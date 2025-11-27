import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

const Process = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('.process-step');
      
      steps.forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Line animation
      gsap.fromTo('.process-line-progress',
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 1
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Concept',
      description: 'The genesis of form. We begin with the site, the light, and the human need. Sketches emerge from the subconscious, capturing the essence of the space before it exists.'
    },
    {
      number: '02',
      title: 'Design',
      description: 'Refining the vision. Rigorous iteration transforms abstract ideas into tangible structures. Every material is chosen for its tactile quality and aging potential.'
    },
    {
      number: '03',
      title: 'Reality',
      description: 'The build. Precision meets craft. We oversee every detail, ensuring the physical manifestation honors the initial spark of inspiration.'
    }
  ];

  return (
    <section className="process" ref={sectionRef} id="process">
      <div className="process-header">
        <h2>The Process</h2>
      </div>
      
      <div className="process-timeline">
        <div className="process-line">
          <div className="process-line-progress"></div>
        </div>
        
        {steps.map((step, index) => (
          <div key={index} className="process-step">
            <div className="process-step-number">{step.number}</div>
            <div className="process-step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
