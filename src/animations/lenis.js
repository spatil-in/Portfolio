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

    // In-page links (#about, #contact…) glide with Lenis instead of jumping.
    const onAnchorClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
      const hash = link.getAttribute("href");
      const target = hash === "#" || hash === "#home" ? 0 : document.querySelector(hash);
      if (target === null) return;
      event.preventDefault();
      // A pinned section (Projects) must be targeted at its pin start, not at wherever its
      // element currently sits, otherwise the link lands early or at the end of the pin.
      const pinned = target && ScrollTrigger.getAll().find((st) => st.pin && st.trigger === target);
      const destination = target === 0 ? 0 : pinned ? pinned.start : target.getBoundingClientRect().top + lenis.scroll;
      lenis.scrollTo(destination, { duration: 1.6, force: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    };
    document.addEventListener("click", onAnchorClick);
    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.portfolioLenis = lenis;

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.portfolioLenis;
      window.removeEventListener("load", resetScroll);
      window.removeEventListener("load", refresh);
    };
  }, []);
}
