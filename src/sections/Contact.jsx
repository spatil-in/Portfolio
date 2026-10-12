import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/gsap-setup";
import { contactDetails, copy, socialLinks } from "../data/content";
import SectionLabel from "../components/SectionLabel";
import MagneticButton from "../components/MagneticButton";
import Marquee from "../components/Marquee";

export default function Contact() {
  const root = useRef(null);
  const [status, setStatus] = useState("");

  useGSAP(() => {
    const marquee = root.current.querySelector(".marquee__track");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;
    const animation = gsap.to(marquee, { xPercent: -25, duration: 18, repeat: -1, ease: "none" });
    ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const speed = Math.min(Math.abs(self.getVelocity()) / 2500, 1.7);
        animation.timeScale((self.direction < 0 ? -1 : 1) * (1 + speed));
      },
    });
    gsap.from(root.current.querySelectorAll(".contact__details, .contact__form"), {
      y: 26, opacity: 0, duration: 0.75, stagger: 0.13, ease: "signature",
      scrollTrigger: { trigger: root.current.querySelector(".contact__grid"), start: "top 78%" },
    });
    return () => animation.kill();
  }, { scope: root });

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    setStatus(copy.contact.form.submitted);
    window.location.href = `mailto:sanketpatil@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact section-pad" id="contact" ref={root} aria-labelledby="contact-title">
      <div className="container">
        <SectionLabel number="06">{copy.contact.label}</SectionLabel>
        <div className="contact__headline"><h2 className="section-title" id="contact-title">{copy.contact.titleLead}<br /><span className="gradient-text">{copy.contact.titleHighlight}</span></h2><span className="contact__asterisk" aria-hidden="true">✳</span></div>
      </div>
      <Marquee />
      <div className="container contact__grid">
        <div className="contact__details">
          <p className="contact__intro">{copy.contact.introduction}</p>
          <div className="contact__ways">{contactDetails.map((item) => (
            <div className="contact-way" key={item.label}><span>{item.label}</span>{item.href ? <a href={item.href}>{item.value} <span aria-hidden="true">↗</span></a> : <strong>{item.value}</strong>}</div>
          ))}</div>
          <div className="contact__socials"><span className="eyebrow">{copy.contact.socialLabel}</span><div>{socialLinks.map((social) => <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer">{social.short}<span aria-hidden="true">↗</span></a>)}</div></div>
        </div>
        <form className="contact__form" onSubmit={submit}>
          <label><span>{copy.contact.form.name}</span><input name="name" type="text" placeholder={copy.contact.form.namePlaceholder} autoComplete="name" required /></label>
          <label><span>{copy.contact.form.email}</span><input name="email" type="email" placeholder={copy.contact.form.emailPlaceholder} autoComplete="email" required /></label>
          <label><span>{copy.contact.form.message}</span><textarea name="message" rows="3" placeholder={copy.contact.form.messagePlaceholder} required /></label>
          <div className="contact__submit"><MagneticButton className="button-primary" type="submit">{copy.contact.form.submit} <span aria-hidden="true">↗</span></MagneticButton><span>{copy.contact.form.replyTime}</span></div>
          <p className="contact__status" aria-live="polite">{status}</p>
        </form>
      </div>
    </section>
  );
}
