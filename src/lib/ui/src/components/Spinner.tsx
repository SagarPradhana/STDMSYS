"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@school-management/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <motion.div
          className={cn(
            "rounded-full border-t-transparent border-indigo-500",
            sizeClasses[size]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        {size === "xl" && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/30 border-t-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}
