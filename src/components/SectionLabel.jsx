export default function SectionLabel({ children, number, className = "" }) {
  return (
    <div className={`section-label ${className}`}>
      <span className="section-label__dot" aria-hidden="true" />
      {number && <span className="section-label__number">{number}</span>}
      <span>{children}</span>
    </div>
  );
}
