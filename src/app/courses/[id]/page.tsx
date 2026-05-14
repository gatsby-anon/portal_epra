"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import type { CourseWithAvailability } from "@/types/course";

export default function CourseDetailPage() {
  const [course, setCourse] = useState<CourseWithAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourse(data.data);
        } else {
          router.push('/#courses');
        }
      })
      .catch(() => router.push('/#courses'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?returnTo=/courses/${id}`);
      return;
    }

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: id }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Inscrição confirmada: Você já está garantido neste curso.' });
        if (course) {
          setCourse({
            ...course,
            enrollmentCount: course.enrollmentCount + 1,
            isOpen: course.enrollmentCount + 1 < course.vagas && new Date(course.dataLimite) > new Date()
          });
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro no processamento: Tente novamente em alguns instantes.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro no processamento: Tente novamente em alguns instantes.' });
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-light-gray font-[family-name:var(--font-body)]">
        <Header />
        <main className="container mx-auto px-4 py-24 flex justify-center items-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 bg-surface-container rounded-full"></div>
            <div className="space-y-3">
              <div className="h-4 w-[200px] bg-surface-container rounded"></div>
              <div className="h-4 w-[150px] bg-surface-container rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="bg-background min-h-screen text-light-gray font-[family-name:var(--font-body)] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/#courses')}
            className="text-zinc-400 hover:text-white mb-8 transition-colors text-sm flex items-center gap-2"
          >
            &larr; Voltar aos Cursos
          </button>

          {message && (
            <div className={`mb-8 p-4 border text-sm ${
              message.type === 'success' 
                ? 'border-[#b1d35c] text-[#b1d35c] bg-[#b1d35c]/10' 
                : 'border-error text-error bg-error/10'
            }`}>
              {message.text}
            </div>
          )}

          <div className="border border-border-gray bg-surface-container/50 p-8 md:p-12 relative overflow-hidden">
            {/* Cyberpunk accent lines */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#b1d35c] to-transparent opacity-50" />
            <div className="absolute top-0 left-0 w-[2px] h-32 bg-gradient-to-b from-[#b1d35c] to-transparent opacity-50" />

            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-5xl text-white font-bold leading-tight">
                {course.titulo}
              </h1>
              
              <span className={`px-3 py-1.5 text-xs font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] border ${
                course.isOpen 
                  ? "bg-[#b1d35c]/10 text-[#b1d35c] border-[#b1d35c]/30" 
                  : "bg-error/10 text-error border-error/30"
              }`}>
                {course.isOpen ? "INSCRIÇÕES ABERTAS" : "INSCRIÇÕES ENCERRADAS"}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="font-[family-name:var(--font-headline)] text-white text-lg mb-3">Sobre o Curso</h3>
                  <p className="text-light-gray leading-relaxed whitespace-pre-wrap">
                    {course.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Carga Horária</h4>
                    <p className="text-white text-lg font-medium">{course.cargaHoraria}h</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Horário</h4>
                    <p className="text-white text-lg font-medium">{course.horario}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Instrutor</h4>
                    <p className="text-white text-lg font-medium">{course.instrutor}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Vagas</h4>
                    <p className="text-white text-lg font-medium">{course.enrollmentCount}/{course.vagas} preenchidas</p>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 border border-border-gray p-6 flex flex-col justify-between h-full min-h-[250px]">
                <div>
                  <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Prazo de Inscrição</h4>
                  <p className="text-white font-medium text-lg">
                    {new Date(course.dataLimite).toLocaleDateString('pt-BR')}
                  </p>
                  
                  {!course.isOpen && (
                    <div className="mt-6 text-sm text-error/80">
                      {course.enrollmentCount >= course.vagas 
                        ? "Todas as vagas para este curso já foram preenchidas."
                        : "O prazo para inscrições já se encerrou."}
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button 
                    onClick={handleEnroll}
                    disabled={!course.isOpen}
                    className={`w-full py-4 px-6 font-[family-name:var(--font-headline)] text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
                      !course.isOpen 
                        ? "bg-surface-container text-outline cursor-not-allowed border border-border-gray" 
                        : "bg-[#b1d35c] text-black hover:bg-[#c4e56b]"
                    }`}
                  >
                    {course.isOpen 
                      ? "Inscrever-se Agora" 
                      : (course.enrollmentCount >= course.vagas ? "Vagas Esgotadas" : "Inscrições Encerradas")}
                  </button>
                  
                  {course.isOpen && !user && (
                    <p className="text-center text-xs text-zinc-500 mt-3">
                      Você será redirecionado para fazer login
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
