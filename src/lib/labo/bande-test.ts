// Bande test en stops : temps de chaque volet du margeur (6 volets, un ou
// deux passages). Utilisé côté serveur pour le rendu initial et dans le
// navigateur à chaque changement de réglage.
import { formatStops, formatTime, stopWord } from './math';

export interface StripSettings {
  /** Temps le plus court, en secondes. */
  start: number;
  /** Dénominateur du pas : 3 pour ⅓ de stop. */
  den: number;
  /** Nombre de plages : 6 (un passage) ou 12 (deux passages). */
  count: 6 | 12;
  /** Un volet à la fois, ou exposition cumulée. */
  mode: 'single' | 'cumul';
}

export const DEFAULTS: StripSettings = { start: 2, den: 3, count: 12, mode: 'single' };

export interface Flap {
  label: string;
  /** Gris de la case, du plus clair au plus foncé. */
  tone: string;
}

export interface Strip {
  passes: Flap[][];
  summary: string;
  method: string;
  hints: string[];
}

// Gris simulé d'une plage : courbe en S autour du temps moyen de la bande.
function tone(t: number, ref: number): string {
  const x = 1 / (1 + Math.exp(-1.25 * Math.log2(t / ref)));
  return `hsl(40 5% ${(95 - 80 * x).toFixed(1)}%)`;
}

export function computeStrip({ start, den, count, mode }: StripSettings): Strip {
  const cumul = mode === 'cumul';
  const times = Array.from({ length: count }, (_, i) => start * 2 ** (i / den));
  const ref = Math.sqrt(times[0] * times[count - 1]);
  let shortAdd = false;

  // Un passage = 6 volets ; en cumulé, chaque volet affiche ce qu'on ajoute.
  const passes: Flap[][] = [];
  for (let p = 0; p < count / 6; p++) {
    const pass = times.slice(p * 6, p * 6 + 6);
    passes.push(
      pass.map((t, i) => {
        if (!cumul || i === 0) return { label: formatTime(t), tone: tone(t, ref) };
        const add = t - pass[i - 1];
        if (add < 1) shortAdd = true;
        return { label: `+${formatTime(add)}`, tone: tone(t, ref) };
      }),
    );
  }

  const span = (count - 1) / den;
  const hints: string[] = [];
  if (times[0] < 2) {
    hints.push('Les poses de moins de 2 s sont peu fiables : ferme d’un cran et pars d’un temps plus long.');
  }
  if (cumul && shortAdd) {
    hints.push(
      'Certains ajouts font moins d’une seconde, la lampe n’a pas le temps de se stabiliser. Expose un volet à la fois, ou pars d’un temps plus long.',
    );
  }
  if (den > 3 && times.some((t) => t >= 10 && t < 16)) {
    hints.push('Entre 10 et 16 s, le compte-pose arrondit trop pour un pas aussi fin. Reste sous 10 s ou pars au-dessus de 16 s.');
  }

  return {
    passes,
    summary: `${count} plages de ${formatTime(times[0])} à ${formatTime(times[count - 1])} s, soit ${formatStops(span)} ${stopWord(span)} couverts.`,
    method: cumul
      ? 'À chaque passage : ouvre tous les volets, pose le premier temps, puis referme un volet avant chaque ajout, en commençant par le 1.'
      : 'Ouvre un seul volet à la fois et règle le temps inscrit dessous.',
    hints,
  };
}
