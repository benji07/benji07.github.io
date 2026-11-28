// Marges du margeur : on choisit la marge des lames gauche et droite, la
// taille de l'image en découle, entière ou recadrée.
//
// Tout est calculé dans le repère du margeur : feuille en largeur, côté fixe
// en haut. Le négatif décide seulement du sens de pose : en hauteur (4,5 × 6,
// demi-format), le margeur se pose tourné d'un quart de tour.
// Toutes les longueurs sont en centimètres.

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type EaselType = '2' | '3' | '4';
export type Style = 'full' | 'equal' | 'gallery';

/**
 * Papiers : taille réelle. Les feuilles vendues « 24 × 30 » chez Adox ou
 * Fuji sont au format en pouces (9,5 × 12″, soit 24 × 30,5 cm).
 */
export const PAPERS = [
  { id: '13x18', label: '13×18', long: 17.8, short: 12.7 },
  { id: '20x25', label: '20×25', long: 25.4, short: 20.3 },
  { id: '24x30', label: '24×30', long: 30.5, short: 24 },
  { id: '30x40', label: '30×40', long: 40.6, short: 30.5 },
];

/** Négatifs : grand et petit côté de la vue (mm) ; `portrait` : projeté en hauteur. */
export const NEGATIVES = [
  { id: '24x36', label: '24×36', long: 36, short: 24, portrait: false },
  { id: '45x6', label: '4,5×6', long: 56, short: 42, portrait: true },
  { id: '6x6', label: '6×6', long: 56, short: 56, portrait: false },
  { id: '6x7', label: '6×7', long: 69, short: 56, portrait: false },
  { id: '6x9', label: '6×9', long: 84, short: 56, portrait: false },
  { id: '18x24', label: '18×24', long: 24, short: 18, portrait: true },
  { id: '24x65', label: 'XPan', long: 65, short: 24, portrait: false },
];

export const STYLES: { id: Style; label: string }[] = [
  { id: 'full', label: 'Sans recadrer' },
  { id: 'equal', label: 'Marges égales' },
  { id: 'gallery', label: 'Galerie' },
];

export const EASELS: { id: EaselType; label: string }[] = [
  { id: '2', label: '2 lames' },
  { id: '3', label: '3 lames' },
  { id: '4', label: '4 lames' },
];

/** Description du margeur choisi, pour le repli « Mon margeur ». */
export function easelSummary(s: Settings): string {
  if (s.easel === '2') return `2 lames · haut et gauche fixes à ${cm(s.fix2)} cm`;
  if (s.easel === '3') {
    const [min, max] = fixedRange(s);
    return `3 lames · côté fixe réglable de ${cm(min)} à ${cm(max)} cm`;
  }
  return '4 lames · tout est réglable';
}

/** Plus petite marge possible ; facteur galerie. */
export const MIN = 0.5;
const GALLERY = 1.5;

export interface Settings {
  paper: string;
  negative: string;
  style: Style;
  /** Marge des lames gauche et droite. */
  margin: number;
  /** Galerie : photo en hauteur (la marge plus large passe sur le côté). */
  vertical: boolean;
  easel: EaselType;
  /** Marges fixes d'un margeur 2 lames. */
  fix2: number;
  /** Plage de réglage du côté fixe d'un margeur 3 lames. */
  fixMin: number;
  fixMax: number;
}

/** Plage du côté fixe d'un 3 lames, bornes remises dans l'ordre. */
function fixedRange(s: Settings): [number, number] {
  const a = Math.max(s.fixMin, MIN);
  const b = Math.max(s.fixMax, MIN);
  return [Math.min(a, b), Math.max(a, b)];
}

export const DEFAULTS: Settings = {
  paper: '30x40',
  negative: '24x36',
  style: 'full',
  margin: 1,
  vertical: false,
  easel: '3',
  fix2: 1,
  fixMin: 0.5,
  fixMax: 5,
};

const r1 = (x: number) => Math.round(x * 10) / 10;
const fl1 = (x: number) => Math.floor(x * 10 + 1e-6) / 10;
export const cm = (x: number) => x.toFixed(1).replace('.', ',');
const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id) ?? list[0];

