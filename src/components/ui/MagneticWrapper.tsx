"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  withHalo?: boolean;
}

export function MagneticWrapper({
  children,
  strength = 0.5,
  className = "",
  withHalo = true,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {withHalo && (
        <motion.div
          className="absolute inset-[-20px] rounded-full pointer-events-none z-0"
          style={{
            x: mouseX,
            y: mouseY,
            background: "radial-gradient(circle, var(--color-neon-pulse-secondary-glow) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
