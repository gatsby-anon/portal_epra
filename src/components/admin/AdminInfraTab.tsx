"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Cloud, Cpu, Activity, RefreshCcw, Terminal as TerminalIcon } from "lucide-react";

interface SystemStatus {
  status: "online" | "offline" | "scanning";
  database: string;
  region: string;
  latency: string;
  runtime: string;
  timestamp: string;
}

export default function AdminInfraTab() {
  const [status, setStatus] = useState<SystemStatus>({
    status: "scanning",
    database: "Neon Serverless",
    region: "Searching...",
    latency: "0ms",
    runtime: "Node.js 20.x",
    timestamp: new Date().toISOString()
  });

  const [logs, setLogs] = useState<string[]>([
    "Initializing system link...",
    "Syncing with Neon Cluster...",
    "Vercel Edge Network: ACTIVE"
  ]);

  const fetchStatus = async () => {
    setStatus(prev => ({ ...prev, status: "scanning" }));
    addLog("Manual Re-sync triggered...");
    
    try {
      const res = await fetch("/api/infra/ping");
      const data = await res.json();
      
      if (data.status === "online") {
        setStatus(data);
        addLog(`Link established: Latency ${data.latency}`);
        addLog(`DB Instance: ${data.database} [${data.region}]`);
      } else {
        setStatus(prev => ({ ...prev, status: "offline" }));
        addLog("LINK_FAILURE: Connection to Neon timed out.");
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, status: "offline" }));
      addLog("CRITICAL_ERROR: API endpoint unreachable.");
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Health Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Neon DB Card */}
        <InfraCard 
          title="DATABASE_LINK"
          status={status.status}
          icon={<Database className="text-[#A4C639]" size={20} />}
          details={[
            { label: "Status", value: status.status === "online" ? "ONLINE" : (status.status === "scanning" ? "SCANNING" : "OFFLINE") },
            { label: "Provider", value: "Neon" },
            { label: "Region", value: status.region }
          ]}
        />

        {/* Vercel Card */}
        <InfraCard 
          title="DEPLOY_STATUS"
          status="online"
          icon={<Cloud className="text-[#2D6CDF]" size={20} />}
          details={[
            { label: "Env", value: "Production" },
            { label: "Branch", value: "Main" },
            { label: "Last Build", value: "Success" }
          ]}
        />

        {/* System Card */}
        <InfraCard 
          title="RESOURCE_UTILIZATION"
          status="online"
          icon={<Cpu className="text-[#A4C639]" size={20} />}
          details={[
            { label: "Runtime", value: status.runtime },
            { label: "Latency", value: status.latency },
            { label: "Edge", value: "ACTIVE" }
          ]}
        />
      </div>

      {/* Terminal Log */}
      <div className="border border-[#3A3A3A] bg-[#0D0D0D] rounded-sm overflow-hidden shadow-2xl relative">
        <div className="bg-[#1A1A1A] px-4 py-2 border-b border-[#3A3A3A] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-[#A4C639]" />
            <span className="text-[10px] font-[family-name:var(--font-code)] text-gray-400 uppercase tracking-widest">
              System_Logs // Infrastructure_Terminal
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
            <div className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
            <div className="w-2 h-2 rounded-full bg-[#A4C639]" />
          </div>
        </div>
        
        <div className="p-4 h-48 font-[family-name:var(--font-code)] text-xs overflow-y-auto bg-[#0D0D0D] scrollbar-hide relative">
          {/* CRT Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-30" />
          
          <div className="space-y-1 relative z-20">
            {logs.map((log, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={log.includes("ERROR") || log.includes("FAILURE") ? "text-[#D64545]" : "text-gray-400"}
              >
                <span className="text-[#A4C639] mr-2">{">"}</span> {log}
              </motion.p>
            ))}
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-[#A4C639] ml-1 align-middle"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end">
        <button 
          onClick={fetchStatus}
          disabled={status.status === "scanning"}
          className="flex items-center gap-3 bg-[#A4C639] text-black font-black px-8 py-3 font-[family-name:var(--font-headline)] tracking-widest uppercase text-xs hover:bg-[#b8db40] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          <RefreshCcw size={16} className={status.status === "scanning" ? "animate-spin" : ""} />
          RE-SYNC SYSTEM
        </button>
      </div>
    </div>
  );
}

function InfraCard({ title, status, icon, details }: any) {
  const statusColor = status === "online" ? "#A4C639" : (status === "scanning" ? "#2D6CDF" : "#D64545");
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#1A1A1A]/80 border border-[#3A3A3A] p-6 rounded-sm relative overflow-hidden group"
    >
      {/* Glow Effect */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: statusColor }}
      />

      <div className="flex justify-between items-start mb-6">
        <div className="p-2 bg-[#0D0D0D] border border-[#3A3A3A] rounded-sm">
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            animate={status === "online" ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.2em]" style={{ color: statusColor }}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="text-gray-400 font-[family-name:var(--font-headline)] text-[10px] tracking-widest uppercase mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {details.map((detail: any, i: number) => (
          <div key={i} className="flex justify-between items-center border-b border-[#3A3A3A]/30 pb-2">
            <span className="text-[10px] font-[family-name:var(--font-code)] text-gray-600 uppercase">{detail.label}</span>
            <span className="text-[11px] font-[family-name:var(--font-code)] text-gray-300">{detail.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
