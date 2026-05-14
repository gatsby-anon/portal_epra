"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Challenge {
  id: string;
  titulo: string;
  descricao: string;
  dataLimite: string;
  urlGithub: string | null;
  instrutor: string;
  _count: { submissions: number };
  isOpen: boolean;
}

export function Challenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const reqId = Date.now();
    console.log('[ChallengeSection] Fetching challenges, reqId:', reqId);
    fetch('/api/challenges')
      .then(res => {
        console.log('[ChallengeSection] status:', res.status, 'reqId:', reqId);
        return res.json();
      })
      .then(data => {
        console.log('[ChallengeSection] data:', data, 'reqId:', reqId);
        console.log('[ChallengeSection] data.success:', data?.success, 'reqId:', reqId);
        console.log('[ChallengeSection] data.data length:', data?.data?.length, 'reqId:', reqId);
        if (data.success) setChallenges(data.data);
      })
      .catch(err => console.error('[ChallengeSection] fetch error:', err, 'reqId:', reqId))
      .finally(() => setLoading(false));
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <section id="challenge" className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto bg-[#0D0D0D]">
        <div className="text-center text-gray-400">Carregando desafios...</div>
      </section>
    );
  }

  // Show empty state instead of hiding
  if (challenges.length === 0) {
    return (
      <section id="challenge" className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto bg-[#0D0D0D]">
        <h2 className="text-3xl font-[family-name:var(--font-headline)] text-white mb-4">Desafios</h2>
        <p className="text-gray-400">Nenhum desafio disponível no momento.</p>
      </section>
    );
  }

  return (
    <section id="challenge" className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto bg-[#0D0D0D]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-wire-red text-white px-3 py-1 font-[family-name:var(--font-headline)] text-[10px] font-bold uppercase tracking-[0.2em]">
              Desafios
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-3xl font-bold mt-4 text-white">
              Participe dos Desafios
            </h2>
          </div>
          <Link href="/challenges">
            <GlowButton variant="ghost" className="text-sm">
              Ver Todos →
            </GlowButton>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D0D0D]/90 border border-[#b1d35c]/30 text-[#b1d35c] hover:bg-[#b1d35c]/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-12"
            style={{ scrollbarWidth: 'none' }}
          >
            {challenges.map((challenge) => (
              <GlassCard key={challenge.id} className={`flex-shrink-0 w-[400px] p-6 border ${
                challenge.isOpen 
                  ? 'border-[#b1d35c]/30' 
                  : 'border-[#3A3A3A] opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-white">
                    {challenge.titulo}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    challenge.isOpen 
                      ? 'bg-[#b1d35c]/10 text-[#b1d35c] border border-[#b1d35c]/30' 
                      : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
                  }`}>
                    {challenge.isOpen ? 'Aberto' : 'Encerrado'}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-[family-name:var(--font-code)]">
                  {challenge.descricao}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-[#0D0D0D] px-2 py-1 rounded border border-[#3A3A3A] font-[family-name:var(--font-code)]">
                    📅 {formatDate(challenge.dataLimite)}
                  </span>
                  <span className="text-xs bg-[#0D0D0D] px-2 py-1 rounded border border-[#3A3A3A] font-[family-name:var(--font-code)]">
                    👤 {challenge.instrutor}
                  </span>
                  <span className="text-xs bg-[#0D0D0D] px-2 py-1 rounded border border-[#3A3A3A] font-[family-name:var(--font-code)]">
                    📊 {challenge._count.submissions}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/challenges/${challenge.id}`}
                    className={`flex-1 text-center py-2 rounded transition-colors font-[family-name:var(--font-headline)] text-sm ${
                      challenge.isOpen 
                        ? 'border border-[#b1d35c]/50 text-[#b1d35c] hover:bg-[#b1d35c]/10' 
                        : 'border border-[#3A3A3A] text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Ver Detalhes
                  </Link>
                  {challenge.isOpen && (
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="flex-1 text-center py-2 bg-[#b1d35c] text-black font-bold rounded hover:bg-[#b1d35c]/90 transition-colors font-[family-name:var(--font-headline)] text-sm"
                    >
                      Enviar
                    </Link>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D0D0D]/90 border border-[#b1d35c]/30 text-[#b1d35c] hover:bg-[#b1d35c]/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}