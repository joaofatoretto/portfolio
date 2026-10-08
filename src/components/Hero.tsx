import { memo, useEffect, useState } from 'react';
import { PROFILE } from '../content/profile';
import { useCopy, useLocalize } from '../i18n/copy';
import { FIBRES } from '../lib/signal';
import { TVHero } from './TVHero';

/* The fibres are ~200 KB of path data, drawn four times (content + tear copies). They add nothing to the prerendered HTML,
   so they're added once the page is live; the content is still hidden then, and the band only draws in later in the tune-in. */
const Band = memo(function Band() {
  const label = useCopy().profile.home.hero.band;
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  return (
    <div className="band-wrap">
      <div className="band-clip">
        <svg className="band-svg" viewBox="0 0 1264 300" preserveAspectRatio="none" role="img" aria-label={label}>
          {live && <>
            {FIBRES.paths.map((d, i) => <path key={i} d={d} fill="none" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="0.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}
            <path d={FIBRES.main} fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            <path d={FIBRES.main} fill="none" stroke="#FFFFFF" strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </>}
        </svg>
      </div>
      <div className="sweep" />
    </div>
  );
});

/** Rendered once for real and three times as aria-hidden copies for the picture tears. */
const HeroContent = memo(function HeroContent({ copy }: { copy?: boolean }) {
  const { ui, profile } = useCopy(), t = profile.home.hero, localize = useLocalize();
  const H = copy ? 'div' : 'h1';
  const tab = copy ? -1 : undefined;
  return (
    <div className="content" aria-hidden={copy || undefined}>
      <div className="eyebrow-row">
        <p className="eyebrow">{ui.eyebrow}</p>
      </div>
      <div className="headline-row">
        <H className="h1" {...(copy ? {} : { 'data-focus': true, tabIndex: -1 })}>{t.title}</H>
        <div className="intro">
          <p className="body-l">{t.intro}</p>
          <div className="ctas">
            <a className="btn primary" href={localize('/#work')} tabIndex={tab}>{t.cta}</a>
            <a className="btn ghost" href={PROFILE.cv} download tabIndex={tab}>{t.cv}</a>
          </div>
        </div>
      </div>
      <div className="band-group">
        <Band />
        {/* The answer to the graphic, revealed a moment after it draws (see .cue in home.css). The band's aria-label says the same. */}
        <div className="cue" aria-hidden="true">
          <span className="cue-noise"><b>{t.cue.noise}</b><span className="cue-long">{t.cue.noiseLong}</span></span>
          <span className="cue-line"><i /></span>
          <span className="cue-signal"><b>{t.cue.signal}</b></span>
        </div>
      </div>
    </div>
  );
});

/** Home's hero: "Listen." tunes in on CH 01 (the TV itself is TVHero). */
export function Hero() {
  const { profile } = useCopy();
  return <TVHero channel="CH 01" label={profile.home.hero.label} content={copy => <HeroContent copy={copy} />} />;
}
