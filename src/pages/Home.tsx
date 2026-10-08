import { useEffect } from 'react';
import { useCopy } from '../i18n/copy';
import { Contact } from '../components/Contact';
import { Hero } from '../components/Hero';
import { About } from '../sections/About';
import { Build } from '../sections/Build';
import { Method } from '../sections/Method';
import { Proof } from '../sections/Proof';
import { Work } from '../sections/Work';

export function Home() {
  const { seo } = useCopy();
  useEffect(() => { document.title = seo.title; }, [seo]);
  return (
    <main>
      {/* The room around the TV: Paper frames the hero as it closes into the card, and the results under it.
          Everything after is on the dark Stage, like the rest of the site. */}
      <div className="room paper">
        <Hero />
        <div className="page"><Proof /></div>
      </div>
      <div className="page">
        <Work />
        <Method />
        <Build />
        <About />
        <Contact />
      </div>
    </main>
  );
}
