import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

const Hero = ({ startAnimation }) => {
  const heroRef = useRef(null);
  const subtitleRef = useRef(null);
  const videoRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!startAnimation || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Kill any existing timeline
    if (tlRef.current) {
      tlRef.current.kill();
    }

    tlRef.current = gsap.timeline();

    // Video reveal
    tlRef.current.fromTo(videoRef.current,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
    );

    // Text reveal
    tlRef.current.fromTo('.hero-char',
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

    tlRef.current.fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.8'
    );

    tlRef.current.fromTo('.scroll-indicator',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '-=0.5'
    );

    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      // Title layer - moves more
      gsap.to('.hero-line:first-child', {
        x: xPos * 15,
        y: yPos * 10,
        duration: 1,
        ease: 'power2.out'
      });

      // Second line - moves slightly less for depth
      gsap.to('.hero-line:last-child', {
        x: xPos * 10,
        y: yPos * 7,
        duration: 1,
        ease: 'power2.out'
      });

      // Subtitle - subtle movement
      gsap.to(subtitleRef.current, {
        x: xPos * 5,
        y: yPos * 3,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Don't revert or kill timeline - animation should persist
    };
  }, [startAnimation]);

  const title = "SIDNEY";

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
        <h1 className="hero-title">
          <div className="hero-line">
            {title.split('').map((char, i) => (
              <span key={i} className="hero-char">{char}</span>
            ))}
          </div>
          <div className="hero-line">
            {"KYLIE".split('').map((char, i) => (
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
