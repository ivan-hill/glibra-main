import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { initOnboardAnimations } from "@/lib/animations/onboardAnimations";
import AveryMascot from "../components/AveryMascot";
import glibbraLogo from "@assets/fulllogo_transparent_1755820006270_1777575902769.png";
import { Sun, Moon, ChevronDown } from "lucide-react";

function animateCounter(setter: (n: number) => void, target: number, duration: number) {
  const start = performance.now();
  const run = (now: number) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    setter(Math.round(ease * target));
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

const PROVIDER_CATEGORIES = [
  { label: "Short-term rental hosts", icon: "🏡" },
  { label: "Boutique lodging", icon: "🏨" },
  { label: "Independent restaurants", icon: "🍽" },
  { label: "Wineries", icon: "🍷" },
  { label: "Farms & agritourism", icon: "🌾" },
  { label: "Tour guides", icon: "🗺" },
  { label: "Photographers", icon: "📷" },
  { label: "Transportation providers", icon: "🚐" },
  { label: "Local experience operators", icon: "🛶" },
  { label: "Wellness providers", icon: "🧘" },
  { label: "Outdoor activity operators", icon: "🥾" },
];

const FAQ_ITEMS = [
  {
    q: "Who can join Glibra?",
    a: "Glibra is designed for hosts, restaurants, wineries, farms, guides, photographers, transportation providers, and local experience operators who want to participate in coordinated regional travel bundles.",
  },
  {
    q: "Does Glibra replace my existing booking system?",
    a: "No. Glibra is a coordination layer that helps travelers discover and organize local providers as part of a connected trip plan. Your current setup stays intact.",
  },
  {
    q: "Does Glibra guarantee bookings?",
    a: "No. Glibra helps improve discovery and coordination, but individual bookings depend on provider availability and traveler demand.",
  },
  {
    q: "What happens if a provider becomes unavailable?",
    a: "Glibra helps travelers adjust their plan by surfacing possible backup options or revised itinerary paths where available.",
  },
  {
    q: "Is Glibra an insurance product?",
    a: "No. Glibra is not travel insurance and does not provide claim-based coverage, reimbursement, or insured protection. Glibra provides coordination assistance and fallback planning.",
  },
  {
    q: "What is the Finger Lakes pilot program?",
    a: "Glibra is launching its first regional network in the Finger Lakes, Upstate New York. Local providers in this region can apply now to be included in coordinated travel bundles during the pilot.",
  },
];

export default function WebGLStory() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lightMode, setLightMode] = useState(() => {
    try { return localStorage.getItem("de-theme") === "light"; } catch { return false; }
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleTheme = () => {
    setLightMode(prev => {
      const next = !prev;
      try { localStorage.setItem("de-theme", next ? "light" : "dark"); } catch {}
      return next;
    });
  };

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const [s1, setS1] = useState(0);
  const [s2, setS2] = useState(0);
  const [s3, setS3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const countersStarted = useRef(false);

  useEffect(() => {
    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768 ||
      "ontouchstart" in window;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    const cleanup = initOnboardAnimations();
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;
    if (!ring || !dot) return;

    let mx = -200, my = -200, rx = -200, ry = -200;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const raf = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersStarted.current) {
          countersStarted.current = true;
          animateCounter(setS1, 120, 1800);
          animateCounter(setS2, 8, 900);
          animateCounter(setS3, 15, 1600);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <div
      id="main"
      data-scroll-container
      className={`dark-editorial${lightMode ? " de-light" : ""}${menuOpen ? " menu-open" : ""}`}
    >
      {/* ── LOADER ── */}
      <div id="loader">
        <img src={glibbraLogo} alt="GLIBRA" id="loader-logo" />
      </div>

      {/* ── CURSORS ── */}
      {!isMobile && (
        <>
          <div ref={cursorRef} id="cursor" className="de-cursor">Explore</div>
          <div ref={cursorRingRef} className="de-ring" />
          <div ref={cursorDotRef} className="de-dot" />
        </>
      )}

      {/* SEO H1 — visible to search engines and screen readers */}
      <h1 className="sr-only">Join Glibra as a Host or Local Provider</h1>

      {/* ── NAV ── */}
      <nav className="de-nav">
        <a href="/" className="de-logo">
          <img src={glibbraLogo} alt="GLIBRA — Finger Lakes provider network" className="de-logo-img" />
        </a>

        <div className="de-nav-right">
          <button className="de-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {lightMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button className="de-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <div className="de-split-wrap">
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span>{menuOpen ? "Menu" : "Close"}</span>
          </div>
          <div className="de-burger">
            <span className="de-bl" />
            <span className="de-bl" />
            <span className="de-bl" />
          </div>
        </button>
        </div>
      </nav>

      {/* ── MENU OVERLAY ── */}
      <div className="de-menu-overlay" aria-hidden={!menuOpen}>
        <ul className="de-menu-list">
          <li>
            <a href="/checkout" onClick={() => setMenuOpen(false)}>
              <div className="de-mli">
                <span>List My Service</span>
                <span>List My Service</span>
              </div>
              <span className="de-m-arrow">→ Providers</span>
            </a>
          </li>
          <li>
            <a href="#page-providers" onClick={() => setMenuOpen(false)}>
              <div className="de-mli">
                <span>Who Can Join</span>
                <span>Who Can Join</span>
              </div>
              <span className="de-m-arrow">→ Eligibility</span>
            </a>
          </li>
          <li>
            <a href="#page2" onClick={() => setMenuOpen(false)}>
              <div className="de-mli">
                <span>Plan a Trip</span>
                <span>Plan a Trip</span>
              </div>
              <span className="de-m-arrow">→ Travelers</span>
            </a>
          </li>
          <li>
            <a href="#page-faq" onClick={() => setMenuOpen(false)}>
              <div className="de-mli">
                <span>Provider FAQ</span>
                <span>Provider FAQ</span>
              </div>
              <span className="de-m-arrow">→ Questions</span>
            </a>
          </li>
          <li>
            <a href="mailto:ivan@glibra.com" onClick={() => setMenuOpen(false)}>
              <div className="de-mli">
                <span>Get in Touch</span>
                <span>Get in Touch</span>
              </div>
              <span className="de-m-arrow">→ Contact</span>
            </a>
          </li>
        </ul>
        <div className="de-menu-foot">
          <a href="#">Geneva, NY</a>
          <a href="mailto:ivan@glibra.com">ivan@glibra.com</a>
          <span>©2025 Glibra Inc.</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PAGE 1 — HERO
      ══════════════════════════════════════ */}
      <section id="page1" data-scroll-section>
        <div className="de-hero-kicker">Finger Lakes · Pilot 2025 · Provider Onboarding</div>
        <div id="overlay">
          <h2 className="de-hero-h1">
            <span>Travel,</span>
            <span className="de-outline">handled.<sup className="de-tm">™</sup></span>
          </h2>
          <div className="de-hero-bottom">
            <p className="de-hero-desc">
              Join Glibra as a local provider and become part of coordinated Finger Lakes travel bundles.
            </p>
            <div className="de-hero-scroll">
              Scroll
              <div className="de-scroll-line" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PAGE 2 — CHOOSE PATH
      ══════════════════════════════════════ */}
      <section id="page2" data-scroll-section>
        <div id="page2-label">
          <span>I'm here to...</span>
          <span>Choose your path</span>
        </div>

        <div className="de-fork-grid">
          {/* HOST */}
          <a className="de-fork-cell host" href="/checkout" aria-label="Finger Lakes provider onboarding for Glibra">
            <div className="de-fork-wm" aria-hidden="true">01</div>
            <div className="de-fork-top">
              <span className="de-fork-idx">01 —</span>
              <span className="de-fork-pill">Hosts &amp; Providers</span>
            </div>
            <div className="de-fork-bottom">
              <div style={{ marginBottom: "1rem" }}>
                {["Get", "inside"].map((w, i) => (
                  <span key={i} className="de-wt">
                    <span className="de-wti">
                      <span>{w}</span>
                      <span className="alt">{w}</span>
                    </span>
                  </span>
                ))}
                <br />
                {["real", "plans."].map((w, i) => (
                  <span key={i} className="de-wt">
                    <span className="de-wti">
                      <span>{w}</span>
                      <span className="alt">{w}</span>
                    </span>
                  </span>
                ))}
              </div>
              <p className="de-fork-desc">
                Join the cooperative. Your winery, inn, farm, or local experience gets placed inside coordinated trip bundles — discovered by travelers already planning Finger Lakes trips.
              </p>
              <div className="de-fork-cta-row">
                <span className="de-fork-cta-txt">List My Service</span>
                <div className="de-fork-arrow">→</div>
              </div>
            </div>
          </a>

          {/* TRAVELER */}
          <a className="de-fork-cell traveler" href="#page4" aria-label="Local host participating in coordinated Upstate New York travel">
            <div className="de-fork-wm" aria-hidden="true">02</div>
            <div className="de-fork-top">
              <span className="de-fork-idx">02 —</span>
              <span className="de-fork-pill">Travelers</span>
            </div>
            <div className="de-fork-bottom">
              <div style={{ marginBottom: "1rem" }}>
                {["Stop", "juggling"].map((w, i) => (
                  <span key={i} className="de-wt">
                    <span className="de-wti">
                      <span>{w}</span>
                      <span className="alt">{w}</span>
                    </span>
                  </span>
                ))}
                <br />
                <span className="de-wt">
                  <span className="de-wti">
                    <span>apps.</span>
                    <span className="alt">apps.</span>
                  </span>
                </span>
              </div>
              <p className="de-fork-desc">
                Tell Avery your vision. Get a fully coordinated Finger Lakes weekend — lodging, tastings, transport — built from a network of local independent providers.
              </p>
              <div className="de-fork-cta-row">
                <span className="de-fork-cta-txt">Plan a Trip</span>
                <div className="de-fork-arrow">→</div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PAGE 3 — SWIPER MARQUEE
      ══════════════════════════════════════ */}
      <section id="page3" data-scroll-section>
        <div id="page3-top">
          <h2><span className="de-underline">What we coordinate</span></h2>
          <p className="de-page3-sub">Every piece of your Finger Lakes trip — local, independent, and bundled.</p>
        </div>
        <div className="swiper de-marquee">
          <div className="swiper-wrapper">
            {[
              { b: "Wineries", s: "Seneca & Cayuga trails" },
              { b: "Lodging", s: "Inns, cottages & B&Bs" },
              { b: "Farms", s: "Agritourism & pick-your-own" },
              { b: "Tours", s: "Guided experiences" },
              { b: "Transport", s: "Local shuttles & rentals" },
              { b: "Dining", s: "Farm-to-table & lakeside" },
              { b: "Photography", s: "Portrait & event shoots" },
              { b: "Wellness", s: "Spas & retreats" },
              { b: "Outdoors", s: "Kayak, hike & cycle" },
              { b: "Wineries", s: "Seneca & Cayuga trails" },
              { b: "Lodging", s: "Inns, cottages & B&Bs" },
              { b: "Farms", s: "Agritourism & pick-your-own" },
              { b: "Tours", s: "Guided experiences" },
              { b: "Transport", s: "Local shuttles & rentals" },
              { b: "Dining", s: "Farm-to-table & lakeside" },
              { b: "Photography", s: "Portrait & event shoots" },
              { b: "Wellness", s: "Spas & retreats" },
              { b: "Outdoors", s: "Kayak, hike & cycle" },
            ].map((item, i) => (
              <div key={i} className="swiper-slide de-slide">
                <b>{item.b}</b>
                <span className="de-slide-dot" />
                <span>{item.s}</span>
                <span className="de-slide-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROVIDER NETWORK — WHO CAN JOIN
      ══════════════════════════════════════ */}
      <section id="page-providers" data-scroll-section className="de-providers-section animate-section">
        <div className="de-providers-header">
          <span className="de-providers-kicker">Provider network · Finger Lakes pilot</span>
          <h2 className="de-providers-title">
            Who can <em>join</em> Glibra
          </h2>
          <p className="de-providers-sub">
            Regional travel depends on many independent operators. A traveler may need lodging from one provider,
            transportation from another, dining from a restaurant, and activities from separate farms, wineries,
            guides, or local operators. Glibra connects these pieces into clearer trip plans.
          </p>
        </div>
        <div className="de-providers-grid">
          {PROVIDER_CATEGORIES.map((cat, i) => (
            <div key={i} className="de-provider-chip">
              <span className="de-provider-icon" aria-hidden="true">{cat.icon}</span>
              <span className="de-provider-label">{cat.label}</span>
            </div>
          ))}
        </div>
        <div className="de-providers-cta">
          <a href="/checkout" className="de-btn-flood">
            <span>Submit Your Business →</span>
          </a>
          <a href="mailto:ivan@glibra.com" className="de-ul-link">Join the Finger Lakes Pilot →</a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PAGE 4 — HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="page4" data-scroll-section>
        <div id="page4-header">
          <h2>
            How <em>Glibra</em>
            <br />
            works for you
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: ".62rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--de-dim)",
            maxWidth: "200px",
            textAlign: "right",
            lineHeight: "1.6",
          }}>
            Providers &amp; travelers.<br />One coordinated network.
          </p>
        </div>
        <ul className="de-work-list">
          {[
            { num: "01", name: "List your service on Glibra", tag: "Provider onboarding · Finger Lakes pilot" },
            { num: "02", name: "Travelers discover your offering", tag: "AI-matched bundles · Real trip plans" },
            { num: "03", name: "Your service joins a coordinated bundle", tag: "Local cooperative · Pre-cleared inventory" },
            { num: "04", name: "Fallback paths keep plans on track", tag: "Adjusted itinerary · No insurance language" },
          ].map((item) => (
            <li key={item.num} className="de-work-item">
              <div className="de-work-left">
                <span className="de-work-num">{item.num}</span>
                <div>
                  <div className="de-work-name">
                    <span className="de-work-name-wrap">{item.name}</span>
                  </div>
                  <div className="de-work-tag">{item.tag}</div>
                </div>
              </div>
              <span className="de-work-arrow">→</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════
          PAGE 5 — PHILOSOPHY
      ══════════════════════════════════════ */}
      <section id="page5" data-scroll-section>
        <div id="page5-title">
          <h3>Our philosophy</h3>
          <p className="de-quote">
            The burden isn't
            <br />
            the destination —
            <br />
            it's <strong>starting over.</strong>
          </p>
        </div>
        <div id="page5-content">
          <p>
            When one part of a traveler's plan changes, Glibra helps guide the traveler toward possible
            backup options or adjusted itinerary paths where available — without calling it insurance,
            and without starting from scratch.
            <br /><br />
            For providers, this means your service stays relevant even when plans shift. Small towns win
            when the whole network holds together.
          </p>
          <a href="mailto:ivan@glibra.com" className="de-ul-link">Become a Glibra Provider →</a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROVIDER FAQ
      ══════════════════════════════════════ */}
      <section id="page-faq" data-scroll-section className="de-faq-section animate-section">
        <div className="de-faq-header">
          <span className="de-providers-kicker">Questions · Provider FAQ</span>
          <h2 className="de-providers-title">Common questions</h2>
        </div>
        <ul className="de-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <li key={i} className={`de-faq-item${openFaq === i ? " open" : ""}`}>
              <button
                className="de-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{item.q}</span>
                <ChevronDown size={16} className="de-faq-chevron" />
              </button>
              <div className="de-faq-a">
                <p>{item.a}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="de-faq-cta">
          <a href="/checkout" className="de-ul-link">Join as a Provider →</a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PAGE 6 — STATS + CTA
      ══════════════════════════════════════ */}
      <section id="page6" data-scroll-section>
        <div id="page6-top">
          <p>Glibra in numbers</p>
          <p>Geneva, New York · 2025</p>
        </div>

        <div id="info" ref={statsRef}>
          <div className="de-info-cell">
            <div className="de-info-num">
              <span>{s1}</span><sup>+</sup>
            </div>
            <div className="de-info-label">Local providers<br />in network</div>
          </div>
          <div className="de-info-cell">
            <div className="de-info-num t">
              $<span>{s2}</span>
            </div>
            <div className="de-info-label">Flat traveler<br />coordination fee</div>
          </div>
          <div className="de-info-cell">
            <div className="de-info-num">
              <span>{s3}</span><sup>k</sup>
            </div>
            <div className="de-info-label">Year-one traveler<br />target, Finger Lakes</div>
          </div>
        </div>

        <div id="page6-bottom">
          <h2 className="de-outline-h1">
            <span>Relax.</span>
            <span className="de-outline">We've got</span>
            <span>this.</span>
          </h2>
          <div className="de-cta-right">
            <p className="de-cta-sub">
              List your service in minutes. Glibra places you inside real Finger Lakes trip plans.
            </p>
            <a href="/checkout" className="de-btn-flood">
              <span>Join the Pilot →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer data-scroll-section>
        <div className="de-footer-logo">
          <img
            src={glibbraLogo}
            alt="Independent winery joining Glibra travel bundles"
            className="de-footer-logo-img"
          />
        </div>
        <ul className="de-footer-links">
          <li><a href="/checkout">List Your Service</a></li>
          <li><a href="#page-providers">Who Can Join</a></li>
          <li><a href="#page2">Travelers</a></li>
          <li><a href="#page-faq">FAQ</a></li>
          <li><a href="/production-rights">Production Rights</a></li>
          <li><a href="mailto:ivan@glibra.com">Contact</a></li>
        </ul>
        <div className="de-footer-copy">©2025 Glibra Inc. · Geneva, NY · Finger Lakes Pilot Region</div>
      </footer>

      {/* ── AVERY MASCOT ── */}
      <AveryMascot currentSection="hero" userType={null} />
    </div>
  );
}
