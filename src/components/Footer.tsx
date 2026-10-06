import { useLocation } from 'react-router-dom';
import { PROFILE } from '../content/profile';
import { Lockup } from './Icons';

export function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className="page">
      <div className="footer">
        <Lockup />
        <span className="caption">Designed and built by me in React. Every graphic is generated in code.</span>
        <div className="footer-links">
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.cv} download>CV (PDF)</a>
          <a href={`${pathname}#top`}>Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
