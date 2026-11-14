/**
 * Use pre-measured accordion panel height when present (see Accordion.astro)
 * so scrollHeight is not read after Starwind invalidates styles.
 */
export function accordionRafPlugin() {
  return {
    name: 'accordion-raf-scrollheight',
    transform(code, id) {
      if (!id.includes('@starwind-ui') && !id.includes('starwind-ui')) return null;
      if (code.includes('/* accordion-raf */')) return null;

      let next = code;
      let changed = false;

      const setHeightPattern =
        /panel\.style\.setProperty\(heightProperty,\s*`\$\{panel\.scrollHeight\}px`\);/g;
      if (setHeightPattern.test(next)) {
        changed = true;
        next = next.replace(
          setHeightPattern,
          '/* accordion-raf */panel.style.setProperty(heightProperty, `${panel.__swPanelH ?? panel.scrollHeight}px`);',
        );
      }

      const contentHeightPattern =
        /`\$\{content\.scrollHeight\}px`/g;
      if (contentHeightPattern.test(next)) {
        changed = true;
        next = next.replace(
          contentHeightPattern,
          '`${content.__swPanelH ?? content.scrollHeight}px`',
        );
      }

      const genericPanelHeightPattern = /`\$\{panel\.scrollHeight\}px`/g;
      if (genericPanelHeightPattern.test(next)) {
        changed = true;
        next = next.replace(
          genericPanelHeightPattern,
          '`${panel.__swPanelH ?? panel.scrollHeight}px`',
        );
      }

      if (!changed) return null;

      return { code: next, map: null };
    },
  };
}
