export interface ColorOption {
  id: string;
  name: string;
  twBg: string; // Tailwind background class
  twText: string; // Tailwind text color class
  hex: string;
  icon: string; // Lucide icon name placeholder
  message: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  size: number;
}