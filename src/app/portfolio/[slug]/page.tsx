"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Code, ExternalLink, Calendar, User, Tag, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  technologies: string[];
  repositoryLink?: string | null;
  author: {
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export default function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(`/api/portfolio/${slug}`);
        const result = await response.json();
        if (result.success) {
          setItem(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error fetching portfolio item:', err);
        setError('Erro ao carregar detalhes do portfólio');
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mb-4 text-primary" size={40} />
        <p className="font-[family-name:var(--font-code)] uppercase tracking-widest text-sm">Descriptografando Dados...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center justify-center text-zinc-500 px-4">
        <div className="border border-red-500/20 bg-red-500/5 p-8 max-w-md text-center">
          <p className="font-[family-name:var(--font-code)] text-red-400 uppercase tracking-widest text-sm mb-6">
            {error || 'Portfólio não encontrado'}
          </p>
          <Link href="/#portfolio" className="text-primary hover:underline font-[family-name:var(--font-headline)] uppercase tracking-wider text-xs">
            Voltar para a base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <SectionWrapper>
        {/* Back Button */}
        <Link 
          href="/#portfolio" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-[family-name:var(--font-headline)] text-xs uppercase tracking-widest font-bold">Voltar para Portfólio</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {item.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap gap-6 mb-8 text-zinc-500 font-[family-name:var(--font-code)] text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span>{item.author.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Hero Image */}
              <GlassCard className="aspect-video relative overflow-hidden mb-12 border-primary/20">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </GlassCard>

              {/* Description */}
              <div className="prose prose-invert max-w-none mb-12 text-zinc-300 leading-relaxed text-lg font-light">
                <ReactMarkdown>
                  {item.description}
                </ReactMarkdown>
              </div>


              {/* Gallery */}
              {item.images.length > 1 && (
                <div className="mt-16">
                  <h3 className="font-[family-name:var(--font-headline)] text-xl text-white mb-8 border-l-2 border-primary pl-4 uppercase tracking-widest">
                    Galeria Técnica
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.images.slice(1).map((img, idx) => (
                      <GlassCard key={idx} className="aspect-video relative overflow-hidden group">
                        <Image
                          src={img}
                          alt={`${item.title} screen ${idx + 2}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <aside className="sticky top-32 space-y-8">
              {/* Repository Link */}
              {item.repositoryLink && (
                <GlassCard className="p-6 border-primary/40 bg-primary/5">
                  <h4 className="font-[family-name:var(--font-headline)] text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Acesso ao Código</h4>
                  <a 
                    href={item.repositoryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-black font-[family-name:var(--font-headline)] font-bold uppercase tracking-widest hover:bg-primary/80 transition-all group"
                  >
                    <Code size={20} />
                    <span>Ver Repositório</span>
                    <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </GlassCard>
              )}

              {/* Technologies */}
              <GlassCard className="p-6">
                <h4 className="font-[family-name:var(--font-headline)] text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Tecnologias</h4>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-surface-container border border-outline-variant/30 text-zinc-300 font-[family-name:var(--font-code)] text-[11px] uppercase"
                    >
                      <Tag size={10} className="text-primary" />
                      {tech}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </aside>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
