import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopy, useLocalize } from '../i18n/copy';
import { Lockup } from './Icons';
import { LangSwitch } from './LangSwitch';

/** Fixed nav, Stage like the page. On home the Hero switches it: .stage (transparent) over the full-screen hero, .paper over the room around it. */
export function NavBar() {
  const { pathname } = useLocation();
  const { ui } = useCopy(), localize = useLocalize();
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
  /* the hire page and its thank-you page */
  const onHire = pathname === '/hire' || pathname.startsWith('/hire/');
  /** `more`: a home section that gives way first on narrower screens */
  const link = (id: string, text: string, more = false) => (
    <a className={more ? 'text-link nav-more' : 'text-link'} href={localize(`/#${id}`)} aria-current={current === id ? 'true' : undefined}>{text}</a>
  );
  return (
    // Home and /hire start on the dark Stage (the prerendered HTML too); from then on TVHero toggles .stage with the scroll.
    <div className={tvHero ? 'nav-wrap stage' : 'nav-wrap'} id="navwrap">
      <nav className="nav" aria-label={ui.nav.label}>
        <Lockup />
        <div className="links">
          {link('work', ui.nav.work)}
          {link('build', ui.nav.build, true)}
          {link('about', ui.nav.about, true)}
          <a className="text-link" href={localize('/hire')} aria-current={onHire ? 'page' : undefined}>{ui.nav.hire}</a>
          <LangSwitch />
          <a className="talk" href={localize(`${onHome ? '/' : pathname}#contact`)}>{ui.nav.talk}</a>
        </div>
      </nav>
    </div>
  );
}
