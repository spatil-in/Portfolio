import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap-setup";

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    const counter = { value: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(counter, {
      value: 100,
      duration: reducedMotion ? 0.12 : 1.45,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counter.value)),
      onComplete: () => gsap.to(root.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: reducedMotion ? 0.12 : 0.78,
        ease: "signature",
        onComplete,
      }),
    });
  }, { scope: root });

  useEffect(() => {
    document.body.classList.add("is-loading");
    return () => document.body.classList.remove("is-loading");
  }, []);

  return (
    <div className="preloader" ref={root} role="status" aria-label={`Loading portfolio, ${progress}%`}>
      <div className="preloader__top"><span>SP / PORTFOLIO</span><span>2025 — 26</span></div>
      <div className="preloader__center">
        <span className="preloader__eyebrow">A DIGITAL EXPERIENCE BY</span>
        <strong>SP<span>.</span></strong>
      </div>
      <div className="preloader__bottom">
        <div className="preloader__track"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
        <div className="preloader__meta"><span>LOADING EXPERIENCE</span><span>{String(progress).padStart(3, "0")}%</span></div>
      </div>
    </div>
  );
}
