"use client";

import { Terminal, Code2, Cpu } from "lucide-react";
import content from "@/data/content.json";

export function Footer() {
  const { footer } = content;

  return (
    <footer className="w-full border-t border-border-gray bg-[#0D0D0D]">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-12 py-16 gap-12 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <div className="space-y-6 max-w-sm">
          <div className="font-black text-primary-container text-2xl font-[family-name:var(--font-headline)] tracking-widest">
            {footer.brand}
          </div>
          <p className="font-[family-name:var(--font-code)] text-[10px] tracking-wider text-zinc-500 uppercase leading-loose">
            {footer.description}
          </p>
          <div className="flex gap-4">
            <Terminal
              size={20}
              className="text-primary-container/60 hover:text-white cursor-pointer transition-opacity opacity-80 hover:opacity-100"
            />
            <Code2
              size={20}
              className="text-primary-container/60 hover:text-white cursor-pointer transition-opacity opacity-80 hover:opacity-100"
            />
            <Cpu
              size={20}
              className="text-primary-container/60 hover:text-white cursor-pointer transition-opacity opacity-80 hover:opacity-100"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase font-light text-zinc-400">
              CONTATO
            </div>
            <nav className="flex flex-col gap-2">
              <a
                href={`mailto:${footer.contact.email}`}
                className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-white transition-opacity opacity-80 hover:opacity-100"
              >
                <b>{footer.contact.email}</b>
              </a>
              <span className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase text-gray-500">
                {footer.contact.phone}
              </span>
              <span className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase text-gray-500">
                {footer.contact.campus}
                <br />
                {footer.contact.city}
              </span>
            </nav>
          </div>

          <div className="space-y-4">
            <div className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase font-light text-zinc-400">
              LOCALIZAÇÃO
            </div>
            <div className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase text-gray-500">
              {footer.location.address}
              <br />
              {footer.location.region}
              <br />
              {footer.location.sector}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-gray px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-[family-name:var(--font-headline)] text-[10px] tracking-[0.2em] uppercase font-light text-gray-500">
          {footer.copyright}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-[family-name:var(--font-code)] text-secondary-text">
            {footer.status}
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-primary" />
            <div className="w-1 h-3 bg-primary" />
            <div className="w-1 h-3 bg-primary/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
