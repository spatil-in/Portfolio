import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "./gsap-setup";

/**
 * Declarative scroll reveals. Add data attributes in JSX, call useReveal(sectionRef):
 *   data-reveal="lines"            split into lines, each line rises out of a mask
 *   data-reveal="fade"             fade + rise (data-y, data-delay optional)
 *   data-reveal="stagger"          children rise one after another
 *   data-parallax="-20"            drifts by that many % of its own height while scrolling
 * Everything is skipped for prefers-reduced-motion (content simply stays visible).
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return undefined;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 112,
                duration: 1.15,
                stagger: 0.09,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        gsap.utils.toArray('[data-reveal="fade"]', root).forEach((el) => {
          gsap.from(el, {
            y: Number(el.dataset.y ?? 36),
            autoAlpha: 0,
            duration: 1,
            delay: Number(el.dataset.delay ?? 0),
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray('[data-reveal="stagger"]', root).forEach((el) => {
          gsap.from(el.children, {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray("[data-parallax]", root).forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax),
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope },
  );
}
