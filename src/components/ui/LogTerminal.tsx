"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "ROOT";
  message: string;
}

interface LogTerminalProps {
  logs: LogEntry[];
  title?: string;
}

export function LogTerminal({ logs, title = "System_Logs.sh" }: LogTerminalProps) {
  const [command, setCommand] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INFO": return "text-primary";
      case "WARN": return "text-vibrant-yellow";
      case "ERROR": return "text-error";
      case "DEBUG": return "text-gray-400";
      case "ROOT": return "text-primary";
      default: return "text-gray-300";
    }
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden border-[#3A3A3A] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Terminal Header */}
      <div className="bg-[#0D0D0D] px-4 py-2 border-b border-[#3A3A3A] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-error/40 border border-error/50"></span>
          <span className="w-3 h-3 rounded-full bg-vibrant-yellow/40 border border-vibrant-yellow/50"></span>
          <span className="w-3 h-3 rounded-full bg-primary/40 border border-primary/50"></span>
          <span className="ml-4 font-[family-name:var(--font-headline)] text-[10px] font-bold tracking-[0.1em] text-gray-400 uppercase">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-[family-name:var(--font-code)] text-gray-500 italic">TTY/S0 - 9600 BAUD</span>
      </div>

      {/* Terminal Body */}
      <div className="bg-[#0D0D0D] p-6 font-[family-name:var(--font-code)] text-xs h-64 overflow-y-auto space-y-2 text-gray-300">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span className={`${getLevelColor(log.level)} shrink-0`}>
              {log.level === "ROOT" ? "ROOT@EPRA:" : `${log.level}:`}
            </span>
            <span className={log.level === "ERROR" || log.level === "WARN" ? getLevelColor(log.level) : ""}>
              {log.message}
            </span>
          </div>
        ))}
        <div className="flex gap-4 items-center">
          <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]</span>
          <span className="text-primary shrink-0">ROOT@EPRA:</span>
          <span className="animate-pulse">_</span>
        </div>
        <div ref={endOfMessagesRef} />
      </div>

      {/* Terminal Input */}
      <div className="border-t border-[#3A3A3A] bg-[#1A1A1A] p-2 flex gap-4">
        <span className="text-primary font-[family-name:var(--font-code)] text-xs pl-4">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="ENTER_COMMAND_SEQUENCE"
          className="bg-transparent border-none text-xs font-[family-name:var(--font-code)] focus:ring-0 p-0 w-full text-[#e3e2e2] outline-none"
        />
      </div>
    </div>
  );
}
