import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Navigation.css';

const Navigation = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 2.5 } // Delay to wait for preloader
    );
  }, []);

  return (
    <nav className="navigation" ref={navRef}>
      <div className="nav-logo">
        <a href="#" data-cursor-text="HOME">SIDNEY</a>
      </div>
      <div className="nav-links">
        <a href="#philosophy" className="nav-link" data-cursor-text="READ">Philosophy</a>
        <a href="#projects" className="nav-link" data-cursor-text="WORK">Projects</a>
        <a href="#process" className="nav-link" data-cursor-text="HOW">Process</a>
        <a href="#contact" className="nav-link" data-cursor-text="SAY HI">Contact</a>
      </div>
    </nav>
  );
};

export default Navigation;
