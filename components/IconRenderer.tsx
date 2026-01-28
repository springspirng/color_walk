import React from 'react';
import { Flame, Sun, Droplets, Leaf, Zap, Crown, HelpCircle } from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className }) => {
  switch (iconName) {
    case 'Flame': return <Flame className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Leaf': return <Leaf className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'Crown': return <Crown className={className} />;
    default: return <HelpCircle className={className} />;
  }
};