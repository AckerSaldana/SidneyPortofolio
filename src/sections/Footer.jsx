import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);
  const ctaRef = useRef(null);

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#') || href.includes('#')) {
      e.preventDefault();
      const targetId = href.includes('#') ? href.split('#')[1] : href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
        {/* Column 1: Branding */}
        <div className="footer-column footer-brand">
          <div className="brand-logo">
            <span className="brand-name">SIDNEY</span>
            <span className="brand-subtitle">ARCHITECTURE & DESIGN</span>
          </div>
          <p className="footer-tagline">Where design meets<br />environmental responsibility</p>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-column footer-nav">
          <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
          <a href="#philosophy" onClick={(e) => handleSmoothScroll(e, '#philosophy')}>Philosophy</a>
          <a href="#projects" onClick={(e) => handleSmoothScroll(e, '#projects')}>Projects</a>
          <a href="#process" onClick={(e) => handleSmoothScroll(e, '#process')}>Process</a>
          <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>Contact</a>
        </div>

        {/* Column 3: Ciudad de México */}
        <div className="footer-column">
          <span className="column-label">Ciudad de México</span>
          <p>Av. Paseo de la Reforma 505,</p>
          <p>Cuauhtémoc, 06500</p>
          <p>+52 55 1234 5678</p>
        </div>

        {/* Column 4: Monterrey */}
        <div className="footer-column">
          <span className="column-label">Monterrey</span>
          <p>Torre KOI, Av. David Alfaro Siqueiros 106,</p>
          <p>Valle Oriente, 66269</p>
          <p>+52 81 2345 6789</p>
        </div>

        {/* Column 5: Guadalajara & Los Angeles */}
        <div className="footer-column">
          <div className="location-block">
            <span className="column-label">Guadalajara</span>
            <p>Sidney West Architecture</p>
            <p>+52 33 3456 7890</p>
          </div>

          <div className="location-block mt-8">
            <span className="column-label">Los Angeles</span>
            <a href="https://sidney.arch">sidney.arch</a>
            <p>+1 213 456 7890</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <span className="lang-switch">ESPAÑOL</span>
        </div>

        <div className="footer-legal">
          <a href="#">Cookie Preferences</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="footer-right">
          <a href="#contact" className="contact-btn" onClick={(e) => handleSmoothScroll(e, '#contact')}>Contact us</a>
          <span className="copyright">Website by Acker</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
