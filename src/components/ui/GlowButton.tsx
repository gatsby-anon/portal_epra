"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}

export function GlowButton({ children, variant = "primary", className = "", onClick }: GlowButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-primary text-on-primary shadow-[0_10px_30px_rgba(143,175,60,0.4)] hover:shadow-[0_0_40px_rgba(143,175,60,0.6)] hover:bg-primary-hover hover-pulse-neon animate-scanline"
      : "border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 animate-scanline";

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`px-8 py-4 font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.1em] transition-all relative overflow-hidden ${styles} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
