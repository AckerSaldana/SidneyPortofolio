import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import GrainOverlay from './components/GrainOverlay';
import useMousePosition from './hooks/useMousePosition';
import Hero from './sections/Hero';
import Philosophy from './sections/Philosophy';
import Gallery from './sections/Gallery';
import Process from './sections/Process';
import Footer from './sections/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  useMousePosition(); // Initialize mouse tracking

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger refresh after Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="app">
      <GrainOverlay />
      <CustomCursor />
      {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}
      <Navigation />
      
      <div className="content-wrapper">
        <Hero startAnimation={preloaderComplete} />
        <Philosophy />
        <Gallery />
        <Process />
      </div>
      <Footer />
      
    </main>
  );
}

export default App;
