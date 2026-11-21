// Changement de format : quand la tête monte, la lumière s'étale.
//   t₂ = t₁ × ((m₂ + 1) ÷ (m₁ + 1))², m = grandissement
import { formatStops, formatTime, stopWord } from './math';

/** Grand côté des négatifs, en millimètres. */
export const NEGATIVES = [
  { label: '24 × 36', size: 36 },
  { label: '4,5 × 6', size: 56 },
  { label: '6 × 6', size: 56 },
  { label: '6 × 7', size: 69 },
  { label: '6 × 9', size: 84 },
];

export interface FormatSettings {
  /** Grand côté du négatif (mm). */
  negative: number;
  /** Temps actuel (s). */
  time: number;
  /** Grand côté de l'image actuelle et de la nouvelle (cm). */
  from: number;
  to: number;
}

export const DEFAULTS: FormatSettings = { negative: 36, time: 8, from: 24, to: 40 };

export interface FormatResult {
  /** Écart en stops, ex. « ≈ +1 ⅓ stop ». */
  stops: string;
  /** Nouveau temps à diaphragme constant. */
  same: string;
  /** Variante en ouvrant ou fermant d'un ou plusieurs crans. */
  aperture: string;
}

export function computeFormat({ negative, time, from, to }: FormatSettings): FormatResult {
  const m1 = (from * 10) / negative;
  const m2 = (to * 10) / negative;
  const ratio = ((m2 + 1) / (m1 + 1)) ** 2;
  const delta = Math.log2(ratio);
  const abs = Math.round(Math.abs(delta) * 12) / 12;

  if (abs === 0) return { stops: '0 stop', same: 'Aucune correction à faire.', aperture: '' };

  const n = Math.round(delta);
  const k = Math.abs(n);
  return {
    stops: `≈ ${delta > 0 ? '+' : '−'}${formatStops(abs)} ${stopWord(abs)}`,
    same: `Même diaphragme : ${formatTime(time * ratio)} s au lieu de ${formatTime(time)} s.`,
    aperture:
      n === 0
        ? 'L’écart est assez petit pour être absorbé au compte-pose.'
        : `${n > 0 ? 'En ouvrant' : 'En fermant'} de ${k} cran${k > 1 ? 's' : ''} : ${formatTime((time * ratio) / 2 ** n)} s, pour rester dans ta zone de temps habituelle.`,
  };
}
