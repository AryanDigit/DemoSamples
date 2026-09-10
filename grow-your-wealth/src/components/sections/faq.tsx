"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Who is this practice built for?",
    a: "Doctors and other busy professionals in and around Surat who want protection, growth, and a clear plan without juggling five different advisors.",
  },
  {
    q: "What happens in the 15-minute meeting?",
    a: "We listen to your family goals, current cover, and investments, then outline whether a deeper blueprint would actually help — with no obligation to buy a product.",
  },
  {
    q: "Do you sell only insurance or mutual funds?",
    a: "No. The work is need-based: insurance, investments, retirement, child education, loans, and tax-efficient wealth creation — under one roof.",
  },
  {
    q: "Are the package prices fixed?",
    a: "Discovery is free. Comprehensive and annual fees are starting points and are confirmed in writing after we understand complexity, so there are no surprises.",
  },
  {
    q: "Can we meet outside clinic hours?",
    a: "Yes. Evening and weekend slots in Surat are available so your patients come first.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-28 bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <BlurFade>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold-deep">
            Questions
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Straightforward answers
          </h2>
        </BlurFade>
        <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-ivory/60">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-display text-base font-semibold text-navy">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-gold-deep transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
