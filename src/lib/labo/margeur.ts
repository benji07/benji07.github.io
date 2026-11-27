// Marges du margeur : taille de l'image, orientation du margeur et réglage
// de chaque côté, pour un papier, un négatif et un cadrage donnés.
//
// Deux repères :
// - la vue, depuis le devant de l'agrandisseur : c'est là que l'image est
//   projetée, et son sens dépend du négatif (portrait pour le 4,5 × 6) ;
// - le margeur, dont les côtés gardent leur nom quand on le tourne : tourné
//   d'un quart de tour, son haut passe à droite, sa gauche passe en haut.
// Toutes les longueurs sont en centimètres.

import { formatNumber } from './math';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type EaselType = '2' | '3' | '4';
export type Mode = 'equal' | 'ratio' | 'size';
export type Orientation = 'auto' | 'normal' | 'rotated';

/** Plus petite marge acceptée, quel que soit le margeur. */
export const MIN_MARGIN = 0.5;

/** Plage de réglage d'un côté fixe ; min = max : marge non réglable. */
export interface Range {
  min: number;
  max: number;
}

export const EASELS: { id: EaselType; label: string; fixed: Partial<Record<Side, Range>> }[] = [
  { id: '2', label: '2 lames', fixed: { top: { min: 1, max: 1 }, left: { min: 1, max: 1 } } },
  { id: '3', label: '3 lames', fixed: { top: { min: 0.5, max: 5 } } },
  { id: '4', label: '4 lames', fixed: {} },
];

/**
 * Papiers courants : format affiché et taille réelle. Les feuilles vendues
 * « 24 × 30 » chez Adox ou Fuji sont au format en pouces (9,5 × 12″, soit
 * 24 × 30,5 cm) : ce sont ces tailles réelles qui servent au calcul.
 */
export const PAPERS = [
  { id: '13x18', label: '13×18', long: 17.8, short: 12.7 },
  { id: '20x25', label: '20×25', long: 25.4, short: 20.3 },
  { id: '24x30', label: '24×30', long: 30.5, short: 24 },
  { id: '30x40', label: '30×40', long: 40.6, short: 30.5 },
];

/**
 * Formats de négatif : grand et petit côté de la vue (mm). `portrait` : la
 * vue est projetée en hauteur (le 4,5 × 6 est en travers du film 120).
 */
export const NEGATIVES = [
  { id: '18x24', label: 'Demi-format 18 × 24', long: 24, short: 18, portrait: false },
  { id: '24x36', label: '24 × 36', long: 36, short: 24, portrait: false },
  { id: '24x65', label: 'XPan 24 × 65', long: 65, short: 24, portrait: false },
  { id: '45x6', label: '4,5 × 6', long: 56, short: 42, portrait: true },
  { id: '6x6', label: '6 × 6', long: 56, short: 56, portrait: false },
  { id: '6x7', label: '6 × 7', long: 69, short: 56, portrait: false },
  { id: '6x9', label: '6 × 9', long: 84, short: 56, portrait: false },
];

/** Ratios de recadrage ; `neg` : celui du négatif. */
export const RATIOS = [
  { id: 'neg', label: 'Celui du négatif', value: 0 },
  { id: '3:2', label: '3:2', value: 3 / 2 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '5:4', label: '5:4', value: 5 / 4 },
  { id: '7:5', label: '7:5', value: 7 / 5 },
  { id: '1:1', label: '1:1', value: 1 },
];

export const MODES: { id: Mode; label: string }[] = [
  { id: 'equal', label: 'Marges égales (recadrage)' },
  { id: 'ratio', label: 'Ratio gardé, marge mini' },
  { id: 'size', label: 'Grand côté imposé' },
];

/** Marge du bas : facteur appliqué à la marge du haut. */
export const BOTTOMS = [
  { value: 1, label: 'Égale au haut' },
  { value: 1.25, label: '1,25 × le haut' },
  { value: 1.5, label: '1,5 × le haut' },
];

export const ORIENTATIONS: { id: Orientation; label: string }[] = [
  { id: 'auto', label: "Proposé par l'outil" },
  { id: 'normal', label: 'Normal' },
  { id: 'rotated', label: 'Tourné de 90°' },
];

export interface EaselSettings {
  easel: EaselType;
  /** Plages des côtés fixes, par type de margeur. */
  fixed: Record<EaselType, Partial<Record<Side, Range>>>;
  /** Format choisi dans PAPERS, ou « custom ». */
  paper: string;
  /** Taille réelle de la feuille. */
  long: number;
  short: number;
  negative: string;
  mode: Mode;
  /** Identifiant dans RATIOS (modes « ratio » et « size »). */
  ratio: string;
  /** Grand côté de l'image (mode « size »). */
  size: number;
  /** Marge (mode « equal ») ou marge minimale (mode « ratio »). */
  margin: number;
  /** Facteur de la marge du bas, voir BOTTOMS. */
  bottom: number;
  orientation: Orientation;
}

