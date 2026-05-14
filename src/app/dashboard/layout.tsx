"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminShell } from "@/components/layout/AdminShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout, sessionChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && sessionChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, router, sessionChecked]);

  if (!mounted || !sessionChecked) {
    return null; // Loading state - wait for session check
  }

  if (!isAuthenticated || !user) {
    return null; // Not authenticated - wait for redirect
  }

  // Determine active tab based on pathname
  let activeTab = "profile";
  if (pathname.includes("/content") || pathname.includes("/metrics")) activeTab = "content";
  if (pathname.includes("/admin")) activeTab = "admin";
  if (pathname.includes("/logs")) activeTab = "logs";

  return (
    <AdminShell activeTab={activeTab} userRole={user.role} onLogout={logout}>
      {children}
    </AdminShell>
  );
}
