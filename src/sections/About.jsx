import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../animations/gsap-setup";
import SectionLabel from "../components/SectionLabel";
import { copy, experienceStats } from "../data/content";

export default function About() {
  const root = useRef(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current.querySelectorAll("[data-about-count]").forEach((item) => {
        const target = Number(item.dataset.aboutCount);
        item.textContent = `${target.toFixed(target % 1 ? 1 : 0)}${item.dataset.suffix}`;
      });
      return undefined;
    }
    const words = new SplitText(root.current.querySelector(".about__statement"), { type: "words" });
    const quoteLines = new SplitText(root.current.querySelector(".about__quote p"), { type: "lines", mask: "lines" });
    gsap.fromTo(words.words, { opacity: 0.18 }, {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: root.current.querySelector(".about__statement"), start: "top 75%", end: "bottom 45%", scrub: 0.6 },
    });
    gsap.from(root.current.querySelectorAll(".about-card"), {
      y: 36, opacity: 0, stagger: 0.12, duration: 0.7, ease: "signature",
      scrollTrigger: { trigger: root.current.querySelector(".about__cards"), start: "top 78%" },
    });
    root.current.querySelectorAll("[data-about-count]").forEach((item) => {
      const counter = { value: 0 };
      const target = Number(item.dataset.aboutCount);
      gsap.to(counter, {
        value: target,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current.querySelector(".about__stats"), start: "top 84%", once: true },
        onUpdate: () => { item.textContent = `${counter.value.toFixed(target % 1 ? 1 : 0)}${item.dataset.suffix}`; },
      });
    });
    gsap.from(quoteLines.lines, {
      yPercent: 100, opacity: 0, stagger: 0.12, duration: 0.8, ease: "signature",
      scrollTrigger: { trigger: root.current.querySelector(".about__quote"), start: "top 82%" },
    });
    return () => {
      words.revert();
      quoteLines.revert();
    };
  }, { scope: root });

  return (
    <section className="about section-pad" id="about" ref={root} aria-labelledby="about-title">
      <div className="container">
        <div className="section-heading about__heading">
          <SectionLabel number="02">{copy.about.label}</SectionLabel>
          <span className="section-heading__aside">{copy.about.aside[0]}<br />{copy.about.aside[1]}</span>
        </div>
        <h2 className="sr-only" id="about-title">About me</h2>
        <p className="about__statement">{copy.about.statement.map((segment, index) => segment.emphasis ? <span key={index}>{segment.text}</span> : <span key={index} className="about__statement-plain">{segment.text}</span>)}</p>
        <div className="about__cards">
          {copy.about.pillars.map((pillar) => (
            <article className="about-card glass" key={pillar.number}>
              <div className="about-card__top"><span>{pillar.number} / 03</span><span className="about-card__icon" aria-hidden="true">{pillar.icon}</span></div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
              <span className="about-card__rule" />
            </article>
          ))}
        </div>
        <blockquote className="about__quote">
          <span className="about__quote-mark" aria-hidden="true">“</span>
          <p>{copy.about.quote}</p>
          <cite>{copy.about.attribution}</cite>
        </blockquote>
        <div className="about__stats" aria-label="Experience highlights">
          {experienceStats.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <strong data-about-count={stat.value} data-suffix={stat.suffix}>0{stat.suffix}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
