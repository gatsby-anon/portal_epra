'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from "@/components/sections/Header";

interface Opportunity {
  id: string;
  titulo: string;
  descricao: string;
  vagas: number;
  dataLimite: string | null;
  status: 'Open' | 'Closed';
  applicationCount: number;
  isOpen: boolean;
}

export default function VagaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const opportunityId = params.id as string;

  useEffect(() => {
    if (user) {
      setNome(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    fetch(`/api/vagas/${opportunityId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setOpportunity(data.data);
      })
      .catch(() => setMessage({ type: 'error', text: 'Erro ao carregar vaga' }))
      .finally(() => setLoading(false));
  }, [opportunityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!nome || !email || !curso || !semestre || !pdfUrl) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios' });
      return;
    }

    setSubmitting(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isAuthenticated) {
        headers['x-user-id'] = user?.id || '';
        headers['x-user-role'] = user?.role || '';
      }

      const res = await fetch(`/api/vagas/${opportunityId}/candidatar`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ nome, email, curso, semestre, linkedInUrl, pdfUrl, opportunityId }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Candidatura confirmada! Em breve entraremos em contato.' });
        setNome('');
        setEmail('');
        setCurso('');
        setSemestre('');
        setLinkedInUrl('');
        setPdfUrl('');
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar candidatura' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-light-gray">Carregando...</div>;
  if (!opportunity) return <div className="min-h-screen bg-background flex items-center justify-center text-light-gray">Vaga não encontrada</div>;

  return (
    <div className="bg-background min-h-screen text-light-gray font-[family-name:var(--font-body)] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/#recruitment')}
            className="text-zinc-400 hover:text-white mb-8 transition-colors text-sm flex items-center gap-2"
          >
            &larr; Voltar às Vagas
          </button>

          {message && (
            <div className={`mb-8 p-4 border text-sm ${
              message.type === 'success' 
                ? 'border-[#00d4ff] text-[#00d4ff] bg-[#00d4ff]/10' 
                : 'border-error text-error bg-error/10'
            }`}>
              {message.text}
            </div>
          )}

          <div className="border border-border-gray bg-surface-container/50 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-50" />
            <div className="absolute top-0 left-0 w-[2px] h-32 bg-gradient-to-b from-[#00d4ff] to-transparent opacity-50" />

            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-5xl text-white font-bold leading-tight">
                {opportunity.titulo}
              </h1>
              
              <span className={`px-3 py-1.5 text-xs font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] border ${
                opportunity.isOpen 
                  ? "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30" 
                  : "bg-error/10 text-error border-error/30"
              }`}>
                {opportunity.isOpen ? "VAGA ABERTA" : "VAGA FECHADA"}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="font-[family-name:var(--font-headline)] text-white text-lg mb-3">Descrição</h3>
                  <p className="text-light-gray leading-relaxed whitespace-pre-wrap">
                    {opportunity.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Vagas</h4>
                    <p className="text-white text-lg font-medium">{opportunity.applicationCount}/{opportunity.vagas} preenchidas</p>
                  </div>
                  {opportunity.dataLimite && (
                    <div>
                      <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-1">Prazo</h4>
                      <p className="text-white text-lg font-medium">
                        {new Date(opportunity.dataLimite).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background/80 border border-border-gray p-6 flex flex-col justify-between h-full min-h-[250px]">
                <div>
                  <h4 className="text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Informações</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status</span>
                      <span className={opportunity.isOpen ? "text-[#00d4ff]" : "text-error"}>
                        {opportunity.isOpen ? "Aberta" : "Fechada"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Vagas</span>
                      <span className="text-white">{opportunity.vagas}</span>
                    </div>
                  </div>
                </div>

                {opportunity.isOpen ? (
                  <button
                    onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 bg-[#00d4ff] text-black font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] hover:bg-[#00d4ff]/90 transition-colors mt-6"
                  >
                    Candidatar-se
                  </button>
                ) : (
                  <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] mt-6 cursor-not-allowed">
                    Encerrada
                  </button>
                )}
              </div>
            </div>

            {opportunity.isOpen && (
              <div id="application-form" className="mt-16 pt-12 border-t border-border-gray">
                <h3 className="font-[family-name:var(--font-headline)] text-white text-xl mb-6">Formulário de Candidatura</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Curso *</label>
                      <input
                        type="text"
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                        placeholder="Ciência da Computação"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Semestre *</label>
                      <input
                        type="text"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                        placeholder="5º"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">LinkedIn (opcional)</label>
                    <input
                      type="url"
                      value={linkedInUrl}
                      onChange={(e) => setLinkedInUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-code)] text-zinc-500 uppercase tracking-wider mb-2">Link do Currículo (PDF) *</label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border-gray text-white focus:border-[#00d4ff] focus:outline-none"
                      placeholder="Cole o link do seu currículo (Google Drive, LinkedIn, etc.)"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#00d4ff] text-black font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] hover:bg-[#00d4ff]/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Candidatura'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}