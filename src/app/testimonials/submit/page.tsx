"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";

export default function SubmitTestimonialPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    comment: "",
    lgpdConsent: false,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!isAuthenticated) {
    router.push("/login?redirect=/testimonials/submit");
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.role.trim() || !form.comment.trim()) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (!form.lgpdConsent) {
      setError("Você deve aceitar os termos de uso dos dados");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", `Nome: ${form.name}\nCargo: ${form.role}\n\n${form.comment}`);
      formData.append("lgpdConsent", "true");
      if (photoFile) {
        formData.append("photoUrl", photoPreview || "");
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          text: `Nome: ${form.name}\nCargo: ${form.role}\n\n${form.comment}`,
          photoUrl: photoPreview,
          lgpdConsent: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar depoimento");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/testimonials"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar depoimento");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 border border-neon-green flex items-center justify-center">
            <svg className="w-10 h-10 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-headline)]">
            Depoimento Enviado!
          </h1>
          <p className="text-zinc-400 mb-8">
            Seu depoimento foi enviado para análise e será publicado após aprovação.
          </p>
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="bg-primary text-on-primary px-6 py-3 font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider hover:opacity-90"
          >
            Voltar ao Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20 px-6">
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-headline)] mb-2">
            Compartilhe Sua História
          </h1>
          <p className="text-zinc-400">
            Conte sua experiência com o EPRA
          </p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-light-gray mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none font-[family-name:var(--font-body)]"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm text-light-gray mb-2">
                Cargo/Empresa *
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none font-[family-name:var(--font-body)]"
                placeholder="Ex: Engenheiro de Software @ Empresa"
              />
            </div>

            <div>
              <label className="block text-sm text-light-gray mb-2">
                Seu Depoimento *
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={6}
                className="w-full bg-[#0D0D0D] border border-border-gray p-3 text-white focus:border-primary focus:outline-none font-[family-name:var(--font-body)] resize-none"
                placeholder="Conte sua experiência..."
              />
            </div>

            <div>
              <label className="block text-sm text-light-gray mb-2">
                Foto (opcional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer border border-dashed border-border-gray p-4 hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <span className="text-zinc-500 text-sm">Clique para selecionar</span>
                </label>
                {photoPreview && (
                  <div className="w-16 h-16 rounded overflow-hidden border border-primary/40">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4">
              <input
                type="checkbox"
                id="lgpdConsent"
                checked={form.lgpdConsent}
                onChange={(e) => setForm({ ...form, lgpdConsent: e.target.checked })}
                className="mt-1 w-4 h-4 accent-primary"
              />
              <label htmlFor="lgpdConsent" className="text-sm text-zinc-400">
                Eu concordo que meu depoimento seja exibido no site do EPRA conforme LGPD. *
              </label>
            </div>

            {error && (
              <p className="text-wire-red text-sm">{error}</p>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-on-primary px-8 py-3 font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar Depoimento"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="border border-border-gray text-light-gray px-8 py-3 font-[family-name:var(--font-headline)] font-bold uppercase tracking-wider hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}