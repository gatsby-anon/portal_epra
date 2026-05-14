"use client";

import Image from "next/image";
import Link from "next/link";
import { Code, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  technologies: string[];
  repositoryLink?: string | null;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  featured?: boolean;
  className?: string;
}

export function PortfolioCard({ item, featured = false, className = "" }: PortfolioCardProps) {
  const image = item.images[0] || "/placeholder-portfolio.jpg";

  return (
    <GlassCard 
      className={`overflow-hidden relative group cursor-pointer h-full min-h-[300px] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      } ${className}`}
    >
      <Link href={`/portfolio/${item.slug}`} className="block w-full h-full relative">
        <Image
          src={image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-[10px] px-2 py-0.5 bg-black/50 border border-primary/30 text-primary font-[family-name:var(--font-code)] uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <h4 className={`font-[family-name:var(--font-headline)] font-semibold text-white ${
            featured ? "text-2xl" : "text-lg"
          }`}>
            {item.title}
          </h4>
          
          {featured && (
            <p className="text-sm text-zinc-400 mt-2 line-clamp-2 max-w-md">
              {item.description}
            </p>
          )}

          {item.repositoryLink && (
            <div className="mt-3 flex items-center gap-2 text-primary/80 group-hover:text-primary transition-colors">
               <Code size={14} />
               <span className="text-[10px] font-bold uppercase tracking-wider">Repository</span>
               <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>
          )}
        </div>
      </Link>
    </GlassCard>
  );
}
