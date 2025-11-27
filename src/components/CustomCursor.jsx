import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
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
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
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
    } else {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
      gsap.to(followerRef.current, { 
        scale: 1, 
        backgroundColor: 'transparent',
        mixBlendMode: 'normal',
        duration: 0.3 
      });
    }
  }, [isHovering]);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className={`cursor-follower ${isHovering ? 'active' : ''}`}>
        {hoverText && <span className="cursor-text">{hoverText}</span>}
      </div>
    </>
  );
};

export default CustomCursor;
