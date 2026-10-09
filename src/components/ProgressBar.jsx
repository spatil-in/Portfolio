import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap-setup";

export default function ProgressBar() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
    });
  }, { scope: ref });

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