export interface Result {
  /** Feuille, dans le repère du margeur (W le long du côté fixe). */
  W: number;
  H: number;
  img: { w: number; h: number };
  margins: Record<Side, number>;
  fixed: Partial<Record<Side, true>>;
  /** Part du négatif perdue au recadrage (%), et dans quel sens. */
  lost: number;
  lostAlong: 'long' | 'short';
  /** Taille qu'aurait le négatif entier à cette échelle. */
  proj: { w: number; h: number };
  negative: (typeof NEGATIVES)[number];
  paper: (typeof PAPERS)[number];
  style: Style;
  vertical: boolean;
  easel: EaselType;
  /** Margeur à poser tourné d'un quart de tour. */
  rotated: boolean;
  hints: string[];
}

export type Outcome = Result | { error: string };

export function compute(s: Settings): Outcome {
  const paper = byId(PAPERS, s.paper);
  const neg = byId(NEGATIVES, s.negative);
  const W = paper.long;
  const H = paper.short;
  const r = neg.long / neg.short;
  const m = Math.max(s.easel === '2' ? s.fix2 : s.margin, MIN);
  // Galerie : la marge plus large va en bas, ou sur le côté pour une photo en hauteur.
  const kx = s.style === 'gallery' && s.vertical ? GALLERY : 1;
  const ky = s.style === 'gallery' && !s.vertical ? GALLERY : 1;
  // Seule la marge de côté est imposée ; sans recadrage, haut et bas peuvent
  // descendre jusqu'au minimum physique.
  const fv = s.style === 'equal' ? m : MIN;
  // Le côté fixe d'un 3 lames ne descend pas sous son minimum.
  const [fixMin, fixMax] = fixedRange(s);
  const topFloor = s.easel === '3' ? Math.max(fv, fixMin) : fv;
  const aw = W - m * (1 + kx);
  const ah = H - topFloor - fv * ky;
  if (!(aw > 1 && ah > 1)) return { error: 'Marge trop grande pour cette feuille.' };

  let img: { w: number; h: number };
  if (s.style === 'equal') {
    img = { w: aw, h: ah };
  } else {
    const l = Math.min(aw, ah * r);
    img = { w: l, h: l / r };
  }
  const ir = img.w / img.h;
  img = { w: fl1(img.w), h: fl1(img.h) };

  const fw = W - img.w;
  const fh = H - img.h;
  const margins = { left: r1(fw / (1 + kx)), right: 0, top: r1(fh / (1 + ky)), bottom: 0 };
  margins.right = r1(fw - margins.left);
  margins.bottom = r1(fh - margins.top);

  const hints: string[] = [];
  if (s.easel !== '2' && s.style !== 'equal' && margins.left > m + 0.05) {
    hints.push(`Ici c'est la hauteur de la feuille qui limite l'image : les marges de côté passent à ${cm(margins.left)} cm.`);
  }
  const fixed: Result['fixed'] = s.easel === '3' ? { top: true } : s.easel === '2' ? { top: true, left: true } : {};
  if (s.easel === '3' && margins.top > fixMax) {
    margins.bottom = r1(fh - fixMax);
    margins.top = fixMax;
    hints.push(`Le côté fixe plafonne à ${cm(fixMax)} cm : l'image remonte, le reste de la marge passe en bas.`);
  } else if (s.easel === '3' && margins.top < fixMin) {
    margins.bottom = r1(fh - fixMin);
    margins.top = fixMin;
    hints.push(`Le côté fixe ne descend pas sous ${cm(fixMin)} cm : l'image descend d'autant.`);
  }
  if (s.easel === '2') {
    const off = margins.top !== m || margins.left !== m;
    margins.bottom = r1(fh - m);
    margins.top = m;
    margins.right = r1(fw - m);
    margins.left = m;
    if (off) hints.push("Margeur 2 lames : l'image est calée dans le coin haut gauche, elle n'est pas centrée.");
  }

  const lost = Math.round((1 - Math.min(ir, r) / Math.max(ir, r)) * 100);
  return {
    W,
    H,
    img,
    margins,
    fixed,
    lost,
    lostAlong: ir < r ? 'long' : 'short',
    proj: ir < r ? { w: img.h * r, h: img.h } : { w: img.w, h: img.w / r },
    negative: neg,
    paper,
    style: s.style,
    vertical: s.vertical,
    easel: s.easel,
    rotated: neg.portrait,
    hints,
  };
}

