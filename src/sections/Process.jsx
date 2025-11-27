import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

const ProcessStep = ({ step, index, isActive, onHover }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      gsap.to(contentRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [isActive]);

  return (
    <div 
      className={`process-item ${isActive ? 'active' : ''}`}
      onMouseEnter={() => onHover(index)}
    >
      <div className="process-header-row">
        <span className="process-number">0{index + 1}</span>
        <h3 className="process-title">{step.title}</h3>
      </div>
      
      <div className="process-accordion-content" ref={contentRef}>
        <div className="process-description">
          <p>{step.description}</p>
        </div>
      </div>
    </div>
  );
};

const Process = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      title: 'CONCEPT',
      description: 'The genesis of form. We begin with the site, the light, and the human need. Sketches emerge from the subconscious, capturing the essence of the space before it exists.'
    },
    {
      title: 'DESIGN',
      description: 'Refining the vision. Rigorous iteration transforms abstract ideas into tangible structures. Every material is chosen for its tactile quality and aging potential.'
    },
    {
      title: 'REALITY',
      description: 'The build. Precision meets craft. We oversee every detail, ensuring the physical manifestation honors the initial spark of inspiration.'
    },
    {
      title: 'LIVING',
      description: 'The space comes alive. We monitor how light interacts with the surfaces throughout the seasons, ensuring the architecture evolves with its inhabitants.'
    }
  ];

  return (
    <section className="process" ref={sectionRef} id="process">
      <div className="process-container">
        <div className="process-list">
          {steps.map((step, index) => (
            <ProcessStep 
              key={index} 
              step={step} 
              index={index} 
              isActive={activeIndex === index}
              onHover={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
