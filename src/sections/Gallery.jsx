import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

import WebGLDistortion from '../components/WebGLDistortion';

const ProjectCard = ({ project, index }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="project-card" 
      data-cursor-text="VIEW"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="project-image-container">
        <WebGLDistortion image={project.image} isHovering={isHovering} />
        {/* Fallback image if WebGL fails or for SEO, hidden visually but present */}
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
      const totalWidth = container.scrollWidth - window.innerWidth;

      gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + container.scrollWidth,
          invalidateOnRefresh: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" ref={sectionRef} id="projects">
      <div className="gallery-header">
        <h2>Selected Works</h2>
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
