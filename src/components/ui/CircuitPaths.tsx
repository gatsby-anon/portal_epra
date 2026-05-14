"use client";

import { motion } from "framer-motion";

export function CircuitPaths() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-neon-pulse-secondary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-neon-pulse-secondary)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-neon-pulse-secondary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Horizontal Lines */}
      <motion.path
        d="M 0 100 H 2000"
        stroke="url(#circuit-gradient)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M 0 400 H 2000"
        stroke="url(#circuit-gradient)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
      />
      
      {/* Vertical Lines */}
      <motion.path
        d="M 200 0 V 1000"
        stroke="url(#circuit-gradient)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0.5 }}
      />
      <motion.path
        d="M 800 0 V 1000"
        stroke="url(#circuit-gradient)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
      />
      
      {/* Circuit Nodes */}
      <circle cx="200" cy="100" r="2" fill="var(--color-neon-pulse-secondary)" className="animate-pulse" />
      <circle cx="800" cy="400" r="2" fill="var(--color-neon-pulse-secondary)" className="animate-pulse" />
    </svg>
  );
}
