import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

const colorMap: Record<string, string> = {
  primary: "bg-primary shadow-[0_0_10px_rgba(177,211,92,0.5)]",
  "neon-green": "bg-neon-green shadow-[0_0_10px_rgba(164,198,57,0.5)]",
  "vibrant-yellow": "bg-vibrant-yellow shadow-[0_0_10px_rgba(242,194,48,0.5)]",
  "electric-blue": "bg-electric-blue shadow-[0_0_10px_rgba(45,108,223,0.5)]",
  "wire-red": "bg-wire-red shadow-[0_0_10px_rgba(214,69,69,0.5)]",
};

export function ProgressBar({ progress, color = "primary" }: ProgressBarProps) {
  const glowClass = colorMap[color] || colorMap.primary;
  
  return (
    <div className="w-full h-2 bg-zinc-900 mt-4 relative overflow-hidden border border-white/5">
      {/* Background Segments */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(90deg, #fff 2px, transparent 2px)",
          backgroundSize: "6px 100%"
        }}
      />
      
      {/* Progress Fill */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full ${glowClass} relative overflow-hidden ${progress >= 90 ? "animate-pulse" : ""}`}
      >
        {/* Fill Segments */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.3) 2px, transparent 2px)",
            backgroundSize: "6px 100%"
          }}
        />
        
        {/* Moving Highlight */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
        />
      </motion.div>
    </div>
  );
}
