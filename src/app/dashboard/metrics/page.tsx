"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ImpactMetrics {
  id: string;
  totalStudents: number;
  projectsCompleted: number;
  hardwareKits: number;
  communityReach: number;
  updatedAt: string;
}

export default function MetricsAdminPage() {
  const { user, hasPermission } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    totalStudents: 0,
    projectsCompleted: 0,
    hardwareKits: 0,
    communityReach: 0,
  });

  useEffect(() => {
    if (!hasPermission(["ORIENTADOR", "ALUNO_INTERNO"])) {
      router.push("/dashboard");
      return;
    }

    fetch("/api/metrics", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics(data.metrics);
          setForm({
            totalStudents: data.metrics.totalStudents,
            projectsCompleted: data.metrics.projectsCompleted,
            hardwareKits: data.metrics.hardwareKits,
            communityReach: data.metrics.communityReach,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hasPermission, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500">Carregando...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-headline)] text-2xl text-white mb-2">
          Métricas de Impacto
        </h1>
        <p className="text-zinc-500">Editar métricas exibidas na homepage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm text-light-gray mb-2">
            Total de Alunos
          </label>
          <input
            type="number"
            value={form.totalStudents}
            onChange={(e) =>
              setForm({ ...form, totalStudents: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-light-gray mb-2">
            Projetos Concluídos
          </label>
          <input
            type="number"
            value={form.projectsCompleted}
            onChange={(e) =>
              setForm({ ...form, projectsCompleted: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-light-gray mb-2">
            Kits de Hardware
          </label>
          <input
            type="number"
            value={form.hardwareKits}
            onChange={(e) =>
              setForm({ ...form, hardwareKits: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-light-gray mb-2">
            Comunidade Atendida
          </label>
          <input
            type="number"
            value={form.communityReach}
            onChange={(e) =>
              setForm({ ...form, communityReach: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-on-primary px-6 py-3 font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Métricas"}
        </button>
      </form>
    </div>
  );
}