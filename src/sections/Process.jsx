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
      title: 'ANALYSIS',
      description: 'Understanding the ecosystem. We study climate patterns, solar orientation, and natural resources. Every project begins with deep respect for the land and its existing rhythms.'
    },
    {
      title: 'BIOCLIMATIC',
      description: 'Designing with nature. Passive strategies guide our approach—natural ventilation, thermal mass, and daylighting reduce energy dependency while maximizing human comfort.'
    },
    {
      title: 'MATERIALS',
      description: 'Conscious selection. We prioritize locally-sourced, recycled, and low-carbon materials. Each choice considers embodied energy, durability, and end-of-life recyclability.'
    },
    {
      title: 'REGENERATION',
      description: 'Beyond sustainability. Our buildings give back—harvesting rainwater, generating clean energy, and creating habitats. Architecture that heals rather than depletes.'
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
