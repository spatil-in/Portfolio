import { socialLinks } from "../data/content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand footer-brand" href="#home" aria-label="Back to top">
        <span className="brand__mark">S<span>.</span></span>
        <span className="brand__text">SANKET PATIL<small>MADE WITH CURIOSITY IN PUNE</small></span>
      </a>
      <span className="footer-copyright">© {new Date().getFullYear()} Sanket Patil. All rights reserved.</span>
      <div className="footer-socials">{socialLinks.map((social) => <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer">{social.short}</a>)}</div>
      <a className="back-to-top" href="#home">Back to top ↑</a>
    </footer>
  );
}
