import type React from 'react';

/**
 * Inline styles injected into the RichTextRenderer container via a <style> tag
 * to style Tiptap-generated HTML elements inside Remotion compositions.
 */
export const richTextCSS = `
  p { margin: 0 0 0.5em 0; }
  p:last-child { margin-bottom: 0; }
  strong, b { font-weight: 700; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  h2 { font-size: 1.5em; font-weight: 700; margin: 0 0 0.4em 0; }
  h3 { font-size: 1.25em; font-weight: 600; margin: 0 0 0.4em 0; }
  ul { list-style: disc; padding-left: 1.5em; margin: 0.4em 0; }
  ol { list-style: decimal; padding-left: 1.5em; margin: 0.4em 0; }
  li { margin: 0.2em 0; }
  blockquote { border-left: 4px solid currentColor; opacity: 0.8; padding-left: 1em; margin: 0.5em 0; font-style: italic; }
`;
