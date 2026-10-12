import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap, Flip, ScrollTrigger } from "../animations/gsap-setup";
import { projects, projectFilters } from "../data/projects";
import { copy } from "../data/content";
import SectionLabel from "../components/SectionLabel";
import ProjectCard from "../components/ProjectCard";
import MagneticButton from "../components/MagneticButton";

/* ---------- constants ---------- */
const SCRUB = 0.6; // Lenis already smooths the scroll, so keep scrub low to avoid a floaty double-smoothing feel
const FOCUS = 0.42; // the "active" card is the one closest to this point of the viewport (0 = left, 1 = right)
const MAX_SKEW = 5; // degrees, scroll-velocity skew on the track
const PARALLAX = 7; // percent the card image drifts inside its frame
const pad = (n) => String(n).padStart(2, "0");

export default function Projects() {
  const root = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const stRef = useRef(null); // the pin ScrollTrigger, used by filter + keyboard focus
  const introDone = useRef(false);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const visibleProjects = projects.filter((project) => filter === "All" || project.category === filter);

  /* ======================= DETAIL: close ======================= */
  const closeDetail = useCallback(() => {
    const panel = modalRef.current?.querySelector(".project-detail__panel");
    const source = openerRef.current;
    if (!selected || !panel || !source) {
      setSelected(null);
      window.portfolioLenis?.start();
      source?.querySelector(".project-card__button")?.focus();
      return;
    }
    Flip.fit(panel, source, { scale: true, absolute: true });
    gsap.to(panel, {
      x: 0, y: 0, scale: 0.96, opacity: 0, duration: 0.45, ease: "power2.inOut",
      onComplete: () => {
        gsap.set(modalRef.current, { display: "none" });
        modalRef.current?.classList.remove("is-open");
        setSelected(null);
        window.portfolioLenis?.start();
        source.querySelector(".project-card__button")?.focus();
      },
    });
  }, [selected]);

  /* ======================= HORIZONTAL SCROLL ======================= */
  useGSAP(
    () => {
      const section = root.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const progress = progressRef.current;
      const counter = counterRef.current;
      const cards = gsap.utils.toArray(".project-card", track);
      const total = cards.length;
      if (!total) return;

      const headEls = gsap.utils.toArray(".projects__heading > *, .projects__filters, .projects__footer", section);
      let activeIndex = -1;
      const setActive = (i) => {
        if (i === activeIndex) return;
        activeIndex = i;
        counter.textContent = `${pad(i + 1)} / ${pad(total)}`;
      };

      // Cards are measured relative to the track so it works whether or not the track is positioned.
      const rel = (el) => (el.offsetParent === track ? el.offsetLeft : el.offsetLeft - track.offsetLeft);
      let metrics = [];
      const measure = () => {
        metrics = cards.map((c) => ({ center: rel(c) + c.offsetWidth / 2, width: c.offsetWidth }));
      };

      // One-time intro: heading, filters and cards reveal when the section approaches.
      const buildIntro = () => {
        if (introDone.current) return;
        gsap.set(headEls, { y: 36, autoAlpha: 0 });
        gsap.set(cards, { y: 80, clipPath: "inset(100% 0% 0% 0%)" });
        gsap
          .timeline({
            defaults: { ease: "signature" },
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
            onComplete: () => { introDone.current = true; },
          })
          .to(headEls, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 }, 0)
          .to(cards, { y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.12, clearProps: "clipPath" }, 0.2);
      };

      const mm = gsap.matchMedia(section);

      mm.add(
        {
          full: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          lite: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { full, reduce } = ctx.conditions;
          gsap.set(progress, { scaleX: 0, transformOrigin: "0% 50%" });

          /* ---------- tablet / mobile / reduced motion: native swipe + synced progress ---------- */
          if (!full) {
            if (!reduce) buildIntro();
            const onScroll = () => {
              const max = viewport.scrollWidth - viewport.clientWidth;
              const p = max > 0 ? viewport.scrollLeft / max : 0;
              gsap.set(progress, { scaleX: p });
              setActive(Math.round(p * (total - 1)));
            };
            viewport.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
            return () => viewport.removeEventListener("scroll", onScroll);
          }

          /* ---------- desktop: pinned horizontal scroll ---------- */
          // "is-hs" = horizontal-scroll mode. projects-fit.css uses it to fit the whole section in one screen.
          section.classList.add("is-hs");
          // Take over from any native overflow scrolling defined in CSS.
          gsap.set(viewport, { overflowX: "hidden", scrollSnapType: "none" });
          gsap.set(track, { display: "flex", flexWrap: "nowrap", width: "max-content", willChange: "transform" });
          gsap.set(cards, { flexShrink: 0 });
          buildIntro();
          measure();

          const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

          // Velocity skew: the track leans into the scroll, then settles.
          const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
          let settle;

          const render = (p) => {
            const x = gsap.getProperty(track, "x");
            const vw = viewport.clientWidth;
            gsap.set(progress, { scaleX: p });

            // Active-card emphasis: scale and brightness follow distance from the focus point.
            let best = 0;
            let bestDist = Infinity;
            cards.forEach((card, i) => {
              const m = metrics[i];
              if (!m) return;
              const d = Math.abs(m.center + x - vw * FOCUS);
              const t = 1 - gsap.utils.clamp(0, 1, d / (m.width * 1.15));
              gsap.set(card, { scale: 0.9 + 0.1 * t, opacity: 0.5 + 0.5 * t });
              if (d < bestDist) { bestDist = d; best = i; }
            });
            setActive(best);
          };

          const scrollTween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none", // must stay linear: containerAnimation depends on it
            onUpdate() { render(this.progress()); },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: SCRUB,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: -1, // refresh after the pinned Hero above, so start positions include its pin spacing
              onRefresh: measure,
              onUpdate: (self) => {
                skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, self.getVelocity() / -350));
                settle?.kill();
                settle = gsap.delayedCall(0.08, () => skewTo(0));
              },
            },
          });
          stRef.current = scrollTween.scrollTrigger;

          // Inner image parallax, driven by the horizontal tween (not the page scroll).
          cards.forEach((card) => {
            const img = card.querySelector("img");
            if (!img) return;
            gsap.set(img, { scale: 1.2 });
            gsap.fromTo(
              img,
              { xPercent: -PARALLAX },
              {
                xPercent: PARALLAX,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: scrollTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          });

          // Keyboard: focusing an off-screen card scrolls the page to it instead of
          // letting the browser shift the hidden-overflow viewport and break the layout.
          const onFocusIn = (e) => {
            const card = e.target.closest(".project-card");
            const st = scrollTween.scrollTrigger;
            const dist = getDistance();
            if (!card || !st || !dist) return;
            viewport.scrollLeft = 0;
            const m = metrics[cards.indexOf(card)];
            const targetX = gsap.utils.clamp(0, dist, m.center - viewport.clientWidth * FOCUS);
            const y = st.start + (targetX / dist) * (st.end - st.start);
            const lenis = window.portfolioLenis;
            if (lenis) lenis.scrollTo(y, { duration: 1.1 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };
          track.addEventListener("focusin", onFocusIn);

          render(0);

          return () => {
            section.classList.remove("is-hs");
            track.removeEventListener("focusin", onFocusIn);
            settle?.kill();
            stRef.current = null;
          };
        }
      );

      // Pinned layouts need a fresh measure once fonts and images have settled.
      let cancelled = false;
      document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        cancelled = true;
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true }
  );

  /* ======================= DETAIL: open + focus trap ======================= */
  useEffect(() => {
    if (!selected) return undefined;
    const lenis = window.portfolioLenis;
    lenis?.stop();
    const onKey = (event) => {
      if (event.key === "Escape") closeDetail();
      if (event.key === "Tab") {
        const focusable = [...(modalRef.current?.querySelectorAll("button, a[href], input, textarea, [tabindex]:not([tabindex='-1'])") || [])]
          .filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const modal = modalRef.current;
    const frame = requestAnimationFrame(() => {
      const panel = modal?.querySelector(".project-detail__panel");
      const source = openerRef.current;
      if (!panel || !source) return;
      modal.classList.add("is-open");
      gsap.set(modal, { display: "flex" });
      panel.querySelector(".project-detail__close")?.focus();
      Flip.fit(panel, source, { scale: true, absolute: true });
      gsap.to(panel, {
        x: 0, y: 0, scale: 1, duration: 0.82, ease: "signature",
        onComplete: () => gsap.from(modal.querySelectorAll(".project-detail__reveal"), {
          y: 18, opacity: 0, stagger: 0.07, duration: 0.45, ease: "power3.out",
        }),
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      gsap.killTweensOf(modal);
      if (modal) gsap.killTweensOf(modal.querySelector(".project-detail__panel"));
    };
  }, [selected, closeDetail]);

  /* ======================= FILTER ======================= */
  const changeFilter = (nextFilter) => {
    if (nextFilter === filter) return;

    // The track length changes with the filter, so return to the start of the pin first.
    const st = stRef.current;
    if (st) {
      const lenis = window.portfolioLenis;
      if (lenis) lenis.scrollTo(st.start, { immediate: true, force: true });
      else window.scrollTo(0, st.start);
      st.animation?.progress(0);
    }

    const state = Flip.getState(root.current.querySelectorAll(".project-card"));
    setFilter(nextFilter); // useGSAP re-runs and rebuilds the pin for the new card count
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.65,
        ease: "signature",
        absolute: true,
        stagger: 0.035,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "signature" }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  };

  const openDetail = (project, event) => {
    openerRef.current = event.currentTarget.closest(".project-card");
    setSelected(project);
  };

  /* ======================= RENDER ======================= */
  // The detail view is portaled to <body>: a pinned ancestor can carry a transform,
  // which would break position:fixed on the modal.
  const detail = (
    <div className="project-detail" ref={modalRef} aria-hidden={!selected} style={{ display: "none" }}>
      {selected && (
        <article className="project-detail__panel" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" tabIndex={-1}>
          <button className="project-detail__close" type="button" aria-label="Close project details" onClick={closeDetail}>Close <span>×</span></button>
          <div className="project-detail__visual"><img src={selected.image} alt={`${selected.title} project preview`} /></div>
          <div className="project-detail__body">
            <div className="project-detail__reveal eyebrow">{selected.number} / CASE STUDY <span>—</span> {selected.year}</div>
            <h2 className="project-detail__reveal" id="project-detail-title">{selected.title}<span>.</span></h2>
            <p className="project-detail__reveal">{selected.description}</p>
            <div className="project-detail__columns project-detail__reveal">
              <div><h3>Key features</h3><ul>{selected.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
              <div><h3>Technology</h3><div className="project-card__tags">{selected.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div>
            </div>
            <div className="project-detail__actions project-detail__reveal">
              <MagneticButton href="#contact" className="button-primary" onClick={closeDetail}>Discuss a similar project ↗</MagneticButton>
              <button className="text-link" type="button" onClick={closeDetail}>Back to work <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </article>
      )}
    </div>
  );

  return (
    <section className="projects section-pad" id="projects" ref={root} aria-labelledby="projects-title">
      <div className="projects__heading container">
        <div><SectionLabel number="04">{copy.projects.label}</SectionLabel><h2 className="section-title" id="projects-title">{copy.projects.title} <span className="gradient-text">{copy.projects.highlight}</span></h2></div>
        <p className="section-heading__copy">{copy.projects.description}</p>
      </div>
      <div className="projects__filters container" role="group" aria-label="Filter projects">
        {projectFilters.map((item) => (
          <button key={item.value} type="button" className={filter === item.value ? "is-selected" : ""} aria-pressed={filter === item.value} onClick={() => changeFilter(item.value)}>
            {item.label}<span>{item.value === "All" ? projects.length : projects.filter((project) => project.category === item.value).length}</span>
          </button>
        ))}
      </div>
      <div className="projects__viewport" ref={viewportRef}>
        <div className="projects__track" ref={trackRef}>
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={(item, event) => openDetail(item, event)} />
          ))}
          <div className="projects__end-card"><span className="eyebrow">{copy.projects.endEyebrow}</span><h3>{copy.projects.endTitle} <em>{copy.projects.endHighlight}</em></h3><a href="#contact">{copy.projects.endCta} ↗</a></div>
        </div>
      </div>
      <div className="projects__footer container">
        <span>SCROLL TO EXPLORE <span aria-hidden="true">→</span></span>
        <div className="projects__progress" aria-hidden="true"><span ref={progressRef} /></div>
        <span className="projects__counter" ref={counterRef} aria-live="polite">{`01 / ${pad(visibleProjects.length)}`}</span>
      </div>

      {createPortal(detail, document.body)}
    </section>
  );
}