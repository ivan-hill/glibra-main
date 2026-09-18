import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export function initOnboardAnimations(): (() => void) | undefined {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const main = document.querySelector("#main") as HTMLElement | null;
  if (!main) return;

  const isMobile = window.innerWidth <= 768;

  /* ── 1. LOADER + HERO REVEAL ── */
  const tl = gsap.timeline();

  // Hide nav logo and menu before animation starts
  gsap.set(".de-logo", { opacity: 0, x: 40 });
  gsap.set(".de-menu-btn", { opacity: 0 });

  tl.from("#loader-logo", {
    x: 60,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power3.out",
  });
  tl.to("#loader-logo", {
    x: -60,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    ease: "power2.in",
  });
  tl.to("#loader", { opacity: 0, duration: 0.3 });
  tl.to("#loader", { display: "none" });

  // Nav logo slides in from right — same motion as the loader
  tl.to(".de-logo", {
    x: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power3.out",
  });
  // Menu button fades in alongside
  tl.to(".de-menu-btn", { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");

  tl.from(
    "#page1 #overlay .de-hero-h1 span, #page1 #overlay h1 span",
    { y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" },
    "-=0.2",
  );
  tl.from(
    ["#page1 .de-hero-desc", "#page1 .de-hero-scroll"],
    { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    "-=0.3",
  );

  /* ── 2. BLOB CURSOR (desktop, hero overlay only) ── */
  const overlay = document.querySelector("#overlay");
  const cursor = document.querySelector("#cursor") as HTMLElement | null;
  if (overlay && cursor && !isMobile) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    overlay.addEventListener("mouseenter", () =>
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }),
    );
    overlay.addEventListener("mouseleave", () =>
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 }),
    );
    overlay.addEventListener("mousemove", (event) => {
      const e = event as MouseEvent;
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    });
  }

  /* ── HELPER: on-entry reveal (no scrub — plays the moment section enters) ── */
  const reveal = (
    targets: string | Element | Element[],
    trigger: string,
    opts: { y?: number; x?: number; delay?: number; stagger?: number } = {},
  ) => {
    gsap.from(targets, {
      y: opts.y ?? 50,
      x: opts.x ?? 0,
      opacity: 0,
      duration: 0.9,
      delay: opts.delay ?? 0,
      stagger: opts.stagger ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  };

  /* ── 3. PAGE 2 — FORK LABEL + CELLS ── */
  reveal("#page2-label", "#page2", { y: 40 });

  document.querySelectorAll<HTMLElement>(".de-fork-cell").forEach((cell, i) => {
    gsap.from(cell, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#page2 .de-fork-grid",
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ── 4. PAGE 3 — SWIPER ── */
  const swiperEl = document.querySelector(".de-marquee");
  let swiperInstance: Swiper | null = null;
  if (swiperEl) {
    swiperInstance = new Swiper(".de-marquee", {
      modules: [Autoplay],
      direction: "horizontal",
      loop: true,
      autoplay: { delay: 0, disableOnInteraction: false },
      speed: 8000,
      slidesPerView: "auto",
      freeMode: true,
    } as any);
  }

  reveal("#page3-top h2 .de-underline", "#page3", { y: 30 });
  reveal("#page3-top .de-page3-sub", "#page3", { y: 20, delay: 0.1 });

  /* ── 5. PAGE 4 — WORK LIST ── */
  reveal("#page4-header h2", "#page4", { y: 40 });

  document.querySelectorAll<HTMLElement>(".de-work-item").forEach((item, i) => {
    gsap.from(item, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".de-work-list",
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ── 6. PAGE 5 — PHILOSOPHY ── */
  reveal(["#page5-title h3", "#page5-title .de-quote"], "#page5", {
    y: 50,
    stagger: 0.15,
  });
  reveal(
    ["#page5-content p", "#page5-content .de-ul-link"],
    "#page5-content",
    { y: 40, stagger: 0.12 },
  );

  /* ── 7. PAGE 6 — STATS + CTA ── */
  reveal("#page6-top", "#page6", { y: 30 });

  document.querySelectorAll<HTMLElement>(".de-info-cell").forEach((cell, i) => {
    gsap.from(cell, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#info",
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  reveal("#page6-bottom h1 span, #page6-bottom .de-outline-h1 span", "#page6-bottom", { y: 60, stagger: 0.1 });
  reveal([".de-cta-sub", ".de-btn-flood"], "#page6-bottom", {
    y: 30,
    stagger: 0.1,
    delay: 0.2,
  });

  ScrollTrigger.refresh();

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (swiperInstance) {
      try { swiperInstance.destroy(true, true); } catch {}
    }
  };
}
