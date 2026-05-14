"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  technologies: string[];
  repositoryLink?: string | null;
}

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/portfolio');
        const result = await response.json();
        if (result.success) {
          setItems(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Erro ao carregar portfólio');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  return (
    <SectionWrapper id="portfolio">
      <div className="mb-12">
        <div className="font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
          Cases de Sucesso
        </div>
        <h2 className="font-[family-name:var(--font-headline)] text-3xl font-semibold text-white">
          Portfólio & Impacto
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="font-[family-name:var(--font-code)] uppercase tracking-widest text-xs">Acessando Arquivos...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-zinc-500 border border-red-500/20 bg-red-500/5">
          <p className="font-[family-name:var(--font-code)] text-red-400 uppercase tracking-widest text-xs">{error}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 relative px-4 md:px-12"
        >
          {items.length > 0 ? (
            items.map((item, index) => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                featured={index === 0}
                className={index === 0 ? "md:col-span-2 md:row-span-2" : "md:h-[300px]"}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800">
               <p className="text-zinc-500 font-[family-name:var(--font-code)] text-xs uppercase">Nenhum projeto registrado no sistema.</p>
            </div>
          )}
        </motion.div>
      )}
    </SectionWrapper>
  );
}
