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

    // Use internal logical dimensions or half of physical dimensions
    const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
    const centerY = canvas.height / (window.devicePixelRatio || 1) / 2;

    const newParticles: Particle[] = [];
    const count = 80; // Slightly reduced for mobile smoothness

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
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
        size: Math.random() * 4 + 2,
      });
    }
    particlesRef.current = newParticles;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    if (particlesRef.current.length === 0 && !activeRef.current) {
      requestRef.current = 0;
      return;
    }

    // Update and Draw in one pass
    const nextParticles: Particle[] = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];

      // Update physics
      p.x += p.velocity.x;
      p.y += p.velocity.y + 0.15; // increased gravity slightly
      p.velocity.x *= 0.98;
      p.velocity.y *= 0.98;
      p.life -= 0.015;

      if (p.life > 0) {
        // Draw
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
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

  // Handle Resize and High-DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set physical bits
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Set CSS display bits
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
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};