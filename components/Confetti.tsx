import React, { useEffect, useRef, useState } from 'react';
import { Particle } from '../types';

interface ConfettiProps {
  colorHex: string;
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ colorHex, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (active) {
      // Spawn explosion
      const newParticles: Particle[] = [];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
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
          size: Math.random() * 6 + 2,
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active, colorHex]);

  const animate = () => {
    setParticles(prevParticles => {
      return prevParticles
        .map(p => ({
          ...p,
          x: p.x + p.velocity.x,
          y: p.y + p.velocity.y + 0.1, // gravity
          velocity: {
            x: p.velocity.x * 0.98, // friction
            y: p.velocity.y * 0.98,
          },
          life: p.life - 0.015,
        }))
        .filter(p => p.life > 0);
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (particles.length > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [particles.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [particles]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};