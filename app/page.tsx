"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  BarChart3,
  Award,
  Leaf,
  Users,
  Globe,
  Building2,
  Lock,
} from "lucide-react";

// ─── Inline styles for animations not in Tailwind ─────────────────────────────
const globalStyles = `
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes floatY2 {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes floatY3 {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  @keyframes earthSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes orbitPulse {
    0%, 100% { opacity: 0.08; }
    50%       { opacity: 0.18; }
  }
  @keyframes orbitRotate {
    from { transform: translate(-50%,-50%) rotate(0deg); }
    to   { transform: translate(-50%,-50%) rotate(360deg); }
  }

  .float-1 { animation: floatY  4s   ease-in-out infinite; }
  .float-2 { animation: floatY2 5s 1s ease-in-out infinite; }
  .float-3 { animation: floatY3 3.5s 0.5s ease-in-out infinite; }
  .blink-dot { animation: blink 1.5s ease-in-out infinite; }
  .earth-spin { animation: earthSpin 60s linear infinite; }
  .ticker-move { animation: ticker 38s linear infinite; }
  .orbit-pulse { animation: orbitPulse 4s ease-in-out infinite; }
  .orbit-rotate { animation: orbitRotate 120s linear infinite; }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }

  .glass-tag {
    background: rgba(10,14,12,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0,232,122,0.12);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .img-section-overlay {
    background: linear-gradient(
      to bottom,
      rgba(5,8,10,0.15) 0%,
      rgba(5,8,10,0.05) 40%,
      rgba(5,8,10,0.6) 100%
    );
  }
`;

// ─── Ticker data ───────────────────────────────────────────────────────────────
const TICKERS = [
  { label: "VCU/VERRA", price: "₹1,842", up: true, pct: "2.4%" },
  { label: "GOLD STD", price: "₹2,210", up: true, pct: "1.8%" },
  { label: "CCTS/IND", price: "₹980", up: false, pct: "0.6%" },
  { label: "EU ETS", price: "₹5,640", up: true, pct: "3.1%" },
  { label: "CORSIA", price: "₹3,120", up: true, pct: "0.9%" },
  { label: "REDD+", price: "₹1,560", up: false, pct: "1.2%" },
  { label: "ACR/CAR", price: "₹2,880", up: true, pct: "4.2%" },
  { label: "NATURE", price: "₹4,100", up: true, pct: "1.5%" },
];

// ─── Bento cells ──────────────────────────────────────────────────────────────
const SMALL_CELLS = [
  {
    bg: "from-[#0a0f1a]",
    accent: "#00b4ff",
    tag: "Verification",
    Icon: Shield,
    title: "Registry verified",
    desc: "Direct links to Verra, Gold Standard, CCTS, ACR — every credit validated at source.",
  },
  {
    bg: "from-[#140a1a]",
    accent: "#c864ff",
    tag: "Analytics",
    Icon: BarChart3,
    title: "Portfolio intelligence",
    desc: "P&L, risk exposure, quality scoring, and vintage analysis in one view.",
  },
  {
    bg: "from-[#1a100a]",
    accent: "#ffb400",
    tag: "Compliance",
    Icon: Award,
    title: "ESG reporting",
    desc: "Auto-generate TCFD, GRI, CDP, SEBI BRSR reports with one click.",
  },
  {
    bg: "from-[#0a1414]",
    accent: "var(--g)",
    tag: "Support",
    Icon: Users,
    title: "Dedicated desk",
    desc: "Named account managers and a 24/7 trading desk for block trades.",
  },
];

// ─── Registries ───────────────────────────────────────────────────────────────
const REGISTRIES = [
  { name: "Verra", Icon: Globe },
  { name: "Gold Standard", Icon: Award },
  { name: "CCTS India", Icon: Building2 },
  { name: "EU ETS", Icon: Globe },
  { name: "CORSIA", Icon: TrendingUp },
  { name: "ACR", Icon: Shield },
  { name: "CAR", Icon: Lock },
];

