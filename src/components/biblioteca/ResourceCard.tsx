"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { LanguageBadge } from "./LanguageBadge";
import { DownloadCounter } from "./DownloadCounter";

interface LibraryResource {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  linguagem?: string | null;
  tags: string[];
  link: string;
  downloadCount: number;
}

interface ResourceCardProps {
  resource: LibraryResource;
  onDownload: (id: string) => void;
  isAuthenticated?: boolean;
}

export function ResourceCard({ resource, onDownload, isAuthenticated = false }: ResourceCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("[ResourceCard] Clicked download for:", resource.id, "authenticated:", isAuthenticated);
    onDownload(resource.id);
  };

  const downloadCount = typeof resource.downloadCount === 'number' ? resource.downloadCount : 0;

  return (
    <GlassCard className="p-5 border-l-4 border-l-primary/50 hover:border-primary/80 transition-all group">
      {/* Top: Tags + Language */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-1.5">
          {resource.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-[10px] px-2 py-0.5 bg-surface-container border border-outline-variant/50 text-zinc-400 font-[family-name:var(--font-code)] uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
        {resource.linguagem && <LanguageBadge language={resource.linguagem} />}
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-headline)] text-lg font-semibold text-white mb-2 line-clamp-1">
        {resource.titulo}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
        {resource.descricao}
      </p>

      {/* Bottom: Counter + CTA */}
      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
        <DownloadCounter count={downloadCount} />
        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-1.5 bg-primary text-black text-xs font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider hover:bg-primary/80 transition-colors cursor-pointer"
        >
          {isAuthenticated ? "Baixar" : "Faça login"}
        </button>
      </div>
    </GlassCard>
  );
}