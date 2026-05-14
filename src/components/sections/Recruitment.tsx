"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

interface Opportunity {
  id: string;
  titulo: string;
  descricao: string;
  vagas: number;
  dataLimite: string | null;
  status: "Open" | "Closed";
  applicationCount: number;
  isOpen: boolean;
}

export function Recruitment() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vagas")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOpportunities(data.data.filter((o: Opportunity) => o.isOpen).slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (id: string) => {
    router.push(`/vagas/${id}`);
  };

  return (
    <section id="recruitment" className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto text-center border-t border-border-gray bg-[#0D0D0D]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="inline-block px-4 py-1 border border-primary/50 text-secondary-text font-[family-name:var(--font-code)] text-xs rounded-full">
          OPEN_RECRUITMENT_2026
        </div>

        <h2 className="font-[family-name:var(--font-headline)] text-4xl font-bold text-white">
          JUNTE-SE AO <em className="text-[#00d4ff]">EPRA</em>
        </h2>

        <p className="text-light-gray leading-relaxed">
          Estamos em busca de desenvolvedores, designers e entusiastas em robótica para expandir nossos horizontes. Se você quer impactar a educação tecnológica, seu terminal está esperando.
        </p>

        {loading ? (
          <div className="text-zinc-500">Carregando vagas...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-zinc-500">Nenhuma vaga disponível no momento.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <GlassCard className="p-6 text-left border-l-4 border-l-[#00d4ff]">
                  <div className="font-[family-name:var(--font-headline)] text-lg font-semibold mb-2 text-white">
                    {opp.titulo}
                  </div>
                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{opp.descricao}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {opp.applicationCount}/{opp.vagas} candidatos
                    </span>
                    <button 
                      onClick={() => handleApply(opp.id)}
                      className="text-xs font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] text-[#00d4ff]"
                    >
                      [APLICAR]
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}