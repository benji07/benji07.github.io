// Calculs partagés par les outils du labo (src/pages/labo/).

const NBSP = '\u00a0';

/**
 * Temps réglable sur le compte-pose : au dixième sous 10 s, à la seconde
 * au-delà (le compte-pose n'affiche plus les dixièmes à partir de 10 s).
 */
export function roundTime(t: number): number {
  const r = Math.round(t * 10) / 10;
  return r >= 10 ? Math.round(t) : r;
}

/** Temps arrondi comme sur le compte-pose, à la française : « 8,5 », « 13 ». */
export function formatTime(t: number): string {
  const r = roundTime(t);
  return r >= 10 ? String(r) : r.toFixed(1).replace('.', ',');
}

/** Nombre décimal à la française : 1.25 → « 1,25 ». */
export function formatNumber(x: number, digits = 2): string {
  return x.toFixed(digits).replace('.', ',');
}

const FRACTIONS: Record<string, string> = {
  '1/2': '½',
  '1/3': '⅓',
  '2/3': '⅔',
  '1/4': '¼',
  '3/4': '¾',
  '1/6': '⅙',
  '5/6': '⅚',
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Quantité de stops en fraction lisible : 1.333 → « 1 ⅓ », 0.5 → « ½ ». */
export function formatStops(x: number): string {
  const whole = Math.floor(x + 1e-6);
  const rest = x - whole;
  if (rest < 0.02) return String(whole);
  for (const d of [2, 3, 4, 6, 12]) {
    const n = Math.round(rest * d);
    if (n > 0 && n < d && Math.abs(rest - n / d) < 0.012) {
      const g = gcd(n, d);
      const key = `${n / g}/${d / g}`;
      const f = FRACTIONS[key] ?? key;
      return whole ? `${whole}${NBSP}${f}` : f;
    }
  }
  return formatNumber(x);
}

export const stopWord = (x: number) => (x >= 2 ? 'stops' : 'stop');

/** Lit un champ numérique, virgule acceptée. NaN si vide ou invalide. */
export function readNumber(input: HTMLInputElement | null): number {
  if (!input) return NaN;
  return parseFloat(input.value.replace(',', '.'));
}
