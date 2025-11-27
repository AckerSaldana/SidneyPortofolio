import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'splitting'; // We'll simulate Splitting or use a manual approach if package issues arise
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Simulate Splitting.js by wrapping characters (or use the library if it works out of the box)
    // For now, we'll assume the library is working or we'd use a utility. 
    // Since we installed 'splitting', we can try to use it.
    // However, in React, it's often better to do this manually or use a wrapper to avoid DOM manipulation conflicts.
    // Let's do a simple manual split for the title to be safe and "React-way".
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.5 }); // Wait for preloader + nav

      // Video reveal
      tl.fromTo(videoRef.current, 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
      );

      // Text reveal
      tl.fromTo('.hero-char', 
        { y: 100, opacity: 0, rotateX: -90 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          stagger: 0.05, 
          duration: 1.2, 
          ease: 'power4.out' 
        },
        '-=1.5'
      );

      tl.fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );

      tl.fromTo('.scroll-indicator',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.5'
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const title = "SIDNEY";
  const lastName = "ARCHITECT"; // Or whatever the name is. User said "Her name and title". Let's use a placeholder name.

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-video-container">
        {/* Placeholder for video. User to provide file. */}
        <div className="video-placeholder" ref={videoRef}>
           <video 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="hero-video"
             src="/video/background-video.mp4" 
           />
           <div className="video-overlay"></div>
        </div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title" ref={titleRef}>
          <div className="hero-line">
            {title.split('').map((char, i) => (
              <span key={i} className="hero-char">{char}</span>
            ))}
          </div>
          <div className="hero-line">
            {"PORTFOLIO".split('').map((char, i) => (
              <span key={i} className="hero-char">{char}</span>
            ))}
          </div>
        </h1>
        <h2 className="hero-subtitle" ref={subtitleRef}>ARCHITECT</h2>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>SCROLL</span>
      </div>
    </section>
  );
};

export default Hero;
