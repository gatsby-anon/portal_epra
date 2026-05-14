"use client";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/sections/Header";

type AuthMode = "LOGIN" | "REGISTER" | "SUCCESS";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, register, isLoading } = useAuth();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "LOGIN") {
      const result = await login({ email, password });
      if (!result.success) {
        setErrorMsg(result.error || "Authentication failed");
      }
    } else if (mode === "REGISTER") {
      if (!consentGiven) {
        setErrorMsg("You must accept the terms of use");
        return;
      }
      const result = await register({ fullName, email, password, course, consentGiven });
      if (result.success) {
        setMode("SUCCESS");
      } else {
        setErrorMsg(result.error || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="glass-panel p-12 max-w-md w-full space-y-8 relative">
          
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-headline)] text-3xl font-bold text-primary-container mb-2">
              EPRA // {mode === "REGISTER" ? "SIGN_UP" : "LOGIN"}
            </h1>
            <p className="font-[family-name:var(--font-code)] text-xs text-zinc-500 uppercase tracking-widest">
              {mode === "SUCCESS" ? "PROTOCOL_COMPLETED" : "AUTHENTICATION_REQUIRED"}
            </p>
          </div>

          {/* Mode Toggle */}
          {mode !== "SUCCESS" && (
            <div className="flex border-b border-border-gray">
              <button 
                onClick={() => setMode("LOGIN")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider font-[family-name:var(--font-headline)] transition-colors ${mode === "LOGIN" ? "text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Access
              </button>
              <button 
                onClick={() => setMode("REGISTER")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider font-[family-name:var(--font-headline)] transition-colors ${mode === "REGISTER" ? "text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="bg-error/10 border border-error p-3 text-error text-xs font-[family-name:var(--font-code)]">
              ERROR: {errorMsg}
            </div>
          )}

          {mode === "SUCCESS" ? (
            <div className="space-y-6 text-center py-8">
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                 <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-black font-bold">✓</div>
              </div>
              <div>
                <h3 className="text-primary font-[family-name:var(--font-headline)] font-bold text-lg mb-2">REGISTRATION_COMPLETE</h3>
                <p className="text-sm text-zinc-400 font-[family-name:var(--font-body)]">
                  Your account has been initialized and activated. Access is now granted.
                </p>
              </div>
              <button 
                onClick={() => setMode("LOGIN")}
                className="w-full bg-primary text-on-primary py-4 font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-hover transition-all"
              >
                PROCEED_TO_LOGIN
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              {mode === "REGISTER" && (
                <div>
                  <label className="block text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
                    FULL_NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-surface-container-lowest border border-border-gray px-4 py-3 text-white font-[family-name:var(--font-code)] text-sm focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
                  USER_ID (EMAIL)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@epra.ufc.br"
                  className="w-full bg-surface-container-lowest border border-border-gray px-4 py-3 text-white font-[family-name:var(--font-code)] text-sm focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
                  ACCESS_KEY (PASSWORD)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-lowest border border-border-gray px-4 py-3 text-white font-[family-name:var(--font-code)] text-sm focus:border-primary focus:outline-none transition-colors"
                  required
                  minLength={8}
                />
              </div>

              {mode === "REGISTER" && (
                <div>
                  <label className="block text-[10px] font-[family-name:var(--font-headline)] font-bold uppercase tracking-[0.1em] text-secondary-text mb-2">
                    COURSE (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="Engenharia de Software"
                    className="w-full bg-surface-container-lowest border border-border-gray px-4 py-3 text-white font-[family-name:var(--font-code)] text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              {mode === "REGISTER" && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <label htmlFor="consent" className="text-xs text-zinc-400 font-[family-name:var(--font-code)]">
                    I accept the <a href="/lgpd" className="text-primary hover:underline">terms of use</a> and LGPD consent
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-primary text-on-primary py-4 font-[family-name:var(--font-headline)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-[0_10px_30px_rgba(143,175,60,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "PROCESSING..." : mode === "LOGIN" ? "AUTHENTICATE" : "INITIALIZE_PROTOCOL"}
              </button>
            </form>
          )}

          <p className="text-center text-[10px] font-[family-name:var(--font-code)] text-zinc-600">
            SECURE_PROTOCOL // TLS_1.3
          </p>
        </div>
      </div>
    </div>
  );
}


