"use client";

import { Check } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Discovery Call",
    price: "Free",
    cadence: "15 minutes",
    description: "A focused conversation to understand your goals, gaps, and next steps.",
    cta: "Book a discovery call",
    featured: false,
    features: [
      "Need-based diagnostic",
      "Protection vs growth snapshot",
      "Clear follow-up recommendation",
    ],
  },
  {
    name: "Comprehensive Planning",
    price: "₹12,500",
    cadence: "one-time blueprint",
    description: "A full financial map for your family, practice, and future milestones.",
    cta: "Start your blueprint",
    featured: true,
    features: [
      "Investment & insurance design",
      "Tax-efficient wealth strategies",
      "Child education & retirement paths",
      "Written action plan you can follow",
    ],
  },
  {
    name: "Annual Partnership",
    price: "₹36,000",
    cadence: "per year",
    description: "Ongoing reviews so your plan stays aligned as income and life change.",
    cta: "Talk annual care",
    featured: false,
    features: [
      "Quarterly portfolio check-ins",
      "Policy & tax-year reminders",
      "Priority WhatsApp / call access",
    ],
  },
];

/**
 * Three-tier pricing adapted from 21st.dev:
 * “Pricing Section” by brijr.
 */
export function Pricing() {
  return (
    <section id="pricing" className="bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">
            Consultation packages
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Start with 15 minutes. Stay for a lifetime plan.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Transparent retainers — no product-pushing. Fees below are illustrative
            starting points discussed after your discovery call.
          </p>
        </BlurFade>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, i) => (
            <BlurFade key={plan.name} delay={0.08 * i} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col rounded-3xl border p-7 transition-transform duration-300 hover:-translate-y-1",
                  plan.featured
                    ? "border-gold bg-navy text-ivory shadow-lift"
                    : "border-line bg-paper text-navy shadow-soft",
                )}
              >
                {plan.featured ? (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-navy">
                    Most chosen
                  </span>
                ) : (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-ivory px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
                    {plan.cadence}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-3 font-display text-4xl font-extrabold">
                  {plan.price}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    plan.featured ? "text-ivory/70" : "text-muted",
                  )}
                >
                  {plan.featured ? plan.cadence : plan.description}
                </p>
                {plan.featured ? (
                  <p className="mt-3 text-sm text-ivory/80">{plan.description}</p>
                ) : null}
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          plan.featured ? "text-gold" : "text-gold-deep",
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.featured ? (
                  <ShimmerButton href="#connect" className="mt-8 w-full">
                    {plan.cta}
                  </ShimmerButton>
                ) : (
                  <a
                    href="#connect"
                    className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full border border-navy/15 text-sm font-semibold hover:border-gold hover:bg-ivory"
                  >
                    {plan.cta}
                  </a>
                )}
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
