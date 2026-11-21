// Ring-around : une vignette par dominante (deux intensités) autour d'une
// vignette neutre, et la correction de filtration qui va avec.
//
// Tirage d'après négatif : une dominante se neutralise avec un filtre de la
// même couleur (règle 1 de la notice Durst). La correction se fait en jaune
// et magenta ; le cyan déjà réglé (gris pour allonger le temps) est gardé.
import { clamp, type Filtration } from './durst';

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

/** Correction en valeurs Durst pour une dominante légère (1) ou forte (2). */
export const AMOUNTS = { 1: 5, 2: 10 } as const;

export type Level = keyof typeof AMOUNTS;

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
const MIX = { 1: 16, 2: 34 } as const;

/** Les 25 cases de la grille, vides (null) ou occupées par une vignette. */
export function grid(): (Tile | null)[] {
  const cells: (Tile | null)[] = Array(25).fill(null);
  cells[12] = { value: 'neutre', label: 'Neutre', name: 'Tirage neutre', bands: GREYS };
  for (const cast of CASTS) {
    cast.cells.forEach(([row, col], i) => {
      const level = (i + 1) as Level;
      cells[row * 5 + col] = {
        value: `${cast.id}-${level}`,
        label: `${cast.label} ${AMOUNTS[level]}`,
        name: `Dominante ${cast.label.toLowerCase()} ${level === 1 ? 'légère' : 'forte'}`,
        bands: GREYS.map((grey) => `color-mix(in srgb, ${cast.color} ${MIX[level]}%, ${grey})`),
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

  const level = (lvl === '2' ? 2 : 1) as Level;
  const amount = AMOUNTS[level];
  let y = from.y + cast.y * amount;
  let m = from.m + cast.m * amount;
  let c = from.c;

  // Un filtre ne descend pas sous 0 : retirer du jaune revient à ajouter
  // du magenta et du cyan, retirer du magenta à ajouter du jaune et du cyan.
  if (y < 0) {
    m += -y;
    c += -y;
    y = 0;
  }
  if (m < 0) {
    y += -m;
    c += -m;
    m = 0;
  }

  const filtration = { y: clamp(y), m: clamp(m), c: clamp(c) };
  const changes = (['y', 'm', 'c'] as const)
    .map((ch) => [ch, filtration[ch] - from[ch]] as const)
    .filter(([, d]) => d !== 0)
    .map(([ch, d]) => `${d > 0 ? '+' : '−'}${Math.abs(d)} ${ch.toUpperCase()}`);

  return { cast, level, filtration, changes };
}
