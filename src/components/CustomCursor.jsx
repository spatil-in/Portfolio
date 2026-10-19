import { useEffect } from "react";
import { gsap } from "../animations/gsap-setup";

export default function CustomCursor() {
  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return undefined;
    const wrap = document.querySelector(".custom-cursor");
    const dot = document.querySelector(".cursor-dot");
    const follower = document.querySelector(".cursor-follower");
    gsap.set(wrap, { autoAlpha: 0 }); // hidden until the pointer first moves (no stray ring at 0,0)
    let shown = false;
    const moveX = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12 });

    const move = (event) => {
      if (!shown) {
        shown = true;
        gsap.set([dot, follower], { x: event.clientX, y: event.clientY });
        gsap.to(wrap, { autoAlpha: 1, duration: 0.3 });
      }
      moveX(event.clientX);
      moveY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
    };
    const enter = (event) => {
      const interactive = event.target.closest("a, button, input, textarea, [data-cursor]");
      follower.dataset.label = interactive?.dataset.cursor || "";
      follower.classList.toggle("is-active", Boolean(interactive));
    };
    const leave = () => gsap.to(wrap, { autoAlpha: 0, duration: 0.2 });
    const back = () => { if (shown) gsap.to(wrap, { autoAlpha: 1, duration: 0.2 }); };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", enter);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", back);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", enter);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", back);
      gsap.killTweensOf([wrap, dot, follower]);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-follower" />
    </div>
  );
}
