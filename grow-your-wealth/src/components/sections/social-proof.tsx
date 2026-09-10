"use client";

import { Check, Handshake } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";

const reasons = [
  "Need-based financial consulting",
  "Customized solutions for you & your family",
  "Focus on protection, growth & wealth creation",
  "Complete financial solutions under one roof",
  "Trusted guidance with transparency",
];

const specialties = [
  "Tax planning",
  "High-return investments",
  "Portfolio & risk management",
  "Retirement & succession",
  "Lifestyle-fitted plans",
  "Child education planning",
];

export function SocialProof() {
  return (
    <section id="proof" className="relative scroll-mt-28 overflow-hidden bg-navy py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(232,185,49,0.18), transparent 36%), radial-gradient(circle at 80% 80%, rgba(245,200,74,0.12), transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <BlurFade>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-navy">
              <Handshake className="h-4 w-4" />
              Why connect with me?
            </div>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-ivory sm:text-4xl">
              Trusted guidance for people who heal lives
            </h2>
            <ul className="mt-6 space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-ivory/90">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </BlurFade>

          <BlurFade delay={0.12}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 15, suffix: "+", label: "Years of counsel" },
                { value: 500, suffix: "+", label: "Families guided" },
                { value: 1, suffix: "", label: "Roof for all solutions" },
                { value: 15, suffix: " min", label: "To start a plan" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gold/25 bg-navy-soft/60 p-5 text-center"
                >
                  <p className="font-display text-3xl font-extrabold text-gold">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ivory/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center font-script text-3xl text-gold">
              You heal lives. We plan yours.
            </p>
          </BlurFade>
        </div>

        <div className="mt-12">
          <Marquee>
            {specialties.map((item) => (
              <span
                key={item}
                className="mx-1 whitespace-nowrap rounded-full border border-gold/30 px-4 py-2 text-sm text-ivory/90"
              >
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
