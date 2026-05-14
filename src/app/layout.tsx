import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EPRA // TERMINAL - Engenharia de Projetos e Robótica Aplicada",
  description:
    "Domine Arduino, C++ e Python através da engenharia prática. O EPRA democratiza a tecnologia de ponta no coração de Russas, transformando linhas de código em movimento.",
  keywords: ["EPRA", "robótica", "Arduino", "Python", "UFC Russas", "engenharia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="overflow-x-hidden bg-[#0D0D0D]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
