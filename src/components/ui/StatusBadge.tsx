import { colorMaps } from "@/components/ui/colorMaps";

interface StatusBadgeProps {
  label: string;
  color?: string;
}

export function StatusBadge({ label, color = "neon-green" }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 clipped-corner-hover cursor-default">
      <span
        className={`w-2 h-2 rounded-full ${colorMaps.bg[color] || "bg-neon-green"} shadow-[0_0_12px_rgba(164,198,57,1)] animate-pulse`}
      />
      <span className="text-[10px] font-[family-name:var(--font-code)] uppercase tracking-[0.2em] text-secondary-text">
        {label}
      </span>
    </div>
  );
}
