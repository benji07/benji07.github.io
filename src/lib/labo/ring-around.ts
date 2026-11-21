// Ring-around : une vignette par dominante (deux intensités) autour d'une
// vignette neutre, et la correction de filtration qui va avec.
//
// Tirage d'après négatif : une dominante se neutralise avec un filtre de la
// même couleur (règle 1 de la notice Durst). La correction se fait en jaune
// et magenta ; le cyan déjà réglé (gris pour allonger le temps) est gardé.
import { CHANNELS, clamp, MAX, newTime, type Filtration } from './durst';
import { formatNumber, formatTime } from './math';

export interface Cast {
  id: string;
  label: string;
  /** Couleur de la dominante, mélangée aux gris des vignettes. */
  color: string;
  /** Sens de la correction en jaune et en magenta. */
  y: -1 | 0 | 1;
  m: -1 | 0 | 1;
  /** Position [ligne, colonne] dans la grille 5 × 5, intensité légère puis forte. */
  cells: [[number, number], [number, number]];
}

// Dans l'ordre du cercle chromatique, en partant du haut.
export const CASTS: Cast[] = [
  { id: 'jaune', label: 'Jaune', color: '#f0d000', y: 1, m: 0, cells: [[1, 2], [0, 2]] },
  { id: 'rouge', label: 'Rouge', color: '#d23a2a', y: 1, m: 1, cells: [[1, 3], [0, 4]] },
  { id: 'magenta', label: 'Magenta', color: '#d0208a', y: 0, m: 1, cells: [[3, 3], [4, 4]] },
  { id: 'bleu', label: 'Bleu', color: '#2850c8', y: -1, m: 0, cells: [[3, 2], [4, 2]] },
  { id: 'cyan', label: 'Cyan', color: '#10a8c8', y: -1, m: -1, cells: [[3, 1], [4, 0]] },
  { id: 'vert', label: 'Vert', color: '#2e9a3a', y: 0, m: -1, cells: [[1, 1], [0, 0]] },
];

/**
 * Dominante légère (1) ou forte (2) : correction en valeurs Durst, teinte
 * des vignettes (% de la couleur mélangée au gris) et libellés.
 */
export const LEVELS = {
  1: { amount: 5, mix: 16, adj: 'léger', adjF: 'légère' },
  2: { amount: 10, mix: 34, adj: 'fort', adjF: 'forte' },
} as const;

export type Level = keyof typeof LEVELS;

export interface Tile {
  /** « neutre » ou « <dominante>-<intensité> » : valeur du bouton radio. */
  value: string;
  label: string;
  /** Texte complet pour les lecteurs d'écran. */
  name: string;
  /** Trois gris (clair, moyen, foncé) teintés par la dominante. */
  bands: string[];
}

const GREYS = ['#e9e9e9', '#9a9a9a', '#4a4a4a'];

/** Les 25 cases de la grille, vides (null) ou occupées par une vignette. */
export function grid(): (Tile | null)[] {
  const cells: (Tile | null)[] = Array(25).fill(null);
  cells[12] = { value: 'neutre', label: 'Neutre', name: 'Tirage neutre', bands: GREYS };
  for (const cast of CASTS) {
    cast.cells.forEach(([row, col], i) => {
      const level = LEVELS[(i + 1) as Level];
      cells[row * 5 + col] = {
        value: `${cast.id}-${i + 1}`,
        label: `${cast.label} ${level.amount}`,
        name: `Dominante ${cast.label.toLowerCase()} ${level.adjF}`,
        bands: GREYS.map((grey) => `color-mix(in srgb, ${cast.color} ${level.mix}%, ${grey})`),
      };
    });
  }
  return cells;
}

export interface Correction {
  cast?: Cast;
  level?: Level;
  filtration: Filtration;
  /** Changement par filtre, ex. « +5 M ». Vide pour un tirage neutre. */
  changes: string[];
}

/** Nouvelle filtration pour la vignette choisie (« neutre », « magenta-1 »…). */
export function correct(value: string, from: Filtration): Correction {
  const [id, lvl] = value.split('-');
  const cast = CASTS.find((c) => c.id === id);
  if (!cast) return { filtration: { ...from }, changes: [] };

  const level: Level = lvl === '2' ? 2 : 1;
  const amount = LEVELS[level].amount;
  const y = from.y + cast.y * amount;
  const m = from.m + cast.m * amount;

  // Un filtre ne descend pas sous 0 : retirer du jaune revient à ajouter
  // du magenta et du cyan. On ajoute donc aux trois ce qui manque au plus bas.
  // De même, un filtre ne dépasse pas MAX : on retire alors la même valeur
  // aux trois (moins de gris neutre), ce qui garde l'équilibre des couleurs.
  const k = Math.max(0, -Math.min(y, m));
  const over = Math.max(0, Math.max(y, m, from.c) + k - MAX);
  const shift = k - over;
  const filtration = { y: clamp(y + shift), m: clamp(m + shift), c: clamp(from.c + shift) };
  const changes = CHANNELS
    .map((ch) => [ch, filtration[ch] - from[ch]] as const)
    .filter(([, d]) => d !== 0)
    .map(([ch, d]) => `${d > 0 ? '+' : '−'}${Math.abs(d)} ${ch.toUpperCase()}`);

  return { cast, level, filtration, changes };
}

/**
 * Textes du résultat pour la vignette choisie, partagés par le rendu serveur
 * et le script de la page. Sans temps valide, `t` est undefined.
 */
export function describe(value: string, from: Filtration, time: number) {
  const correction = correct(value, from);
  const { cast, level, filtration } = correction;
  const t = time > 0 ? newTime(time, from, filtration) : undefined;
  return {
    correction,
    t,
    label: cast && level ? `Tirage ${cast.label.toLowerCase()}, ${LEVELS[level].adj}` : 'Tirage neutre',
    changes: correction.changes.length ? correction.changes.join('   ') : 'Rien à changer',
    chips: [...CHANNELS.map((ch) => `${ch.toUpperCase()} ${filtration[ch]}`), t === undefined ? '–' : `${formatTime(t)} s`],
    detail: t === undefined ? 'Entre le temps de ce tirage.' : `calcul : ${formatNumber(t)} s, au lieu de ${formatTime(time)} s`,
  };
}
