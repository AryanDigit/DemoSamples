"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line/80 bg-paper/90 shadow-soft backdrop-blur-md"
          : "border-transparent bg-paper/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-10 w-10" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-navy sm:text-xs">
              {site.name}
            </span>
            <span className="hidden text-[0.65rem] text-muted sm:block">
              {site.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy/80 transition-colors hover:text-gold-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ShimmerButton
            href="#connect"
            className="h-10 px-5 text-xs uppercase tracking-[0.16em]"
          >
            Book 15 minutes
          </ShimmerButton>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-navy lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    document.body.style.overflow = "";
                    setOpen(false);
                    const target = document.querySelector(link.href);
                    window.setTimeout(() => {
                      target?.scrollIntoView({ behavior: "smooth" });
                    }, 80);
                  }}
                  className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-ivory"
                >
                  {link.label}
                </a>
              ))}
              <ShimmerButton
                href="#connect"
                className="mt-2 w-full"
                onClick={() => {
                  document.body.style.overflow = "";
                  setOpen(false);
                  window.setTimeout(() => {
                    document.querySelector("#connect")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 80);
                }}
              >
                Book 15 minutes
              </ShimmerButton>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
