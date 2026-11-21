// Changement de format : quand la tête monte, la lumière s'étale.
//   t₂ = t₁ × ((m₂ + 1) ÷ (m₁ + 1))², m = grandissement
import { formatStops, formatTime, stopWord } from './math';

/** Formats de négatif et leur grand côté, en millimètres. */
export const NEGATIVES = [
  { id: '24x36', label: '24 × 36', size: 36 },
  { id: '45x6', label: '4,5 × 6', size: 56 },
  { id: '6x6', label: '6 × 6', size: 56 },
  { id: '6x7', label: '6 × 7', size: 69 },
  { id: '6x9', label: '6 × 9', size: 84 },
];

export interface FormatSettings {
  /** Identifiant du négatif dans NEGATIVES. */
  negative: string;
  /** Temps actuel (s). */
  time: number;
  /** Grand côté de l'image actuelle et de la nouvelle (cm). */
  from: number;
  to: number;
}

export const DEFAULTS: FormatSettings = { negative: '24x36', time: 8, from: 24, to: 40 };

export interface FormatResult {
  /** Nouveau temps à diaphragme constant, ex. « 20 s ». */
  time: string;
  /** Ancien temps et écart en stops, ex. « au lieu de 8,0 s · ≈ +1 ⅓ stop ». */
  comparison: string;
  /** Variante en ouvrant ou fermant d'un ou plusieurs crans. */
  aperture: string;
  /** Dessin des deux tirages : largeur (la plus grande à 100 %) et libellé. */
  prints: { width: string; label: string }[];
}

export function computeFormat({ negative, time, from, to }: FormatSettings): FormatResult {
  const size = (NEGATIVES.find((neg) => neg.id === negative) ?? NEGATIVES[0]).size;
  const m1 = (from * 10) / size;
  const m2 = (to * 10) / size;
  const ratio = ((m2 + 1) / (m1 + 1)) ** 2;
  const delta = Math.log2(ratio);
  const abs = Math.round(Math.abs(delta) * 12) / 12;
  const max = Math.max(from, to);
  const prints = [from, to].map((side) => ({
    width: `${(side / max) * 100}%`,
    label: `${String(side).replace('.', ',')} cm`,
  }));

  if (abs === 0) return { time: `${formatTime(time)} s`, comparison: 'Aucune correction à faire.', aperture: '', prints };

  const t = time * ratio;
  const n = Math.round(delta);
  const k = Math.abs(n);
  return {
    time: `${formatTime(t)} s`,
    comparison: `au lieu de ${formatTime(time)} s · ≈ ${delta > 0 ? '+' : '−'}${formatStops(abs)} ${stopWord(abs)}`,
    aperture:
      n === 0
        ? 'L’écart est assez petit pour être absorbé au compte-pose.'
        : `${n > 0 ? 'En ouvrant' : 'En fermant'} de ${k} cran${k > 1 ? 's' : ''} : ${formatTime(t / 2 ** n)} s, pour rester dans ta zone de temps habituelle.`,
    prints,
  };
}
