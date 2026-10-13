/* Lab only: /lab/hero/:v shows the /hire page with hero variant v in place of HireHero.
   The route exists only on the dev server (App.tsx), so none of this ships. */
import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Call } from '../sections/hire/Call';
import { Pay } from '../sections/hire/Pay';
import { PathSection } from '../sections/hire/PathSection';
import { Picture } from '../sections/hire/Picture';
import { ProofCards } from '../sections/hire/ProofCards';
import { Send } from '../sections/hire/Send';
import { Trust } from '../sections/hire/Trust';
import { VARIANTS } from './heroes';

export default function HeroLab() {
  const { v } = useParams();
  const current = VARIANTS.find(x => String(x.n) === v) ?? VARIANTS[0];
  const Hero = current.load;
  return (
    <main className="hire-page">
      <nav className="lab-switch" aria-label="Hero variants">
        {VARIANTS.map(x => (
          <Link key={x.n} to={`/lab/hero/${x.n}`} reloadDocument aria-current={x.n === current.n ? 'page' : undefined} title={x.name}>{x.n}</Link>
        ))}
        <span>{current.name}</span>
      </nav>
      <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
        <Hero />
      </Suspense>
      <div className="room paper"><Trust /></div>
      <div className="page">
        <PathSection />
        <Picture />
        <ProofCards />
        <Pay />
        <Call />
        <Send />
      </div>
      <style>{`
        .lab-switch { position: fixed; left: 12px; bottom: 12px; z-index: 9999; display: flex; gap: 4px; align-items: center;
          padding: 4px; border-radius: 999px; background: rgba(10,10,11,.85); border: 1px solid #3A3A3C; font: 12px var(--font-mono); backdrop-filter: blur(8px); }
        .lab-switch a { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; color: #A3A3A3; text-decoration: none; }
        .lab-switch a[aria-current] { background: #fff; color: #0A0A0B; }
        .lab-switch span { padding: 0 10px 0 6px; color: #A3A3A3; }
      `}</style>
    </main>
  );
}
