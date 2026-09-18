import { motion } from "framer-motion";

type Item = { key: string; label: string; img: string; start: number; z: number; align: "left"|"right"|"center"; };

const items: Item[] = [
  { key:"attraction", label:"List your tours & experiences",      img:"/images/waterfall-main.jpg", start:0.15, z:10, align:"left"   },
  { key:"accommodation", label:"Showcase your property to travelers",        img:"/images/stay.webp", start:0.20, z:20, align:"right"  },
  { key:"transportation", label:"Connect your vehicle rental service",            img:"/images/jeep-updated.jpg",    start:0.25, z:30, align:"center" },
  { key:"dining", label:"Feature your restaurant or catering",       img:"/images/dining-updated.jpg", start:0.30, z:40, align:"left" },
  { key:"photography", label:"Offer your photography services", img:"/images/couple-real.jpg", start:0.35, z:50, align:"right" },
];

function clamp01(x:number){ return Math.max(0, Math.min(1, x)); }
function easeIO(t:number){ return t<0.5? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
function localT(p:number, a:number, span=0.10){ if(p<=a) return 0; if(p>=a+span) return 1; return easeIO((p-a)/span); }

export default function OverlayStack({ progress }: { progress: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex:5 }}>
      {items.map((it) => {
        const t = localT(progress, it.start, 0.12);
        const visible = progress >= it.start - 0.02;
        const base =
          it.align==="left" ? "items-end justify-start p-4 sm:p-6" :
          it.align==="right"? "items-center justify-end p-4 sm:p-6" :
                              "items-start justify-center p-4 sm:p-6";
        return (
          <div key={it.key} className={`absolute inset-0 flex ${base}`} style={{ zIndex: it.z }}>
            <motion.div
              initial={{ opacity:0, y:32, scale:0.985 }}
              animate={{ opacity: visible? clamp01(t):0, y: visible? (1-t)*24:24, scale: 0.985 + t*0.015 }}
              transition={{ type:"tween", duration:0.5, ease:[0.2,0.7,0.2,1] }}
              className="w-[82%] sm:w-[65%] md:w-[55%] max-w-[640px] rounded-2xl overflow-hidden border border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <img src={it.img} alt="" loading={it.key==="stay"?"eager":"lazy"} decoding="async"
                   className="w-full h-40 sm:h-48 md:h-56 object-cover" />
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs md:text-sm text-white font-medium">
                {it.label}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}