"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Testimonial {
  id: string;
  text: string;
  photoUrl?: string | null;
  status: string;
  user: {
    id: string;
    fullName: string;
    course?: string | null;
  };
  createdAt: string;
}

export default function TestimonialsAdminPage() {
  const { user, hasPermission } = useAuth();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const userRole = user?.role;
    if (userRole !== "ORIENTADOR" && userRole !== "ALUNO_INTERNO") {
      router.push("/dashboard");
      return;
    }

    fetch("/api/testimonials?all=true", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  const pending = testimonials.filter((t) => t.status === "PENDING");
  const approved = testimonials.filter((t) => t.status === "APPROVED");
  const rejected = testimonials.filter((t) => t.status === "REJECTED");

  if (loading) {
    return (
      <div className="p-8 text-zinc-500">Carregando...</div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-headline)] text-2xl text-white mb-2">
          Depoimentos
        </h1>
        <p className="text-zinc-500">Aprovar ou rejeitar depoimentos enviados</p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-sm text-vibrant-yellow mb-4">
            PENDENTES ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((t) => (
              <div key={t.id} className="bg-surface-container-low border border-border-gray p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-white mb-2">{t.text}</p>
                    <p className="text-xs text-zinc-500">
                      {t.user.fullName} — {t.user.course || "Aluno"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(t.id, "APPROVED")}
                      disabled={updating === t.id}
                      className="bg-neon-green/20 text-neon-green px-3 py-1 text-sm hover:bg-neon-green/30 disabled:opacity-50"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatus(t.id, "REJECTED")}
                      disabled={updating === t.id}
                      className="bg-wire-red/20 text-wire-red px-3 py-1 text-sm hover:bg-wire-red/30 disabled:opacity-50"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-[family-name:var(--font-headline)] text-sm text-neon-green mb-4">
          APROVADOS ({approved.length})
        </h2>
        <div className="space-y-2">
          {approved.map((t) => (
            <div key={t.id} className="bg-surface-container-low border border-border-gray/50 p-3 text-sm">
              <p className="text-white">{t.text}</p>
              <p className="text-xs text-zinc-600">{t.user.fullName}</p>
            </div>
          ))}
          {approved.length === 0 && <p className="text-zinc-600">Nenhum</p>}
        </div>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-headline)] text-sm text-wire-red mb-4">
          REJEITADOS ({rejected.length})
        </h2>
        <div className="space-y-2">
          {rejected.map((t) => (
            <div key={t.id} className="bg-surface-container-low border border-border-gray/30 p-3 text-sm opacity-60">
              <p className="text-white">{t.text}</p>
              <p className="text-xs text-zinc-600">{t.user.fullName}</p>
            </div>
          ))}
          {rejected.length === 0 && <p className="text-zinc-600">Nenhum</p>}
        </div>
      </div>
    </div>
  );
}