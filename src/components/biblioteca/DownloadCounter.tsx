"use client";

import { Download } from "lucide-react";

interface DownloadCounterProps {
  count: number;
}

export function DownloadCounter({ count }: DownloadCounterProps) {
  // Ensure count is always a valid number
  const validCount = typeof count === 'number' && !isNaN(count) && count >= 0 ? count : 0;
  const formattedCount = new Intl.NumberFormat("pt-BR").format(validCount);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Download size={14} className="text-primary" />
      <span className="font-[family-name:var(--font-code)] text-zinc-400">
        {formattedCount}
      </span>
      <span className="text-zinc-500 text-xs">downloads</span>
    </div>
  );
}