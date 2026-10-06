import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { TempoSession } from './TempoSession';

/** Width and height from a WebP file's header (lossy, lossless or extended). */
function webpSize(file: string) {
  const b = readFileSync(file);
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (kind === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
}

describe('Tempo session', () => {
  const imgs = () => {
    const { container } = render(<TempoSession live={false} alt="Tempo’s landing page" />);
    const page = container.querySelector<HTMLElement>('.tp-page')!;
    const pageH = 11488;
    return [...page.querySelectorAll('img')].map(img => {
      const w = Number(img.getAttribute('width')), h = Number(img.getAttribute('height'));
      return { img, w, h, top: (parseFloat(img.style.top) / 100) * pageH };
    });
  };

  it('declares each part at its real size', () => {
    for (const { img, w, h } of imgs()) expect(webpSize(join(process.cwd(), 'public', img.getAttribute('src')!)), img.getAttribute('src')!).toEqual([w, h]);
  });

  it('tucks each part under the next, so no seam shows between them', () => {
    const parts = imgs();
    for (let i = 0; i < parts.length - 1; i++) expect(parts[i].top + parts[i].h).toBeGreaterThan(parts[i + 1].top + 1);
    const last = parts[parts.length - 1];
    expect(last.top + last.h).toBeCloseTo(11488, 5);
  });
});
