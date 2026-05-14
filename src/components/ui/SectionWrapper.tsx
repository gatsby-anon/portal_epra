"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  withBorder?: boolean;
}

export function SectionWrapper({ children, id, className = "", withBorder = false }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`px-6 md:px-12 py-20 bg-[#0D0D0D] ${withBorder ? "border-y border-border-gray" : ""} ${className}`}
    >
      <div className="max-w-screen-2xl mx-auto">{children}</div>
    </motion.section>
  );
}
