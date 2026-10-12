import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../animations/gsap-setup";
import { copy, socialLinks } from "../data/content";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const menuRef = useRef(null);

  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "journey", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const header = document.querySelector(".site-header");
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const hidden = !menuOpen && self.scroll() > 120 && self.direction > 0;
        gsap.to(header, { yPercent: hidden ? -110 : 0, duration: 0.35, ease: "power3.out", overwrite: true });
      },
    });
    return () => {
      trigger.kill();
      gsap.killTweensOf(header);
    };
  }, [menuOpen]);

  useEffect(() => {
    const lenis = window.portfolioLenis;
    if (menuOpen) lenis?.stop();
    else if (!document.body.classList.contains("is-loading")) lenis?.start();

    const menu = menuRef.current;
    if (!menu) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuOpen) {
      gsap.set(menu, { display: "flex" });
      if (reducedMotion) {
        gsap.set(menu, { clipPath: "circle(150% at 92% 4%)" });
        gsap.set(menu.querySelectorAll(".mobile-menu__link"), { y: 0, opacity: 1 });
      } else {
        gsap.fromTo(menu, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.65, ease: "signature" });
        gsap.fromTo(menu.querySelectorAll(".mobile-menu__link"), { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.45, stagger: 0.07, delay: 0.15, ease: "signature",
        });
      }
    } else {
      gsap.to(menu, {
        clipPath: "circle(0% at 92% 4%)",
        duration: reducedMotion ? 0 : 0.42,
        ease: "power2.inOut",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
    return () => {
      gsap.killTweensOf(menu);
      gsap.killTweensOf(menu.querySelectorAll(".mobile-menu__link"));
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Sanket Patil, home">
          <span className="brand__mark">S<span>.</span></span>
          <span className="brand__text">SANKET PATIL<small>FRONTEND DEVELOPER</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {copy.navigation.map((item) => (
            <a key={item.href} href={item.href} className={active === item.href.slice(1) ? "is-active" : ""}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-contact">Let’s talk <span aria-hidden="true">↗</span></a>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>
      <div ref={menuRef} className="mobile-menu" id="mobile-menu" aria-hidden={!menuOpen} style={{ display: "none" }}>
        <div className="mobile-menu__inner">
          <span className="eyebrow">NAVIGATION / 01—05</span>
          {copy.navigation.map((item, index) => (
            <a
              key={item.href}
              className="mobile-menu__link"
              href={item.href}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <small>0{index + 1}</small>{item.label}<span aria-hidden="true">↗</span>
            </a>
          ))}
          <a className="mobile-menu__contact" href="#contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Start a conversation ↗</a>
          <div className="mobile-menu__socials">
            {socialLinks.map((social) => <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer">{social.short}</a>)}
          </div>
        </div>
      </div>
    </>
  );
}
