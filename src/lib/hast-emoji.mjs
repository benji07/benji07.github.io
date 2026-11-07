// Emoji en début de ligne de liste ou de paragraphe (« - 👥 Tu peux
// venir… ») : il tient lieu de puce, le lecteur d'écran n'a pas à le lire.
// On le masque, et la liste reçoit role="list" : Safari retire sinon la
// sémantique de liste quand les puces sont masquées en CSS.
// Plugin hast de Sätteri, le moteur markdown d'Astro 7.

// Un emoji affiché comme tel, avec ses variantes (couleur de peau, ZWJ).
const LEADING_EMOJI =
  /^((?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)(?:\p{Emoji_Modifier}|️|‍\p{Extended_Pictographic}️?)*)/u;

export default {
  name: 'hide-leading-emoji',
  element: {
    filter: ['li', 'p'],
    visit(node, ctx) {
      const first = node.children[0];
      if (first?.type !== 'text') return;
      const match = first.value.match(LEADING_EMOJI);
      if (!match) return;
      ctx.removeChildAt(node, 0);
      ctx.insertChildAt(node, 0, [
        { type: 'element', tagName: 'span', properties: { ariaHidden: 'true' }, children: [{ type: 'text', value: match[1] }] },
        { type: 'text', value: first.value.slice(match[1].length) },
      ]);
      // Ligne de liste, directement ou via son <p> (liste « aérée »).
      const item = node.tagName === 'li' ? node : ctx.parent(node);
      const list = item?.tagName === 'li' ? ctx.parent(item) : undefined;
      if (list) ctx.setProperty(list, 'role', 'list');
    },
  },
};
