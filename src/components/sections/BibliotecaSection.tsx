"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ResourceCard } from "@/components/biblioteca/ResourceCard";
import { ResourceGrid, EmptyState } from "@/components/biblioteca/ResourceGrid";

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

const tabs = [
  { id: "codigos", label: "Códigos" },
  { id: "bibliotecas", label: "Bibliotecas" },
  { id: "materiais", label: "Materiais de Curso" },
];

export function BibliotecaSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("codigos");
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth status
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("[BibliotecaSection] Auth check result:", data);
        setIsAuthenticated(!!data.user);
      })
      .catch((err) => {
        console.error("[BibliotecaSection] Auth check error:", err);
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/biblioteca?categoria=${activeTab}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("[BibliotecaSection] API response:", data);
        if (data.success) {
          // Validate downloadCount for each resource
          const validatedResources = (data.data || []).map((r: any) => ({
            ...r,
            downloadCount: typeof r.downloadCount === 'number' && !isNaN(r.downloadCount) ? r.downloadCount : 0
          }));
          setResources(validatedResources);
        } else {
          setError(data.error || "Erro ao carregar recursos");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Erro ao carregar recursos. Tente novamente.");
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleDownload = async (id: string) => {
    console.log("[BibliotecaSection] handleDownload called, id:", id, "isAuthenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
      console.log("[BibliotecaSection] Not authenticated, redirecting to login");
      router.push("/login?returnUrl=#biblioteca");
      return;
    }

    try {
      console.log("[BibliotecaSection] Making download request for:", id);
      const res = await fetch(`/api/biblioteca/${id}/download`, {
        method: "POST",
        credentials: "include",
      });
      console.log("[BibliotecaSection] Download response status:", res.status);
      
      const data = await res.json();
      console.log("[BibliotecaSection] Download response data:", data);
      
      if (res.status === 401 || data.error === "auth_required") {
        console.log("[BibliotecaSection] Auth required, redirecting to login");
        router.push("/login?returnUrl=#biblioteca");
        return;
      }
      
      if (data.success && (data.data?.externalUrl || data.externalUrl)) {
        const externalUrl = data.data?.externalUrl || data.externalUrl;
        console.log("[BibliotecaSection] Opening external URL:", externalUrl);
        window.open(externalUrl, "_blank");
        // Refresh count
        setResources((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r
          )
        );
      } else if (data.error) {
        console.error("[BibliotecaSection] Download error:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("[BibliotecaSection] Download exception:", error);
      alert("Erro ao baixar recurso");
    }
  };

  return (
    <section
      id="biblioteca"
      className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto border-t border-border-gray bg-[#0D0D0D]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-block px-4 py-1 border border-primary/50 text-secondary-text font-[family-name:var(--font-code)] text-xs rounded-full mb-4">
            BIBLIOTECA_DE_RECURSOS
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-4xl font-bold text-white">
            Biblioteca de Códigos &{" "}
            <em className="text-primary">Materiais</em>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Acesse códigos, bibliotecas e materiais de curso desenvolvidos pela comunidade EPRA.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex gap-1 p-1 bg-surface-container border border-outline-variant">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 font-[family-name:var(--font-headline)] text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-black"
                    : "text-zinc-400 hover:text-white hover:bg-surface-variant"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-16 text-zinc-500">Carregando recursos...</div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-wire-red mb-2">Erro ao carregar recursos. Tente novamente.</p>
          </div>
        ) : resources.length === 0 ? (
          <ResourceGrid>
            <EmptyState />
          </ResourceGrid>
        ) : (
          <ResourceGrid>
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDownload={handleDownload}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </ResourceGrid>
        )}
      </motion.div>
    </section>
  );
}