export const DEFAULTS: EaselSettings = {
  easel: '3',
  fixed: Object.fromEntries(EASELS.map((e) => [e.id, e.fixed])) as EaselSettings['fixed'],
  paper: '30x40',
  long: 40.6,
  short: 30.5,
  negative: '24x36',
  mode: 'ratio',
  ratio: 'neg',
  size: 27,
  margin: 1,
  bottom: 1,
  orientation: 'auto',
};

export const NAMES: Record<Side, string> = { top: 'Haut', bottom: 'Bas', left: 'Gauche', right: 'Droite' };
const WHERE: Record<Side, string> = { top: 'en haut', bottom: 'en bas', left: 'à gauche', right: 'à droite' };
const SIDES: Side[] = ['top', 'bottom', 'left', 'right'];

/** Côté de la vue occupé par un côté du margeur, normal ou tourné. */
const TURNED: Record<Side, Side> = { top: 'right', right: 'bottom', bottom: 'left', left: 'top' };
const toView = (side: Side, rotated: boolean) => (rotated ? TURNED[side] : side);
const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

const mm = (x: number) => Math.round(x * 10) / 10;
const floorMm = (x: number) => Math.floor(x * 10 + 1e-6) / 10;
export const cm = (x: number) => formatNumber(x, 1);

/** Ratio lisible : « 4:3 » quand il en est proche, sinon « 1,38:1 ». */
function ratioName(r: number): string {
  const named = [
    [1, '1:1'],
    [5 / 4, '5:4'],
    [4 / 3, '4:3'],
    [7 / 5, '7:5'],
    [3 / 2, '3:2'],
    [65 / 24, '65:24'],
  ] as const;
  const near = named.find(([v]) => Math.abs(r / v - 1) < 0.01);
  return near ? near[1] : `${formatNumber(r, 2)}:1`;
}

export interface SideSetting {
  /** Côté du margeur. */
  side: Side;
  /** Où il se trouve, vu de devant (« à droite » quand le margeur est tourné). */
  where: string;
  fixed: boolean;
  /** Marge entre le bord de la feuille et l'image. */
  margin: number;
  /** Taille de l'image lue sur la réglette de cette lame, s'il y a lieu. */
  image?: string;
}

export interface EaselResult {
  rotated: boolean;
  /** Orientation que l'outil propose. */
  proposed: boolean;
  /** Feuille et image vues de devant : largeur et hauteur. */
  paper: { w: number; h: number };
  image: { w: number; h: number };
  /** Marges vues de devant. */
  margins: Record<Side, number>;
  /** Côtés du margeur, dans l'ordre haut, bas, gauche, droite. */
  sides: SideSetting[];
  /** « ≈ 4:3 » ; et ce que le recadrage retire au négatif. */
  ratio: string;
  crop?: string;
  hints: string[];
}

export type EaselOutcome = { ok: true; result: EaselResult } | { ok: false; error: string };