/** Ratio de l'image : « 3:2 », « ≈ 4:3 » ou « 1,38:1 ». */
export function ratioName(res: Result): string {
  const r = Math.max(res.img.w, res.img.h) / Math.min(res.img.w, res.img.h);
  const named: [number, string][] = [
    [1, '1:1'],
    [5 / 4, '5:4'],
    [4 / 3, '4:3'],
    [7 / 5, '7:5'],
    [3 / 2, '3:2'],
    [16 / 9, '16:9'],
    [2, '2:1'],
  ];
  const [d, label] = named.map(([v, l]) => [Math.abs(r / v - 1), l] as const).sort((a, b) => a[0] - b[0])[0];
  return d < 0.004 ? label : d < 0.025 ? `≈ ${label}` : `${r.toFixed(2).replace('.', ',')}:1`;
}

export interface Step {
  side: Side;
  name: string;
  value: string;
  how: string;
  /** Rien à régler (marge fixe d'un 2 lames). */
  idle: boolean;
}

/**
 * Ce qu'il faut régler, dans l'ordre du geste. Sur un 3 lames (Ahel Marge 3),
 * la réglette de la lame gauche donne la hauteur de l'image (on y place la
 * lame du bas) et celle de la lame du bas donne la largeur (on y place la
 * lame droite).
 */
export function steps(res: Result): Step[] {
  const { margins: m, img } = res;
  const two = res.easel === '2';
  const three = res.easel === '3';
  return [
    { side: 'top', name: res.fixed.top ? 'Haut, côté fixe' : 'Lame du haut', value: cm(m.top), how: two ? 'fixe, rien à régler' : 'marge', idle: two },
    { side: 'left', name: res.fixed.left ? 'Gauche, fixe' : 'Lame gauche', value: cm(m.left), how: two ? 'fixe, rien à régler' : 'marge', idle: two },
    {
      side: 'bottom',
      name: 'Lame du bas',
      value: cm(img.h),
      how: three ? `hauteur, sur la réglette de la lame gauche · marge ${cm(m.bottom)}` : `hauteur d'image · marge ${cm(m.bottom)}`,
      idle: false,
    },
    {
      side: 'right',
      name: 'Lame droite',
      value: cm(img.w),
      how: three ? `largeur, sur la réglette de la lame du bas · marge ${cm(m.right)}` : `largeur d'image · marge ${cm(m.right)}`,
      idle: false,
    },
  ];
}

const svg = (w: number, h: number, body: string, cls = '') =>
  `<svg class="${cls}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${body}</svg>`;

/** Vignette d'une feuille, à l'échelle des autres. */
export function paperThumb(p: (typeof PAPERS)[number]): string {
  const w = p.long;
  const h = p.short;
  return svg(42, 32, `<rect class="t-paper" x="${(42 - w) / 2}" y="${(32 - h) / 2}" width="${w}" height="${h}"/>`);
}

/** Vignette d'un négatif, dans son sens de projection. */
export function negativeThumb(n: (typeof NEGATIVES)[number]): string {
  const k = 0.42;
  let w = n.long * k;
  let h = n.short * k;
  if (n.portrait) [w, h] = [h, w];
  return svg(42, 28, `<rect class="t-neg" x="${(42 - w) / 2}" y="${(28 - h) / 2}" width="${w}" height="${h}" rx="1"/>`);
}

/**
 * Petite feuille avec son image, pour comparer les cadrages ; vue de devant,
 * donc en hauteur quand le margeur est tourné.
 */
export function mini(res: Outcome, size: number): string {
  if ('error' in res) return svg(size, size * 0.75, '');
  const k = size / res.W;
  const { W, H, img, margins: m } = res;
  const [pw, ph, x, y, iw, ih] = res.rotated
    ? [H, W, H - m.top - img.h, m.left, img.h, img.w]
    : [W, H, m.left, m.top, img.w, img.h];
  return svg(
    pw * k + 2,
    ph * k + 2,
    `<g transform="translate(1 1)"><rect class="t-paper" width="${pw * k}" height="${ph * k}"/><rect class="t-img" x="${x * k}" y="${y * k}" width="${iw * k}" height="${ih * k}"/></g>`,
  );
}

