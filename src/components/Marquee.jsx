export default function Marquee() {
  const phrase = "LET’S BUILD SOMETHING AMAZING";
  return (
    <div className="marquee" aria-label={phrase}>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => <span key={item}>{phrase}<i>✳</i></span>)}
      </div>
    </div>
  );
}
