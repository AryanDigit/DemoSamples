"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const shimmerClass =
  "group relative isolate inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-7 text-sm font-semibold tracking-wide text-navy shadow-gold transition-transform duration-300 will-change-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function ShimmerSurface({
  children,
  shimmerColor,
}: {
  children: ReactNode;
  shimmerColor: string;
}) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
      >
        <span
          className="absolute inset-[-100%] animate-shimmer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          }}
        />
      </span>
      <span className="relative z-10">{children}</span>
    </>
  );
}

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  background?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

/** Magic UI Shimmer Button — primary CTA pattern from 21st.dev / Magic UI. */
export function ShimmerButton({
  children,
  className,
  shimmerColor = "#fff8dc",
  background = "linear-gradient(135deg,#c4921a 0%,#e8b931 45%,#f5c84a 100%)",
  href,
  type = "button",
  onClick,
}: ShimmerButtonProps) {
  const style = { background };

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cn(shimmerClass, className)}
        style={style}
      >
        <ShimmerSurface shimmerColor={shimmerColor}>{children}</ShimmerSurface>
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(shimmerClass, className)}
      style={style}
    >
      <ShimmerSurface shimmerColor={shimmerColor}>{children}</ShimmerSurface>
    </button>
  );
}
