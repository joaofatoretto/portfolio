import { Fragment, type ReactNode } from 'react';

/** Renders the case-study inline markup: **bold**, _italic_ and [text](url). */
const TOKEN = /(\*\*.+?\*\*|_[^_]+?_|\[[^\]]+\]\([^)]+\))/g;

export function rich(text: string): ReactNode[] {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{rich(part.slice(2, -2))}</strong>;
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) return <em key={i}>{rich(part.slice(1, -1))}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return <a key={i} href={link[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{rich(link[1])}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export const Rich = ({ text }: { text: string }) => <>{rich(text)}</>;
