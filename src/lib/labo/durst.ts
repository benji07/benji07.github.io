// Tête couleur Durst CLS 605 (agrandisseur M605) : facteurs d'exposition des
// filtres, d'après la table de la notice (p. 16, « Filter factors »).
//
//   T(nouveau) = T(ancien) × (F1 × F2 × F3) nouveau ÷ (F1 × F2 × F3) ancien

export type Channel = 'y' | 'm' | 'c';

export interface Filtration {
  y: number;
  m: number;
  c: number;
}

/** Valeur maximale des molettes. */
export const MAX = 130;

// Une valeur tous les 5, de 0 à 130.
export const FACTORS: Record<Channel, number[]> = {
  y: [
    1.0, 1.02, 1.04, 1.06, 1.08, 1.1, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.17, 1.18, 1.18, 1.18, 1.19, 1.19, 1.19,
    1.2, 1.2, 1.2, 1.21, 1.21, 1.21, 1.22,
  ],
  m: [
    1.0, 1.08, 1.15, 1.21, 1.26, 1.31, 1.36, 1.4, 1.44, 1.48, 1.52, 1.56, 1.6, 1.64, 1.68, 1.71, 1.74, 1.77, 1.8, 1.83,
    1.86, 1.89, 1.92, 1.95, 1.98, 2.01, 2.04,
  ],
  c: [
    1.0, 1.06, 1.11, 1.16, 1.2, 1.24, 1.28, 1.31, 1.34, 1.37, 1.4, 1.43, 1.46, 1.49, 1.52, 1.54, 1.56, 1.58, 1.6, 1.62,
    1.64, 1.66, 1.68, 1.7, 1.72, 1.74, 1.76,
  ],
};

export const clamp = (v: number) => Math.max(0, Math.min(MAX, Number.isFinite(v) ? v : 0));

/** Facteur d'un filtre ; les molettes se règlent au cran de 1, on interpole entre deux lignes. */
export function factor(channel: Channel, value: number): number {
  const table = FACTORS[channel];
  const v = clamp(value);
  const i = Math.floor(v / 5);
  if (i >= table.length - 1) return table[table.length - 1];
  return table[i] + (table[i + 1] - table[i]) * ((v - i * 5) / 5);
}

export const product = ({ y, m, c }: Filtration) => factor('y', y) * factor('m', m) * factor('c', c);

/** Nouveau temps de pose après un changement de filtration. */
export function newTime(time: number, from: Filtration, to: Filtration): number {
  return (time * product(to)) / product(from);
}

/**
 * Gris neutre pour allonger le temps : la plus petite valeur (par pas de 5)
 * à ajouter aux trois filtres pour atteindre `target`. Undefined si les
 * molettes n'y suffisent pas.
 */
export function neutralFor(time: number, from: Filtration, target: number) {
  const room = MAX - Math.max(from.y, from.m, from.c);
  for (let n = 5; n <= room; n += 5) {
    const to = { y: from.y + n, m: from.m + n, c: from.c + n };
    const t = newTime(time, from, to);
    if (t >= target) return { added: n, filtration: to, time: t };
  }
  return undefined;
}

/**
 * Réglage en cours (filtration et temps), partagé entre la page Durst et le
 * ring-around via le stockage du navigateur : la page la plus récemment
 * modifiée fait foi.
 */
export interface Setting extends Filtration {
  time: number;
  /** Date de la dernière modification (Date.now()). */
  at: number;
}

export const SETTING_KEY = 'reglage';
