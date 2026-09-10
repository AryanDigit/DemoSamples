import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

/** Magic UI Marquee — looping social-proof strip used on 21st.dev landing blocks. */
export function Marquee({ children, className, reverse }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4 py-2 animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "animate-marquee-reverse",
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4 py-2 animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "animate-marquee-reverse",
        )}
      >
        {children}
      </div>
    </div>
  );
}
