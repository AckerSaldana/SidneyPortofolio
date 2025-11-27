import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import GrainOverlay from './components/GrainOverlay';
import useMousePosition from './hooks/useMousePosition';
import Footer from './sections/Footer';

// Pages
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [transitionData, setTransitionData] = useState({ active: false, image: null, rect: null, id: null });
  const transitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useMousePosition(); // Initialize mouse tracking

  // Lenis Setup
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger refresh
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [location.pathname]);

  // Animate transition after image is rendered
  useLayoutEffect(() => {
    if (transitionData.active && transitionRef.current && transitionData.rect) {
      const overlay = transitionRef.current;
      const { rect, id } = transitionData;

      // Set initial position matching the clicked card
      gsap.set(overlay, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        opacity: 1,
        objectFit: 'cover',
        zIndex: 9999
      });

      const tl = gsap.timeline({
        onComplete: () => {
          navigate(`/project/${id}`);
          // Fade out overlay after navigation
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              setTransitionData({ active: false, image: null, rect: null, id: null });
            }
          });
        }
      });

      // 1. Slight "lift" effect
      tl.to(overlay, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });

      // 2. Expand to full screen with dramatic easing
      tl.to(overlay, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        scale: 1, // Reset scale
        duration: 1.2,
        ease: 'expo.inOut' // More dramatic ease
      }, '-=0.1');

    }
  }, [transitionData.active]);

  const handleProjectClick = (image, rect, id) => {
    setTransitionData({ active: true, image, rect, id });
  };

  return (
    <main className="app">
      <GrainOverlay />
      <CustomCursor />
      {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}
      <Navigation />
      
      {/* Transition Overlay Image */}
      {transitionData.active && (
        <img 
          ref={transitionRef}
          src={transitionData.image} 
          alt="Transition" 
          className="transition-overlay"
          style={{ pointerEvents: 'none' }}
        />
      )}

      <Routes>
        <Route path="/" element={<Home preloaderComplete={preloaderComplete} onProjectClick={handleProjectClick} />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
      
      <Footer />
    </main>
  );
}

export default App;
