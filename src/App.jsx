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
  const [transitionData, setTransitionData] = useState({ active: false, image: null, title: null, id: null });
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
    if (transitionData.active && transitionRef.current && transitionData.image) {
      const overlay = transitionRef.current;
      const titleOverlay = document.querySelector('.transition-title');
      const { image, title, id } = transitionData;

      // Set initial position matching the clicked card
      gsap.set(overlay, {
        top: image.rect.top,
        left: image.rect.left,
        width: image.rect.width,
        height: image.rect.height,
        opacity: 1,
        objectFit: 'cover',
        zIndex: 9999
      });

      const tl = gsap.timeline({
        onComplete: () => {
          navigate(`/project/${id}`, { state: { transition: true } });
          // Fade out overlays after navigation
          gsap.to([overlay, titleOverlay], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setTransitionData({ active: false, image: null, title: null, id: null });
            }
          });
        }
      });

      // 1. Image Animation
      tl.to(overlay, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        duration: 1.2,
        ease: 'expo.inOut'
      });

      // 2. Title Animation (Fly to center)
      if (titleOverlay) {
        // Calculate center position (approximate for Hero title)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Target font size should match Hero title size (8vw approx)
        const targetFontSize = windowWidth * 0.08; 
        
        tl.to(titleOverlay, {
          top: windowHeight / 2 - targetFontSize / 2, // Center vertically
          left: '50%',
          xPercent: -50, // Center horizontally
          fontSize: targetFontSize,
          duration: 1.2,
          ease: 'expo.inOut'
        }, 0); // Sync with image
      }

    }
  }, [transitionData.active]);

  const handleProjectClick = (imageData, titleData, id) => {
    setTransitionData({ active: true, image: imageData, title: titleData, id });
  };

  return (
    <main className="app">
      <GrainOverlay />
      <CustomCursor />
      {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}
      <Navigation />
      
      {/* Transition Overlay Image */}
      {transitionData.active && (
        <>
          <img 
            ref={transitionRef}
            src={transitionData.image.image} 
            alt="Transition" 
            className="transition-overlay"
            style={{ pointerEvents: 'none' }}
          />
          {transitionData.title && (
            <h1 
              className="transition-title"
              style={{
                position: 'fixed',
                top: transitionData.title.rect.top,
                left: transitionData.title.rect.left,
                fontSize: '3rem', // Match card size initially
                fontFamily: 'var(--font-display)',
                color: '#fff',
                zIndex: 10000,
                margin: 0,
                lineHeight: 1,
                pointerEvents: 'none',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              {transitionData.title.text}
            </h1>
          )}
        </>
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
