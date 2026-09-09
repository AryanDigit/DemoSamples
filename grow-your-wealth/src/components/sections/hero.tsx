"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { site } from "@/lib/site";

/**
 * Split hero adapted from 21st.dev:
 * “Hero with image, text and two buttons” by Tommy Jepsen.
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-br from-ivory via-paper to-[#efe6d4]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-navy/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-0 lg:pt-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10"
        >
          <p className="font-script text-3xl text-gold-deep sm:text-4xl">
            Hello Doctor,
          </p>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-navy/70">
            I&apos;m
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-gold sm:text-5xl lg:text-[3.35rem]">
            {site.founder}
          </h1>
          <p className="mt-3 inline-flex rounded-full bg-navy px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ivory">
            Founder – {site.name}
          </p>

          <Heart
            className="mt-5 h-8 w-8 text-gold"
            strokeWidth={1.6}
            aria-hidden
          />

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">
            Your financial well-being is as important as your patients&apos;. I
            help doctors and professionals make{" "}
            <span className="font-semibold text-gold-deep">
              smarter financial decisions
            </span>
            ,{" "}
            <span className="font-semibold text-gold-deep">protect</span> their
            family and{" "}
            <span className="font-semibold text-gold-deep">grow</span> their
            wealth.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ShimmerButton href="#connect" className="w-full sm:w-auto">
              Request 15 minutes
            </ShimmerButton>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-navy/15 bg-white/70 px-6 text-sm font-semibold text-navy transition-colors hover:border-gold hover:bg-ivory"
            >
              Explore solutions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-5 text-sm italic text-muted">{site.mantra}</p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[6px] border-gold bg-navy shadow-lift sm:aspect-[5/6] lg:aspect-auto lg:h-[34rem] lg:rounded-t-[14rem] lg:rounded-b-none lg:border-b-0">
            <Image
              src="/seeta-headshot.jpg"
              alt="Seeta Rochani, founder of Grow Your Wealth"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover object-[center_12%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent p-5 lg:hidden">
              <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-gold">
                {site.mantra}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
