import { parse } from 'parse5';

const attributes = new Set(['alt', 'title', 'aria-label', 'placeholder', 'data-label', 'data-alt']);
const skip = new Set(['script', 'style', 'code', 'pre', 'svg', 'math', 'noscript']);

export function visitContent(html, visit, localizeLink) {
  const document = parse(html, { sourceCodeLocationInfo: true });
  const edits = [];
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  function walk(node, blocked = false) {
    blocked ||= skip.has(node.tagName) || node.attrs?.some((a) => a.name === 'translate' && a.value === 'no');
    if (blocked) return;
    const location = node.sourceCodeLocation;
    if (node.nodeName === '#text' && location) {
      const source = node.value.trim();
      if (source) { const result = visit(source); if (result !== source) edits.push([location.startOffset, location.endOffset, escape(node.value.replace(source, result))]); }
    }
    for (const attr of node.attrs ?? []) {
      let value = attr.value;
      if (attributes.has(attr.name)) value = visit(value.trim());
      if (attr.name === 'href' && node.tagName === 'a' && localizeLink) value = localizeLink(value);
      if (value !== attr.value && location?.attrs?.[attr.name]) edits.push([location.attrs[attr.name].startOffset, location.attrs[attr.name].endOffset, `${attr.name}="${escape(value)}"`]);
    }
    for (const child of node.childNodes ?? []) walk(child, blocked);
  }
  walk(document);
  edits.sort((a, b) => b[0] - a[0]);
  for (const [start, end, value] of edits) html = html.slice(0, start) + value + html.slice(end);
  return html;
}
