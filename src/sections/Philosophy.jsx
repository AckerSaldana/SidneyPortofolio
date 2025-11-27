import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philosophy.css';

const Philosophy = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate words
      const words = gsap.utils.toArray('.word');
      
      gsap.fromTo(words, 
        { 
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: '.philosophy-content',
            start: 'top 70%',
            end: 'bottom 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

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
          <p>
            {"Space is not just built.".split(' ').map((word, i) => (
              <span key={i} className="word-wrapper"><span className="word">{word}&nbsp;</span></span>
            ))}
          </p>
          <p>
            <span className="word-wrapper"><span className="word">It's&nbsp;</span></span>
            <span className="word-wrapper"><span className="word highlight">felt.</span></span>
          </p>
        </div>
        <div className="philosophy-description">
          <p>
            {"Architecture is the silent language of space. It speaks through light, material, and void. My work explores the intersection of human emotion and structural integrity, creating environments that breathe and evolve with their inhabitants.".split(' ').map((word, i) => (
               <span key={i} className="word-wrapper"><span className="word">{word}&nbsp;</span></span>
            ))}
          </p>
          <p>
             {"Every line drawn is a deliberate choice to frame a moment, to capture a feeling, to build a memory.".split(' ').map((word, i) => (
               <span key={i} className="word-wrapper"><span className="word">{word}&nbsp;</span></span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
