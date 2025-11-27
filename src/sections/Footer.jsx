import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // CTA text animation on scroll
      gsap.fromTo('.cta-line',
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Info columns fade in
      gsap.fromTo('.footer-column',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-info',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Bottom bar slide in
      gsap.fromTo('.footer-bottom',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        }
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef} id="contact">
      {/* Large CTA Section */}
      <div className="footer-cta" ref={ctaRef}>
        <a href="mailto:hello@sidney.arch" className="cta-text">
          <div className="cta-line-wrapper">
            <span className="cta-line">Let's create</span>
          </div>
          <div className="cta-line-wrapper">
            <span className="cta-line">something</span>
          </div>
          <div className="cta-line-wrapper">
            <span className="cta-line cta-accent">extraordinary</span>
          </div>
        </a>
        <div className="cta-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>

      {/* Info Grid */}
      <div className="footer-info">
        <div className="footer-column">
          <span className="column-label">Location</span>
          <p>Mexico City</p>
          <p>Copenhagen</p>
        </div>

        <div className="footer-column">
          <span className="column-label">Contact</span>
          <a href="mailto:hello@sidney.arch">hello@sidney.arch</a>
          <p>+52 55 1234 5678</p>
        </div>

        <div className="footer-column">
          <span className="column-label">Social</span>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Behance</a>
        </div>

        <div className="footer-column">
          <span className="column-label">Navigation</span>
          <a href="#philosophy">Philosophy</a>
          <a href="#projects">Projects</a>
          <a href="#process">Process</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span className="copyright">&copy; {new Date().getFullYear()} Sidney Architecture</span>
        <span className="tagline">Designing the future, one space at a time</span>
      </div>
    </footer>
  );
};

export default Footer;
