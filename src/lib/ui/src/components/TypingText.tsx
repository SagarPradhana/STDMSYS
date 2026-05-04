"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export function TypingText({ text, className, speed = 30, delay = 800, showCursor = true }: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const idxRef = useRef(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      idxRef.current = 0;
      setDone(false);

      const interval = setInterval(() => {
        if (idxRef.current < text.length) {
          setDisplayed(text.slice(0, idxRef.current + 1));
          idxRef.current += 1;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  useEffect(() => {
    if (!done || !showCursor) return;
    const blink = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(blink);
  }, [done, showCursor]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayed}
      {showCursor && (
        <span
          className="inline-block w-[2px] h-[1em] bg-white/70 ml-0.5 align-text-bottom rounded-sm"
          style={{
            opacity: done ? (cursorVisible ? 1 : 0) : 1,
            transition: "opacity 0.1s",
          }}
        />
      )}
    </motion.span>
  );
}
