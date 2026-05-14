"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Users, FileText, Settings, Power, ChevronDown, BookOpen, Trophy, GraduationCap, MessageSquare, Briefcase, Activity, BarChart3 } from "lucide-react";
import content from "@/data/content.json";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface AdminShellProps {
  children: ReactNode;
  activeTab?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function AdminShell({ children, activeTab = "dashboard", userRole = "Admin", onLogout }: AdminShellProps) {
  const { user, hasPermission } = useAuth();
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(activeTab === "content");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(activeTab === "admin");

  // Filter items based on permissions
  const sideNavItems = [
    { id: "profile", label: "Perfil", icon: Users, href: "/dashboard/profile", show: true },
    { 
      id: "content", 
      label: "Gerenciar Conteúdo", 
      icon: Terminal,
      href: "/dashboard/content",
      show: hasPermission(["ALUNO_INTERNO", "ORIENTADOR"]),
      subItems: [
        { id: "content-courses", label: "Cursos", icon: GraduationCap, href: "/dashboard/content?tab=courses" },
        { id: "content-challenges", label: "Desafios", icon: Trophy, href: "/dashboard/content?tab=challenges" },
        { id: "content-tutorials", label: "Tutoriais", icon: BookOpen, href: "/dashboard/content?tab=tutorials" },
        { id: "content-testimonials", label: "Depoimentos", icon: MessageSquare, href: "/dashboard/content?tab=testimonials" },
        { id: "content-portfolio", label: "Portfólio", icon: Briefcase, href: "/dashboard/content?tab=portfolio" },
        { id: "content-metrics", label: "Métricas", icon: BarChart3, href: "/dashboard/metrics" },
      ]
    },
    { 
      id: "admin", 
      label: "Gerenciar Sistema", 
      icon: FileText,
      href: "/dashboard/admin?tab=users",
      show: hasPermission(["ORIENTADOR"]),
      subItems: [
        { id: "admin-users", label: "Usuários", icon: Users, href: "/dashboard/admin?tab=users" },
        { id: "admin-audit", label: "Auditoria", icon: FileText, href: "/dashboard/admin?tab=audit" },
        { id: "admin-infra", label: "Infraestrutura", icon: Activity, href: "/dashboard/admin?tab=infra" },
      ]
    },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#e3e2e2]">
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 border-b border-border-gray bg-[#0D0D0D]/90 backdrop-blur-xl shadow-[0_0_15px_rgba(143,175,60,0.1)]"
      >
        <div className="flex justify-between items-center w-full px-8 h-16 max-w-screen-2xl mx-auto">
          <Link href="/" className="relative h-8 w-32">
            <Image 
              src="/images/logo.png" 
              alt="EPRA Logo" 
              fill 
              className="object-contain"
              priority
            />
          </Link>

          {/* Nav Links — Matching Landing Page */}
          <nav className="hidden md:flex gap-8 items-center">
            {content.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href.startsWith("/") ? item.href : `/${item.href}`}
                className="font-[family-name:var(--font-headline)] tracking-tight uppercase text-sm transition-colors text-gray-400 font-medium hover:text-primary-container"
              >
                {item.label}
              </Link>
            ))}

          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={onLogout}
              className="hidden md:block bg-primary-container/10 border border-primary-container/50 text-primary-container px-4 py-2 font-[family-name:var(--font-headline)] tracking-tight uppercase text-xs font-semibold hover:bg-[#1A1A1A] active:scale-95 transition-all"
            >
              LOGOUT
            </button>
            <div className="h-8 w-8 rounded-full border border-primary overflow-hidden ml-2 cursor-pointer flex items-center justify-center bg-[#1A1A1A] text-primary font-bold">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="flex pt-16 min-h-screen">
        {/* Side Navigation Bar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1A1A1A]/70 backdrop-blur-lg border-r border-[#3A3A3A] flex flex-col z-40 shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-[#3A3A3A]/50">
            <Link href="/" className="relative h-6 w-24 block mb-2">
              <Image 
                src="/images/logo.png" 
                alt="EPRA Logo" 
                fill 
                className="object-contain object-left"
              />
            </Link>
            <p className="text-gray-500 text-[10px] font-[family-name:var(--font-code)] tracking-widest uppercase mt-1">
              Auth_Level: {userRole}
            </p>
          </div>
          
          <nav className="flex-1 py-4 overflow-y-auto">
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.subItems?.some(sub => activeTab === sub.id));
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = item.id === 'content' ? isContentMenuOpen : (item.id === 'admin' ? isAdminMenuOpen : false);
              
              const toggleMenu = (id: string) => {
                if (id === 'content') setIsContentMenuOpen(!isContentMenuOpen);
                if (id === 'admin') setIsAdminMenuOpen(!isAdminMenuOpen);
              };

              return (
                <div key={item.id}>
                  <Link
                    href={hasSubItems ? "#" : item.href}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        toggleMenu(item.id);
                      }
                    }}
                    className={`flex items-center justify-between px-6 py-3 transition-all duration-200 font-[family-name:var(--font-headline)] text-xs tracking-widest ${
                      isActive
                        ? "bg-primary/20 text-primary border-l-4 border-primary shadow-[inset_0_0_10px_rgba(143,175,60,0.2)]"
                        : "text-gray-400 hover:bg-[#1A1A1A] hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      {item.label}
                    </div>
                    {hasSubItems && (
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  {/* SubMenu */}
                  {hasSubItems && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-[#121414]"
                        >
                          {item.subItems?.map((subItem) => {
                            const subIsActive = activeTab === subItem.id;
                            return (
                              <Link
                                key={subItem.id}
                                href={subItem.href}
                                className={`flex items-center gap-3 pl-12 pr-6 py-2.5 transition-colors font-[family-name:var(--font-headline)] text-[10px] tracking-widest ${
                                  subIsActive
                                    ? "text-primary bg-primary/10"
                                    : "text-gray-500 hover:text-primary"
                                }`}
                              >
                                <subItem.icon size={12} />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-[#3A3A3A]/50">
            <button className="w-full bg-primary text-black font-bold py-3 text-[10px] font-[family-name:var(--font-headline)] tracking-widest flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors active:scale-95">
              <Terminal size={14} />
              TERMINAL_SYNC
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 text-red-500 mt-4 px-2 py-2 hover:bg-red-500/10 w-full transition-all text-xs font-[family-name:var(--font-headline)] tracking-widest"
            >
              <Power size={16} />
              Power_Down
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="ml-64 flex-1 p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
