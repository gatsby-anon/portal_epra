"use client";

import { ReactNode } from "react";

interface ResourceGridProps {
  children: ReactNode;
}

export function ResourceGrid({ children }: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="col-span-full py-16 text-center">
      <p className="font-[family-name:var(--font-headline)] text-xl text-zinc-500 mb-2">
        Nenhum recurso disponível
      </p>
      <p className="text-sm text-zinc-600">
        Não há recursos nesta categoria ainda.
      </p>
    </div>
  );
}