"use client";

import { useEffect } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { MissionLog } from "@/components/sections/MissionLog";
import { ModuleGrid } from "@/components/sections/ModuleGrid";
import { Challenge } from "@/components/sections/Challenge";
import { Testimonials } from "@/components/sections/Testimonials";
import { Courses } from "@/components/sections/Courses";
import { Portfolio } from "@/components/sections/Portfolio";
import { Recruitment } from "@/components/sections/Recruitment";
import { BibliotecaSection } from "@/components/sections/BibliotecaSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  useEffect(() => {
    // Force clean URL if it has #hero on mount
    if (window.location.hash === '#hero') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Metrics />
        <MissionLog />
        <ModuleGrid />
        <Challenge />
        <Testimonials />
        <Courses />
        <Portfolio />
        <Recruitment />
        <BibliotecaSection />
      </main>
      <Footer />
    </>
  );
}

