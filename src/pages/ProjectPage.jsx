import { useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

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
      // Initial animations
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

      // Project number reveal
      tl.fromTo('.hero-project-number',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        hasTransition ? 0.3 : '-=1'
      );

      // Scroll-triggered animations
      gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Image parallax
      gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.fromTo(img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        );
      });

      // Image reveal
      gsap.utils.toArray('.image-reveal').forEach(el => {
        gsap.fromTo(el,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.4,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Counter animation
      gsap.utils.toArray('.stat-number').forEach(el => {
        const target = el.getAttribute('data-value');
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Next project hover effect
      const nextSection = document.querySelector('.next-project-section');
      const nextImage = document.querySelector('.next-project-image');

      if (nextSection && nextImage) {
        nextSection.addEventListener('mouseenter', () => {
          gsap.to(nextImage, { scale: 1.05, duration: 0.8, ease: 'power2.out' });
        });
        nextSection.addEventListener('mouseleave', () => {
          gsap.to(nextImage, { scale: 1, duration: 0.8, ease: 'power2.out' });
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [hasTransition, id, project]);

  const handleNextProject = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/project/${nextProject.id}`);
  };

  if (!project) return <div className="project-page">Project not found</div>;

  // Format project number
  const projectNumber = String(projectIndex + 1).padStart(2, '0');

  return (
    <div className="content-wrapper project-page" ref={containerRef}>
      {/* Hero Section */}
      <section className="project-hero">
        <div className="project-hero-image">
          <img src={project.image} alt={project.title} />
        </div>
        <div className="project-hero-overlay"></div>
        <span className="hero-project-number">{projectNumber}</span>
        <h1 className="project-hero-title">{project.title}</h1>
      </section>

      {/* Introduction Section */}
      <section className="project-intro">
        <div className="intro-grid">
          <div className="intro-label reveal-text">
            <span className="label-number">01</span>
            <span className="label-text">Introduction</span>
          </div>
          <div className="intro-content">
            <p className="intro-lead reveal-text">{project.leadText}</p>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="full-image-section">
        <div className="full-image-wrapper image-reveal">
          <img src={project.bannerImage} alt={project.title} className="parallax-img" />
        </div>
      </section>

      {/* Project Details Grid */}
      <section className="details-section">
        <div className="details-grid">
          <div className="details-sidebar">
            <div className="detail-block reveal-text">
              <span className="detail-label">Services</span>
              <div className="detail-values">
                {project.services.map((service, i) => (
                  <span key={i} className="detail-value">{service}</span>
                ))}
              </div>
            </div>
            <div className="detail-block reveal-text">
              <span className="detail-label">Team</span>
              <div className="detail-values">
                {project.team.map((member, i) => (
                  <span key={i} className="detail-value">{member}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="details-content">
            <div className="section-header reveal-text">
              <span className="label-number">02</span>
              <h2 className="section-title-lg">{project.challenge.title}</h2>
            </div>
            <p className="body-text reveal-text">{project.challenge.text}</p>
          </div>
        </div>
      </section>

      {/* Editorial Image Grid */}
      <section className="editorial-gallery">
        <div className="gallery-asymmetric">
          <div className="gallery-large image-reveal">
            <img src={project.images[0]} alt={`${project.title} Detail 1`} className="parallax-img" />
          </div>
          <div className="gallery-small image-reveal">
            <img src={project.images[1]} alt={`${project.title} Detail 2`} className="parallax-img" />
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="quote-section">
        <div className="quote-container">
          <blockquote className="pull-quote reveal-text">
            <span className="quote-mark">"</span>
            {project.description}
          </blockquote>
        </div>
      </section>

      {/* Approach Section */}
      <section className="approach-section">
        <div className="approach-grid">
          <div className="approach-header reveal-text">
            <span className="label-number">03</span>
            <h2 className="section-title-lg">{project.approach.title}</h2>
          </div>
          <div className="approach-content">
            <p className="body-text reveal-text">{project.approach.text}</p>
          </div>
        </div>
      </section>

      {/* Next Project - Editorial */}
      <section className="next-project-section">
        <div className="next-project-background">
          <img src={nextProject.image} alt={nextProject.title} className="next-project-image" />
          <div className="next-project-overlay"></div>
        </div>

        <div className="next-project-content">
          <div className="next-project-label">
            <span className="next-label-text">Next Project</span>
            <span className="next-project-number">{String((projectIndex + 2) % projects.length || projects.length).padStart(2, '0')}</span>
          </div>

          <h2 className="next-project-title">
            {nextProject.title.split(' ').map((word, i) => (
              <span key={i} className="next-title-word">{word}</span>
            ))}
          </h2>

          <div className="next-project-meta">
            <span>{nextProject.location}</span>
            <span className="meta-divider">—</span>
            <span>{nextProject.year}</span>
          </div>

          <button className="next-project-cta" onClick={handleNextProject}>
            <span className="cta-text">View Project</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
