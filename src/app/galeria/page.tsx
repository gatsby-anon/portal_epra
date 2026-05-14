"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Maximize2, X, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { hasPermission } = useAuth();
  const canManage = hasPermission(["ORIENTADOR", "ALUNO_INTERNO"]);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch gallery images", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setImages(images.filter((img) => img.id !== id));
      } else {
        alert(data.error || "Erro ao excluir imagem");
      }
    } catch (err) {
      alert("Erro de conexão ao excluir imagem");
    }
  };

  const handleAdd = async () => {
    const url = prompt("Insira a URL da imagem (ou caminho relativo em /images/gallery/):");
    if (!url) return;
    const alt = prompt("Insira uma descrição (opcional):") || "";

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });
      const data = await res.json();
      if (data.success) {
        setImages([data.data, ...images]);
      } else {
        alert(data.error || "Erro ao adicionar imagem");
      }
    } catch (err) {
      alert("Erro de conexão ao adicionar imagem");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <SectionWrapper>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary-container" />
                <span className="font-[family-name:var(--font-code)] text-primary-container text-xs tracking-[0.3em] uppercase">
                  EPRA_VISUAL_ARCHIVE
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">
                Galeria de <span className="text-primary-container">Projetos</span>
              </h1>
            </div>

            {canManage && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/50 text-primary-container px-6 py-3 font-[family-name:var(--font-headline)] tracking-tight uppercase text-sm font-semibold hover:bg-primary-container/20 transition-all active:scale-95 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                Adicionar Imagem
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-zinc-500">
              <Loader2 className="animate-spin mb-4 text-primary" size={40} />
              <p className="font-[family-name:var(--font-code)] uppercase tracking-widest text-sm">Escaneando Arquivos...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-40 border border-zinc-800 bg-zinc-900/20 rounded-lg">
              <ImageIcon className="mx-auto mb-4 text-zinc-700" size={48} />
              <p className="text-zinc-500 font-[family-name:var(--font-headline)]">Nenhuma imagem encontrada no arquivo.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid"
                >
                  <GlassCard
                    className="group relative overflow-hidden cursor-zoom-in border-white/5 hover:border-primary/30 transition-all duration-500"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || "Galeria EPRA"}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-end gap-2">
                        {canManage && (
                          <button
                            onClick={(e) => handleDelete(image.id, e)}
                            className="p-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/40 transition-colors rounded-md"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <div className="p-2 bg-primary/20 border border-primary/50 text-primary rounded-md">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                      
                      {image.alt && (
                        <p className="text-white font-[family-name:var(--font-code)] text-xs uppercase tracking-wider line-clamp-2 bg-black/40 p-2 backdrop-blur-sm border-l-2 border-primary">
                          {image.alt}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </SectionWrapper>
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 p-3 text-white hover:text-primary transition-colors z-[101]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full p-1 bg-primary/30 rounded-sm shadow-[0_0_30px_rgba(177,211,92,0.2)]">
                <div className="relative w-full h-full overflow-hidden border border-primary/50">
                   <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt || "Galeria EPRA"}
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                  
                  {/* Neon Border Effect */}
                  <div className="absolute inset-0 pointer-events-none border-[1px] border-primary animate-pulse-glow opacity-50" />
                </div>
                
                {selectedImage.alt && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 text-white">
                    <p className="font-[family-name:var(--font-code)] text-sm uppercase tracking-widest border-l-2 border-primary pl-4">
                      {selectedImage.alt}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
