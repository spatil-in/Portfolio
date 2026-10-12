import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap-setup";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

export function useLenis() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const resetScroll = () => {
      window.portfolioLenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    window.addEventListener("load", resetScroll, { once: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("load", resetScroll);
    }
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      autoRaf: false,
    });
    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.portfolioLenis = lenis;

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", resetScroll, { once: true });
    window.addEventListener("load", refresh, { once: true });

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.portfolioLenis;
      window.removeEventListener("load", resetScroll);
      window.removeEventListener("load", refresh);
    };
  }, []);
}
