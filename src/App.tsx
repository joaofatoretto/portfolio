import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ChannelSwitch, useScrollOnNavigate } from './components/ChannelSwitch';
import { Footer } from './components/Footer';
import { useCopy } from './i18n/copy';
import { NavBar } from './components/NavBar';
import { CaseStudy } from './pages/CaseStudy';
import { Hire } from './pages/Hire';
import { HireThanks } from './pages/HireThanks';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

/* Lab: hero explorations, on the dev server only (dropped from the production and prerender builds). */
const HeroLab = import.meta.env.DEV ? lazy(() => import('./lab/HeroLab')) : null;

function Layout() {
  useScrollOnNavigate();
  const { ui } = useCopy();
  return (
    <>
      <a className="skip" href="#main-content" onClick={e => { e.preventDefault(); document.querySelector<HTMLElement>('main [data-focus]')?.focus(); }}>{ui.skip}</a>
      <NavBar />
      <Outlet />
      <Footer />
      <ChannelSwitch />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="hire" element={<Hire />} />
        <Route path="hire/thanks" element={<HireThanks />} />
        {HeroLab && <Route path="lab/hero/:v" element={<Suspense fallback={null}><HeroLab /></Suspense>} />}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
