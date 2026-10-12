import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap-setup";
import { journey } from "../data/journey";
import { copy } from "../data/content";
import SectionLabel from "../components/SectionLabel";

export default function Journey() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.current.querySelector(".journey__line"), { drawSVG: "0% 0%" }, {
        drawSVG: "0% 100%", ease: "none",
        scrollTrigger: { trigger: root.current.querySelector(".journey__timeline"), start: "top 72%", end: "bottom 70%", scrub: 0.8 },
      });
      gsap.utils.toArray(".journey-card", root.current).forEach((card, index) => {
        gsap.from(card, {
          x: window.matchMedia("(max-width: 767px)").matches ? 0 : index % 2 ? 38 : -38,
          opacity: 0, duration: 0.7, ease: "signature",
          scrollTrigger: { trigger: card, start: "top 83%" },
        });
        gsap.from(card.querySelector(".journey-card__dot"), {
          scale: 0.2, boxShadow: "0 0 0 rgba(47,107,255,0)",
          scrollTrigger: { trigger: card, start: "top 75%", end: "top 45%", scrub: 0.4 },
        });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="journey section-pad" id="journey" ref={root} aria-labelledby="journey-title">
      <div className="container">
        <div className="section-heading">
          <div><SectionLabel number="05">{copy.journey.label}</SectionLabel><h2 className="section-title" id="journey-title">{copy.journey.title} <span className="gradient-text">{copy.journey.highlight}</span></h2></div>
          <p className="section-heading__copy">{copy.journey.description}</p>
        </div>
        <div className="journey__timeline">
          <svg className="journey__svg" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path className="journey__line" pathLength="100" d="M 1 0 V 100" /></svg>
          {journey.map((item, index) => (
            <article className={`journey-card ${index % 2 ? "journey-card--right" : ""}`} key={item.number}>
              <span className="journey-card__dot" aria-hidden="true" />
              <div className="journey-card__inner glass">
                <div className="journey-card__meta"><span>{item.period}</span><span>{item.number} / 03</span></div>
                <h3>{item.role}</h3><span className="journey-card__place">{item.place}</span><p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