export function computeEasel(s: EaselSettings): EaselOutcome {
  const long = Math.max(s.long, s.short);
  const short = Math.min(s.long, s.short);
  if (!(short > 0)) return { ok: false, error: 'Indique la taille de la feuille.' };

  const neg = NEGATIVES.find((n) => n.id === s.negative) ?? NEGATIVES[1];
  const negRatio = neg.long / neg.short;
  const square = neg.long === neg.short;

  // Le grand côté de la feuille suit celui de l'image ; une vue carrée suit
  // la feuille, donc margeur normal.
  const proposedRotated = neg.portrait;
  const rotated = s.orientation === 'auto' ? proposedRotated : s.orientation === 'rotated';
  const paper = rotated ? { w: short, h: long } : { w: long, h: short };
  // Sens de l'image vue de devant ; une vue carrée recadrée suit la feuille.
  const imagePortrait = square ? rotated : neg.portrait;

  const k = s.bottom > 1 ? s.bottom : 1;
  const ratio = s.mode === 'equal' ? 0 : (RATIOS.find((r) => r.id === s.ratio)?.value || negRatio);

  // Dimensions d'image (largeur, hauteur vues de devant) à partir du grand
  // côté et du ratio choisi.
  const fromLong = (l: number) => (imagePortrait ? { w: l / ratio, h: l } : { w: l, h: l / ratio });

  let image: { w: number; h: number };
  let floor: number;
  if (s.mode === 'size') {
    if (!(s.size > 0)) return { ok: false, error: "Indique le grand côté de l'image." };
    image = fromLong(s.size);
    floor = MIN_MARGIN;
  } else {
    floor = Math.max(s.margin, MIN_MARGIN);
    if (!(s.margin >= MIN_MARGIN)) {
      return { ok: false, error: `La marge ne descend pas sous ${cm(MIN_MARGIN)} cm.` };
    }
    // Zone utile : la marge sur trois côtés, et k fois la marge en bas.
    const availW = paper.w - 2 * floor;
    const availH = paper.h - floor * (1 + k);
    if (!(availW > 0 && availH > 0)) return { ok: false, error: 'La marge est trop grande pour la feuille.' };
    if (s.mode === 'equal') {
      image = { w: availW, h: availH };
    } else {
      const l = imagePortrait ? Math.min(availH, availW * ratio) : Math.min(availW, availH * ratio);
      image = fromLong(l);
    }
  }
  // Au millimètre inférieur : l'image ne mord jamais sur la marge.
  image = { w: floorMm(image.w), h: floorMm(image.h) };

  // Marges vues de devant : centrées en largeur, le bas k fois le haut.
  const freeW = paper.w - image.w;
  const freeH = paper.h - image.h;
  if (freeW < 2 * MIN_MARGIN - 1e-6 || freeH < 2 * MIN_MARGIN - 1e-6) {
    return {
      ok: false,
      error: `L'image ne tient pas sur la feuille avec ${cm(MIN_MARGIN)} cm de marge : choisis un grand côté plus court.`,
    };
  }
  const margins: Record<Side, number> = { top: 0, bottom: 0, left: 0, right: 0 };
  margins.left = mm(freeW / 2);
  margins.right = mm(freeW - margins.left);
  margins.top = mm(freeH / (1 + k));
  margins.bottom = mm(freeH - margins.top);

  // Côtés fixes : bornés à leur plage, le reste va à la lame opposée.
  const hints: string[] = [];
  const fixed = s.fixed[s.easel] ?? {};
  for (const side of SIDES) {
    const range = fixed[side];
    if (!range) continue;
    const v = toView(side, rotated);
    const o = OPPOSITE[v];
    const total = margins[v] + margins[o];
    const min = Math.min(range.min, range.max);
    const max = Math.max(range.min, range.max);
    const set = mm(Math.min(Math.max(margins[v], min), max));
    const shift = mm(margins[v] - set);
    if (shift === 0) continue;
    margins[v] = set;
    margins[o] = mm(total - set);
    const where = rotated ? ` (${WHERE[v]})` : '';
    const toward = shift > 0 ? 'vers ce côté' : "à l'opposé";
    const limit = min === max ? `est fixe à ${cm(set)} cm` : `va de ${cm(min)} à ${cm(max)} cm`;
    hints.push(
      `Le côté ${NAMES[side].toLowerCase()} du margeur${where} ${limit} : l'image est décalée de ${cm(Math.abs(shift))} cm ${toward}.`,
    );
  }

  const low = SIDES.filter((v) => margins[v] < MIN_MARGIN - 1e-6);
  if (low.length) {
    return {
      ok: false,
      error: `Avec ce margeur, la marge ${low.map((v) => WHERE[v]).join(' et ')} tombe sous ${cm(MIN_MARGIN)} cm : réduis l'image.`,
    };
  }
  if (s.mode !== 'size') {
    const tight = SIDES.filter((v) => margins[v] < floor - 1e-6);
    if (tight.length) hints.push(`Marge ${tight.map((v) => WHERE[v]).join(' et ')} sous les ${cm(floor)} cm demandés.`);
  }

  // Réglage de chaque côté du margeur. Une lame qui ferme l'image en face
  // d'un côté fixe (ou la droite et le bas sans côté fixe) se lit souvent en
  // taille d'image sur sa réglette.
  const sides: SideSetting[] = SIDES.map((side) => {
    const v = toView(side, rotated);
    const isFixed = Boolean(fixed[side]);
    const setting: SideSetting = { side, where: WHERE[v], fixed: isFixed, margin: margins[v] };
    const facing = fixed[OPPOSITE[side]] || (!fixed[side] && (side === 'bottom' || side === 'right'));
    if (!isFixed && facing) {
      // Côtés haut et bas du margeur : dimension verticale du margeur.
      const vertical = side === 'top' || side === 'bottom';
      const length = vertical !== rotated ? image.h : image.w;
      setting.image = `image ${cm(length)}`;
    }
    return setting;
  });

  // Ratio obtenu et recadrage par rapport au négatif entier.
  const imgRatio = Math.max(image.w, image.h) / Math.min(image.w, image.h);
  let crop: string | undefined;
  const lost = 1 - Math.min(imgRatio, negRatio) / Math.max(imgRatio, negRatio);
  if (Math.round(lost * 100) >= 1) {
    const along = square
      ? 'sur un côté'
      : imgRatio < negRatio
        ? 'sur la longueur'
        : 'sur la largeur';
    crop = `Négatif ${neg.label} recadré de ${Math.round(lost * 100)} % ${along}.`;
  }

  return {
    ok: true,
    result: {
      rotated,
      proposed: rotated === proposedRotated,
      paper,
      image,
      margins,
      sides,
      ratio: `≈ ${ratioName(imgRatio)}`,
      crop,
      hints,
    },
  };
}

