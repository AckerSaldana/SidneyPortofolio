import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const TRAIL_LENGTH = 5;

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const trailRefs = useRef([]);
  const rippleRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const mouseHistory = useRef([]);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      // Update mouse history for trail
      mouseHistory.current.push({ x: clientX, y: clientY });
      if (mouseHistory.current.length > TRAIL_LENGTH * 3) {
        mouseHistory.current.shift();
      }

      // Main cursor
      gsap.to(cursorRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Follower
      gsap.to(followerRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Trail dots with increasing delay
      trailRefs.current.forEach((trail, i) => {
        if (trail) {
          gsap.to(trail, {
            x: clientX,
            y: clientY,
            duration: 0.3 + i * 0.08,
            ease: 'power2.out'
          });
        }
      });
    };

    const handleClick = (e) => {
      if (rippleRef.current) {
        // Position ripple at click location
        gsap.set(rippleRef.current, {
          x: e.clientX,
          y: e.clientY,
          scale: 0,
          opacity: 0.5
        });

        // Animate ripple
        gsap.to(rippleRef.current, {
          scale: 2,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    const handleHoverStart = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('.cursor-hover')) {
        setIsHovering(true);
        const text = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        setHoverText(text || '');
      }
    };

    const handleHoverEnd = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('.cursor-hover')) {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      gsap.to(cursorRef.current, { scale: 0.5, duration: 0.3 });
      gsap.to(followerRef.current, {
        scale: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        mixBlendMode: 'difference',
        duration: 0.3
      });
      // Hide trail on hover
      trailRefs.current.forEach(trail => {
        if (trail) gsap.to(trail, { opacity: 0, duration: 0.2 });
      });
    } else {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
      gsap.to(followerRef.current, {
        scale: 1,
        backgroundColor: 'transparent',
        mixBlendMode: 'normal',
        duration: 0.3
      });
      // Show trail
      trailRefs.current.forEach((trail, i) => {
        if (trail) gsap.to(trail, { opacity: 1 - (i * 0.2), duration: 0.2 });
      });
    }
  }, [isHovering]);

  return (
    <>
      {/* Trail dots */}
      {[...Array(TRAIL_LENGTH)].map((_, i) => (
        <div
          key={i}
          ref={el => trailRefs.current[i] = el}
          className="cursor-trail"
          style={{ opacity: 1 - (i * 0.2) }}
        />
      ))}

      {/* Click ripple */}
      <div ref={rippleRef} className="cursor-ripple" />

      {/* Main cursor */}
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className={`cursor-follower ${isHovering ? 'active' : ''}`}>
        {hoverText && <span className="cursor-text">{hoverText}</span>}
      </div>
    </>
  );
};

export default CustomCursor;
