import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 10) + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline();

      tl.to(counterRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 0.2
      })
      .to(lineRef.current, {
        width: '100%',
        duration: 0.8,
        ease: 'power2.inOut'
      }, '-=0.3')
      .to(containerRef.current, {
        y: '-100%',
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader-content">
        <div className="preloader-counter" ref={counterRef}>
          {progress}%
        </div>
        <div className="preloader-line-container">
          <div className="preloader-line" ref={lineRef} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
