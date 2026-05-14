"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, Users, FileText, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminAuditTab from "@/components/admin/AdminAuditTab";
import AdminInfraTab from "@/components/admin/AdminInfraTab";

const tabs = [
  { id: "users", label: "Usuários", icon: Users },
  { id: "audit", label: "Auditoria", icon: FileText },
  { id: "infra", label: "Infraestrutura", icon: Activity },
];


export default function AdminPage() {
  const { user, hasPermission } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams, activeTab]);

  if (!hasPermission(["ORIENTADOR"])) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-400 mb-2">Acesso Restrito</h2>
          <p className="text-gray-500">Apenas Orientadores podem acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#3A3A3A] pb-4">
        <h1 className="text-2xl font-black text-primary italic font-[family-name:var(--font-headline)]">
          Gerenciar Sistema
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-[family-name:var(--font-code)]">
          Controle de usuários e auditoria do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#3A3A3A]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-[family-name:var(--font-headline)] text-xs tracking-widest transition-all ${
                isActive
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-500 hover:text-gray-300 hover:bg-[#1A1A1A]"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "users" && <AdminUsersTab />}
        {activeTab === "audit" && <AdminAuditTab />}
        {activeTab === "infra" && <AdminInfraTab />}

      </div>
    </div>
  );
}