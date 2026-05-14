"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useAuth } from "@/context/AuthContext";
import content from "@/data/content.json";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();
  const { user, isAuthenticated, logout } = useAuth();

  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);

    // D-01: Handle external page links (like /galeria)
    if (!href.startsWith("#")) {
      const targetPath = href.startsWith("/") ? href : `/${href}`;
      window.location.href = targetPath;
      return;
    }

    // D-02: Handle anchors when on a subpage
    if (pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    // D-03: Handle anchors on the same page (Home)
    const id = href.replace("#", "");
    if (id === "hero" || id === "" || href === "/") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      return;
    }
    scrollTo(id);
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 border-b border-border-gray transition-all ${
        scrolled ? "bg-surface-container-lowest/95 shadow-[0_0_15px_rgba(143,175,60,0.1)]" : "bg-surface-container-lowest/90"
      } backdrop-blur-xl`}
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {content.nav.map((item) => {
            const isActive = 
              (item.href === 'galeria' && pathname === '/galeria') || 
              (item.href.startsWith('#') && pathname === '/' && (item.active || false)); // Simple check, ideally use observer
            
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.href)}
                className={`font-[family-name:var(--font-headline)] tracking-tight uppercase text-sm transition-colors ${
                  isActive
                    ? "text-primary-container border-b-2 border-primary-container pb-1 font-semibold"
                    : "text-gray-400 font-medium hover:text-primary-container"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>


        {/* User Menu or Login Button */}
        {isAuthenticated && user ? (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="text-primary text-xs font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm font-[family-name:var(--font-headline)]">
                {user.fullName}
              </span>
            </Link>
            <button
              onClick={logout}
              className="text-zinc-400 hover:text-wire-red text-xs font-[family-name:var(--font-headline)] uppercase tracking-wider transition-colors"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link href="/login" className="hidden md:block bg-primary-container/10 border border-primary-container/50 text-primary-container px-4 py-2 font-[family-name:var(--font-headline)] tracking-tight uppercase text-xs font-semibold hover:bg-surface-container-low active:scale-95 transition-all">
            LOGIN
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary-container"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border-gray bg-surface-container-lowest/95 backdrop-blur-xl"
        >
          <nav className="flex flex-col px-8 py-4 gap-4">
            {content.nav.map((item) => {
              const isActive = 
                (item.href === 'galeria' && pathname === '/galeria') || 
                (item.href.startsWith('#') && pathname === '/' && (item.active || false));

              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.href)}
                  className={`text-left font-[family-name:var(--font-headline)] tracking-tight uppercase text-sm transition-colors ${
                    isActive ? "text-primary-container font-semibold" : "text-gray-400"
                  } hover:text-primary-container`}
                >
                  {item.label}
                </button>
              );
            })}

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 py-2 border-b border-border-gray">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-[family-name:var(--font-headline)]">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="mt-2 text-left text-wire-red font-[family-name:var(--font-headline)] tracking-tight uppercase text-sm"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-2 bg-primary-container/10 border border-primary-container/50 text-primary-container px-4 py-2 text-center font-[family-name:var(--font-headline)] tracking-tight uppercase text-xs font-semibold">
                LOGIN
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
