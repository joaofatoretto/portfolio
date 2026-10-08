import { render } from '@testing-library/react';
import { PrototypeEmbed } from './PrototypeEmbed';
import { CASES } from '../content/cases';
import { pt } from '../content/pt';
import type { Block } from '../content/cases/types';

const embeds = (body: Block[]) => body.filter((b): b is Extract<Block, { type: 'embed' }> => b.type === 'embed');

describe('PrototypeEmbed', () => {
  // The tall (phone) layout comes from the block's data, never from its label, which is translated.
  it('is tall when the block says so, whatever the label', () => {
    const { container } = render(<PrototypeEmbed src="https://embed.figma.com/x" label="Celular" tall />);
    expect(container.querySelector('figure')).toHaveClass('embed-tall');
  });

  it('is wide by default, even when the label says mobile', () => {
    const { container } = render(<PrototypeEmbed src="https://embed.figma.com/x" label="Mobile" />);
    expect(container.querySelector('figure')).not.toHaveClass('embed-tall');
  });

  it('marks the same embeds tall in both languages', () => {
    const tall = (cases: typeof CASES) => cases.flatMap(c => embeds(c.body).map(e => `${c.slug}:${!!e.tall}`));
    expect(tall(CASES)).toContain('photo-editing:true');
    expect(tall(pt.cases)).toEqual(tall(CASES));
  });
});
