'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Challenge {
  id: string;
  titulo: string;
  descricao: string;
  dataLimite: string;
  urlGithub: string | null;
  instrutor: string;
  _count: { submissions: number };
  isOpen: boolean;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const challengeId = params.id as string;

  useEffect(() => {
    fetch(`/api/challenges/${challengeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setChallenge(data.data);
        else setError(data.error);
      })
      .catch(() => setError('Erro ao carregar desafio'))
      .finally(() => setLoading(false));
  }, [challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    if (!githubRegex.test(githubUrl)) {
      setError('URL deve seguir o formato: https://github.com/owner/repo');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ githubUrl, observacoes }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Solução submetida com sucesso!');
        setGithubUrl('');
        setObservacoes('');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Erro ao submeter solução');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!challenge) return <div className="p-8 text-center text-[#ffb4ab]">Desafio não encontrado</div>;

  const isOpen = challenge.isOpen;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button 
          onClick={() => router.back()}
          className="text-[#b1d35c] hover:text-[#b1d35c]/80 mb-6 font-[family-name:var(--font-headline)]"
        >
          ← Voltar
        </button>

        <div className="border border-[#3A3A3A] rounded-lg p-8 bg-[#1A1C1C]">
          <div className="flex justify-between items-start mb-6">
            <h1 className="font-[family-name:var(--font-headline)] text-3xl font-bold">
              {challenge.titulo}
            </h1>
            <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${
              isOpen 
                ? 'bg-[#b1d35c]/10 text-[#b1d35c] border border-[#b1d35c]/30' 
                : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30'
            }`}>
              {isOpen ? 'Aberto' : 'PRAZO EXPIRADO'}
            </span>
          </div>

          <div className="mb-8">
            <p className="whitespace-pre-wrap font-[family-name:var(--font-code)] text-gray-300">
              {challenge.descricao}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm font-[family-name:var(--font-code)]">
            <div>
              <span className="text-gray-500">Prazo:</span>
              <span className="ml-2 text-white">{formatDate(challenge.dataLimite)}</span>
            </div>
            <div>
              <span className="text-gray-500">Instrutor:</span>
              <span className="ml-2 text-white">{challenge.instrutor}</span>
            </div>
            {challenge.urlGithub && (
              <div className="col-span-2">
                <span className="text-gray-500">Repositório:</span>
                <a 
                  href={challenge.urlGithub} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-[#b1d35c] hover:underline"
                >
                  {challenge.urlGithub}
                </a>
              </div>
            )}
            <div>
              <span className="text-gray-500">Submissões:</span>
              <span className="ml-2 text-white">{challenge._count.submissions}</span>
            </div>
          </div>

          {isOpen ? (
            <div className="border-t border-[#3A3A3A] pt-6">
              <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold mb-4 text-[#b1d35c]">
                Submeter Solução
              </h2>
              
              {!isAuthenticated ? (
                <div className="text-center py-6 bg-[#0D0D0D] rounded-lg">
                  <p className="text-gray-400 mb-4">Você precisa estar logado para submeter</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-6 py-2 bg-[#b1d35c] text-black font-bold rounded hover:bg-opacity-80"
                  >
                    Fazer Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#3A3A3A]">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-[family-name:var(--font-code)]">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={user?.fullName || ''}
                        readOnly
                        className="w-full p-2 bg-[#1A1C1C] border border-[#3A3A3A] rounded text-gray-300 font-[family-name:var(--font-code)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-[family-name:var(--font-code)]">
                        Curso
                      </label>
                      <input
                        type="text"
                        value={user?.course || 'Não informado'}
                        readOnly
                        className="w-full p-2 bg-[#1A1C1C] border border-[#3A3A3A] rounded text-gray-300 font-[family-name:var(--font-code)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-[family-name:var(--font-code)]">
                      Observações
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Descreva sua solução..."
                      rows={4}
                      className="w-full p-3 bg-[#0D0D0D] border border-[#3A3A3A] rounded text-white font-[family-name:var(--font-code)] focus:border-[#b1d35c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-[family-name:var(--font-code)]">
                      Link Repositório GitHub
                    </label>
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="w-full p-3 bg-[#0D0D0D] border border-[#3A3A3A] rounded text-white font-[family-name:var(--font-code)] focus:border-[#b1d35c] focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cole a URL do seu repositório com a solução
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 rounded text-[#ffb4ab] text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-[#b1d35c]/10 border border-[#b1d35c]/30 rounded text-[#b1d35c] text-sm">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !githubUrl}
                    className="w-full py-3 bg-[#b1d35c] text-black font-bold uppercase rounded hover:bg-opacity-90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Submetendo...' : 'Enviar Solução'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="border-t border-[#3A3A3A] pt-6 text-center py-6 bg-[#0D0D0D]/50 rounded-lg">
              <p className="text-[#ffb4ab] font-bold uppercase mb-2">PRAZO EXPIRADO</p>
              <p className="text-gray-400">Este desafio não está mais disponível para submissão.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}