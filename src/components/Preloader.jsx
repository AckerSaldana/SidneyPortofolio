import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const brandRef = useRef(null);
  const progressRef = useRef(null);
  const tlRef = useRef(null);
  const intervalRef = useRef(null);
  const isExitingRef = useRef(false);

  useEffect(() => {
    // Kill any existing timeline from StrictMode remount
    if (tlRef.current) {
      tlRef.current.kill();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const brandChars = brandRef.current.querySelectorAll('.char');

    // Clear any existing inline styles and set initial state
    gsap.set(brandChars, { clearProps: 'all' });
    gsap.set(brandChars, { y: '100%', opacity: 0 });
    gsap.set(counterRef.current, { clearProps: 'all' });
    gsap.set(counterRef.current, { opacity: 0, y: 10 });
    gsap.set(progressRef.current, { scaleX: 0 });

    tlRef.current = gsap.timeline();

    // Phase 1: SK appears first (smooth reveal)
    tlRef.current.to(brandChars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3
    })
    // Phase 2: After SK is shown, reveal counter and progress
    .to(counterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '+=0.2')
    .to(progressRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        // Phase 3: Start progress simulation AFTER animations complete
        const interval = setInterval(() => {
          setProgress(prev => {
            const next = prev + Math.floor(Math.random() * 6) + 3;
            if (next >= 100) {
              clearInterval(interval);
              intervalRef.current = null;
              return 100;
            }
            return next;
          });
        }, 50);
        intervalRef.current = interval;
      }
    }, '-=0.2');

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isExitingRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Guard against multiple exit animations
    if (progress !== 100 || isExitingRef.current) return;
    isExitingRef.current = true;

    const brandChars = brandRef.current.querySelectorAll('.char');

    const tl = gsap.timeline({
      onComplete: () => onComplete?.()
    });

    // Exit Sequence - smooth and cinematic
    tl.to([counterRef.current, progressRef.current.parentElement], {
      opacity: 0,
      y: -15,
      duration: 0.4,
      ease: 'power2.in'
    })
    .to(brandChars, {
      yPercent: -110,
      stagger: 0.03,
      duration: 0.6,
      ease: 'power3.in'
    }, '-=0.2')
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut'
    }, '-=0.3');
  }, [progress, onComplete]);

  // Split "SK" into characters
  const brandName = "SK".split("");

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader-content">
        <div className="preloader-brand" ref={brandRef}>
          {brandName.map((char, index) => (
            <span key={index} className="char-wrapper">
              <span className="char">{char}</span>
            </span>
          ))}
        </div>
        
        <div className="preloader-footer">
          <div className="preloader-counter" ref={counterRef}>
            {progress < 10 ? `0${progress}` : progress} — 100
          </div>
          <div className="preloader-progress-track">
            <div className="preloader-progress-bar" ref={progressRef}></div>
          </div>
        </div>
      </div>
      <div className="grain-overlay"></div>
    </div>
  );
};

export default Preloader;
