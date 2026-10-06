import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Lockup } from './Icons';

/** Fixed nav, Stage like the page. On home the Hero switches it: .stage (transparent) over the full-screen hero, .paper over the room around it. */
export function NavBar() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  /* pages that open with the full-screen TV hero (TVHero switches the nav as you scroll) */
  const tvHero = onHome || pathname === '/hire';
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'build', 'about', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [onHome]);

  const current = onHome ? active : pathname.startsWith('/work/') ? 'work' : '';
  const link = (id: string, text: string) => (
    <a className="text-link" href={`/#${id}`} aria-current={current === id ? 'true' : undefined}>{text}</a>
  );
  return (
    // Home and /hire start on the dark Stage (the prerendered HTML too); from then on TVHero toggles .stage with the scroll.
    <div className={tvHero ? 'nav-wrap stage' : 'nav-wrap'} id="navwrap">
      <nav className="nav" aria-label="Main">
        <Lockup />
        <div className="links">
          {link('work', 'Case studies')}
          {link('build', 'How I build')}
          {link('about', 'About')}
          <a className="talk" href={`${onHome ? '/' : pathname}#contact`}>Let’s talk</a>
        </div>
      </nav>
    </div>
  );
}
