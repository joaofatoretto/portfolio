/* A case body's Portuguese text, laid over the English body block by block. Images and embeds are written here with
   their text only (alt, label); their src, sizes and flags come from the English block, so they live in one place.
   Throws at import if the two bodies drift apart (a block added, removed or reordered on one side only). */
import type { Block, CaseBody } from '../../cases/types';

export type TextBlock =
  | Exclude<Block, { type: 'img' | 'embed' }>
  | { type: 'img'; alt: string; caption?: string }
  | { type: 'embed'; label: string };

export function translateBody(en: CaseBody, pt: TextBlock[], slug: string): CaseBody {
  if (en.length !== pt.length) throw new Error(`${slug}: ${pt.length} Portuguese blocks for ${en.length} English ones`);
  return en.map((e, i) => {
    const t = pt[i];
    if (t.type !== e.type) throw new Error(`${slug} #${i}: ${t.type} where English has ${e.type}`);
    return { ...e, ...t } as Block;
  });
}
