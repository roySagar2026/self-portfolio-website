import { useEffect, useMemo, useRef } from 'react';

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function GalaxyBackground() {
  const canvasRef = useRef(null);
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        id: i,
        left: `${random(0, 100)}%`,
        top: `${random(0, 100)}%`,
        size: random(1, 2.6),
        delay: random(0, 8),
        duration: random(2.5, 5.5),
        opacity: random(0.25, 0.9),
      })),
    []
  );

  const shooting = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: `${random(5, 55)}%`,
        left: `${random(10, 80)}%`,
        delay: random(1, 14),
        duration: random(1.6, 2.8),
        angle: random(-28, -12),
      })),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const dust = Array.from({ length: 50 }, () => ({
      x: random(0, window.innerWidth),
      y: random(0, window.innerHeight),
      r: random(0.4, 1.4),
      vx: random(-0.05, 0.05),
      vy: random(-0.08, 0.02),
      a: random(0.15, 0.45),
    }));

    const draw = () => {
      t += 0.004;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // soft nebula washes
      const g1 = ctx.createRadialGradient(
        w * (0.25 + Math.sin(t) * 0.04),
        h * 0.2,
        0,
        w * 0.3,
        h * 0.25,
        w * 0.45
      );
      g1.addColorStop(0, 'rgba(90,90,100,0.12)');
      g1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(
        w * (0.75 + Math.cos(t * 0.8) * 0.03),
        h * 0.7,
        0,
        w * 0.7,
        h * 0.75,
        w * 0.4
      );
      g2.addColorStop(0, 'rgba(70,70,80,0.1)');
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      dust.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(210,210,220,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="galaxy" aria-hidden>
      <canvas ref={canvasRef} className="galaxy__canvas" />
      <div className="galaxy__milky" />
      <div className="galaxy__glow galaxy__glow--a" />
      <div className="galaxy__glow galaxy__glow--b" />
      <div className="galaxy__glow galaxy__glow--c" />

      {stars.map((s) => (
        <span
          key={s.id}
          className="galaxy__star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}

      {shooting.map((s) => (
        <span
          key={s.id}
          className="galaxy__shoot"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            ['--shoot-angle']: `${s.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}
