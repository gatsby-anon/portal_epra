"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import Link from "next/link";
import content from "@/data/content.json";
import { useRef } from "react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const { hero } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[900px] flex items-center px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden bg-[#0D0D0D]"
    >
      {/* Parallax Background Layer */}
      <motion.div 
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(13, 13, 13, 0.8) 0%, rgba(13, 13, 13, 0.2) 50%, rgba(13, 13, 13, 1) 100%), url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY 
        }}
      />

      {/* Decorative Glows Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(143,175,60,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(45,108,223,0.1),transparent_30%)]" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="z-10 max-w-3xl relative"
      >
        <div className="hero-glass-control p-10 md:p-14 relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/40" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary/20" />

          <motion.div variants={fadeUp} className="mb-8 relative z-10">
            <StatusBadge label={hero.status} />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl mb-8 leading-tight text-white font-bold relative z-10 glitch-sutil"
          >
            {hero.titlePart1}{" "}
            <span className="text-neon-green drop-shadow-[0_0_25px_rgba(164,198,57,0.6)]">
              {hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-body)] text-lg text-white/95 max-w-xl mb-12 leading-relaxed relative z-10"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-6 relative z-10">
            <MagneticWrapper>
              <Link href="#courses">
                <GlowButton variant="primary">{hero.ctaPrimary}</GlowButton>
              </Link>
            </MagneticWrapper>
            <MagneticWrapper>
              <GlowButton variant="ghost">{hero.ctaSecondary}</GlowButton>
            </MagneticWrapper>
          </motion.div>

          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 border border-primary/10 rounded-full" />
          <div className="absolute -right-5 -bottom-5 w-32 h-32 border border-primary/20 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
