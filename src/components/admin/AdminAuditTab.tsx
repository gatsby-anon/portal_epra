"use client";

import { useState, useEffect } from "react";
import { Loader2, FileText } from "lucide-react";

interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  actionLabel: string;
  targetId: string;
  targetName: string;
  details: string | null;
  createdAt: string;
}

export default function AdminAuditTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionFilter !== 'all') params.set('actionFilter', actionFilter);
      params.set('page', page.toString());
      
      const res = await fetch(`/api/admin/audit?${params}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      
      const data = await res.json();
      setLogs(data.data.logs);
      setTotalPages(data.data.totalPages);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, page]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      ROLE_PROMOTION: 'bg-[#2D6CDF]/20 text-[#2D6CDF] border-[#2D6CDF]/30',
      ROLE_REVOCATION: 'bg-[#3A3A3A]/50 text-gray-400 border-[#3A3A3A]/50',
      USER_DEACTIVATION: 'bg-red-500/20 text-[#ffb4ab] border-red-500/30',
      USER_REACTIVATION: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    const labels: Record<string, string> = {
      ROLE_PROMOTION: 'Promoção',
      ROLE_REVOCATION: 'Revogação',
      USER_DEACTIVATION: 'Desativação',
      USER_REACTIVATION: 'Reativação',
    };
    return (
      <span className={`px-2 py-1 text-[10px] font-[family-name:var(--font-code)] uppercase border rounded ${colors[action] || colors.ROLE_PROMOTION}`}>
        {labels[action] || action}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ffb4ab]">{error}</p>
        <button 
          onClick={fetchLogs}
          className="mt-4 text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div>
        <label className="block text-gray-500 text-[10px] font-[family-name:var(--font-code)] uppercase mb-1">
          Tipo de Ação
        </label>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-[#1A1C1C] border border-[#3A3A3A] text-gray-300 text-sm px-3 py-2 rounded focus:border-primary focus:outline-none w-48"
        >
          <option value="all">Todas</option>
          <option value="ROLE_PROMOTION">Promoção</option>
          <option value="ROLE_REVOCATION">Revogação</option>
          <option value="USER_DEACTIVATION">Desativação</option>
          <option value="USER_REACTIVATION">Reativação</option>
        </select>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 font-[family-name:var(--font-code)]">
            Nenhum registro de auditoria
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-[family-name:var(--font-code)] text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#3A3A3A] text-gray-500 uppercase">
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">Ator</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Alvo</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {log.actorName}
                    </td>
                    <td className="px-4 py-3">
                      {getActionBadge(log.action)}
                      {log.details && (
                        <span className="ml-2 text-gray-500 text-[10px]">
                          {log.details}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {log.targetName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3A3A3A]">
              <span className="text-gray-500 text-sm font-[family-name:var(--font-code)]">
                Showing {((page - 1) * 20) + 1}-{Math.min(page * 20, total)} of {total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-[#1A1C1C] border border-[#3A3A3A] text-gray-400 text-sm rounded hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-gray-500 text-sm font-[family-name:var(--font-code)]">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-[#1A1C1C] border border-[#3A3A3A] text-gray-400 text-sm rounded hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}