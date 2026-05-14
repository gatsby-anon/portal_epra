"use client";

import { X, Loader2, AlertCircle } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface RoleChangeModalProps {
  isOpen: boolean;
  user: User | null;
  targetRole: 'ALUNO_INTERNO' | 'USUARIO_EXTERNO' | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function RoleChangeModal({ 
  isOpen, 
  user, 
  targetRole, 
  onConfirm, 
  onCancel,
  isLoading = false,
  error = null 
}: RoleChangeModalProps) {
  if (!isOpen) return null;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ORIENTADOR: 'Orientador',
      ALUNO_INTERNO: 'Aluno Interno',
      USUARIO_EXTERNO: 'Aluno Externo',
    };
    return labels[role] || role;
  };

  const getActionText = () => {
    if (targetRole === 'ALUNO_INTERNO') {
      return `Promover ${user?.fullName} de ${getRoleLabel(user?.role || '')} para Aluno Interno?`;
    }
    if (targetRole === 'USUARIO_EXTERNO') {
      return `Revogar o papel de ${user?.fullName} de Aluno Interno para Aluno Externo?`;
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1A1C1C] border border-[#3A3A3A] rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3A3A]">
          <h3 className="text-lg font-bold text-gray-200 font-[family-name:var(--font-headline)]">
            Alterar Papel
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded text-[#ffb4ab] text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="text-gray-500 text-[10px] font-[family-name:var(--font-code)] uppercase">
                Usuário
              </label>
              <p className="text-gray-200">{user?.fullName}</p>
            </div>
            
            <div>
              <label className="text-gray-500 text-[10px] font-[family-name:var(--font-code)] uppercase">
                Email
              </label>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <div className="pt-2">
              <p className="text-gray-300">{getActionText()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#3A3A3A]">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-[family-name:var(--font-headline)] text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-black text-sm font-bold font-[family-name:var(--font-headline)] hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}