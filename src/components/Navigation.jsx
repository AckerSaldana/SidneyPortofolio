import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Navigation.css';

const MagneticLink = ({ href, className, children, cursorText }) => {
  const linkRef = useRef(null);

  const handleMouseMove = (e) => {
    const link = linkRef.current;
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(link, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(linkRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <a
      ref={linkRef}
      href={href}
      className={className}
      data-cursor-text={cursorText}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
};

const Navigation = () => {
  const navRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 2.5 }
    );

    // Scroll-aware styling
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
      <div className="nav-logo">
        <MagneticLink href="#" cursorText="HOME">SIDNEY</MagneticLink>
      </div>
      <div className="nav-links">
        <MagneticLink href="#philosophy" className="nav-link" cursorText="READ">Philosophy</MagneticLink>
        <MagneticLink href="#projects" className="nav-link" cursorText="WORK">Projects</MagneticLink>
        <MagneticLink href="#process" className="nav-link" cursorText="HOW">Process</MagneticLink>
        <MagneticLink href="#contact" className="nav-link" cursorText="SAY HI">Contact</MagneticLink>
      </div>
    </nav>
  );
};

export default Navigation;
