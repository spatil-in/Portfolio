import { useEffect, useState } from "react";
import { useLenis } from "./animations/lenis";
import CursorFog from "./components/CursorFog";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Hero from "./sections/Hero";
import Journey from "./sections/Journey";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";

function App() {
  const [loading, setLoading] = useState(true);
  // `revealed` flips as the preloader curtain starts lifting: the hero and navbar intros play then.
  const [revealed, setRevealed] = useState(false);
  useLenis();

  useEffect(() => {
    if (!loading) {
      window.portfolioLenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      window.portfolioLenis?.start();
      document.body.classList.remove("is-loading");
    } else {
      window.portfolioLenis?.stop();
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onReveal={() => setRevealed(true)} onComplete={() => setLoading(false)} />}
      <Navbar ready={revealed} />
      <CursorFog />
      <CustomCursor />
      <main>
        <Hero ready={revealed} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
