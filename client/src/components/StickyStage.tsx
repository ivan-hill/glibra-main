import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";

export default function StickyStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: 0.3 });
  return (
    <section ref={ref} className="relative h-[500svh] sm:h-[500svh]">
      <div data-active={active} className="sticky top-0 h-[100svh] w-full">
        {children}
      </div>
    </section>
  );
}