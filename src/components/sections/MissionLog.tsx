"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TerminalTyping } from "@/components/ui/TerminalTyping";
import content from "@/data/content.json";

export function MissionLog() {
  const { mission } = content;

  return (
    <SectionWrapper id="mission">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image with industrial frame */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-1 border border-border-gray glass-panel"
        >
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary" />
          <Image
            src={mission.image}
            alt="Mission Workshop"
            width={800}
            height={450}
            className="w-full aspect-video object-cover"
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="font-[family-name:var(--font-headline)] text-3xl font-semibold flex items-center gap-4 text-white">
            <Terminal className="text-primary" size={28} />
            {mission.title}
          </h2>

          <p className="font-[family-name:var(--font-body)] text-light-gray leading-relaxed">
            {mission.description}
          </p>

          <div className="mt-8">
            <TerminalTyping 
              prompt={mission.terminal.prompt}
              command={mission.terminal.command}
              steps={mission.terminal.steps as any}
            />
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
