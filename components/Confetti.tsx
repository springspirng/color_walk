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

  // Sync active state to ref for access in animation loop
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    const centerX = canvas.width / dpr / 2;
    const centerY = canvas.height / dpr / 2;

    const newParticles: Particle[] = [];
    const count = 50; // Optimized for iOS performance

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
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
        size: Math.random() * 6 + 3,
      });
    }
    particlesRef.current = newParticles;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Match resize cap
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    if (particlesRef.current.length === 0 && !activeRef.current) {
      requestRef.current = 0;
      return;
    }

    const nextParticles: Particle[] = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];

      p.x += p.velocity.x;
      p.y += p.velocity.y + 0.18;
      p.velocity.x *= 0.97;
      p.velocity.y *= 0.97;
      p.life -= 0.018;

      if (p.life > 0) {
        // Optimization: Use fillRect (squares) instead of arcs (circles)
        // fillRect is significantly faster for mobile GPUs to draw
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        // Square width fluctuates slightly to simulate "tumbling" confetti
        const width = p.size * (0.6 + Math.sin(p.life * 10) * 0.4);
        ctx.fillRect(p.x - width / 2, p.y - p.size / 2, width, p.size);

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

      // Cap DPR at 2.0. iPhones with DPR 3.0 often lag on full-screen drawing.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
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
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};