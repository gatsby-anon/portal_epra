"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  text: string;
  type: "info" | "success";
}

interface TerminalTypingProps {
  prompt: string;
  command: string;
  steps: Step[];
}

export function TerminalTyping({ prompt, command, steps }: TerminalTypingProps) {
  const [currentText, setCurrentText] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);

  useEffect(() => {
    if (isTypingCommand) {
      if (currentText.length < command.length) {
        const timeout = setTimeout(() => {
          setCurrentText(command.slice(0, currentText.length + 1));
        }, Math.random() * 100 + 50); // "Hardware delay"
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTypingCommand(false);
          setShowSteps(true);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, command, isTypingCommand]);

  useEffect(() => {
    if (showSteps && visibleSteps < steps.length) {
      const timeout = setTimeout(() => {
        setVisibleSteps((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [showSteps, visibleSteps, steps.length]);

  return (
    <div className="crt-effect vignette p-6 font-[family-name:var(--font-code)] text-sm rounded-sm border border-primary/20 min-h-[200px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center">
          <span className="text-primary mr-2">{prompt}</span>
          <span className="text-white relative">
            {currentText}
            {isTypingCommand && (
              <span className="inline-block w-2 h-4 bg-neon-green ml-1 animate-terminal-blink align-middle shadow-[0_0_8px_#A4C639]" />
            )}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {steps.slice(0, visibleSteps).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 ${
                  step.type === "success" ? "text-neon-green" : "text-zinc-500"
                }`}
              >
                <span className="shrink-0">{">> "}</span>
                <span 
                  className="glitch-text" 
                  data-text={step.text}
                  style={{ 
                    textShadow: step.type === "success" ? "0 0 8px rgba(164, 198, 57, 0.4)" : "none"
                  } as React.CSSProperties}
                >
                  {step.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!isTypingCommand && visibleSteps === steps.length && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block w-2 h-4 bg-neon-green ml-1 animate-terminal-blink align-middle shadow-[0_0_8px_#A4C639]" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
