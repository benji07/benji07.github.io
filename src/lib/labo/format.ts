// Changement de format : quand la tête monte, la lumière s'étale.
//   t₂ = t₁ × ((m₂ + 1) ÷ (m₁ + 1))², m = grandissement
import { formatStops, formatTime, stopWord } from './math';

/** Formats de négatif : grand et petit côté de l'image, en millimètres. */
export const NEGATIVES = [
  { id: '24x36', label: '24 × 36', size: 36, short: 24 },
  { id: '45x6', label: '4,5 × 6', size: 56, short: 42 },
  { id: '6x6', label: '6 × 6', size: 56, short: 56 },
  { id: '6x7', label: '6 × 7', size: 69, short: 56 },
  { id: '6x9', label: '6 × 9', size: 84, short: 56 },
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
  /** Variante en ouvrant ou fermant le diaphragme. */
  aperture: string;
  /** Dessin des deux tirages : largeur, proportions du négatif et libellé. */
  prints: { width: string; aspect: string; label: string }[];
}

export function computeFormat({ negative, time, from, to }: FormatSettings): FormatResult {
  const { size, short } = NEGATIVES.find((neg) => neg.id === negative) ?? NEGATIVES[0];
  const m1 = (from * 10) / size;
  const m2 = (to * 10) / size;
  const ratio = ((m2 + 1) / (m1 + 1)) ** 2;
  const delta = Math.log2(ratio);
  // Au sixième de stop : assez fin, et chaque valeur a son glyphe (⅙, ⅓, ½…).
  const abs = Math.round(Math.abs(delta) * 6) / 6;
  // Chaque tirage occupe au plus une moitié du plateau ; le plus grand la remplit.
  const max = Math.max(from, to);
  const prints = [from, to].map((side) => ({
    width: `calc((50% - 8px) * ${side / max})`,
    aspect: `${size} / ${short}`,
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
        : `${n > 0 ? 'En ouvrant' : 'En fermant'} de ${k} ${stopWord(k)} : ${formatTime(t / 2 ** n)} s, pour rester dans ta zone de temps habituelle.`,
    prints,
  };
}
