import { memo } from 'react';
import { HERO } from '../../content/hire';
import { waLink } from '../../content/profile';
import { TVHero } from '../../components/TVHero';
import { caseBySlug } from '../../content/cases';
import { ArrowIcon } from '../../components/Icons';
import { WaIcon } from './icons';
import { TempoSession } from './TempoSession';

/* Real work in the hero: the Tempo landing page I redesigned. */
const SHOT = caseBySlug('tempo-landing-page')!;

/** Rendered once for real and three times as aria-hidden copies for the TV's picture tears. */
const HireHeroContent = memo(function HireHeroContent({ copy }: { copy: boolean }) {
  const H = copy ? 'div' : 'h1';
  const tab = copy ? -1 : undefined;
  return (
    <div className="content hire-content" aria-hidden={copy || undefined}>
      <div className="eyebrow-row"><p className="eyebrow">João Fatoretto — Product Designer who ships code</p></div>
      <div className="hire-hero-grid">
        <div className="hire-hero-text">
          <H className="hh-title" {...(copy ? {} : { 'data-focus': true, tabIndex: -1 })}>{HERO.title}</H>
          <p className="body-l hh-lede">{HERO.lede}</p>
          <div className="ctas">
            <a className="btn primary" href="#contact" tabIndex={tab}>{HERO.cta}&nbsp;&nbsp;→</a>
            <a className="btn ghost" href={waLink(HERO.wa)} target="_blank" rel="noopener noreferrer" tabIndex={tab}><WaIcon />Chat on WhatsApp</a>
          </div>
        </div>
        <div className="hire-hero-visual hh-shot">
          <TempoSession live={!copy} alt={copy ? '' : HERO.shot.alt}>
            <a className="inline-link" href={`/work/${SHOT.slug}`} tabIndex={tab}>See the case&nbsp;<ArrowIcon /></a>
          </TempoSession>
        </div>
      </div>
    </div>
  );
});

/** /hire's hero: the same TV as home (tunes in, then closes into the card as you scroll), on CH 06. */
export function HireHero() {
  return <TVHero channel="CH 06" label="Tell me your idea" content={copy => <HireHeroContent copy={copy} />} />;
}
