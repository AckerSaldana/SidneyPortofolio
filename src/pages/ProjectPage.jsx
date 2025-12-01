import { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './ProjectPage.css';

const ProjectPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const containerRef = useRef(null);
  const hasTransition = location.state?.transition;

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: hasTransition ? 0 : 0.8 });

      // Hero Title Reveal - Skip if transition happened
      if (!hasTransition) {
        tl.fromTo('.project-hero-title',
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
        );
      } else {
        gsap.set('.project-hero-title', { opacity: 1, y: 0 });
      }

      // Info Sidebar Reveal
      tl.fromTo('.project-info-sidebar',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        hasTransition ? 0.5 : '-=1' // Adjust timing based on transition
      );

      // Main Content Reveal
      tl.fromTo('.project-content-main',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );

    }, containerRef);

    return () => ctx.revert();
  }, [hasTransition]);

  return (
    <div className="content-wrapper project-page" ref={containerRef}>
      <div className="project-hero">
         <div className="project-hero-image">
            {/* Placeholder for FLIP transition target */}
            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&auto=format&fit=crop" alt="Project Hero" />
         </div>
         <div className="project-hero-overlay"></div>
         <h1 className="project-hero-title">The Void House</h1>
      </div>

      <div className="project-container">
        <div className="project-info-sidebar">
           <div className="info-block">
             <span className="info-label">Year</span>
             <span className="info-value">2023</span>
           </div>
           <div className="info-block">
             <span className="info-label">Location</span>
             <span className="info-value">Kyoto, Japan</span>
           </div>
           <div className="info-block">
             <span className="info-label">Role</span>
             <span className="info-value">Lead Architect</span>
           </div>
        </div>

        <div className="project-content-main">
           <p className="project-text-lead">
             A minimalist sanctuary designed to embrace the silence. The Void House explores the relationship between negative space and human habitation.
           </p>
           <p className="project-text">
             Located in the quiet hills of Kyoto, the structure uses raw concrete and natural light to create a meditative atmosphere. Every angle is calculated to frame specific views of the surrounding nature, turning the changing seasons into a living canvas within the home.
           </p>
           
           <div className="project-image-grid">
             <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop" alt="Detail 1" />
             <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop" alt="Detail 2" />
           </div>

           <p className="project-text">
             The interior palette is restrained, using locally sourced timber and stone to ground the ethereal quality of the light.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
