"use client";

import type { ReactNode } from "react";

/** Lightweight enter fade that does not hide SSR content (better LCP). */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