/** Ligne de détail sous la taille de l'image. */
export function describe(r: EaselResult): string {
  const orientation = r.rotated ? 'margeur tourné' : 'margeur normal';
  return `${r.ratio} · ${orientation}${r.proposed ? '' : ' (non proposé)'}`;
}

/** Réglages côté par côté, en lignes de tableau. */
export function renderSides(r: EaselResult): string {
  return r.sides
    .map((s) => {
      const name = r.rotated ? `${NAMES[s.side]} <span class="sides__where">${s.where}</span>` : NAMES[s.side];
      const kind = s.fixed ? 'fixe' : 'lame';
      return `<tr${s.fixed ? ' class="sides__fixed"' : ''}><th scope="row">${name}</th><td class="sides__kind">${kind}</td><td class="sides__margin">${cm(s.margin)}</td><td class="sides__image">${s.image ?? ''}</td></tr>`;
    })
    .join('');
}

/**
 * Schéma à l'échelle, vu de devant l'agrandisseur : la feuille, l'image et
 * les côtés du margeur avec leur marge. Unité du dessin : le millimètre.
 */
export function drawEasel(r: EaselResult): string {
  const W = r.paper.w * 10;
  const H = r.paper.h * 10;
  const fs = Math.max(W, H) * 0.038;
  const pad = fs * 2.6;
  const band = fs * 1.2;
  const m = Object.fromEntries(SIDES.map((v) => [v, r.margins[v] * 10])) as Record<Side, number>;
  const iw = r.image.w * 10;
  const ih = r.image.h * 10;
  const fixedView = new Set(r.sides.filter((s) => s.fixed).map((s) => toView(s.side, r.rotated)));

  const text = (x: number, y: number, value: string, cls: string, rotate = false) =>
    `<text class="${cls}" x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" dominant-baseline="central"${
      rotate ? ` transform="rotate(-90 ${x} ${y})"` : ''
    }>${value}</text>`;

  // Lames : bandes posées dans la marge, au ras de l'image et débordant de
  // la feuille. Un côté fixe est plus épais et plein.
  const blade = (v: Side) => {
    const f = fixedView.has(v);
    const t = f ? band * 1.4 : band;
    const cls = f ? 'easel__blade easel__blade--fixed' : 'easel__blade';
    const e = pad * 0.55;
    if (v === 'top') return `<rect class="${cls}" x="${-e}" y="${m.top - t}" width="${W + 2 * e}" height="${t}"/>`;
    if (v === 'bottom') return `<rect class="${cls}" x="${-e}" y="${H - m.bottom}" width="${W + 2 * e}" height="${t}"/>`;
    if (v === 'left') return `<rect class="${cls}" x="${m.left - t}" y="${-e}" width="${t}" height="${H + 2 * e}"/>`;
    return `<rect class="${cls}" x="${W - m.right}" y="${-e}" width="${t}" height="${H + 2 * e}"/>`;
  };
  const tag = (v: Side) => `${cm(r.margins[v])}${fixedView.has(v) ? ' fixe' : ''}`;

  return [
    `<svg class="easel" viewBox="${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}" role="img" aria-label="Feuille de ${cm(r.paper.w)} × ${cm(
      r.paper.h,
    )} cm vue de devant, image de ${cm(r.image.w)} × ${cm(r.image.h)} cm">`,
    `<rect class="easel__paper" x="0" y="0" width="${W}" height="${H}"/>`,
    `<rect class="easel__image" x="${m.left}" y="${m.top}" width="${iw}" height="${ih}"/>`,
    text(m.left + iw / 2, m.top + ih / 2, `${cm(r.image.w)} × ${cm(r.image.h)}`, 'easel__size'),
    ...(['left', 'right', 'top', 'bottom'] as Side[]).map(blade),
    text(W / 2, -pad + fs * 0.8, tag('top'), 'easel__label'),
    text(W / 2, H + pad - fs * 0.8, tag('bottom'), 'easel__label'),
    text(-pad + fs * 0.8, H / 2, tag('left'), 'easel__label', true),
    text(W + pad - fs * 0.8, H / 2, tag('right'), 'easel__label', true),
    `</svg>`,
  ].join('');
}
