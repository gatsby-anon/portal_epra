"use client";

import { useAuth } from "@/context/AuthContext";
import { Edit, Download, Shield, Monitor, Smartphone } from "lucide-react";
import dashboardData from "@/data/dashboard-content.json";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl text-primary mb-1 uppercase tracking-tighter">Identity_Core</h1>
          <p className="text-on-surface-variant font-[family-name:var(--font-code)] text-xs tracking-[0.2em] uppercase">OPERATOR_SERIAL: {user?.id || "N/A"}</p>
        </div>
        <div className="text-right border-l border-border-gray pl-6">
          <p className="text-[10px] text-gray-500 font-[family-name:var(--font-code)]">UPTIME</p>
          <p className="text-primary font-[family-name:var(--font-code)]">342:12:09</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Central Digital ID Card */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-lg p-6 relative overflow-hidden group glow-border-primary border border-primary">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_50%,rgba(143,175,60,0.05)_50%)] bg-[length:100%_4px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded border-2 border-primary p-1 relative">
                <div className="w-full h-full bg-surface-container-low flex items-center justify-center text-primary text-6xl font-bold rounded-sm">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-2 -left-2 bg-primary text-black px-2 py-0.5 text-[10px] font-bold">
                  VERIFIED
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-primary animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-primary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-[family-name:var(--font-headline)] font-bold tracking-widest uppercase">Nome Completo</label>
                  <p className="font-[family-name:var(--font-headline)] text-2xl font-semibold text-on-surface uppercase">{user?.fullName || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-[family-name:var(--font-headline)] font-bold tracking-widest uppercase">Curso Atribuído</label>
                  <p className="font-[family-name:var(--font-headline)] text-2xl font-semibold text-primary uppercase">{user?.course || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-[family-name:var(--font-headline)] font-bold tracking-widest uppercase">Contato</label>
                  <p className="font-[family-name:var(--font-code)] text-sm text-secondary-fixed">{user?.email || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-[family-name:var(--font-headline)] font-bold tracking-widest uppercase">Progresso Geral</label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]"></div>
                    </div>
                    <span className="text-xs text-primary font-[family-name:var(--font-code)]">85%</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border-gray flex gap-6">
                <button className="flex items-center gap-2 text-xs font-[family-name:var(--font-headline)] font-bold bg-primary text-black px-6 py-2 rounded hover:bg-primary-hover transition-all active:scale-95 uppercase">
                  <Edit size={14} />
                  Editar Perfil
                </button>
                <button className="flex items-center gap-2 text-xs font-[family-name:var(--font-headline)] font-bold border border-outline-variant px-6 py-2 rounded hover:border-primary transition-all active:scale-95 uppercase">
                  <Download size={14} />
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Protocol */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-lg p-6 flex flex-col border border-error-container/30 bg-gradient-to-br from-surface-container-low to-surface-container-lowest">
          <div className="flex items-center gap-4 mb-10">
            <Shield className="text-error w-6 h-6" />
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-semibold text-on-surface uppercase">Security_Protocol</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="bg-surface-container-low p-4 border-l-2 border-error">
              <p className="text-[10px] text-error font-[family-name:var(--font-headline)] font-bold mb-1 uppercase">{dashboardData.profile.security.alert.title}</p>
              <p className="text-xs text-on-surface-variant font-[family-name:var(--font-code)]">IP: {dashboardData.profile.security.alert.ip}</p>
            </div>
            
            <div className="pt-10">
              <h4 className="text-[10px] text-gray-500 font-[family-name:var(--font-headline)] font-bold mb-6 uppercase">Terminais Autorizados</h4>
              <div className="space-y-4">
                {dashboardData.profile.security.terminals.map((term, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 glass-panel border border-border-gray ${term.status === 'OFFLINE' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                      {term.type === 'desktop' ? <Monitor className="text-secondary-fixed w-4 h-4" /> : <Smartphone className="text-secondary-fixed w-4 h-4" />}
                      <span className="text-xs font-[family-name:var(--font-code)]">{term.name}</span>
                    </div>
                    <span className={`text-[10px] font-[family-name:var(--font-headline)] font-bold ${term.status === 'ACTIVE' ? 'text-primary' : 'text-gray-500'}`}>{term.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 glass-panel rounded-lg p-6 border border-border-gray">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-semibold uppercase">Histórico do Terminal</h3>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-[family-name:var(--font-headline)] font-bold rounded-full border border-primary/30">LOG_STREAM_LIVE</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-[family-name:var(--font-code)] text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-border-gray">
                  <th className="pb-3 uppercase">Timestamp</th>
                  <th className="pb-3 uppercase">Ação/Evento</th>
                  <th className="pb-3 uppercase">Nó de Origem</th>
                  <th className="pb-3 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray/30">
                {dashboardData.profile.activity.map((act, i) => (
                  <tr key={i}>
                    <td className="py-4">{act.timestamp}</td>
                    <td className="py-4">{act.action}</td>
                    <td className="py-4 text-tertiary-fixed">{act.node}</td>
                    <td className="py-4"><span className={`text-${act.statusColor}`}>{act.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
