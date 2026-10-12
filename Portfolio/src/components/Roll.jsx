/** Text that rolls up to a duplicate on hover (CSS only, see .roll in global.css). */
export default function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__a">{children}</span>
      <span className="roll__b" aria-hidden="true">{children}</span>
    </span>
  );
}
