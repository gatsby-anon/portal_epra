import { ReactNode, useRef, useEffect } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: "default" | "heavy";
  className?: string;
  onClick?: () => void;
  reactive?: boolean;
  glowColor?: "primary" | "electric-blue" | "vibrant-yellow" | "wire-red" | "neon-green";
}

const hueMap = {
  primary: 76,
  "neon-green": 76,
  "electric-blue": 220,
  "vibrant-yellow": 45,
  "wire-red": 0,
};

export function GlassCard({ 
  children, 
  variant = "default", 
  className = "", 
  onClick,
  reactive = true,
  glowColor = "primary"
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!reactive) return;

    const syncPointer = (e: PointerEvent) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', e.clientX.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', e.clientY.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, [reactive]);

  const hue = hueMap[glowColor] || 76;

  return (
    <div 
      ref={cardRef}
      data-glow
      onClick={onClick}
      style={{
        '--base': hue,
        '--spread': 40, // Reduced spread for more precise cyberpunk look
        '--outer': 1,
      } as React.CSSProperties}
      className={`
        rounded-none
        relative
        backdrop-blur-[10px]
        transition-all
        ${className}
      `}
    >
      <div data-glow-outer />
      {children}
    </div>
  );
}

