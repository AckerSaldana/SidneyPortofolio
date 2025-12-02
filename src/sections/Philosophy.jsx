import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Philosophy.css';

const Philosophy = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create master timeline for sequenced animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.philosophy-headline',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Get rows separately for staggered row animation
      const rows = gsap.utils.toArray('.headline-row');

      // Animate each row with its words
      rows.forEach((row, rowIndex) => {
        const words = row.querySelectorAll('.word');

        tl.fromTo(words,
          {
            yPercent: 100,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.06
          },
          rowIndex * 0.1
        );
      });

      // Animate the decorative line element
      tl.fromTo(lineRef.current,
        {
          scaleX: 0,
          opacity: 0
        },
        {
          scaleX: 1,
          opacity: 0.6,
          duration: 0.6,
          ease: 'power2.inOut'
        },
        '-=0.3'
      );

      // Description - simple fade
      tl.fromTo('.philosophy-description',
        {
          opacity: 0,
          y: 15
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        },
        '-=0.3'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="philosophy" ref={sectionRef} id="philosophy">
      <div className="philosophy-content">
        <div className="philosophy-headline">
          <div className="headline-row">
            <span className="word-wrapper"><span className="word">Design</span></span>
            <span className="word-wrapper"><span className="word">with</span></span>
            <span className="word-wrapper"><span className="word highlight">purpose.</span></span>
          </div>
          <div className="headline-row">
            <span className="word-wrapper"><span className="word">Build</span></span>
            <span className="word-wrapper"><span className="word highlight">sustainably.</span></span>
          </div>
          <span className="decorative-line" ref={lineRef}></span>
        </div>

        <div className="philosophy-description">
          <p>
            Sustainable architecture is more than a trend—it's a responsibility.
            We create spaces that honor the environment while enhancing human experience,
            using innovative materials and passive design strategies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
