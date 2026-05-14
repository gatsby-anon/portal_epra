"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colorMaps } from "@/components/ui/colorMaps";
import { Counter } from "@/components/ui/Counter";
import content from "@/data/content.json";

export function Metrics() {
  return (
    <section className="px-6 md:px-12 py-20 max-w-screen-2xl mx-auto bg-[#0D0D0D]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {content.stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassCard 
              className="p-6 relative overflow-hidden"
              glowColor={stat.color as any}
            >
              <span className="absolute top-2 right-2 font-[family-name:var(--font-code)] text-[8px] text-zinc-600">
                {stat.id}
              </span>
              <div className="text-secondary-text font-[family-name:var(--font-headline)] text-[10px] font-bold uppercase tracking-[0.1em] mb-2">
                {stat.label}
              </div>
              <div className={`font-[family-name:var(--font-headline)] text-4xl font-bold ${colorMaps.text[stat.color] || "text-primary"}`}>
                <Counter to={parseInt(stat.value)} suffix={stat.value.includes("+") ? "+" : ""} />
              </div>
              <ProgressBar progress={stat.progress} color={stat.color} />
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