// ─── Chart bar heights ─────────────────────────────────────────────────────────
const BAR_HEIGHTS = [
  20, 35, 28, 50, 42, 65, 55, 80, 72, 90, 85, 100, 92, 78, 95, 88,
];

export default function Home() {
  return (
    <main className="bg-background text-foreground overflow-hidden relative">
      {/* Inject global keyframes */}
      <style>{globalStyles}</style>

      <AnimatedBackground />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="h-4 w-4 text-black" strokeWidth={2} />
              </div>
              <span className="display-font text-lg font-bold text-white tracking-tight">
                Carbon Trade X
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="hidden sm:inline-block text-sm text-muted-foreground hover:text-white transition-colors px-4 py-2"
              >
                Markets
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-sm font-medium rounded-full">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 pt-32 overflow-hidden">
        {/* Ambient glow orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-200px",
            left: "-200px",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(0,232,122,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(0,180,255,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        {/* ── Earth visual ── */}
        <div
          className="absolute z-[1] hidden lg:block"
          style={{ top: "50%", right: "5%", transform: "translateY(-50%)" }}
        >
          {/* Outer rotating orbit ring */}
          <div
            className="absolute rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "680px",
              height: "680px",
              border: "1px dashed rgba(0,232,122,0.12)",
            }}
          >
            <div
              className="w-full h-full"
              style={{ animation: "spin 180s linear infinite" }}
            />
          </div>

          {/* Middle pulsing orbit ring */}
          <div
            className="absolute rounded-full pulse-glow"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "580px",
              height: "580px",
              border: "1.5px solid rgba(0,232,122,0.18)",
              boxShadow:
                "0 0 60px rgba(0,232,122,0.15), inset 0 0 60px rgba(0,232,122,0.05)",
            }}
          />

          {/* Earth sphere container */}
          <div
            className="rounded-full relative overflow-hidden"
            style={{
              width: "480px",
              height: "480px",
              boxShadow:
                "0 0 200px rgba(0,232,122,0.25), 0 0 100px rgba(0,232,122,0.18), 0 0 50px rgba(0,180,255,0.12), inset 0 0 120px rgba(0,0,0,0.7)",
              background: "linear-gradient(135deg, #1e4a5a 0%, #0f2530 100%)",
              border: "2px solid rgba(0,232,122,0.15)",
            }}
          >
            {/* Earth image */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1024px-The_Earth_seen_from_Apollo_17.jpg"
              alt="Earth"
              className="w-full h-full object-cover rounded-full"
              style={{
                filter: "saturate(0.85) brightness(0.9) contrast(1.15)",
                animation: "spin 90s linear infinite",
              }}
              loading="eager"
            />

            {/* Atmospheric glow layers */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 32% 32%, rgba(0,232,122,0.15) 0%, transparent 35%, rgba(0,232,122,0.06) 55%, rgba(5,8,10,0.75) 100%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 28% 28%, rgba(100,200,255,0.1) 0%, transparent 30%)",
              }}
            />
          </div>

          {/* Outer glow halo */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none pulse-glow"
            style={{
              margin: "-60px",
              background: "transparent",
              boxShadow:
                "0 0 140px 50px rgba(0,232,122,0.15), 0 0 80px 30px rgba(0,180,255,0.08)",
              borderRadius: "50%",
            }}
          />

          {/* ── Floating data tags ── */}
          <div
            className="absolute glass rounded-xl px-4 py-3 whitespace-nowrap z-[2] float-1"
            style={{
              top: "14%",
              right: "38%",
            }}
          >
            <div className="text-[10px] text-muted-foreground tracking-wider mb-1 uppercase font-medium">
              VCU / VERRA
            </div>
            <div className="text-[18px] font-semibold text-white">₹1,842</div>
            <div className="text-[10px] text-primary mt-1 font-medium">
              ↑ 2.4% today
            </div>
          </div>

          <div
            className="absolute glass rounded-xl px-4 py-3 whitespace-nowrap z-[2] float-2"
            style={{
              top: "52%",
              right: "-2%",
            }}
          >
            <div className="text-[10px] text-muted-foreground tracking-wider mb-1 uppercase font-medium">
              GOLD STANDARD
            </div>
            <div className="text-[18px] font-semibold text-white">₹2,210</div>
            <div className="text-[10px] text-primary mt-1 font-medium">
              ↑ 1.8% today
            </div>
          </div>

          <div
            className="absolute glass rounded-xl px-4 py-3 whitespace-nowrap z-[2] float-3"
            style={{
              bottom: "18%",
              right: "42%",
            }}
          >
            <div className="text-[10px] text-muted-foreground tracking-wider mb-1 uppercase font-medium">
              ACTIVE TRADERS
            </div>
            <div className="text-[18px] font-semibold text-white">1,048</div>
            <div className="text-[10px] text-primary mt-1 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary blink-dot" />
              live
            </div>
          </div>
        </div>

        {/* ── Hero copy ── */}
        <div className="container mx-auto px-6 lg:px-10 relative z-[2]">
          <div className="max-w-[600px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-[11px] font-medium mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary blink-dot" />
              Carbon markets, reimagined
            </div>

            {/* Headline */}
            <h1
              className="display-font text-white mb-6"
              style={{
                fontSize: "clamp(64px, 9vw, 108px)",
                lineHeight: "0.92",
                letterSpacing: "-2px",
                fontWeight: 800,
              }}
            >
              Trade the
              <br />
              planet&apos;s
              <br />
              <span className="text-primary">future.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-[420px]">
              Institutional-grade carbon credit trading with verified credits,
              real-time pricing, and the infrastructure serious traders demand.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium rounded-full px-8 hover:scale-105 transition-transform"
                  style={{ boxShadow: "0 0 30px rgba(0,232,122,0.2)" }}
                >
                  Open account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base rounded-full px-8 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  Live demo
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-10 sm:gap-14">
              {[
                { n: "₹500", sup: "Cr+", label: "Trading volume" },
                { n: "10", sup: "M+", label: "Credits verified" },
                { n: "99", sup: ".9%", label: "Uptime SLA" },
              ].map(({ n, sup, label }) => (
                <div key={label}>
                  <div
                    className="display-font text-white"
                    style={{
                      fontSize: "clamp(28px, 4vw, 40px)",
                      lineHeight: 1,
                      fontWeight: 700,
                    }}
                  >
                    {n}
                    <span className="text-primary">{sup}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────────────── */}
      <div className="border-y border-border py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="ticker-move flex w-max">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex">
              {TICKERS.map(({ label, price, up, pct }) => (
                <div
                  key={`${pass}-${label}`}
                  className="flex items-center gap-3 px-7 border-r border-border"
                >
                  <span className="text-xs text-muted-foreground tracking-wide">
                    {label}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: up ? "var(--g)" : "#ff5c5c" }}
                  >
                    {price} {up ? "↑" : "↓"}
                    {pct}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── BENTO FEATURES ───────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-14">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-4">
              Platform
            </div>
            <h2
              className="display-font text-white"
              style={{
                fontSize: "clamp(44px, 6vw, 80px)",
                lineHeight: "0.95",
                letterSpacing: "-1.5px",
                fontWeight: 800,
              }}
            >
              Everything you
              <br />
              need to trade.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ── Large hero cell with chart ── */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#0d1a12] to-card border border-border rounded-3xl min-h-[340px] relative overflow-hidden hover-lift group cursor-default card-shine">
              {/* Animated bar chart in background */}
              <div className="absolute inset-0 flex items-end px-8 pb-[110px] gap-[5px] opacity-25">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        "linear-gradient(to top, #00e87a, transparent)",
                    }}
                  />
                ))}
              </div>
              {/* Green glow under chart */}
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "60px",
                  left: "20%",
                  width: "60%",
                  height: "160px",
                  background: "rgba(0,232,122,0.08)",
                  filter: "blur(40px)",
                  borderRadius: "50%",
                }}
              />
              {/* Text content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-10">
                <h3
                  className="display-font text-white mb-3"
                  style={{
                    fontSize: "clamp(22px,2.5vw,30px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Live order book &amp; real-time pricing
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-md text-sm">
                  Institutional-grade execution with sub-second price updates
                  and deep liquidity across all major carbon registries.
                </p>
              </div>
            </div>

            {/* ── Small cells ── */}
            {SMALL_CELLS.map(({ bg, accent, tag, Icon, title, desc }) => (
              <div
                key={title}
                className={`bg-gradient-to-br ${bg} to-card border border-border rounded-3xl p-8 min-h-[280px] flex flex-col justify-between hover-lift cursor-default card-shine group`}
              >
                <div>
                  <span
                    className="inline-block text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-5"
                    style={{
                      background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                      color: accent,
                    }}
                  >
                    {tag}
                  </span>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: accent, strokeWidth: 1.5 }}
                    />
                  </div>
                </div>
                <div>
                  <h3
                    className="display-font text-white mb-2"
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH FOREST IMAGE ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "520px" }}>
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85&auto=format&fit=crop"
          alt="Forest — real projects, real impact"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.32) saturate(0.5)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 img-section-overlay" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,232,122,0.06) 0%, transparent 65%)",
          }}
        />
        {/* Copy */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2
            className="display-font text-white"
            style={{
              fontSize: "clamp(52px, 8vw, 96px)",
              lineHeight: "0.92",
              letterSpacing: "-2px",
              fontWeight: 800,
            }}
          >
            Real projects.
            <br />
            <span className="text-primary">Real impact.</span>
          </h2>
          <p
            className="text-lg mt-5 max-w-md"
            style={{ color: "rgba(238,241,238,0.55)" }}
          >
            Every credit traces back to a verified real-world project — forests,
            renewables, blue carbon.
          </p>
        </div>
      </div>

      {/* ── REGISTRIES ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-14">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-4">
              Integrations
            </div>
            <h2
              className="display-font text-white"
              style={{
                fontSize: "clamp(36px, 4.5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              Connected to every
              <br />
              major registry.
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-10">
            {REGISTRIES.map(({ name, Icon }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className="rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Icon
                    className="h-7 w-7 transition-colors duration-300 group-hover:text-primary"
                    style={{
                      color: "rgba(238,241,238,0.35)",
                      strokeWidth: 1.2,
                    }}
                  />
                </div>
                <span
                  className="text-xs tracking-wide"
                  style={{ color: "rgba(238,241,238,0.3)" }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-10 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(0,232,122,0.06) 0%, transparent 70%)",
            filter: "blur(20px)",
            borderRadius: "50%",
          }}
        />
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2
            className="display-font text-white mb-5"
            style={{
              fontSize: "clamp(60px, 10vw, 112px)",
              lineHeight: "0.92",
              letterSpacing: "-2.5px",
              fontWeight: 800,
            }}
          >
            Start trading
            <br />
            <span className="text-primary">today.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-sm mx-auto">
            Join 1,000+ institutions on the platform. Free to open an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="text-base font-medium rounded-full px-10 hover:scale-105 transition-transform"
                style={{ boxShadow: "0 0 40px rgba(0,232,122,0.2)" }}
              >
                Create free account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="text-base rounded-full px-10 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                Schedule a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-6 lg:px-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="h-3 w-3 text-black" strokeWidth={2} />
              </div>
              <span
                className="display-font text-base font-bold"
                style={{ color: "rgba(238,241,238,0.35)" }}
              >
                Carbon Trade X
              </span>
            </div>
            <div className="flex gap-6">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "API", href: "/api" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs hover:text-white transition-colors"
                  style={{ color: "rgba(238,241,238,0.3)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="text-xs" style={{ color: "rgba(238,241,238,0.3)" }}>
              © {new Date().getFullYear()} Carbon Trade X
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
