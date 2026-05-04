"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "@school-management/utils";

interface LoadingProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

export function Loading({ fullPage = true, message = "Loading EDUFLOW...", className }: LoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-5",
      fullPage ? "fixed inset-0 z-[9999] bg-white dark:bg-[#0F0E1A]" : "p-12",
      className
    )}>
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-500/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/15"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
          <GraduationCap className="w-8 h-8 text-white" />
          <motion.div
            className="absolute -inset-1.5 rounded-[20px] border-2 border-t-white/90 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black tracking-widest text-xs uppercase"
        >
          {message}
        </motion.p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
