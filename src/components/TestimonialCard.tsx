"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    text: string;
    photoUrl?: string | null;
    user: {
      id: string;
      fullName: string;
      course?: string | null;
    };
    createdAt: string;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-0 bg-surface-container-low p-3 border border-border-gray rounded-t-lg">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-wire-red" />
          <div className="w-3 h-3 rounded-full bg-vibrant-yellow" />
          <div className="w-3 h-3 rounded-full bg-neon-green" />
        </div>
        <div className="font-[family-name:var(--font-code)] text-xs text-zinc-400">
          src / feedback / user_review.sh
        </div>
        <div className="w-4" />
      </div>

      <div className="bg-surface-container-low border-x border-b border-border-gray p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanline-overlay" />

        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-sm border-2 border-primary/40 p-1 overflow-hidden">
              {testimonial.photoUrl ? (
                <Image
                  src={testimonial.photoUrl}
                  alt={testimonial.user.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover grayscale brightness-125 contrast-125"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-code)] text-2xl text-zinc-500">
                    {testimonial.user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-tighter">
              VERIFIED
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <blockquote className="font-[family-name:var(--font-code)] text-lg md:text-xl text-white leading-relaxed italic">
              &ldquo;{testimonial.text}&rdquo;
            </blockquote>
            <div className="pt-4 border-t border-white/10">
              <div className="font-[family-name:var(--font-headline)] text-white tracking-widest font-semibold">
                {testimonial.user.fullName}
              </div>
              <div className="font-[family-name:var(--font-code)] text-xs text-primary">
                {testimonial.user.course || "EPRA Aluno"}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 p-4 font-[family-name:var(--font-code)] text-[10px] text-zinc-700 select-none">
          {testimonial.id.slice(0, 8).toUpperCase()} | {formatDate(testimonial.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}