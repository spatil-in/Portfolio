import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/gsap-setup";
import { skillGroups } from "../data/skills";
import { copy } from "../data/content";
import SectionLabel from "../components/SectionLabel";
import SkillTile from "../components/SkillTile";

export default function Skills() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tiles = root.current.querySelectorAll(".skill-tile");
      gsap.set(tiles, { transformPerspective: 900, transformOrigin: "50% 100%" });
      ScrollTriggerBatch(tiles);
    });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.utils.toArray(".skill-group__title").forEach((heading) => {
        const original = heading.textContent;
        ScrollTrigger.create({
          trigger: heading,
          start: "top 82%",
          once: true,
          onEnter: () => gsap.to(heading, { duration: 0.75, scrambleText: { text: original, chars: "01/<>", speed: 0.5 } }),
        });
      });
    }
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="skills section-pad" id="skills" ref={root} aria-labelledby="skills-title">
      <div className="container">
        <div className="section-heading">
          <div><SectionLabel number="03">{copy.skills.label}</SectionLabel><h2 className="section-title" id="skills-title">{copy.skills.title} <span className="gradient-text">{copy.skills.highlight}</span></h2></div>
          <p className="section-heading__copy">{copy.skills.description}</p>
        </div>
        <div className="skills__groups">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <div className="skill-group__heading"><span>{group.index}</span><h3 className="skill-group__title">{group.title}</h3><span className="skill-group__count">{String(group.skills.length).padStart(2, "0")} SKILLS</span></div>
              <div className="skill-group__grid">{group.skills.map((skill, index) => <SkillTile key={skill} name={skill} index={index} />)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollTriggerBatch(elements) {
  ScrollTrigger.batch(elements, {
    start: "top 88%",
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, {
      z: -110, rotateX: 18, scale: 0.92, opacity: 0,
    }, {
      z: 0, rotateX: 0, scale: 1, opacity: 1, stagger: 0.07, duration: 0.65, ease: "signature",
    }),
  });
}
