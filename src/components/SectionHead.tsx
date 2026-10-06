import { R } from '../lib/reveal';

export function SectionHead({ label, title, id, lede }: { label: string; title: string; id: string; lede?: string }) {
  return (
    <div className="section-head">
      <div>
        <R><span className="label">{label}</span></R>
        <R kind="wipe" d={80}><h2 className="h-1" id={id} tabIndex={-1}>{title}</h2></R>
      </div>
      {lede && <R as="p" d={220} className="lede">{lede}</R>}
    </div>
  );
}
