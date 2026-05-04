"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

export function NotFoundView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-base overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mb-8"
      >
        <span className="text-[180px] font-black leading-none text-primary/5 select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-surface shadow-2xl flex items-center justify-center border border-border">
            <Search className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>
      </motion.div>

      <h1 className="text-4xl font-black tracking-tight mb-4 text-primary uppercase">Page Not Found</h1>
      <p className="text-muted max-w-md mb-10 font-medium text-lg">
        Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="btn-primary gap-2 h-14 px-8 rounded-2xl shadow-xl">
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="gap-2 h-14 px-8 rounded-2xl border-2 hover:bg-surface-2 transition-all"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </Button>
      </div>

      <div className="mt-16 pt-8 border-t border-border/50 w-full max-w-xs text-xs text-muted font-bold tracking-widest uppercase">
        EDUFLOW SCHOOL MANAGEMENT
      </div>
    </div>
  );
}
