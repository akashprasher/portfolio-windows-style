export function WindowBar({ title }: { title: string }) {
  return (
    <div className="window-bar">
      <div className="window-title">
        <span className="window-file-icon" aria-hidden="true">
          ▧
        </span>
        <span>{title}</span>
      </div>
      <div className="window-controls" aria-hidden="true">
        <span>_</span>
        <span>□</span>
        <span>×</span>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <div className="section-heading" id={id}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}
