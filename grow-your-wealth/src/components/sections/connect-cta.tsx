"use client";

import { CalendarClock } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { site } from "@/lib/site";

export function ConnectCta() {
  return (
    <section id="connect" className="bg-ivory pb-16 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <BlurFade>
          <div className="relative overflow-hidden rounded-[2rem] bg-gold px-6 py-10 text-center shadow-gold sm:px-12 sm:py-14">
            <CalendarClock className="mx-auto h-12 w-12 text-navy" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-navy sm:text-3xl">
              Requesting 15 minutes of your valuable time
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy/80">
              I would be grateful for an opportunity to meet you and discuss how
              we can help you achieve financial peace, security and freedom.
            </p>
            <p className="mt-3 font-script text-4xl text-navy">Thank you!</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ShimmerButton
                href={site.phoneHref}
                background="linear-gradient(135deg,#00152d,#002147)"
                shimmerColor="rgba(245,200,74,0.7)"
                className="text-ivory shadow-none"
              >
                Call {site.phone}
              </ShimmerButton>
              <a
                href={site.emailHref}
                className="inline-flex h-12 items-center justify-center rounded-full border border-navy/20 bg-white/70 px-6 text-sm font-semibold text-navy hover:bg-white"
              >
                {site.email}
              </a>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
