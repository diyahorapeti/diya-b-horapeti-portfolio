import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useSmoothScroll } from './hooks/useSmoothScroll';

import Cursor from './components/Cursor';
import Hud from './components/Hud';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Register ScrollTrigger once at module level (before any component mounts)
gsap.registerPlugin(ScrollTrigger);

function App() {
  // Sets up Lenis smooth scroll + GSAP ticker + anchor-link handling
  useSmoothScroll();

  return (
    <>
      {/* Custom crosshair cursor — only activates on fine-pointer devices */}
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
