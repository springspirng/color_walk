import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

interface ConfettiProps {
  colorHex: string;
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ colorHex, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const activeRef = useRef<boolean>(active);

  // Super Aggressive Resolution Downscaling (0.4x)
  // This reduces the number of pixels to draw by >80%
  const RES_FACTOR = 0.4;

  useEffect(() => {
    activeRef.current = active;
    if (active) {
      spawnExplosion();
    } else {
      particlesRef.current = [];
    }
  }, [active, colorHex]);

  const spawnExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const newParticles: Particle[] = [];
    const count = 35; // Slightly increased now that it's working well

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 5 + 3) * RES_FACTOR;
      newParticles.push({
        id: Math.random(),
        x: centerX,
        y: centerY,
        color: i % 2 === 0 ? colorHex : '#ffffff',
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        life: 1.0,
        size: (Math.random() * 7 + 5) * RES_FACTOR,
      });
    }
    particlesRef.current = newParticles;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particlesRef.current.length === 0 && !activeRef.current) {
      requestRef.current = 0;
      return;
    }

    const nextParticles: Particle[] = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];

      p.x += p.velocity.x;
      p.y += p.velocity.y + (0.18 * RES_FACTOR);
      p.velocity.x *= 0.96;
      p.velocity.y *= 0.96;
      p.life -= 0.022;

      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        // Drawing round particles again as requested
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        nextParticles.push(p);
      }
    }

    particlesRef.current = nextParticles;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (active) {
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  }, [active]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Physically small canvas
      canvas.width = width * RES_FACTOR;
      canvas.height = height * RES_FACTOR;

      // Stylistically full-screen (scaled up by browser)
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '50';
      canvas.style.imageRendering = 'auto'; // Back to auto for smoother circles
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: active ? 'block' : 'none' }}
    />
  );
};