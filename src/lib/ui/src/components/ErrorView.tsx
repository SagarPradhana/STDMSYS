"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@school-management/utils";

interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  className?: string;
}

export function ErrorView({ error, reset, className }: ErrorViewProps) {
  return (
    <div className={cn(
      "min-h-[60vh] flex flex-col items-center justify-center p-6 text-center",
      className
    )}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6"
      >
        <AlertCircle className="w-10 h-10 text-red-500" />
      </motion.div>

      <h1 className="text-3xl font-black tracking-tight mb-2 text-primary">Something went wrong</h1>
      <p className="text-muted max-w-md mb-8 font-medium">
        We encountered an unexpected error. Don't worry, your data is safe. You can try refreshing the page or going back home.
      </p>

      {error.digest && (
        <code className="block p-3 rounded-xl bg-surface-2 text-[10px] font-mono text-muted mb-8 border border-border">
          Error ID: {error.digest}
        </code>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={reset}
          className="btn-primary gap-2 h-12 px-6"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button 
          variant="outline"
          className="gap-2 h-12 px-6 rounded-xl"
          onClick={() => window.location.href = "/"}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
