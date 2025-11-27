import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation
      gsap.fromTo('.footer-content',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
          }
        }
      );

      // Counter animation for awards
      const awards = document.querySelectorAll('.award-count');
      awards.forEach(award => {
        const count = parseInt(award.getAttribute('data-count'));
        gsap.to(award, {
          innerText: count,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: award,
            start: 'top 90%',
          }
        });
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef} id="contact">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-credentials">
            <h3>Credentials</h3>
            <ul>
              <li>M.Arch, Harvard GSD</li>
              <li>AIA Member</li>
              <li>LEED AP BD+C</li>
            </ul>
          </div>
          <div className="footer-awards">
            <h3>Recognition</h3>
            <div className="award-item">
              <span className="award-count" data-count="12">0</span>
              <span>International Awards</span>
            </div>
            <div className="award-item">
              <span className="award-count" data-count="24">0</span>
              <span>Publications</span>
            </div>
          </div>
        </div>

        <div className="footer-main">
          <h2>Let's Build<br />The Future</h2>
          <a href="mailto:hello@sidney.arch" className="footer-cta" data-cursor-text="EMAIL">
            hello@sidney.arch
          </a>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" data-cursor-text="FOLLOW">Instagram</a>
            <a href="#" data-cursor-text="CONNECT">LinkedIn</a>
            <a href="#" data-cursor-text="VIEW">Behance</a>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Sidney Architect. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
