import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function MessageFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const [step, setStep] = useState<0|1|2|3>(0);

  useEffect(() => {
    if (!inView) return;
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 1800);
    const t2 = setTimeout(() => setStep(3), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  const Bubble = ({ who, children }: { who:"app"|"vendor"; children: React.ReactNode }) => (
    <div className={`flex ${who==="app"?"justify-start":"justify-end"} w-full`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 my-2 text-sm
        ${who==="app" ? "bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 text-gray-700"
                      : "bg-white border border-gray-200 text-gray-700"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <section ref={ref} className="bg-gray-50 py-16 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h3 className="font-orbitron text-2xl md:text-3xl font-semibold text-center gradient-title">Protected Booking Network</h3>
        <p className="mt-2 text-center text-gray-600">When issues arise, Glibra's AI seamlessly re-coordinates—protecting both hosts and travelers.</p>

        <div className="mt-8 rounded-3xl bg-white border border-gray-200 p-4 md:p-6 shadow-sm">
          {step>=1 && (
            <Bubble who="app">
              <div className="font-medium text-gray-800">Booking confirmed ✅</div>
              <div className="text-gray-600 mt-1">
                Cabin by the falls (Fri–Sun) • 4x4 pickup Fri 3pm • Dinner Sat 7:30 • Photo session Sun sunrise
              </div>
            </Bubble>
          )}
          {step>=2 && (
            <Bubble who="vendor">
              <div className="font-medium text-gray-800">Airbnb host cancelled ❌</div>
              <div className="text-gray-600 mt-1">Sorry—unexpected issue at the property for your dates.</div>
            </Bubble>
          )}
          {step>=3 && (
            <Bubble who="app">
              <div className="font-medium text-gray-800">Rebooked in 2 minutes 🔁</div>
              <div className="text-gray-600 mt-1">
                New cabin 0.6 miles from the waterfall, similar price & rating. All other bookings updated.
              </div>
            </Bubble>
          )}
        </div>

        <div className="text-center mt-8">
          <a 
            href="#service-selection"
            className="inline-block btn-gradient px-8 py-4 text-lg font-semibold rounded-xl"
            data-testid="btn-become-host"
          >
            Become a Host
          </a>
          <p className="text-sm text-gray-500 mt-3">Be part of our protected booking network</p>
        </div>
      </div>
    </section>
  );
}