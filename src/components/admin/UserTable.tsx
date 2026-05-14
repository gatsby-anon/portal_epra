"use client";

import { useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, ArrowUp, ArrowDown, UserPlus, UserMinus, Power, PowerOff, Users } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  course: string | null;
  isActive: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onPromote: (user: User) => void;
  onRevoke: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
}

type SortField = 'fullName' | 'email' | 'role' | 'course' | 'isActive' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function UserTable({ users, onPromote, onRevoke, onDeactivate, onReactivate }: UserTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-gray-600" />;
    return sortDirection === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ORIENTADOR: 'bg-[#b1d35c]/20 text-[#b1d35c] border-[#b1d35c]/30',
      ALUNO_INTERNO: 'bg-[#2D6CDF]/20 text-[#2D6CDF] border-[#2D6CDF]/30',
      USUARIO_EXTERNO: 'bg-[#3A3A3A]/50 text-gray-400 border-[#3A3A3A]/50',
    };
    const labels: Record<string, string> = {
      ORIENTADOR: 'Orientador',
      ALUNO_INTERNO: 'Aluno Interno',
      USUARIO_EXTERNO: 'Aluno Externo',
    };
    return (
      <span className={`px-2 py-1 text-[10px] font-[family-name:var(--font-code)] uppercase border rounded ${colors[role] || colors.USUARIO_EXTERNO}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-[10px] font-[family-name:var(--font-code)] uppercase border rounded ${
        isActive 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-red-500/20 text-[#ffb4ab] border-red-500/30'
      }`}>
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-4 py-3 text-left cursor-pointer hover:text-primary transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  );

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 font-[family-name:var(--font-code)]">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-[family-name:var(--font-code)] text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#3A3A3A] text-gray-500 uppercase">
            <SortableHeader field="fullName">Nome</SortableHeader>
            <SortableHeader field="email">Email</SortableHeader>
            <SortableHeader field="role">Papel</SortableHeader>
            <SortableHeader field="course">Curso</SortableHeader>
            <SortableHeader field="isActive">Status</SortableHeader>
            <SortableHeader field="createdAt">Criado em</SortableHeader>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr 
              key={user.id} 
              className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors"
            >
              <td className="px-4 py-3 text-gray-300">{user.fullName}</td>
              <td className="px-4 py-3 text-gray-400">{user.email}</td>
              <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
              <td className="px-4 py-3 text-gray-400">{user.course || '-'}</td>
              <td className="px-4 py-3">{getStatusBadge(user.isActive)}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {user.role === 'USUARIO_EXTERNO' && user.isActive && (
                    <button
                      onClick={() => onPromote(user)}
                      className="p-1.5 bg-[#2D6CDF]/20 text-[#2D6CDF] hover:bg-[#2D6CDF]/30 rounded transition-colors"
                      title="Promover para Aluno Interno"
                    >
                      <UserPlus size={14} />
                    </button>
                  )}
                  {user.role === 'ALUNO_INTERNO' && user.isActive && (
                    <button
                      onClick={() => onRevoke(user)}
                      className="p-1.5 bg-[#3A3A3A]/50 text-gray-400 hover:bg-[#3A3A3A]/70 rounded transition-colors"
                      title="Revogar para Aluno Externo"
                    >
                      <UserMinus size={14} />
                    </button>
                  )}
                  {user.isActive && user.role !== 'ORIENTADOR' && (
                    <button
                      onClick={() => onDeactivate(user)}
                      className="p-1.5 bg-red-500/20 text-[#ffb4ab] hover:bg-red-500/30 rounded transition-colors"
                      title="Desativar"
                    >
                      <PowerOff size={14} />
                    </button>
                  )}
                  {!user.isActive && user.role !== 'ORIENTADOR' && (
                    <button
                      onClick={() => onReactivate(user)}
                      className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors"
                      title="Reativar"
                    >
                      <Power size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}