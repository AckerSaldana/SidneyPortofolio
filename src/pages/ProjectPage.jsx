import { useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { projects } from '../data/projects';
import './ProjectPage.css';

const ProjectPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const hasTransition = location.state?.transition;

  // Find current project
  const projectIndex = projects.findIndex(p => p.id === id);
  const project = projects[projectIndex];
  
  // Find next project (loop back to start)
  const nextProject = projects[(projectIndex + 1) % projects.length];

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!project) return;

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
        hasTransition ? 0.5 : '-=1'
      );

      // Main Content Reveal
      tl.fromTo('.project-content-main',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );

    }, containerRef);

    return () => ctx.revert();
  }, [hasTransition, id, project]);

  const handleNextProject = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/project/${nextProject.id}`);
  };

  if (!project) return <div className="project-page">Project not found</div>;

  return (
    <div className="content-wrapper project-page" ref={containerRef}>
      <div className="project-hero">
         <div className="project-hero-image">
            <img src={project.image} alt={project.title} />
         </div>
         <div className="project-hero-overlay"></div>
         <h1 className="project-hero-title">{project.title}</h1>
      </div>

      <div className="project-container">
        <div className="project-info-sidebar">
           <div className="info-group">
             <div className="info-block">
               <span className="info-label">Client</span>
               <span className="info-value">{project.client}</span>
             </div>
             <div className="info-block">
               <span className="info-label">Year</span>
               <span className="info-value">{project.year}</span>
             </div>
             <div className="info-block">
               <span className="info-label">Location</span>
               <span className="info-value">{project.location}</span>
             </div>
           </div>
           
           <div className="info-group">
             <div className="info-block">
               <span className="info-label">Services</span>
               {project.services.map((service, i) => (
                 <span key={i} className="info-value">{service}</span>
               ))}
             </div>
             <div className="info-block">
               <span className="info-label">Team</span>
               {project.team.map((member, i) => (
                 <span key={i} className="info-value">{member}</span>
               ))}
             </div>
           </div>
        </div>

        <div className="project-content-main">
           <section className="content-section">
             <h2 className="section-title">{project.challenge.title}</h2>
             <p className="project-text-lead">
               {project.leadText}
             </p>
             <p className="project-text">
               {project.challenge.text}
             </p>
           </section>

           <div className="project-image-grid">
             {project.images.map((img, i) => (
               <img key={i} src={img} alt={`${project.title} Detail ${i + 1}`} />
             ))}
           </div>

           <section className="content-section">
             <h2 className="section-title">{project.approach.title}</h2>
             <p className="project-text">
               {project.approach.text}
             </p>
             <p className="project-text">
               {project.description}
             </p>
           </section>
        </div>
      </div>

      <div className="project-banner-full">
        <img src={project.bannerImage} alt={`${project.title} Wide Shot`} />
      </div>

      <div className="next-project-nav" onClick={handleNextProject}>
        <span className="next-label">Next Project</span>
        <h2 className="next-title">{nextProject.title}</h2>
        <div className="next-arrow">→</div>
      </div>
    </div>
  );
};

export default ProjectPage;
