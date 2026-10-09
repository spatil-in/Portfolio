import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "../animations/gsap-setup";
import { copy, experienceStats } from "../data/content";
import SectionLabel from "../components/SectionLabel";
import MagneticButton from "../components/MagneticButton";

/* ---------- constants (no magic numbers inside the timelines) ---------- */
const EASE = { reveal: "expo.out", pop: "back.out(2.4)", zoom: "power2.in" };
const ZOOM_SCROLL_LENGTH = "+=150%";

// Everything that starts hidden and is revealed by the intro timeline.
// The text lines are hidden here and un-hidden right after SplitText runs,
// so there is never a flash of unstyled text.
const HIDDEN_ON_LOAD = [
  ".hero__eyebrow",
  ".hero__title-line",
  ".hero__role",
  ".hero__intro",
  ".hero__actions",
  ".hero-stat",
  ".hero__visual",
  ".scroll-cue",
  ".hero__coords",
].join(",");

const setCounter = (el, value) => {
  const target = Number(el.dataset.count);
  el.textContent = `${value.toFixed(target % 1 ? 1 : 0)}${el.dataset.suffix ?? ""}`;
};

/**
 * background-clip:text breaks when the text is split into transformed
 * inline-blocks (each char loses the gradient and can turn invisible).
 * This copies the parent's gradient onto every char, offset so the
 * gradient still flows across the whole word.
 */
