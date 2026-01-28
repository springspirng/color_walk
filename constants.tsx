import { ColorOption } from './types';
import { Flame, Sun, Droplets, Leaf, Zap, Crown } from 'lucide-react';
import React from 'react';

// Using JSX in constants require .tsx extension if we were returning components,
// but here we are mapping logic in the component. We'll store data here.

export const COLORS: ColorOption[] = [
  { 
    id: 'red', 
    name: '熱情紅 (Red)', 
    twBg: 'bg-red-500', 
    twText: 'text-red-500',
    hex: '#ef4444', 
    icon: 'Flame',
    message: "Passion & Energy!"
  },
  { 
    id: 'orange', 
    name: '活力橙 (Orange)', 
    twBg: 'bg-orange-500', 
    twText: 'text-orange-500',
    hex: '#f97316', 
    icon: 'Sun',
    message: "Creativity & Joy!"
  },
  { 
    id: 'yellow', 
    name: '希望黃 (Yellow)', 
    twBg: 'bg-yellow-400', 
    twText: 'text-yellow-500',
    hex: '#eab308', 
    icon: 'Zap',
    message: "Optimism & Intellect!"
  },
  { 
    id: 'green', 
    name: '幸運綠 (Green)', 
    twBg: 'bg-green-500', 
    twText: 'text-green-500',
    hex: '#22c55e', 
    icon: 'Leaf',
    message: "Growth & Harmony!"
  },
  { 
    id: 'blue', 
    name: '自由藍 (Blue)', 
    twBg: 'bg-blue-500', 
    twText: 'text-blue-500',
    hex: '#3b82f6', 
    icon: 'Droplets',
    message: "Trust & Peace!"
  },
  { 
    id: 'purple', 
    name: '神秘紫 (Purple)', 
    twBg: 'bg-purple-600', 
    twText: 'text-purple-600',
    hex: '#9333ea', 
    icon: 'Crown',
    message: "Luxury & Ambition!"
  },
];

export const REEL_ITEM_HEIGHT = 160; // Height of one color block in pixels
export const SPIN_DURATION = 3000; // ms
export const MIN_LOOPS = 5; // Minimum full rotations