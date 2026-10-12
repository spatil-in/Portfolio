import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap-setup";

const GREETINGS = ["Hello", "नमस्कार", "Hola", "Bonjour"];
const NAME = ["Sanket", "Patil"];
const SEEN_KEY = "sp-intro-seen";

// Resolves once fonts and the window load event are done (or after a safety timeout),
// so the hero is measured with the real fonts when the curtain lifts.
const pageReady = () =>
  Promise.race([
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener("load", resolve, { once: true })),
    ]),
    new Promise((resolve) => setTimeout(resolve, 4500)),
  ]);

/**
 * Intro sequence: greetings cycle -> name rises letter by letter -> counter hits 100
 * -> letters exit and the screen lifts away on a curved edge, revealing the hero.
 * `onReveal` fires as the curtain starts to lift (the hero intro begins then),
 * `onComplete` fires when the preloader can be removed.
 */
export default function Preloader({ onReveal, onComplete }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const word = q(".preloader__word")[0];
      const count = q(".preloader__count")[0];
      const chars = q(".preloader__char");
      const closed = "inset(0% 0% 0% 0% round 0% 0% 0% 0%)";
      const open = "inset(0% 0% 100% 0% round 0% 0% 50% 50%)";

      gsap.set(root.current, { clipPath: closed });
      gsap.set(chars, { yPercent: 118 });

      if (reduced) {
        count.textContent = "100";
        gsap.set(chars, { yPercent: 0 });
        gsap.set(q(".preloader__role"), { opacity: 1 });
        gsap.timeline()
          .call(onReveal, null, 0.15)
          .to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.15, onComplete });
        return undefined;
      }

      let seen = false;
      try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* storage unavailable */ }

      const counter = { value: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(counter, {
        value: 100,
        duration: 2.7,
        ease: "power2.inOut",
        onUpdate: () => { count.textContent = String(Math.round(counter.value)).padStart(3, "0"); },
      }, 0)
        .fromTo(q(".preloader__hello"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.05)
        .fromTo(q(".preloader__top > *, .preloader__label"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 0.1);

      GREETINGS.forEach((text, i) => {
        if (i > 0) tl.call(() => { word.textContent = text; }, null, 0.1 + i * 0.3);
      });

      tl.to(q(".preloader__hello"), { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" }, 1.3)
        .fromTo(chars, { yPercent: 118 }, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 1.5)
        .fromTo(q(".preloader__role"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 2.05)
        .addLabel("exit", 3)
        .call(() => {
          tl.pause();
          pageReady().then(() => tl.resume());
        }, null, "exit")
        .to(chars, { yPercent: -118, duration: 0.75, stagger: 0.025, ease: "expo.in" }, "exit+=0.05")
        .to(q(".preloader__role, .preloader__count, .preloader__label, .preloader__top"), { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "exit+=0.05")
        .call(onReveal, null, "exit+=0.6")
        .to(root.current, { clipPath: open, duration: 1.1, ease: "expo.inOut", onComplete }, "exit+=0.6")
        .call(() => { try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ } }, null, "exit+=0.6");

      // A returning visitor in the same session gets a faster intro.
      if (seen) tl.timeScale(1.8);
      return undefined;
    },
    { scope: root },
  );

  useEffect(() => {
    document.body.classList.add("is-loading");
    return () => document.body.classList.remove("is-loading");
  }, []);

  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading portfolio">
      <div className="preloader__top" aria-hidden="true">
        <span>SP / PORTFOLIO</span>
        <span>PUNE, IN — {new Date().getFullYear()}</span>
      </div>
      <div className="preloader__stage" aria-hidden="true">
        <p className="preloader__hello"><i /><span className="preloader__word">{GREETINGS[0]}</span></p>
        <div className="preloader__name">
          {NAME.map((line, lineIndex) => (
            <span className="preloader__line" key={line}>
              {[...line].map((char, i) => <span className="preloader__char" key={i}>{char}</span>)}
              {lineIndex === NAME.length - 1 && <span className="preloader__char preloader__char--dot">.</span>}
            </span>
          ))}
        </div>
        <p className="preloader__role">WEB DEVELOPER <i>·</i> REACT <i>·</i> WORDPRESS</p>
      </div>
      <div className="preloader__bottom" aria-hidden="true">
        <span className="preloader__count">000</span>
        <span className="preloader__label">LOADING EXPERIENCE</span>
      </div>
    </div>
  );
}
