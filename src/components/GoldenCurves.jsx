import { useEffect, useRef } from 'react';
import './GoldenCurves.css';

const GoldenCurves = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });

    // Gold palette - fewer colors
    const colors = ['#bf953f', '#c2b280', '#aa771c'];

    let w, h;

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      // Use lower resolution for better performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    const drawRibbon = (index) => {
      const ribbonOffset = index * 160;
      const time = timeRef.current;

      // More lines per ribbon for fuller effect
      for (let j = 0; j < 10; j++) {
        ctx.beginPath();

        // Start point
        let x1 = 0;
        let y1 = h / 2 + Math.sin(time + index + j * 0.1) * 220 + ribbonOffset - 400;

        // Control points
        let cp1x = w * 0.25 + Math.cos(time * 0.5 + index) * 140;
        let cp1y = h * 0.3 + Math.sin(time * 0.7 + index) * 280;

        let cp2x = w * 0.75 + Math.cos(time * 0.6 + index) * 140;
        let cp2y = h * 0.7 + Math.sin(time * 0.4 + index) * 280;

        // End point
        let x2 = w;
        let y2 = h / 2 + Math.cos(time + index + j * 0.1) * 220 - ribbonOffset + 400;

        const lineOffset = j * 1.8;

        ctx.moveTo(x1, y1 + lineOffset);
        ctx.bezierCurveTo(
          cp1x, cp1y + lineOffset,
          cp2x, cp2y + lineOffset,
          x2, y2 + lineOffset
        );

        ctx.strokeStyle = colors[index % colors.length];
        ctx.globalAlpha = 0.12 - (j * 0.01);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const animate = (timestamp) => {
      // Throttle to ~30fps for better performance
      if (timestamp - lastFrameRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameRef.current = timestamp;

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.002;

      ctx.globalAlpha = 1;

      // Draw 6 ribbon groups for more coverage
      for (let i = 0; i < 6; i++) {
        drawRibbon(i);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="golden-curves-canvas"
      aria-hidden="true"
    />
  );
};

export default GoldenCurves;
