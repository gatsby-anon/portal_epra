"use client";

import { motion } from "framer-motion";
import { Cpu, Lightbulb, Terminal, Settings2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CircuitPaths } from "@/components/ui/CircuitPaths";
import { colorMaps } from "@/components/ui/colorMaps";
import content from "@/data/content.json";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Lightbulb,
  Terminal,
  Settings2,
};

export function ModuleGrid() {
  const { modules } = content;

  return (
    <SectionWrapper id="modules" withBorder className="relative overflow-hidden">
      <CircuitPaths />
      <div className="relative z-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
            {modules.sectionLabel}
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-3xl font-semibold text-white">
            {modules.sectionTitle}
          </h2>
        </div>
        <div className="font-[family-name:var(--font-code)] text-[10px] text-zinc-500 hidden md:block">
          {modules.version}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {modules.items.map((mod, i) => {
          const Icon = iconMap[mod.icon] || Cpu;
          return (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard 
                className="p-8 group hover:border-primary/50 transition-all cursor-pointer h-full"
                glowColor={mod.iconColor as any}
              >
                <Icon
                  size={36}
                  className={`${colorMaps.text[mod.iconColor] || "text-primary"} mb-6 block`}
                />
                <h3 className="font-[family-name:var(--font-headline)] text-xl font-semibold mb-4 text-white">
                  {mod.title}
                </h3>
                <p className="text-sm text-light-gray mb-6">{mod.description}</p>
                <div className={`text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] ${colorMaps.text[mod.ctaColor] || "text-primary"} group-hover:underline`}>
                  {mod.ctaLabel}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      </div>
    </SectionWrapper>
  );
}
