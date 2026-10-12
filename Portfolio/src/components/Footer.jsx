import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsap-setup";
import { profile, socialLinks } from "../data/content";
import Roll from "./Roll";

export default function Footer() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The giant name rises into place as the footer scrolls into view (scrubbed).
      gsap.fromTo(".footer__giant span", { yPercent: 70 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 95%", end: "bottom bottom", scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <footer className="site-footer" ref={root}>
      <div className="footer__top">
        <a className="footer__mail" href={`mailto:${profile.email}`} data-cursor="Mail">
          <small>GOT AN IDEA?</small>
          <Roll>{profile.email}</Roll>
        </a>
        <div className="footer__links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><Roll>LinkedIn</Roll> ↗</a>
          <a href={profile.resume} target="_blank" rel="noreferrer"><Roll>Resume</Roll> ↗</a>
          <a href="#home"><Roll>Back to top</Roll> ↑</a>
        </div>
      </div>
      <div className="footer__giant" aria-hidden="true"><span>SANKET PATIL</span></div>
      <div className="footer__bottom">
        <span className="footer-copyright">© {new Date().getFullYear()} Sanket Patil. All rights reserved.</span>
        <span className="footer-copyright">Designed &amp; built in Pune</span>
        <div className="footer-socials">{socialLinks.map((social) => <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer">{social.short}</a>)}</div>
      </div>
    </footer>
  );
}
