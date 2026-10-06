import { Outlet, Route, Routes } from 'react-router-dom';
import { ChannelSwitch, useScrollOnNavigate } from './components/ChannelSwitch';
import { Footer } from './components/Footer';
import { NavBar } from './components/NavBar';
import { CaseStudy } from './pages/CaseStudy';
import { Hire } from './pages/Hire';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

function Layout() {
  useScrollOnNavigate();
  return (
    <>
      <a className="skip" href="#main-content" onClick={e => { e.preventDefault(); document.querySelector<HTMLElement>('main [data-focus]')?.focus(); }}>Skip to content</a>
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