const NAMES: Record<Side, string> = { top: 'haut', bottom: 'bas', left: 'gauche', right: 'droite' };
/** Côté vu de devant d'un côté du margeur tourné d'un quart de tour. */
const TURNED: Record<Side, Side> = { top: 'right', right: 'bottom', bottom: 'left', left: 'top' };

/**
 * Schéma à l'échelle, vu de devant l'agrandisseur : feuille, image, lames
 * numérotées comme la liste, poignées sur les lames gauche et droite, et en
 * hachures la partie du négatif qui tombe sur les lames. Margeur tourné, tout
 * pivote d'un quart de tour (le côté fixe passe à droite), les lames gardent
 * leur nom. `toMargin` convertit une position de pointeur en marge.
 */
export function draw(res: Result, cw: number, maxH: number, badges: Partial<Record<Side, number>>) {
  const rot = res.rotated;
  const { W, H, img, margins: m } = res;
  const vw = rot ? H : W;
  const vh = rot ? W : H;
  const padX = 50;
  const padY = 46;
  const s = Math.min((cw - 2 * padX) / vw, (maxH - 2 * padY) / vh);
  const w = vw * s;
  const h = vh * s;
  const ox = (cw - w) / 2;
  const oy = padY;
  // Repère du margeur (x le long du côté fixe, y vers le bas) → pixels.
  const P = (x: number, y: number) => (rot ? [ox + (H - y) * s, oy + x * s] : [ox + x * s, oy + y * s]);
  const R = (x0: number, y0: number, x1: number, y1: number, attrs: string) => {
    const [ax, ay] = P(x0, y0);
    const [bx, by] = P(x1, y1);
    return `<rect ${attrs} x="${Math.min(ax, bx)}" y="${Math.min(ay, by)}" width="${Math.abs(ax - bx)}" height="${Math.abs(ay - by)}"/>`;
  };
  const view = (side: Side) => (rot ? TURNED[side] : side);
  const ix = m.left;
  const iy = m.top;
  const out: string[] = [
    `<defs><pattern id="margeur-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hatch" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>`,
    R(0, 0, W, H, 'class="s-paper"'),
  ];
  if (res.lost >= 1) {
    const dx = (res.proj.w - img.w) / 2;
    const dy = (res.proj.h - img.h) / 2;
    const zones: [number, number, number, number][] =
      dx > 0.01
        ? [
            [ix - dx, iy, ix, iy + img.h],
            [ix + img.w, iy, ix + img.w + dx, iy + img.h],
          ]
        : [
            [ix, iy - dy, ix + img.w, iy],
            [ix, iy + img.h, ix + img.w, iy + img.h + dy],
          ];
    for (const z of zones) out.push(R(...z, 'class="s-lost"'), R(...z, 'fill="url(#margeur-hatch)"'));
  }
  out.push(R(ix, iy, ix + img.w, iy + img.h, 'class="s-img"'));
  // Taille de l'image telle qu'on la voit : largeur × hauteur vues de devant.
  const [cx, cy] = P(ix + img.w / 2, iy + img.h / 2);
  const [iw, ih] = rot ? [img.h, img.w] : [img.w, img.h];
  out.push(`<text class="s-size${iw * s < 120 ? ' s-size--s' : ''}" x="${cx}" y="${cy - 2}">${cm(iw)} × ${cm(ih)}</text>`);
  if (res.style === 'gallery') {
    const [gx, gy] = res.vertical ? P(ix + img.w - 16 / s, iy + img.h / 2) : P(ix + img.w / 2, iy + img.h - 12 / s);
    out.push(`<text class="s-cap" x="${gx}" y="${gy}">bas</text>`);
  }

  const t = 9 / s;
  const tf = 14 / s;
  const e = 16 / s;
  const blades: Record<Side, (b: number) => [number, number, number, number]> = {
    top: (b) => [-e, m.top - b, W + e, m.top],
    bottom: (b) => [-e, H - m.bottom, W + e, H - m.bottom + b],
    left: (b) => [m.left - b, -e, m.left, H + e],
    right: (b) => [W - m.right, -e, W - m.right + b, H + e],
  };
  const mid: Record<Side, (b: number) => [number, number]> = {
    top: (b) => [W / 2, m.top - b / 2],
    bottom: (b) => [W / 2, H - m.bottom + b / 2],
    left: (b) => [m.left - b / 2, H / 2],
    right: (b) => [W - m.right + b / 2, H / 2],
  };
  const order: Side[] = ['left', 'right', 'bottom', 'top'];
  for (const side of order) {
    const f = Boolean(res.fixed[side]);
    out.push(R(...blades[side](f ? tf : t), `class="s-blade${f ? ' s-blade--fixed' : ''}"`));
  }
  // Marges écrites hors de la feuille, en face de chaque lame, avec son nom.
  const lab: Record<Side, [number, number]> = { top: [W / 2, 0], bottom: [W / 2, H], left: [0, H / 2], right: [W, H / 2] };
  for (const side of order) {
    let [x, y] = P(...lab[side]);
    const v = view(side);
    const f = Boolean(res.fixed[side]);
    if (v === 'top') y -= 26;
    if (v === 'bottom') y += 28;
    if (v === 'left') x -= 27;
    if (v === 'right') x += 27;
    const lr = v === 'left' || v === 'right';
    const cap = f ? (lr ? 'fixe' : 'côté fixe') : NAMES[side];
    out.push(
      lr
        ? `<text class="s-m" x="${x}" y="${y - 7}">${cm(m[side])}</text><text class="s-cap" x="${x}" y="${y + 9}">${cap}</text>`
        : `<text class="s-m" x="${x}" y="${y}">${cm(m[side])}<tspan class="s-cap" dx="6">${cap}</tspan></text>`,
    );
  }
  for (const side of order) {
    const f = Boolean(res.fixed[side]);
    const [qx, qy] = P(...mid[side](f ? tf : t));
    const v = view(side);
    const horiz = v === 'top' || v === 'bottom';
    const n = badges[side];
    if (n) {
      // Décalé du milieu pour laisser la place à la poignée.
      const dx = horiz ? -w * 0.3 : 0;
      const dy = horiz ? 0 : -h * 0.3;
      out.push(`<circle class="s-badge" cx="${qx + dx}" cy="${qy + dy}" r="11"/><text class="s-badge-t" x="${qx + dx}" y="${qy + dy}">${n}</text>`);
    }
    if ((side === 'left' || side === 'right') && res.easel !== '2') {
      const grip = horiz ? `M${qx - 4} ${qy - 2}h8M${qx - 4} ${qy + 2}h8` : `M${qx - 2} ${qy - 4}v8M${qx + 2} ${qy - 4}v8`;
      out.push(
        `<g class="s-handle" data-side="${side}" style="cursor:${horiz ? 'ns' : 'ew'}-resize"><circle class="s-hit" cx="${qx}" cy="${qy}" r="22"/><circle class="s-knob" cx="${qx}" cy="${qy}" r="11"/><path class="s-grip" d="${grip}"/></g>`,
      );
    }
  }
  const H2 = h + 2 * padY;
  return {
    svg: `<svg class="schema" width="${cw}" height="${H2}" viewBox="0 0 ${cw} ${H2}" role="img" aria-label="Feuille ${res.paper.label}, image de ${cm(iw)} × ${cm(ih)} cm">${out.join('')}</svg>`,
    /** Position du pointeur (px dans le schéma) → marge du côté glissé. */
    toMargin(side: Side, px: number, py: number) {
      const x = rot ? (py - oy) / s : (px - ox) / s;
      return side === 'left' ? x : W - x;
    },
  };
}

/** Où poser le margeur sous l'agrandisseur (colonne en haut). */
export function picto(rotated: boolean): string {
  const body = rotated
    ? `<rect class="p-easel" x="27" y="18" width="42" height="56"/><rect class="p-fixed" x="65" y="18" width="5" height="56"/><rect class="t-img" x="33" y="25" width="27" height="42"/>`
    : `<rect class="p-easel" x="20" y="24" width="56" height="42"/><rect class="p-fixed" x="20" y="23" width="56" height="5"/><rect class="t-img" x="27" y="33" width="42" height="27"/>`;
  return svg(96, 80, `<rect class="p-col" x="40" y="2" width="16" height="8"/>${body}`);
}
