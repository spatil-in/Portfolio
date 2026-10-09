import { useEffect } from "react";
import { gsap } from "../animations/gsap-setup";

export default function CustomCursor() {
  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return undefined;
    const dot = document.querySelector(".cursor-dot");
    const follower = document.querySelector(".cursor-follower");
    const moveX = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12 });

    const move = (event) => {
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
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", enter);
      gsap.killTweensOf([dot, follower]);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-follower" />
    </div>
  );
}
