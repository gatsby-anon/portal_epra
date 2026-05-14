"use client";

interface LanguageBadgeProps {
  language: string;
}

const languageStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
  cpp: { label: "C++", bg: "bg-[#00d4ff]/10", text: "text-[#00d4ff]", border: "border-[#00d4ff]/30" },
  python: { label: "Python", bg: "bg-[#facc15]/10", text: "text-[#facc15]", border: "border-[#facc15]/30" },
  arduino: { label: "Arduino", bg: "bg-[#22c55e]/10", text: "text-[#22c55e]", border: "border-[#22c55e]/30" },
  html: { label: "HTML/CSS", bg: "bg-[#f97316]/10", text: "text-[#f97316]", border: "border-[#f97316]/30" },
};

export function LanguageBadge({ language }: LanguageBadgeProps) {
  const normalizedLang = language?.toLowerCase();
  const style = languageStyles[normalizedLang] || {
    label: language?.toUpperCase() || "OTHER",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-[family-name:var(--font-code)] uppercase font-bold tracking-wider ${style.bg} ${style.text} border ${style.border}`}
    >
      {style.label}
    </span>
  );
}