import { useEffect } from 'react';
import { useCopy } from '../i18n/copy';
import { Call } from '../sections/hire/Call';
import { HireHero } from '../sections/hire/HireHero';
import { Pay } from '../sections/hire/Pay';
import { PathSection } from '../sections/hire/PathSection';
import { Picture } from '../sections/hire/Picture';
import { ProofCards } from '../sections/hire/ProofCards';
import { Send } from '../sections/hire/Send';
import { Trust } from '../sections/hire/Trust';

/** /hire, for small businesses and solo founders. Eight beats, each raising the visitor's confidence:
 *  idea → legit? → not sure what I need → picture it → done before → money is safe → what are you waiting for? → send. */
export function Hire() {
  const { seo } = useCopy();
  useEffect(() => { document.title = seo.hire.title; }, [seo]);
  return (
    <main className="hire-page">
      {/* Like home: Paper frames the hero as it closes into the card, and the trust strip under it. The rest is Stage. */}
      <div className="room paper">
        <HireHero />
        <Trust />
      </div>
      <div className="page">
        <PathSection />
        <Picture />
        <ProofCards />
        <Pay />
        <Call />
        <Send />
      </div>
    </main>
  );
}
