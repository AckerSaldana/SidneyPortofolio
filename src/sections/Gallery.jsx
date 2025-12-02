import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

import WebGLDistortion from '../components/WebGLDistortion';

const ProjectCard = ({ project, index, onProjectClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const handleClick = () => {
    if (onProjectClick && cardRef.current) {
      const container = cardRef.current.querySelector('.project-image-container');
      const titleEl = cardRef.current.querySelector('.project-title');
      const rect = container.getBoundingClientRect();
      const titleRect = titleEl.getBoundingClientRect();
      
      // Pass image data AND title data
      onProjectClick(
        { image: project.image, rect }, 
        { text: project.title, rect: titleRect },
        project.id
      );
    }
  };

  return (
    <div
      ref={cardRef}
      className="project-card"
      data-cursor-text="VIEW"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="project-image-container">
        <WebGLDistortion image={project.image} isHovering={isHovering} />
        <img src={project.image} alt={project.title} className="project-image" style={{ opacity: 0 }} />
        <div className="project-overlay"></div>
      </div>
      <div className="project-info">
        <span className="project-number">0{index + 1}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-location">{project.location} — {project.year}</p>
      </div>
    </div>
  );
};

import { projects } from '../data/projects';

const Gallery = ({ onProjectClick }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const section = sectionRef.current;

      // Calculate the scroll distance
      const getScrollAmount = () => {
        return -(container.scrollWidth - window.innerWidth);
      };

      // Horizontal scroll tween
      const horizontalScroll = gsap.to(container, {
        x: getScrollAmount,
        ease: 'none',
      });

      // Create the ScrollTrigger
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${(container.scrollWidth - window.innerWidth) * 3}`,
        pin: true,
        animation: horizontalScroll,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        }
      });

      // Card reveal animation
      gsap.fromTo('.project-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none'
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" ref={sectionRef} id="projects">
      <div className="gallery-header">
        <h2>Selected Works</h2>
        <div className="gallery-progress">
          <div
            className="gallery-progress-bar"
            ref={progressRef}
          />
        </div>
      </div>
      <div className="gallery-container" ref={containerRef}>
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index} 
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
