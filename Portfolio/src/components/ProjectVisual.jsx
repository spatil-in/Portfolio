/**
 * Generated project artwork (no stock photos, no network). Each variant is a
 * small abstract UI drawn with CSS so cards always render and stay on-theme.
 */
export default function ProjectVisual({ variant, className = "" }) {
  return (
    <div className={`pv pv--${variant} ${className}`} aria-hidden="true">
      <span className="pv__glow" />
      {variant === "dashboard" && (
        <div className="pv__frame">
          <div className="pv__side"><i /><i /><i /><i /></div>
          <div className="pv__main">
            <div className="pv__row"><b /><b /><b /></div>
            <div className="pv__chart">
              {[38, 62, 46, 78, 54, 90, 68].map((h, i) => <i key={i} style={{ "--h": `${h}%` }} />)}
            </div>
            <div className="pv__lines"><s /><s /><s /></div>
          </div>
        </div>
      )}
      {variant === "wordpress" && (
        <div className="pv__frame pv__frame--page">
          <div className="pv__bar"><i /><i /><i /></div>
          <div className="pv__hero" />
          <div className="pv__cols"><b /><b /><b /></div>
          <div className="pv__lines"><s /><s /></div>
        </div>
      )}
      {variant === "apps" && (
        <div className="pv__stack">
          <div className="pv__card pv__card--a"><s /><s /><em /></div>
          <div className="pv__card pv__card--b"><div className="pv__donut" /><s /><s /></div>
          <div className="pv__card pv__card--c"><div className="pv__spark"><i /><i /><i /><i /><i /><i /></div></div>
        </div>
      )}
      {variant === "portfolio" && (
        <div className="pv__orbits">
          <i /><i /><i /><span>SP.</span>
        </div>
      )}
    </div>
  );
}
