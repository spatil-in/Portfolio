import { useEffect, useRef } from "react";
import { gsap } from "../animations/gsap-setup";

/**
 * White fog that trails the cursor. Wisps are emitted along the pointer's path (more when
 * it moves faster), drift and swell while fading, and are gone a moment after the pointer
 * stops. Desktop pointers only; skipped for reduced motion. The loop sleeps when idle.
 */
const MAX = 90;
const LIFE = 1.5; // seconds a wisp lives
const SCALE = 0.5; // render at half resolution: fog is soft, this is much cheaper

export default function CursorFog() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const wisps = [];
    let width = 0;
    let height = 0;
    let running = false;
    let last = null; // previous pointer position
    let lastTime = 0;

    const resize = () => {
      width = Math.ceil(window.innerWidth * SCALE);
      height = Math.ceil(window.innerHeight * SCALE);
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    const spawn = (x, y, speed) => {
      if (wisps.length >= MAX) wisps.shift();
      const angle = Math.random() * Math.PI * 2;
      const drift = 6 + Math.random() * 16;
      wisps.push({
        x: x * SCALE + (Math.random() - 0.5) * 10,
        y: y * SCALE + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * drift * SCALE,
        vy: Math.sin(angle) * drift * SCALE - 4 * SCALE, // slight upward drift, like smoke
        r: (38 + Math.random() * 34 + Math.min(speed, 40)) * SCALE,
        grow: (26 + Math.random() * 22) * SCALE,
        age: 0,
        peak: 0.075 + Math.random() * 0.05,
      });
    };

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = wisps.length - 1; i >= 0; i--) {
        const w = wisps[i];
        w.age += dt;
        if (w.age >= LIFE) { wisps.splice(i, 1); continue; }
        w.x += w.vx * dt;
        w.y += w.vy * dt;
        const t = w.age / LIFE;
        const radius = w.r + w.grow * t;
        const alpha = w.peak * Math.sin(Math.PI * Math.min(t * 1.15, 1)) * (1 - t * 0.35); // fade in fast, out slow
        const g = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, radius);
        g.addColorStop(0, `rgba(236, 243, 255, ${alpha})`);
        g.addColorStop(0.5, `rgba(214, 228, 255, ${alpha * 0.45})`);
        g.addColorStop(1, "rgba(200, 220, 255, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(w.x - radius, w.y - radius, radius * 2, radius * 2);
      }
      if (!wisps.length) {
        running = false;
        gsap.ticker.remove(frame);
        ctx.clearRect(0, 0, width, height);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      gsap.ticker.add(frame);
    };

    const move = (event) => {
      const { clientX: x, clientY: y } = event;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        // One wisp every ~16px of travel (cap per event), so fast moves leave a continuous trail.
        const count = Math.min(Math.floor(dist / 16), 4);
        for (let i = 1; i <= count; i++) spawn(last.x + (dx * i) / count, last.y + (dy * i) / count, dist);
        if (!count && dist > 3 && Math.random() < 0.5) spawn(x, y, dist);
      }
      last = { x, y };
      if (wisps.length) start();
    };
    const leave = () => { last = null; };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-fog" aria-hidden="true" />;
}
