"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import content from "@/data/content.json";

interface LocalTestimonial {
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  quote: string;
  uid?: string;
}

export function Testimonials() {
  const { testimonials } = content;
  const [currentIndex, setCurrentIndex] = useState(0);
  const allTestimonials: LocalTestimonial[] = [testimonials.featured, ...testimonials.secondary];


  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  }, [allTestimonials.length]);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const current = allTestimonials[currentIndex];

  return (
    <section id="testimonials" className="px-6 md:px-12 py-20 bg-[#0D0D0D]">
      <div className="max-w-screen-2xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.3em] text-secondary-text mb-2">
            {testimonials.sectionLabel}
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-4xl font-bold text-white">
            {testimonials.sectionTitle}{" "}
            <em className="text-primary">{testimonials.sectionHighlight}</em>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-0 bg-surface-container-low p-3 border border-border-gray rounded-t-lg">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-wire-red" />
                  <div className="w-3 h-3 rounded-full bg-vibrant-yellow" />
                  <div className="w-3 h-3 rounded-full bg-neon-green" />
                </div>
                <div className="font-[family-name:var(--font-code)] text-xs text-zinc-400">
                  {testimonials.terminalPath}
                </div>
                <div className="w-4" />
              </div>

              <GlassCard className="p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(143,175,60,0.1)]">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanline-overlay" />

                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-sm border-2 border-primary/40 p-1 overflow-hidden">
                      <Image
                        src={current.avatar || "/images/testimonial-avatar.jpg"}
                        alt={current.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover grayscale brightness-125 contrast-125"
                      />
                    </div>
                    {currentIndex === 0 && (
                      <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-tighter">
                        VERIFIED
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <StarRating count={current.rating} size={14} />
                    <blockquote className="font-[family-name:var(--font-code)] text-lg md:text-xl text-white leading-relaxed italic">
                      &ldquo;{current.quote}&rdquo;
                    </blockquote>
                    <div className="pt-4 border-t border-white/10">
                      <div className="font-[family-name:var(--font-headline)] text-white tracking-widest font-semibold">
                        {current.name}
                      </div>
                      <div className="font-[family-name:var(--font-code)] text-xs text-primary">
                        {current.role}
                      </div>
                    </div>
                  </div>
                </div>

                {current.uid && (
                  <div className="absolute bottom-0 right-0 p-4 font-[family-name:var(--font-code)] text-[10px] text-zinc-700 select-none">
                    {current.uid}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 border border-border-gray flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary transition-colors"
              aria-label="Depoimento anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex gap-2">
              {allTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-primary w-6" : "bg-zinc-600"
                  }`}
                  aria-label={`Ir para depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 border border-border-gray flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary transition-colors"
              aria-label="Próximo depoimento"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="font-[family-name:var(--font-code)] text-xs text-zinc-500">
              AUTO-PLAY ATIVO: 5s
            </span>
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials/submit" className="inline-block bg-primary/10 border border-primary/50 text-primary px-8 py-4 font-[family-name:var(--font-headline)] text-sm font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors">
              Fez parte do EPRA e quer compartilhar sua história?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}