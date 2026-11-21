// Tête couleur Durst CLS 605 (agrandisseur M605) : facteurs d'exposition des
// filtres, d'après la table de la notice (p. 16, « Filter factors »).
//
//   T(nouveau) = T(ancien) × (F1 × F2 × F3) nouveau ÷ (F1 × F2 × F3) ancien
import { formatNumber, formatTime, roundTime, stopWord } from './math';
import { load, save } from './store';

export const CHANNELS = ['y', 'm', 'c'] as const;
export type Channel = (typeof CHANNELS)[number];

/** Libellés des champs, dans l'ordre de CHANNELS. */
export const CHANNEL_FIELDS = [
  { key: 'y', label: 'Jaune' },
  { key: 'm', label: 'Magenta' },
  { key: 'c', label: 'Cyan' },
] as const;

export interface Filtration {
  y: number;
  m: number;
  c: number;
}

/** Valeur maximale des molettes. */
export const MAX = 130;

/** Écart entre deux lignes de la table. */
export const STEP = 5;

// Une valeur tous les STEP, de 0 à MAX.
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
  const i = Math.floor(v / STEP);
  if (i >= table.length - 1) return table[table.length - 1];
  return table[i] + (table[i + 1] - table[i]) * ((v - i * STEP) / STEP);
}

export const product = ({ y, m, c }: Filtration) => factor('y', y) * factor('m', m) * factor('c', c);

/** Facteur d'exposition entre deux filtrations. */
export const ratio = (from: Filtration, to: Filtration) => product(to) / product(from);

/** Nouveau temps de pose après un changement de filtration. */
export function newTime(time: number, from: Filtration, to: Filtration): number {
  return time * ratio(from, to);
}

/**
 * Gris neutre pour allonger le temps : la plus petite valeur (par pas de STEP)
 * à ajouter aux trois filtres pour atteindre `target`. Undefined si les
 * molettes n'y suffisent pas.
 */
export function neutralFor(time: number, from: Filtration, target: number) {
  const room = MAX - Math.max(from.y, from.m, from.c);
  const base = time / product(from);
  for (let n = STEP; n <= room; n += STEP) {
    const to = { y: from.y + n, m: from.m + n, c: from.c + n };
    const t = base * product(to);
    if (t >= target) return { added: n, filtration: to, time: t };
  }
  return undefined;
}

/**
 * Textes du résultat, partagés par le rendu serveur et le script de la page.
 * `time` doit être > 0.
 */
export function describe(time: number, from: Filtration, to: Filtration, target: number) {
  const f = ratio(from, to);
  const t = time * f;
  const stops = Math.log2(f);
  const neutral = target > 0 ? neutralFor(t, to, target) : undefined;
  return {
    /** Temps calcul\u00e9, non arrondi. */
    t,
    time: `${formatTime(t)} s`,
    detail: `calcul : ${formatNumber(t)} s · × ${formatNumber(f, 3)} · ${stops >= 0 ? '+' : '−'}${formatNumber(Math.abs(stops))} ${stopWord(Math.abs(stops))}`,
    chips: [
      ...CHANNELS.map((ch) => `${ch.toUpperCase()} ${neutral?.filtration[ch] ?? '–'}`),
      neutral ? `${formatTime(neutral.time)} s` : '–',
    ],
    note: neutral
      ? `+${neutral.added} sur chaque filtre. Refais une petite bande : le gris des filtres n’est jamais parfaitement neutre.`
      : target > 0 && target <= t
        ? 'Le temps est déjà assez long.'
        : 'Pas atteignable avec les molettes : ferme le diaphragme d’un cran, ou engage le filtre supplémentaire de la tête.',
  };
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

/** Réglage partagé, ou undefined s'il n'y en a pas de valide. */
export function loadSetting(): Setting | undefined {
  const setting = load<Setting>(SETTING_KEY);
  if (!setting || typeof setting.time !== 'number') return undefined;
  return { y: setting.y ?? 0, m: setting.m ?? 0, c: setting.c ?? 0, time: roundTime(setting.time), at: setting.at ?? 0 };
}

/** Partage un réglage, avec le temps tel qu'il se règle sur le compte-pose. */
export function saveSetting({ y, m, c }: Filtration, time: number, at = Date.now()) {
  save<Setting>(SETTING_KEY, { y, m, c, time: roundTime(time), at });
}
