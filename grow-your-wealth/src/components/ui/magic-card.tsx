"use client";

import { useCallback, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

/** Magic UI Magic Card — pointer-follow gold sheen used in 21st.dev feature grids. */
export function MagicCard({ children, className }: MagicCardProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-line bg-paper p-7 shadow-soft",
        className,
      )}
      style={
        {
          "--mx": `${pos.x}px`,
          "--my": `${pos.y}px`,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(232,185,49,0.18), transparent 42%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
