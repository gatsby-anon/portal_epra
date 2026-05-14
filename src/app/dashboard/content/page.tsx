"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PlusSquare, GraduationCap, Trophy, BookOpen, Users, Terminal, Edit, Trash2, Download, Check, X, Briefcase, FolderOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dashboardData from "@/data/dashboard-content.json";
import type { CourseWithAvailability } from "@/types/course";

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

const tabs = [
  { id: "courses", label: "Cursos", icon: GraduationCap },
  { id: "challenges", label: "Desafios", icon: Trophy },
  { id: "tutorials", label: "Tutoriais", icon: BookOpen },
  { id: "testimonials", label: "Moderar Depoimentos", icon: Users },
  { id: "vagas", label: "Vagas", icon: Briefcase },
  { id: "biblioteca", label: "Biblioteca", icon: FolderOpen },
  { id: "portfolio", label: "Portfólio", icon: Briefcase },
];

export default function ContentManagerPage() {
  const { user, hasPermission } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'courses';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [pushStatus, setPushStatus] = useState<"IDLE" | "PUSHING" | "SUCCESS">("IDLE");

  const [courses, setCourses] = useState<CourseWithAvailability[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithAvailability | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', cargaHoraria: 0, vagas: 0,
    dataLimite: '', horario: '', instrutor: '',
  });

  // Challenge states
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [challengeFormData, setChallengeFormData] = useState({
    titulo: '', descricao: '', dataLimite: '', urlGithub: '', instrutor: '',
  });

  // Testimonials states
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [updatingTestimonial, setUpdatingTestimonial] = useState<string | null>(null);

  // Vagas states
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isCreatingVaga, setIsCreatingVaga] = useState(false);
  const [vagaFormData, setVagaFormData] = useState({
    titulo: '', descricao: '', vagas: 0, dataLimite: '', status: 'Open' as 'Open' | 'Closed',
  });

  // Biblioteca states
  interface BibliotecaResource {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    linguagem?: string | null;
    tags: string[];
    link: string;
    downloadCount: number;
    createdBy?: string;
  }

  const [bibliotecaResources, setBibliotecaResources] = useState<BibliotecaResource[]>([]);
  const [selectedBiblioteca, setSelectedBiblioteca] = useState<BibliotecaResource | null>(null);
  const [isCreatingBiblioteca, setIsCreatingBiblioteca] = useState(false);
  const [bibliotecaFormData, setBibliotecaFormData] = useState({
    titulo: '', descricao: '', categoria: 'codigos', linguagem: '', tags: '', link: '',
  });

  // Portfolio states
  interface PortfolioItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    images: string[];
    technologies: string[];
    repositoryLink?: string | null;
    authorId: string;
  }

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: '', description: '', images: '', technologies: '', repositoryLink: '',
  });

  const fetchTestimonials = () => {
    setLoadingTestimonials(true);
    fetch('/api/testimonials?all=true', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTestimonials(data.testimonials || []);
        setLoadingTestimonials(false);
      })
      .catch(() => setLoadingTestimonials(false));
  };

  const handleTestimonialStatus = async (id: string, status: string) => {
    setUpdatingTestimonial(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      if (res.ok) {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    } finally {
      setUpdatingTestimonial(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Excluir Depoimento: Tem certeza?")) {
      try {
        const res = await fetch(`/api/testimonials/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          setTestimonials(prev => prev.filter(t => t.id !== id));
        }
      } catch (error) {
        alert("Erro ao deletar");
      }
    }
  };

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab')!);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'courses') {
      fetch('/api/courses', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { if (data.success) setCourses(data.data); })
        .catch(err => console.error('courses error:', err));
    } else if (activeTab === 'challenges') {
      const reqId = Date.now();
      console.log('[Content] Fetching challenges, reqId:', reqId);
      fetch('/api/challenges', { credentials: 'include' })
        .then(res => {
          console.log('[Content] Challenges status:', res.status, 'reqId:', reqId);
          if (!res.ok) {
            console.error('[Content] Challenges failed with status:', res.status, 'reqId:', reqId);
            return null;
          }
          return res.json();
        })
        .then(data => { 
          console.log('[Content] Challenges data:', data, 'reqId:', reqId);
          if (data?.success) setChallenges(data.data); 
        })
        .catch(err => console.error('[Content] challenges error:', err));
    } else if (activeTab === 'testimonials') {
      fetchTestimonials();
    } else if (activeTab === 'vagas') {
      fetch('/api/vagas', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { if (data.success) setOpportunities(data.data); });
    } else if (activeTab === 'biblioteca') {
      fetch('/api/biblioteca', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { if (data.success) setBibliotecaResources(data.data || []); })
        .catch(err => console.error('biblioteca error:', err));
    } else if (activeTab === 'portfolio') {
      fetch('/api/portfolio', { credentials: 'include' })
        .then(res => res.json())
        .then(data => { if (data.success) setPortfolioItems(data.data || []); })
        .catch(err => console.error('portfolio error:', err));
    }
  }, [activeTab]);

  if (!hasPermission(["ALUNO_INTERNO", "ORIENTADOR"])) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="font-[family-name:var(--font-headline)] text-2xl text-error mb-2">ACESSO NEGADO</h1>
        <p className="font-[family-name:var(--font-code)] text-sm text-gray-500">Privilégios insuficientes para acessar o Content_Manager.</p>
      </div>
    );
  }

  const handlePush = () => {
    setPushStatus("PUSHING");
    setTimeout(() => {
      setPushStatus("SUCCESS");
      setTimeout(() => setPushStatus("IDLE"), 2000);
    }, 1000);
  };

  const handleCreateOrEdit = async () => {
    const url = isCreating ? '/api/courses' : `/api/courses/${selectedCourse?.id}`;
    const method = isCreating ? 'POST' : 'PUT';

    const payload = {
      ...formData,
      cargaHoraria: Number(formData.cargaHoraria),
      vagas: Number(formData.vagas),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        setSelectedCourse(null);
        fetch('/api/courses', { credentials: 'include' })
          .then(res => res.json())
          .then(data => { if (data.success) setCourses(data.data); });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao salvar curso");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir Curso: Tem certeza que deseja remover este curso permanentemente?")) {
      try {
        const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCourses(courses.filter(c => c.id !== id));
        }
      } catch (error) {
        alert("Erro ao deletar curso");
      }
    }
  };

  // Challenge handlers
  const handleCreateOrEditChallenge = async () => {
    const url = isCreatingChallenge ? '/api/challenges' : `/api/challenges/${selectedChallenge?.id}`;
    const method = isCreatingChallenge ? 'POST' : 'PUT';

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeFormData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingChallenge(false);
        setSelectedChallenge(null);
        fetch('/api/challenges', { credentials: 'include' })
          .then(res => res.json())
          .then(data => { if (data.success) setChallenges(data.data); });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao salvar desafio");
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (confirm("Excluir Desafio: Tem certeza que deseja remover este desafio permanentemente?")) {
      try {
        const headers: Record<string, string> = {};
        if (user?.role) {
          headers['x-user-role'] = user.role;
        }
        
        const res = await fetch(`/api/challenges/${id}`, { 
          method: 'DELETE',
          credentials: 'include',
          headers,
        });
        if (res.ok) {
          setChallenges(challenges.filter(c => c.id !== id));
        } else {
          const data = await res.json();
          alert(data.error || 'Erro ao deletar');
        }
      } catch (error) {
        alert("Erro ao deletar desafio");
      }
    }
  };

  // Vagas handlers
  const handleCreateOrEditVaga = async () => {
    const url = isCreatingVaga ? '/api/vagas' : `/api/vagas/${selectedOpportunity?.id}`;
    const method = isCreatingVaga ? 'POST' : 'PUT';

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(vagaFormData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingVaga(false);
        setSelectedOpportunity(null);
        fetch('/api/vagas', { credentials: 'include' })
          .then(res => res.json())
          .then(data => { if (data.success) setOpportunities(data.data); });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao salvar vaga");
    }
  };

  const handleDeleteVaga = async (id: string) => {
    if (confirm("Excluir Vaga: Tem certeza que deseja remover esta vaga permanentemente?")) {
      try {
        const headers: Record<string, string> = {};
        if (user?.role) {
          headers['x-user-role'] = user.role;
        }
        
        const res = await fetch(`/api/vagas/${id}`, { 
          method: 'DELETE',
          credentials: 'include',
          headers,
        });
        if (res.ok) {
          setOpportunities(opportunities.filter(o => o.id !== id));
        } else {
          const data = await res.json();
          alert(data.error || 'Erro ao deletar');
        }
      } catch (error) {
        alert("Erro ao deletar vaga");
      }
    }
  };

  const handleExportVaga = async (vagaId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      
      const res = await fetch(`/api/vagas/${vagaId}/export`, {
        credentials: 'include',
        headers,
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Erro ao exportar');
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vagas-candidatos.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Erro ao exportar CSV');
    }
  };

  const openEditVaga = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsCreatingVaga(false);
    setVagaFormData({
      titulo: opp.titulo,
      descricao: opp.descricao,
      vagas: opp.vagas,
      dataLimite: opp.dataLimite ? new Date(opp.dataLimite).toISOString().slice(0, 10) : '',
      status: opp.status,
    });
  };

  // Biblioteca CRUD handlers
  const handleCreateOrEditBiblioteca = async () => {
    const url = isCreatingBiblioteca ? '/api/biblioteca' : `/api/biblioteca/${selectedBiblioteca?.id}`;
    const method = isCreatingBiblioteca ? 'POST' : 'PUT';

    const tagsArray = bibliotecaFormData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      titulo: bibliotecaFormData.titulo,
      descricao: bibliotecaFormData.descricao,
      categoria: bibliotecaFormData.categoria,
      linguagem: bibliotecaFormData.linguagem || null,
      tags: tagsArray,
      link: bibliotecaFormData.link,
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingBiblioteca(false);
        setSelectedBiblioteca(null);
        fetch('/api/biblioteca', { credentials: 'include' })
          .then(res => res.json())
          .then(data => { if (data.success) setBibliotecaResources(data.data || []); });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao salvar recurso");
    }
  };

  const handleDeleteBiblioteca = async (id: string) => {
    if (confirm("Excluir Recurso: Tem certeza que deseja remover este recurso permanentemente?")) {
      try {
        const headers: Record<string, string> = {};
        if (user?.role) {
          headers['x-user-role'] = user.role;
        }

        const res = await fetch(`/api/biblioteca/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers,
        });
        if (res.ok) {
          setBibliotecaResources(bibliotecaResources.filter(r => r.id !== id));
        } else {
          const data = await res.json();
          alert(data.error || 'Erro ao deletar');
        }
      } catch (error) {
        alert("Erro ao deletar recurso");
      }
    }
  };

  const openEditBiblioteca = (resource: BibliotecaResource) => {
    setSelectedBiblioteca(resource);
    setIsCreatingBiblioteca(false);
    setBibliotecaFormData({
      titulo: resource.titulo,
      descricao: resource.descricao,
      categoria: resource.categoria,
      linguagem: resource.linguagem || '',
      tags: resource.tags?.join(', ') || '',
      link: resource.link,
    });
  };

  // Portfolio handlers
  const handleCreateOrEditPortfolio = async () => {
    const url = isCreatingPortfolio ? '/api/portfolio' : `/api/portfolio/${selectedPortfolio?.slug}`;
    const method = isCreatingPortfolio ? 'POST' : 'PUT';

    const imagesArray = portfolioFormData.images
      .split('\n')
      .map(img => img.trim())
      .filter(img => img.length > 0);

    const techArray = portfolioFormData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: portfolioFormData.title,
      description: portfolioFormData.description,
      images: imagesArray,
      technologies: techArray,
      repositoryLink: portfolioFormData.repositoryLink || null,
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingPortfolio(false);
        setSelectedPortfolio(null);
        fetch('/api/portfolio', { credentials: 'include' })
          .then(res => res.json())
          .then(data => { if (data.success) setPortfolioItems(data.data || []); });
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao salvar portfólio");
    }
  };

  const handleDeletePortfolio = async (slug: string) => {
    if (confirm("Excluir Portfólio: Tem certeza que deseja remover este item permanentemente?")) {
      try {
        const headers: Record<string, string> = {};
        if (user?.role) {
          headers['x-user-role'] = user.role;
        }
        if (user?.id) {
          headers['x-user-id'] = user.id;
        }

        const res = await fetch(`/api/portfolio/${slug}`, {
          method: 'DELETE',
          credentials: 'include',
          headers,
        });
        if (res.ok) {
          setPortfolioItems(portfolioItems.filter(p => p.slug !== slug));
        } else {
          const data = await res.json();
          alert(data.error || 'Erro ao deletar');
        }
      } catch (error) {
        alert("Erro ao deletar portfólio");
      }
    }
  };

  const openEditPortfolio = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
    setIsCreatingPortfolio(false);
    setPortfolioFormData({
      title: item.title,
      description: item.description,
      images: item.images.join('\n'),
      technologies: item.technologies.join(', '),
      repositoryLink: item.repositoryLink || '',
    });
  };

  function TestimonialsManager() {
    const pending = testimonials.filter(t => t.status === 'PENDING');
    const approved = testimonials.filter(t => t.status === 'APPROVED');
    const rejected = testimonials.filter(t => t.status === 'REJECTED');

    return (
      <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h3 className="font-[family-name:var(--font-headline)] text-lg text-[#e3e2e2] uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-vibrant-yellow rounded-full animate-pulse"></span>
                Pendentes ({pending.length})
              </h3>
              <div className="space-y-4">
                {pending.map(t => (
                  <div key={t.id} className="p-4 border border-vibrant-yellow/30 bg-surface-container">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-[#e3e2e2] mb-2 font-[family-name:var(--font-code)] text-sm">{t.text}</p>
                        <p className="text-xs text-outline">
                          {t.user?.fullName || 'Usuário'} — {t.user?.course || 'Aluno'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTestimonialStatus(t.id, 'APPROVED')}
                          disabled={updatingTestimonial === t.id}
                          className="p-2 text-neon-green hover:bg-neon-green/10 border border-neon-green/30 disabled:opacity-50"
                          title="Aprovar"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleTestimonialStatus(t.id, 'REJECTED')}
                          disabled={updatingTestimonial === t.id}
                          className="p-2 text-wire-red hover:bg-wire-red/10 border border-wire-red/30 disabled:opacity-50"
                          title="Rejeitar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-lg text-neon-green uppercase mb-4">Aprovados ({approved.length})</h3>
            <div className="space-y-2">
              {approved.map(t => (
                <div key={t.id} className="p-3 border border-outline-variant/50 bg-surface-container-low opacity-80">
                  <div className="flex justify-between items-start">
                    <p className="text-[#e3e2e2] text-sm font-[family-name:var(--font-code)]">{t.text}</p>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1 text-wire-red hover:bg-wire-red/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-outline mt-1">{t.user?.fullName}</p>
                </div>
              ))}
              {approved.length === 0 && <p className="text-outline text-sm">Nenhum aprovado</p>}
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-lg text-wire-red uppercase mb-4">Rejeitados ({rejected.length})</h3>
            <div className="space-y-2">
              {rejected.map(t => (
                <div key={t.id} className="p-3 border border-outline-variant/30 bg-surface-container-low opacity-60">
                  <p className="text-[#e3e2e2] text-sm font-[family-name:var(--font-code)]">{t.text}</p>
                  <p className="text-xs text-outline mt-1">{t.user?.fullName}</p>
                </div>
              ))}
              {rejected.length === 0 && <p className="text-outline text-sm">Nenhum rejeitado</p>}
            </div>
          </div>

          {loadingTestimonials && (
            <div className="text-center text-outline">Carregando...</div>
          )}
        </div>
      </div>
    );
  }

  const handleExportChallenge = async (challengeId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (user?.role) {
        headers['x-user-role'] = user.role;
      }
      
      const res = await fetch(`/api/challenges/${challengeId}/export`, {
        credentials: 'include',
        headers,
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Erro ao exportar');
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `desafio-submissoes.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Erro ao exportar CSV');
    }
  };

  const openEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsCreatingChallenge(false);
    setChallengeFormData({
      titulo: challenge.titulo,
      descricao: challenge.descricao,
      dataLimite: new Date(challenge.dataLimite).toISOString().slice(0, 10),
      urlGithub: challenge.urlGithub || '',
      instrutor: challenge.instrutor,
    });
  };

  const openEdit = (course: CourseWithAvailability) => {
    setSelectedCourse(course);
    setIsCreating(false);
    setFormData({
      titulo: course.titulo,
      descricao: course.descricao,
      cargaHoraria: course.cargaHoraria,
      vagas: course.vagas,
      dataLimite: new Date(course.dataLimite).toISOString().slice(0, 10),
      horario: course.horario,
      instrutor: course.instrutor,
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 relative">
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#8faf3c]"></span>
            <span className="text-primary font-[family-name:var(--font-code)] text-xs tracking-widest uppercase">SYSTEM_STABLE // 0xAF32</span>
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-3xl font-bold text-on-surface uppercase tracking-tight">Content_Management_Console</h2>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container border border-outline-variant flex flex-col items-end">
            <span className="text-[10px] text-outline tracking-widest font-[family-name:var(--font-code)] uppercase">Nós Ativos</span>
            <span className="font-[family-name:var(--font-code)] text-xl text-secondary-fixed">1,284</span>
          </div>
          <div className="px-4 py-2 bg-surface-container border border-outline-variant flex flex-col items-end">
            <span className="text-[10px] text-outline tracking-widest font-[family-name:var(--font-code)] uppercase">Largura de Banda</span>
            <span className="font-[family-name:var(--font-code)] text-xl text-tertiary-container">84.2 GB/s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Creation Console (Left Column) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/30"></div>
            <h3 className="font-[family-name:var(--font-headline)] text-xs font-bold tracking-[0.1em] text-primary mb-6 flex items-center gap-2 uppercase">
              <PlusSquare size={16} /> NEW_INSTANCE_GEN
            </h3>
            
            <div className="space-y-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsCreating(false);
                      setSelectedCourse(null);
                    }}
                    className={`w-full text-left p-4 bg-surface-variant/50 border-l-4 transition-all flex justify-between items-center group ${
                      isActive ? "border-primary bg-primary/10" : "border-outline-variant hover:bg-surface-container"
                    }`}
                  >
                    <div>
                      <div className="font-[family-name:var(--font-code)] text-sm uppercase">{tab.label}</div>
                      <div className="text-[10px] text-outline uppercase mt-1">GERENCIAR REGISTROS</div>
                    </div>
                    <div className={`transition-opacity ${isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-50 text-gray-400"}`}>
                      &gt;
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <label className="text-[10px] text-outline block mb-2 tracking-widest uppercase font-[family-name:var(--font-headline)] font-bold">Global_Priority_Override</label>
              <div className="h-1 bg-surface-container-lowest w-full overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Technical Specs / Health */}
          <div className="bg-surface-container-low border border-outline-variant p-6 font-[family-name:var(--font-code)] text-xs space-y-3">
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-outline uppercase">Core_Logic:</span>
              <span className="text-primary-fixed uppercase">Sincronizado</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-outline uppercase">Latência:</span>
              <span className="text-primary">14ms</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-outline uppercase">Status de Cache:</span>
              <span className="text-secondary-fixed">88%_CHEIO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline uppercase">Criptografia:</span>
              <span className="text-tertiary-container">AES-256_ATIVO</span>
            </div>
          </div>
        </div>

        {/* Code Editor & Content Area (Right Column) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-variant border border-outline-variant rounded-t-lg overflow-hidden flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-container border-b border-outline-variant">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-container/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div>
                </div>
                <div className="flex items-center gap-2 border-x border-outline-variant px-4 py-1">
                  <Terminal className="text-sm text-primary w-4 h-4" />
                  <span className="text-[10px] text-outline font-[family-name:var(--font-code)] tracking-widest uppercase">module_{activeTab}_v2.json</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-outline font-[family-name:var(--font-code)]">Ln 142, Col 8</span>
                <button 
                  onClick={handlePush}
                  disabled={pushStatus !== "IDLE"}
                  className={`px-3 py-1 text-[10px] font-[family-name:var(--font-headline)] font-bold transition-colors ${
                    pushStatus === "SUCCESS" ? "bg-secondary-fixed text-black" : "bg-primary text-black hover:bg-primary-fixed"
                  }`}
                >
                  {pushStatus === "IDLE" && "PUSH_CHANGES"}
                  {pushStatus === "PUSHING" && "SYNCING..."}
                  {pushStatus === "SUCCESS" && "SYNCED_OK"}
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeTab === 'courses' ? (
              <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
                {isCreating || selectedCourse ? (
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">
                      {isCreating ? "Novo Curso" : "Editar Curso"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Título</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Descrição</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[100px]" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Carga Horária</label>
                        <input type="number" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.cargaHoraria} onChange={e => setFormData({...formData, cargaHoraria: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Vagas</label>
                        <input type="number" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.vagas} onChange={e => setFormData({...formData, vagas: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Data Limite</label>
                        <input type="date" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.dataLimite} onChange={e => setFormData({...formData, dataLimite: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Horário</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Instrutor</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={formData.instrutor} onChange={e => setFormData({...formData, instrutor: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleCreateOrEdit} className="px-6 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-opacity-80">
                        Salvar
                      </button>
                      <button onClick={() => {setIsCreating(false); setSelectedCourse(null);}} className="px-6 py-2 bg-surface-container text-outline border border-outline-variant font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-surface-variant">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">Cursos Registrados</h3>
                      <button 
                        onClick={() => {
                          setIsCreating(true);
                          setFormData({titulo: '', descricao: '', cargaHoraria: 0, vagas: 0, dataLimite: '', horario: '', instrutor: ''});
                        }}
                        className="px-4 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-xs font-bold uppercase hover:bg-opacity-80 flex items-center gap-2"
                      >
                        <PlusSquare size={14} /> Novo Curso
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {courses.map(course => (
                        <div key={course.id} className="p-4 border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-[family-name:var(--font-headline)] text-white">{course.titulo}</h4>
                              <span className={`text-[10px] px-2 py-0.5 border uppercase font-bold ${course.isOpen ? 'text-[#b1d35c] border-[#b1d35c]/30 bg-[#b1d35c]/10' : 'text-error border-error/30 bg-error/10'}`}>
                                {course.isOpen ? 'ABERTO' : 'ENCERRADO'}
                              </span>
                            </div>
                            <div className="text-xs text-outline font-[family-name:var(--font-code)] flex gap-4">
                              <span>{course.cargaHoraria}h</span>
                              <span>Vagas: {course.enrollmentCount}/{course.vagas}</span>
                              <span>Até: {new Date(course.dataLimite).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(course)} className="p-2 text-primary hover:bg-primary/10 border border-primary/30" title="Editar">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(course.id)} className="p-2 text-error hover:bg-error/10 border border-error/30" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {courses.length === 0 && (
                        <div className="text-center p-8 text-outline text-sm">
                          Nenhum curso registrado.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'challenges' ? (
              <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
                {isCreatingChallenge || selectedChallenge ? (
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">
                      {isCreatingChallenge ? "Novo Desafio" : "Editar Desafio"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Título</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={challengeFormData.titulo} onChange={e => setChallengeFormData({...challengeFormData, titulo: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Descrição</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[100px]" value={challengeFormData.descricao} onChange={e => setChallengeFormData({...challengeFormData, descricao: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Data Limite</label>
                        <input type="date" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={challengeFormData.dataLimite} onChange={e => setChallengeFormData({...challengeFormData, dataLimite: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Instrutor</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={challengeFormData.instrutor} onChange={e => setChallengeFormData({...challengeFormData, instrutor: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">URL GitHub (opcional)</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={challengeFormData.urlGithub} onChange={e => setChallengeFormData({...challengeFormData, urlGithub: e.target.value})} placeholder="https://github.com/owner/repo" />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleCreateOrEditChallenge} className="px-6 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-opacity-80">
                        Salvar
                      </button>
                      <button onClick={() => {setIsCreatingChallenge(false); setSelectedChallenge(null);}} className="px-6 py-2 bg-surface-container text-outline border border-outline-variant font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-surface-variant">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">Desafios Registrados</h3>
                      <button 
                        onClick={() => {
                          setIsCreatingChallenge(true);
                          setChallengeFormData({titulo: '', descricao: '', dataLimite: '', urlGithub: '', instrutor: ''});
                        }}
                        className="px-4 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-xs font-bold uppercase hover:bg-opacity-80 flex items-center gap-2"
                      >
                        <PlusSquare size={14} /> Novo Desafio
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {challenges.map(challenge => (
                        <div key={challenge.id} className="p-4 border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-[family-name:var(--font-headline)] text-white">{challenge.titulo}</h4>
                              <span className={`text-[10px] px-2 py-0.5 border uppercase font-bold ${challenge.isOpen ? 'text-[#b1d35c] border-[#b1d35c]/30 bg-[#b1d35c]/10' : 'text-error border-error/30 bg-error/10'}`}>
                                {challenge.isOpen ? 'ABERTO' : 'ENCERRADO'}
                              </span>
                            </div>
                            <div className="text-xs text-outline font-[family-name:var(--font-code)] flex gap-4">
                              <span>Instrutor: {challenge.instrutor}</span>
                              <span>Até: {new Date(challenge.dataLimite).toLocaleDateString('pt-BR')}</span>
                              <span>Submissões: {challenge._count?.submissions || 0}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditChallenge(challenge)} className="p-2 text-primary hover:bg-primary/10 border border-primary/30" title="Editar">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleExportChallenge(challenge.id)} className="p-2 text-[#b1d35c] hover:bg-[#b1d35c]/10 border border-[#b1d35c]/30" title="Exportar CSV">
                              <Download size={16} />
                            </button>
                            {user?.role === 'ORIENTADOR' && (
                              <button onClick={() => handleDeleteChallenge(challenge.id)} className="p-2 text-error hover:bg-error/10 border border-error/30" title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {challenges.length === 0 && (
                        <div className="text-center p-8 text-outline text-sm">
                          Nenhum desafio registrado.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'testimonials' ? (
              <TestimonialsManager />
            ) : activeTab === 'vagas' ? (
              <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
                {isCreatingVaga || selectedOpportunity ? (
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-headline)] text-lg text-[#00d4ff] uppercase">
                      {isCreatingVaga ? "Nova Vaga" : "Editar Vaga"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Título</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={vagaFormData.titulo} onChange={e => setVagaFormData({...vagaFormData, titulo: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Descrição</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[100px]" value={vagaFormData.descricao} onChange={e => setVagaFormData({...vagaFormData, descricao: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Vagas</label>
                        <input type="number" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={vagaFormData.vagas} onChange={e => setVagaFormData({...vagaFormData, vagas: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Status</label>
                        <select className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={vagaFormData.status} onChange={e => setVagaFormData({...vagaFormData, status: e.target.value as 'Open' | 'Closed'})}>
                          <option value="Open">Aberta</option>
                          <option value="Closed">Fechada</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Data Limite (opcional)</label>
                        <input type="date" className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={vagaFormData.dataLimite} onChange={e => setVagaFormData({...vagaFormData, dataLimite: e.target.value})} />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleCreateOrEditVaga} className="px-6 py-2 bg-[#00d4ff] text-black font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-opacity-80">
                        Salvar
                      </button>
                      <button onClick={() => {setIsCreatingVaga(false); setSelectedOpportunity(null);}} className="px-6 py-2 bg-surface-container text-outline border border-outline-variant font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-surface-variant">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-[family-name:var(--font-headline)] text-lg text-[#00d4ff] uppercase">Vagas Registradas</h3>
                      <button 
                        onClick={() => {
                          setIsCreatingVaga(true);
                          setVagaFormData({titulo: '', descricao: '', vagas: 0, dataLimite: '', status: 'Open'});
                        }}
                        className="px-4 py-2 bg-[#00d4ff] text-black font-[family-name:var(--font-headline)] text-xs font-bold uppercase hover:bg-opacity-80 flex items-center gap-2"
                      >
                        <PlusSquare size={14} /> Nova Vaga
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {opportunities.map(opp => (
                        <div key={opp.id} className="p-4 border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-[family-name:var(--font-headline)] text-white">{opp.titulo}</h4>
                              <span className={`text-[10px] px-2 py-0.5 border uppercase font-bold ${opp.isOpen ? 'text-[#00d4ff] border-[#00d4ff]/30 bg-[#00d4ff]/10' : 'text-error border-error/30 bg-error/10'}`}>
                                {opp.isOpen ? 'ABERTA' : 'FECHADA'}
                              </span>
                            </div>
                            <div className="text-xs text-outline font-[family-name:var(--font-code)] flex gap-4">
                              <span>Vagas: {opp.applicationCount}</span>
                              {opp.dataLimite && <span>Até: {new Date(opp.dataLimite).toLocaleDateString('pt-BR')}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditVaga(opp)} className="p-2 text-[#00d4ff] hover:bg-[#00d4ff]/10 border border-[#00d4ff]/30" title="Editar">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleExportVaga(opp.id)} className="p-2 text-[#00d4ff] hover:bg-[#00d4ff]/10 border border-[#00d4ff]/30" title="Exportar CSV">
                              <Download size={16} />
                            </button>
                            {user?.role === 'ORIENTADOR' && (
                              <button onClick={() => handleDeleteVaga(opp.id)} className="p-2 text-error hover:bg-error/10 border border-error/30" title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {opportunities.length === 0 && (
                        <div className="text-center p-8 text-outline text-sm">
                          Nenhuma vaga registrada.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'biblioteca' ? (
              <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
                {isCreatingBiblioteca || selectedBiblioteca ? (
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">
                      {isCreatingBiblioteca ? "Novo Recurso" : "Editar Recurso"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Título</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={bibliotecaFormData.titulo} onChange={e => setBibliotecaFormData({...bibliotecaFormData, titulo: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Descrição</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[100px]" value={bibliotecaFormData.descricao} onChange={e => setBibliotecaFormData({...bibliotecaFormData, descricao: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Categoria</label>
                        <select className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={bibliotecaFormData.categoria} onChange={e => setBibliotecaFormData({...bibliotecaFormData, categoria: e.target.value})}>
                          <option value="codigos">Códigos</option>
                          <option value="bibliotecas">Bibliotecas</option>
                          <option value="materiais">Materiais de Curso</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Linguagem</label>
                        <select className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={bibliotecaFormData.linguagem} onChange={e => setBibliotecaFormData({...bibliotecaFormData, linguagem: e.target.value})}>
                          <option value="">Nenhuma</option>
                          <option value="cpp">C++</option>
                          <option value="python">Python</option>
                          <option value="arduino">Arduino</option>
                          <option value="html">HTML/CSS</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Tags (separadas por vírgula)</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={bibliotecaFormData.tags} onChange={e => setBibliotecaFormData({...bibliotecaFormData, tags: e.target.value})} placeholder="Básico, Sensores, ..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">URL do Recurso</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={bibliotecaFormData.link} onChange={e => setBibliotecaFormData({...bibliotecaFormData, link: e.target.value})} placeholder="https://..." />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleCreateOrEditBiblioteca} className="px-6 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-opacity-80">
                        Salvar
                      </button>
                      <button onClick={() => {setIsCreatingBiblioteca(false); setSelectedBiblioteca(null);}} className="px-6 py-2 bg-surface-container text-outline border border-outline-variant font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-surface-variant">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">Recursos da Biblioteca</h3>
                      <button 
                        onClick={() => {
                          setIsCreatingBiblioteca(true);
                          setBibliotecaFormData({titulo: '', descricao: '', categoria: 'codigos', linguagem: '', tags: '', link: ''});
                        }}
                        className="px-4 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-xs font-bold uppercase hover:bg-opacity-80 flex items-center gap-2"
                      >
                        <PlusSquare size={14} /> Novo Recurso
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {bibliotecaResources.map(resource => (
                        <div key={resource.id} className="p-4 border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-[family-name:var(--font-headline)] text-white">{resource.titulo}</h4>
                              <span className="text-[10px] px-2 py-0.5 border uppercase font-bold text-primary border-primary/30 bg-primary/10">
                                {resource.categoria === 'codigos' ? 'Códigos' : resource.categoria === 'bibliotecas' ? 'Bibliotecas' : 'Materiais'}
                              </span>
                              {resource.linguagem && (
                                <span className="text-[10px] px-2 py-0.5 border uppercase font-bold text-[#00d4ff] border-[#00d4ff]/30 bg-[#00d4ff]/10">
                                  {resource.linguagem === 'cpp' ? 'C++' : resource.linguagem === 'python' ? 'Python' : resource.linguagem === 'arduino' ? 'Arduino' : 'HTML'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-outline font-[family-name:var(--font-code)] flex gap-4 flex-wrap">
                              <span>Downloads: {resource.downloadCount}</span>
                              {resource.tags?.length > 0 && <span>Tags: {resource.tags.join(', ')}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditBiblioteca(resource)} className="p-2 text-primary hover:bg-primary/10 border border-primary/30" title="Editar">
                              <Edit size={16} />
                            </button>
                            {user?.role === 'ORIENTADOR' && (
                              <button onClick={() => handleDeleteBiblioteca(resource.id)} className="p-2 text-error hover:bg-error/10 border border-error/30" title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {bibliotecaResources.length === 0 && (
                        <div className="text-center p-8 text-outline text-sm">
                          Nenhum recurso registrado.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'portfolio' ? (
              <div className="flex-grow p-6 bg-surface-container-lowest/40 min-h-[500px]">
                {isCreatingPortfolio || selectedPortfolio ? (
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">
                      {isCreatingPortfolio ? "Novo Item de Portfólio" : "Editar Item de Portfólio"}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Título</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={portfolioFormData.title} onChange={e => setPortfolioFormData({...portfolioFormData, title: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Descrição (Markdown suportado)</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[150px]" value={portfolioFormData.description} onChange={e => setPortfolioFormData({...portfolioFormData, description: e.target.value})} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Imagens (uma URL por linha)</label>
                        <textarea className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm min-h-[100px]" value={portfolioFormData.images} onChange={e => setPortfolioFormData({...portfolioFormData, images: e.target.value})} placeholder="https://..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Tecnologias (separadas por vírgula)</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={portfolioFormData.technologies} onChange={e => setPortfolioFormData({...portfolioFormData, technologies: e.target.value})} placeholder="React, Tailwind, Prisma, ..." />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-[family-name:var(--font-code)] text-outline mb-1">Link do Repositório (GitHub)</label>
                        <input className="w-full p-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-code text-sm" value={portfolioFormData.repositoryLink} onChange={e => setPortfolioFormData({...portfolioFormData, repositoryLink: e.target.value})} placeholder="https://github.com/..." />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleCreateOrEditPortfolio} className="px-6 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-opacity-80">
                        Salvar
                      </button>
                      <button onClick={() => {setIsCreatingPortfolio(false); setSelectedPortfolio(null);}} className="px-6 py-2 bg-surface-container text-outline border border-outline-variant font-[family-name:var(--font-headline)] text-sm font-bold uppercase hover:bg-surface-variant">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-[family-name:var(--font-headline)] text-lg text-primary uppercase">Projetos no Portfólio</h3>
                      <button 
                        onClick={() => {
                          setIsCreatingPortfolio(true);
                          setPortfolioFormData({title: '', description: '', images: '', technologies: '', repositoryLink: ''});
                        }}
                        className="px-4 py-2 bg-[#b1d35c] text-black font-[family-name:var(--font-headline)] text-xs font-bold uppercase hover:bg-opacity-80 flex items-center gap-2"
                      >
                        <PlusSquare size={14} /> Novo Projeto
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {portfolioItems.map(item => (
                        <div key={item.id} className="p-4 border border-outline-variant bg-surface-container flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-[family-name:var(--font-headline)] text-white">{item.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 border border-primary/30 bg-primary/10 text-primary uppercase font-bold">
                                {item.slug}
                              </span>
                            </div>
                            <div className="text-xs text-outline font-[family-name:var(--font-code)] flex gap-4 flex-wrap">
                              <span>Tecnologias: {item.technologies.join(', ')}</span>
                              <span>Imagens: {item.images.length}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditPortfolio(item)} className="p-2 text-primary hover:bg-primary/10 border border-primary/30" title="Editar">
                              <Edit size={16} />
                            </button>
                            {(user?.role === 'ORIENTADOR' || item.authorId === user?.id) && (
                              <button onClick={() => handleDeletePortfolio(item.slug)} className="p-2 text-error hover:bg-error/10 border border-error/30" title="Excluir">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {portfolioItems.length === 0 && (
                        <div className="text-center p-8 text-outline text-sm">
                          Nenhum projeto registrado.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex min-h-[500px] bg-surface-container-lowest/40">
                <div className="w-12 bg-surface-container-low border-r border-outline-variant flex flex-col items-center py-4 text-[10px] text-outline/50 font-[family-name:var(--font-code)] leading-6 select-none">
                  <span>140</span><span>141</span><span className="text-primary font-bold">142</span><span>143</span><span>144</span><span>145</span><span>146</span><span>147</span><span>148</span><span>149</span><span>150</span><span>151</span><span>152</span>
                </div>
                <div className="flex-grow p-4 font-[family-name:var(--font-code)] text-sm relative">
                  <div className="mb-4"><span className="text-tertiary">"content_structure"</span>: {"{"}</div>
                  <div className="ml-6 mb-2"><span className="text-secondary-fixed">"node_id"</span>: <span className="text-primary-fixed">"EPRA-{activeTab.toUpperCase()}-01"</span>,</div>
                  <div className="ml-6 mb-2"><span className="text-secondary-fixed">"payload_type"</span>: <span className="text-primary-fixed">"ADVANCED_ROBOTICS_V4"</span>,</div>
                  <div className="ml-6 mb-2 bg-primary/10 border-l-2 border-primary -ml-6 pl-6">
                    <span className="text-secondary-fixed">"status"</span>: <span className="text-primary-fixed">"ACTIVE"</span>, <span className="text-outline">// System override initiated</span>
                  </div>
                  <div className="ml-6 mb-2"><span className="text-secondary-fixed">"tags"</span>: [</div>
                  <div className="ml-12 mb-2"><span className="text-primary-fixed">"cybernetics"</span>, <span className="text-primary-fixed">"automation"</span>, <span className="text-primary-fixed">"logic_flow"</span></div>
                  <div className="ml-6 mb-4">]</div>
                  <div className="mb-4">{"}"},</div>
                  <div className="mb-4"><span className="text-tertiary">"deployment_vector"</span>: [</div>
                  <div className="animate-pulse ml-2 text-primary">|</div>
                </div>
              </div>
            )}
          </div>

          {/* Active Projects Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.content.projects.map((project) => (
              <div key={project.id} className={`bg-surface-container-low border border-outline-variant p-4 hover:border-${project.statusColor} transition-all group`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-[family-name:var(--font-code)] text-sm">{project.id}</h4>
                    <p className="text-[10px] text-outline tracking-wider font-[family-name:var(--font-code)] uppercase">ÚLTIMA_SINCRONIZAÇÃO: {project.lastSync}</p>
                  </div>
                  <span className={`px-2 py-0.5 bg-${project.statusColor}/10 text-${project.statusColor} text-[10px] font-bold border border-${project.statusColor}/20`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-64 right-0 h-6 bg-surface-container-lowest border-t border-border-gray px-4 flex items-center justify-between z-40 text-[9px] font-[family-name:var(--font-code)] tracking-widest text-outline">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span> READY</span>
          <span>UTF-8</span>
          <span>JSON_SCHEMA_v2.1</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span className="text-secondary-fixed">CPU: 42%</span>
          <span className="text-tertiary-container">MEM: 12.4GB</span>
          <span className="text-primary">LATENCY: 14MS</span>
          <span className="bg-surface-container-low px-2 h-full flex items-center border-l border-border-gray">VER: 1.0.4-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
