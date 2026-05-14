'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  useAuth();

  useEffect(() => {
    const reqId = Date.now();
    console.log('[ChallengesPage] Fetching challenges, reqId:', reqId);
    fetch('/api/challenges')
      .then(res => {
        console.log('[ChallengesPage] status:', res.status, 'reqId:', reqId);
        return res.json();
      })
      .then(data => {
        console.log('[ChallengesPage] data:', data, 'reqId:', reqId);
        if (data.success) setChallenges(data.data);
      })
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
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl font-bold mb-8 text-[#b1d35c] uppercase">
          Desafios
        </h1>
        
        {challenges.length === 0 ? (
          <p className="text-gray-400">Nenhum desafio disponível no momento.</p>
        ) : (
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D0D0D]/80 border border-[#b1d35c]/30 text-[#b1d35c] hover:bg-[#b1d35c]/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg"
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
                <div
                  key={challenge.id}
                  className={`flex-shrink-0 w-[380px] border rounded-lg p-6 transition-all ${
                    challenge.isOpen 
                      ? 'border-[#b1d35c]/30 bg-[#1A1C1C] hover:border-[#b1d35c]/60' 
                      : 'border-[#3A3A3A] bg-[#1A1C1C]/50 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold">
                      {challenge.titulo}
                    </h2>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      challenge.isOpen 
                        ? 'bg-[#b1d35c]/10 text-[#b1d35c] border border-[#b1d35c]/30' 
                        : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
                    }`}>
                      {challenge.isOpen ? 'Aberto' : 'Encerrado'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-[family-name:var(--font-code)]">
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
                      📊 {challenge._count.submissions} submissões
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
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0D0D0D]/80 border border-[#b1d35c]/30 text-[#b1d35c] hover:bg-[#b1d35c]/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}