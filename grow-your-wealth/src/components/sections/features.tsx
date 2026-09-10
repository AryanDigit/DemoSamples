"use client";

import { Shield, Sprout, Umbrella } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

const features = [
  {
    icon: Sprout,
    title: "Investment Planning",
    copy: "Grow your wealth with a need-based strategy built around your practice, family, and time horizon.",
  },
  {
    icon: Shield,
    title: "Health & Life Insurance",
    copy: "Protect the people who depend on you with the right cover — so your healing work never leaves home exposed.",
  },
  {
    icon: Umbrella,
    title: "Retirement Planning",
    copy: "Plan today for a worry-free, dignified tomorrow — with income that outlasts a demanding career.",
  },
];

/**
 * Three-up feature grid adapted from 21st.dev:
 * “Grid Feature Cards” by Efferd.
 */
export function Features() {
  return (
    <section id="features" className="scroll-mt-28 bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">
            Complete financial solutions
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Three pillars for doctors &amp; professionals
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Protection, growth, and a future you can actually enjoy — tailored
            under one roof in Surat.
          </p>
        </BlurFade>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <BlurFade key={item.title} delay={0.08 * i}>
              <MagicCard className="h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold shadow-gold">
                  <item.icon className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.copy}
                </p>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
