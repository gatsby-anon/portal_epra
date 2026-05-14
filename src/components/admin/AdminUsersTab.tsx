"use client";

import { useState, useEffect } from "react";
import { Loader2, Users } from "lucide-react";
import UserTable from "./UserTable";
import RoleChangeModal from "./RoleChangeModal";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  course: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<'ALUNO_INTERNO' | 'USUARIO_EXTERNO' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('roleFilter', roleFilter);
      if (statusFilter !== 'all') params.set('statusFilter', statusFilter);
      params.set('page', page.toString());
      
      const res = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Failed to fetch users');
      
      const data = await res.json();
      setUsers(data.data.users);
      setTotalPages(data.data.totalPages);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, page]);

  const handlePromote = (user: User) => {
    setSelectedUser(user);
    setTargetRole('ALUNO_INTERNO');
    setModalError(null);
    setModalOpen(true);
  };

  const handleRevoke = (user: User) => {
    setSelectedUser(user);
    setTargetRole('USUARIO_EXTERNO');
    setModalError(null);
    setModalOpen(true);
  };

  const handleDeactivate = async (user: User) => {
    if (!confirm(`Tem certeza que deseja desativar o usuário "${user.fullName}"?`)) return;
    
    try {
      const res = await fetch(`/api/admin/users/${user.id}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to deactivate');
      }
      
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate');
    }
  };

  const handleReactivate = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reactivate');
      }
      
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reactivate');
    }
  };

  const handleModalConfirm = async () => {
    if (!selectedUser || !targetRole) return;
    
    setModalLoading(true);
    setModalError(null);
    
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update role');
      }
      
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setModalLoading(false);
    }
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
          onClick={fetchUsers}
          className="mt-4 text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-gray-500 text-[10px] font-[family-name:var(--font-code)] uppercase mb-1">
            Papel
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#1A1C1C] border border-[#3A3A3A] text-gray-300 text-sm px-3 py-2 rounded focus:border-primary focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="ORIENTADOR">Orientador</option>
            <option value="ALUNO_INTERNO">Aluno Interno</option>
            <option value="USUARIO_EXTERNO">Aluno Externo</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-500 text-[10px] font-[family-name:var(--font-code)] uppercase mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1C1C] border border-[#3A3A3A] text-gray-300 text-sm px-3 py-2 rounded focus:border-primary focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 font-[family-name:var(--font-code)]">
            Nenhum usuário encontrado
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Tente ajustar os filtros de busca
          </p>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onPromote={handlePromote}
            onRevoke={handleRevoke}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
          />

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

      {/* Modal */}
      <RoleChangeModal
        isOpen={modalOpen}
        user={selectedUser}
        targetRole={targetRole}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalOpen(false)}
        isLoading={modalLoading}
        error={modalError}
      />
    </div>
  );
}