import { fmt, useCopy } from '../i18n/copy';

/** Placeholder picture: a greyscale TV test card, used until a case has a real cover. */
export function TestCard({ client, n }: { client: string; n: number }) {
  const { ui } = useCopy();
  const fs = Math.min(64, 640 / (client.length * 0.6));
  const bars = ['--white', '--grey-150', '--grey-300', '--grey-400', '--grey-500', '--grey-700', '--grey-750', '--grey-800'];
  const wave: string[] = [];
  for (let x = 440; x <= 1160; x += 4) {
    const th = (2 * Math.PI * (x - 440)) / 180;
    wave.push(`${x},${(735 + 42 * (0.62 * Math.sin(3 * th + Math.PI / 2) + 0.38 * Math.sin(2 * th))).toFixed(1)}`);
  }
  const mono = { font: '500 26px var(--font-mono)', letterSpacing: '.1em', fill: 'var(--fg-tertiary)' };
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1600" height="1000" style={{ fill: 'var(--surface)' }} />
      {Array.from({ length: 15 }, (_, i) => <line key={'v' + i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="1000" strokeWidth="1.5" style={{ stroke: 'var(--line)' }} />)}
      {Array.from({ length: 9 }, (_, i) => <line key={'h' + i} x1="0" y1={(i + 1) * 100} x2="1600" y2={(i + 1) * 100} strokeWidth="1.5" style={{ stroke: 'var(--line)' }} />)}
      <circle cx="800" cy="500" r="380" strokeWidth="3" style={{ fill: 'var(--surface)', stroke: 'var(--line-strong)' }} />
      {bars.map((b, i) => <rect key={b} x={440 + i * 90} y="250" width="90" height="120" style={{ fill: `var(${b})` }} />)}
      <rect x="440" y="430" width="720" height="140" strokeWidth="3" style={{ fill: 'var(--bg)', stroke: 'var(--fg-primary)' }} />
      <text x="800" y={500 + fs * 0.35} textAnchor="middle" style={{ fill: 'var(--fg-primary)', font: `600 ${fs}px var(--font-display)` }}>{client}</text>
      <polyline points={wave.join(' ')} fill="none" strokeWidth="4" style={{ stroke: 'var(--fg-primary)' }} />
      <text x="60" y="84" style={mono}>{fmt(ui.testCard.label, { n: String(n).padStart(2, '0') })}</text>
      <text x="1540" y="944" textAnchor="end" style={mono}>{ui.testCard.cover}</text>
    </svg>
  );
}