function paintGradientOnChars(line, chars) {
  const image = getComputedStyle(line).backgroundImage;
  if (!image || image === "none") return;
  const lineRect = line.getBoundingClientRect();
  gsap.set(line, { backgroundImage: "none" });
  chars.forEach((char) => {
    const left = char.getBoundingClientRect().left - lineRect.left;
    gsap.set(char, {
      backgroundImage: image,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${lineRect.width}px 100%`,
      backgroundPosition: `${-left}px 0`,
      backgroundClip: "text",
      webkitBackgroundClip: "text",
    });
  });
}

/**
 * @param {boolean} ready  Pass false while your Preloader is running, then
 *                         true when it finishes. The hero stays hidden and
 *                         the intro plays the moment `ready` becomes true.
 */
export default function Hero({ ready = true }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const q = gsap.utils.selector(root);

      // Runs before paint, so nothing flashes.
      gsap.set(q(HIDDEN_ON_LOAD), { autoAlpha: 0 });
      gsap.set(q(".hero__portal"), { autoAlpha: 0 });
      if (!ready) return;

      let cancelled = false;
      const mm = gsap.matchMedia(root);

      // Split text only after fonts load, otherwise line breaks and
      // char widths are measured with the fallback font and come out wrong.
      document.fonts.ready.then(() => {
        if (cancelled) return;

        mm.add(
          {
            reduce: "(prefers-reduced-motion: reduce)",
            desktop: "(min-width: 1024px)",
            fine: "(pointer: fine)",
          },
          (ctx) => {
            const { reduce, desktop, fine } = ctx.conditions;
            const counters = q("[data-count]");

            /* ---------- reduced motion: simple fade, no scrub, no parallax ---------- */
            if (reduce) {
              counters.forEach((el) => setCounter(el, Number(el.dataset.count)));
              gsap.to(q(HIDDEN_ON_LOAD), { autoAlpha: 1, duration: 0.4, stagger: 0.05 });
              return;
            }

            /* ---------- text splitting ---------- */
            const titleLines = q(".hero__title-line");
            const title = SplitText.create(titleLines, {
              type: "chars",
              mask: "chars",
              charsClass: "hero__char",
            });
            const nameLine = root.querySelector(".hero__title-line.gradient-text");
            if (nameLine) {
              paintGradientOnChars(
                nameLine,
                title.chars.filter((c) => nameLine.contains(c))
              );
            }
            const intro = SplitText.create(q(".hero__intro"), { type: "lines", mask: "lines" });
            gsap.set(titleLines, { autoAlpha: 1 });
            gsap.set(q(".hero__intro"), { autoAlpha: 1 });
            gsap.set(q(".hero__portrait"), { transformPerspective: 900 });

            /* ---------- ambient loops (paused, started by the intro) ---------- */
            const ambient = gsap.timeline({ paused: true });
            ambient
              .to(q(".hero__pulse-ring"), { scale: 1.055, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0)
              .to(q(".hero__orbit--one"), { rotation: 360, duration: 60, repeat: -1, ease: "none" }, 0)
              .to(q(".hero__orbit--two"), { rotation: -360, duration: 90, repeat: -1, ease: "none" }, 0)
              .to(q(".hero__orbit-dot--one"), { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0)
              .to(q(".hero__orbit-dot--two"), { y: 12, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0.4)
              .to(q(".scroll-cue span:last-child"), { y: 5, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" }, 0);

            /* ---------- master intro timeline ---------- */
            const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

            tl.addLabel("title", 0.1)
              .fromTo(q(".hero__eyebrow"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0)
              .fromTo(
                title.chars,
                { yPercent: 115, rotateX: -80, transformOrigin: "50% 100%" },
                { yPercent: 0, rotateX: 0, duration: 1.1, stagger: 0.03 },
                "title"
              )
              .fromTo(q(".hero__role"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "title+=0.6")
              .fromTo(
                intro.lines,
                { yPercent: 110 },
                { yPercent: 0, duration: 0.9, stagger: 0.08 },
                "title+=0.7"
              )
              .fromTo(q(".hero__actions"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "title+=0.9")

              // Portrait: circle-clip reveal + settle zoom, orbits and dots pop in
              .fromTo(q(".hero__visual"), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, "title+=0.2")
              .fromTo(
                q(".hero__portrait"),
                { clipPath: "circle(0% at 50% 50%)" },
                { clipPath: "circle(72% at 50% 50%)", duration: 1.5, ease: "power3.inOut" },
                "title+=0.25"
              )
              .fromTo(q(".hero__portrait img"), { scale: 1.45 }, { scale: 1, duration: 1.8 }, "title+=0.25")
              .fromTo(q(".hero__orbit"), { scale: 0.6 }, { scale: 1, duration: 1.4, stagger: 0.12 }, "title+=0.4")
              .fromTo(q(".hero__orbit-dot"), { scale: 0 }, { scale: 1, duration: 0.7, stagger: 0.15, ease: EASE.pop }, "title+=1.1")

              // Stats stagger in, numbers count up in sync
              .addLabel("stats", "title+=1")
              .fromTo(q(".hero-stat"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, "stats")
              .fromTo(q(".scroll-cue, .hero__coords"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "stats+=0.4")
              .call(() => ambient.play(), null, "stats");

            counters.forEach((el, i) => {
              const state = { value: 0 };
              tl.to(
                state,
                {
                  value: Number(el.dataset.count),
                  duration: 1.8,
                  ease: "power3.out",
                  onUpdate: () => setCounter(el, state.value),
                },
                `stats+=${i * 0.1}`
              );
            });

            /* ---------- pointer parallax: layered depth + 3D tilt ---------- */
            let removePointer = () => {};
            if (fine) {
              const layers = [
                { el: q(".hero__portrait")[0], move: 16, tilt: 7 },
                { el: q(".hero__orbit--one")[0], move: 30 },
                { el: q(".hero__orbit--two")[0], move: -22 },
                { el: q(".hero__orbit-label")[0], move: 46 },
                { el: q(".hero__glow")[0], move: -50 },
              ]
                .filter((l) => l.el)
                .map((l) => {
                  const opts = { duration: 0.9, ease: "power3" };
                  return {
                    ...l,
                    x: gsap.quickTo(l.el, "x", opts),
                    y: gsap.quickTo(l.el, "y", opts),
                    rx: l.tilt ? gsap.quickTo(l.el, "rotationX", opts) : null,
                    ry: l.tilt ? gsap.quickTo(l.el, "rotationY", opts) : null,
                  };
                });

              const apply = (nx, ny) =>
                layers.forEach((l) => {
                  l.x(nx * l.move);
                  l.y(ny * l.move);
                  l.ry?.(nx * l.tilt);
                  l.rx?.(-ny * l.tilt);
                });

              const onMove = (e) => {
                const r = root.getBoundingClientRect();
                apply((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
              };
              const onLeave = () => apply(0, 0);

              root.addEventListener("pointermove", onMove);
              root.addEventListener("pointerleave", onLeave);
              removePointer = () => {
                root.removeEventListener("pointermove", onMove);
                root.removeEventListener("pointerleave", onLeave);
              };
            }

            /* ---------- scroll: pin + zoom into the portrait, portal fills the screen ---------- */
            if (desktop) {
              const portal = q(".hero__portal")[0];
              const visual = q(".hero__visual")[0];

              // Scale needed for the portal circle to reach the farthest screen corner.
              const portalScale = () => {
                const rootRect = root.getBoundingClientRect();
                const v = visual.getBoundingClientRect();
                const cx = v.left + v.width / 2 - rootRect.left;
                const cy = v.top + v.height / 2 - rootRect.top;
                const w = rootRect.width;
                const h = root.offsetHeight;
                const farthest = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
                return (farthest * 2.1) / portal.offsetWidth;
              };

              const zoom = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: ZOOM_SCROLL_LENGTH,
                  pin: true,
                  scrub: 1,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });

              zoom
                .to(q(".hero__copy"), { y: -80, autoAlpha: 0, filter: "blur(8px)", duration: 0.45 }, 0)
                .to(q(".hero__pulse-ring, .hero__orbit, .hero__orbit-dot, .hero__orbit-label"), { autoAlpha: 0, duration: 0.3 }, 0)
                .to(portal, { autoAlpha: 1, duration: 0.15 }, 0)
                .to(portal, { scale: portalScale, ease: EASE.zoom, duration: 1 }, 0)
                .to(q(".hero__portrait"), { scale: 2.4, ease: EASE.zoom, duration: 0.8 }, 0)
                .to(q(".hero__portrait"), { autoAlpha: 0, duration: 0.35 }, 0.6);
            }

            // matchMedia cleanup: runs when the conditions change or the component unmounts
            return () => {
              removePointer();
              title.revert();
              intro.revert();
            };
          }
        );
      });

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [ready], revertOnUpdate: true }
  );

  return (
    <section
      className="hero relative isolate flex min-h-[max(680px,100svh)] items-center overflow-hidden pt-[104px] pb-[76px] max-[767px]:min-h-[max(1050px,100svh)] max-[767px]:items-start max-[767px]:pt-[142px]"
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
    >
      <div className="hero__grid-bg pointer-events-none absolute inset-0 -z-[2]" aria-hidden="true" />
      <div className="hero__glow pointer-events-none absolute -z-[1] right-[5%] top-[9%] h-[56vw] w-[56vw] max-h-[850px] max-w-[850px] rounded-full bg-[radial-gradient(circle,rgba(47,107,255,0.14),rgba(47,107,255,0.035)_43%,transparent_70%)]" aria-hidden="true" />
      <div className="hero__content container z-[3] grid w-full items-center gap-8 pt-5 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.82fr)] md:gap-12 max-[767px]:z-[2]">
        <div className="hero__copy max-w-[680px]">
          <div className="hero__eyebrow mb-6 max-[767px]:mb-[27px] [&_.section-label]:mb-0">
            <SectionLabel number="01">{copy.hero.availability}</SectionLabel>
          </div>
          <h1 className="m-0 text-[clamp(52px,6.3vw,82px)] font-medium leading-[0.94] tracking-[-0.085em] max-[767px]:text-[clamp(58px,13vw,94px)]" id="hero-title">
            <span className="hero__title-mask block overflow-hidden pb-[0.075em] [perspective:700px]">
              <span className="hero__title-line block origin-bottom">{copy.hero.lead}</span>
            </span>
            <span className="hero__title-mask block overflow-hidden pb-[0.075em] [perspective:700px]">
              <span className="hero__title-line gradient-text block origin-bottom">{copy.hero.name}<span className="hero__period">.</span></span>
            </span>
          </h1>
          <p className="hero__role mt-[22px] flex items-center gap-[9px] text-[13px] text-[#dce7fc] max-[767px]:mt-5 max-[767px]:text-xs">
            <span className="size-[6px] rounded-full bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
            {copy.hero.role} <i className="text-[#6e82a7] not-italic">—</i> {copy.hero.location}
          </p>
          <p className="hero__intro mt-4 max-w-[440px] text-[13px] leading-[1.8] text-[var(--color-muted)] max-[767px]:max-w-[420px] max-[767px]:text-xs">
            {copy.hero.introduction}
          </p>
          <div className="hero__actions mt-6 flex items-center gap-5 max-[767px]:mt-[23px] max-[767px]:gap-[15px]">
            <MagneticButton href="#projects" className="button-primary max-[767px]:min-h-12 max-[767px]:gap-3 max-[767px]:px-[15px] max-[767px]:text-[11px]">{copy.hero.workCta} <span aria-hidden="true">↗</span></MagneticButton>
            <a className="text-link" href="#contact">{copy.hero.contactCta} <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero__stats mt-[clamp(36px,5vw,64px)] flex gap-[clamp(22px,3.5vw,46px)] max-[767px]:relative max-[767px]:z-[4] max-[767px]:mt-11 max-[767px]:gap-5">
            {experienceStats.map((stat) => (
              <div className="hero-stat flex flex-col gap-[6px]" key={stat.label}>
                <strong className="font-[var(--font-display)] text-[clamp(24px,2.5vw,32px)] font-medium leading-none tracking-[-0.06em] max-[767px]:text-[25px]" data-count={stat.value} data-suffix={stat.suffix}>0{stat.suffix}</strong>
                <span className="max-w-[86px] text-[9px] text-[var(--color-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__visual relative aspect-square w-full max-w-[560px] justify-self-end max-[767px]:mt-8 max-[767px]:w-[min(72vw,330px)]" aria-hidden="true">
          {/* Portal: starts hidden behind the portrait, scales up on scroll to fill the screen.
              Set its colour to your About section background so the hand-off is seamless. */}
          <div className="hero__portal pointer-events-none absolute inset-0 m-auto size-[62%] rounded-full bg-[radial-gradient(circle,var(--color-bg,#050B1A)_0%,var(--color-bg,#050B1A)_62%,rgba(47,107,255,0.55)_80%,transparent_100%)]" />
          <div className="hero__orbit hero__orbit--one" />
          <div className="hero__orbit hero__orbit--two" />
          <div className="hero__pulse-ring" />
          <div className="hero__portrait">
            <img
              className="h-full w-full object-cover [object-position:50%_31%]"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85"
              alt=""
              fetchPriority="high"
            />
          </div>
          <span className="hero__orbit-label">DESIGN<br />MEETS CODE</span>
          <span className="hero__orbit-dot hero__orbit-dot--one" />
          <span className="hero__orbit-dot hero__orbit-dot--two" />
        </div>
      </div>
      <a href="#about" className="scroll-cue absolute bottom-[29px] left-[var(--gutter)] flex items-center gap-3 font-mono text-[9px] tracking-[0.1em] text-[#92a6c8] max-[767px]:bottom-[22px] max-[767px]:text-[8px]">
        <span className="scroll-cue__line relative h-px w-[37px] overflow-hidden bg-[rgba(143,163,199,0.28)]" />
        <span>{copy.hero.scrollPrompt}</span>
        <span className="text-[var(--color-cyan)]" aria-hidden="true">↓</span>
      </a>
      <span className="hero__coords absolute right-[var(--gutter)] bottom-[31px] font-mono text-[9px] text-[#657b9f] max-[767px]:bottom-[22px] max-[767px]:text-[8px]" aria-hidden="true">18°31′N&nbsp; 73°51′E</span>
    </section>
  );
}