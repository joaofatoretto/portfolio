import { useLocation } from 'react-router-dom';
import { PROFILE } from '../content/profile';
import { useCopy, useLocalize } from '../i18n/copy';
import { Lockup } from './Icons';
import { LangSwitch } from './LangSwitch';

export function Footer() {
  const { pathname } = useLocation();
  const { ui } = useCopy(), localize = useLocalize();
  return (
    <footer className="page">
      <div className="footer">
        <Lockup />
        <span className="caption">{ui.footer.caption}</span>
        <div className="footer-links">
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.cv} download>{ui.footer.cv}</a>
          <a href={localize(`${pathname}#top`)}>{ui.footer.top}</a>
          <LangSwitch />
        </div>
      </div>
    </footer>
  );
}
