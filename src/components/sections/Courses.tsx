"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { colorMaps } from "@/components/ui/colorMaps";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { CourseWithAvailability } from "@/types/course";

export function Courses() {
  const [courses, setCourses] = useState<CourseWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourses(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      router.push(`/login?returnTo=/courses/${courseId}`);
      return;
    }

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Inscrição confirmada: Você já está garantido neste curso.' });
        // Update local state to reflect enrollment
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, enrollmentCount: c.enrollmentCount + 1 } : c
        ));
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro no processamento: Tente novamente em alguns instantes.' });
      }
      
      // Auto dismiss message
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro no processamento: Tente novamente em alguns instantes.' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <SectionWrapper id="courses">
      <h2 className="font-[family-name:var(--font-headline)] text-3xl font-semibold mb-12 text-center text-white">
        CURSOS_ATIVOS
      </h2>

      {message && (
        <div className={`mb-8 p-4 border text-sm ${
          message.type === 'success' 
            ? 'border-[#b1d35c] text-[#b1d35c] bg-[#b1d35c]/10' 
            : 'border-error text-error bg-error/10'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 bg-surface-container rounded-full"></div>
            <div className="space-y-3">
              <div className="h-4 w-[200px] bg-surface-container rounded"></div>
              <div className="h-4 w-[150px] bg-surface-container rounded"></div>
            </div>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center p-12 border border-border-gray bg-surface-container">
          <h3 className="text-xl font-[family-name:var(--font-headline)] text-white mb-2">Nenhum curso disponível</h3>
          <p className="text-light-gray">Não encontramos cursos abertos no momento. Volte em breve ou entre em contato.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, i) => {
            // Using primary gradient as default for all fetched courses
            const gradientClass = colorMaps.gradient["primary"] || "from-primary/40";
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`flex flex-col relative p-[1px] bg-gradient-to-br ${gradientClass} to-transparent`}
              >
                <div className="bg-background p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    {!course.isOpen ? (
                      <span className="px-2 py-1 text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] bg-surface-container text-outline border border-border-gray">
                        INDISPONÍVEL
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] bg-primary/10 text-primary">
                        ABERTO
                      </span>
                    )}
                    <BadgeCheck size={20} className="text-zinc-600" />
                  </div>

                  <h3 className="font-[family-name:var(--font-headline)] text-xl font-semibold text-white">
                    {course.titulo}
                  </h3>
                  <p className="text-sm text-light-gray flex-1">
                    {course.descricao.length > 100 
                      ? course.descricao.substring(0, 100) + '...' 
                      : course.descricao}
                  </p>

                  <div className="pt-4 border-t border-border-gray flex flex-col gap-3">
                    <span className="text-xs font-[family-name:var(--font-code)] text-zinc-500 mb-2">
                      {course.cargaHoraria}H
                    </span>
                    
                    <div className="flex flex-col gap-2 w-full">
                      <button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={!course.isOpen}
                        className={`w-full py-2 font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
                          !course.isOpen 
                            ? "bg-surface-container text-outline cursor-not-allowed" 
                            : "bg-[#b1d35c] text-black hover:bg-[#c4e56b]"
                        }`}
                      >
                        {!course.isOpen ? "INSCRIÇÕES ENCERRADAS" : "Inscrever-se"}
                      </button>
                      
                      <button 
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="w-full py-2 border border-border-gray font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-white/5 transition-colors"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
