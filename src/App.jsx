import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Cursor from './components/Cursor';
import Hud from './components/Hud';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Register ScrollTrigger once at module level
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let lenis;

    if (!prefersReducedMotion) {
      // One Lenis instance drives smooth scrolling
      lenis = new Lenis();

      // Named tick function so it can be removed from gsap.ticker on cleanup
      function onTick(time) {
        lenis.raf(time * 1000);
      }

      // GSAP ticker drives Lenis — one shared animation loop
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      // Keep ScrollTrigger in sync with every Lenis scroll event
      lenis.on('scroll', ScrollTrigger.update);

      // Refresh after layout is painted
      ScrollTrigger.refresh();

      return () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
      };
    }

    // Still refresh even without smooth scroll
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      {/* Custom cursor — only renders on fine-pointer (desktop) devices */}
      <Cursor />

      {/* Fixed top HUD navigation bar */}
      <Hud />

      {/* Page sections */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;
