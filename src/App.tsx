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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
