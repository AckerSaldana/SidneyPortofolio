import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

import WebGLDistortion from '../components/WebGLDistortion';

const ProjectCard = ({ project, index }) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className="project-card"
      data-cursor-text="VIEW"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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

const Gallery = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  const projects = [
    {
      title: "The Void House",
      location: "Kyoto, Japan",
      year: "2023",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop"
    },
    {
      title: "Azure Museum",
      location: "Oslo, Norway",
      year: "2022",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop"
    },
    {
      title: "Brutalist Retreat",
      location: "Swiss Alps",
      year: "2024",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop"
    },
    {
      title: "Urban Canopy",
      location: "Singapore",
      year: "2023",
      image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&auto=format&fit=crop"
    }
  ];

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
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
