import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philosophy.css';

const Philosophy = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray('.philosophy-text p');
      
      texts.forEach((text, i) => {
        gsap.fromTo(text, 
          { 
            opacity: 0, 
            y: 50,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: text,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Parallax effect for the background text
      gsap.to('.philosophy-bg-text', {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="philosophy" ref={sectionRef} id="philosophy">
      <div className="philosophy-bg-text">VISION</div>
      <div className="philosophy-content" ref={textRef}>
        <div className="philosophy-text">
          <p>"Space is not just built.</p>
          <p>It's <span className="highlight">felt</span>."</p>
        </div>
        <div className="philosophy-description">
          <p>
            Architecture is the silent language of space. It speaks through light, 
            material, and void. My work explores the intersection of human emotion 
            and structural integrity, creating environments that breathe and evolve 
            with their inhabitants.
          </p>
          <p>
            Every line drawn is a deliberate choice to frame a moment, to capture 
            a feeling, to build a memory.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
