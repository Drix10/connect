# Carbon Trade X — AI Prompt Guide

### How to talk to Claude (or any AI) to keep building this site without generic results

---

## 1. Always paste this System Context first

Before any request, paste this block. It prevents the AI from resetting to generic defaults.

```
You are building Carbon Trade X — an institutional carbon credit trading platform.

TECH STACK:
- Next.js 15 (App Router, "use client" where needed)
- Tailwind CSS + shadcn/ui components
- TypeScript
- Lucide React for icons
- Google Fonts via @import in globals.css

DESIGN SYSTEM — never deviate from these:
- Font display: Playfair Display (weight 500) — used for ALL headings, elegant serif
- Font body: DM Sans (300 light, 400 normal, 500 medium) — body text and UI
- Font mono: DM Mono (300, 400) — for data, prices, tickers, code
- Loaded via: app/globals.css with @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap')
- Use .display-font utility class for Playfair Display headings (NOT .heading-display)
- Primary color: #00e87a (hsl(158 100% 46%)) — emerald green
- Background: hsl(222 47% 11%) — near-black with slight blue tint
- Cards/surfaces: hsl(224 37% 15%) with glass effect (bg-card/80 backdrop-blur-sm)
- Border color: hsl(215 28% 17%) — use border-border class
- Muted text: hsl(215 20% 65%) — use text-muted-foreground
- Heading letter-spacing: 0em (natural serif spacing, NOT tight)
- Heading line-height: 1.15 (improved readability)
- Body font-weight: 300 (light) for paragraphs, 400 (normal) for UI, 500 (medium) for emphasis
- Border radius for cards: rounded-3xl (24px) — never rounded-lg
- CTAs: always rounded-full (pill shape)
- Animations: CSS keyframes in globals.css, use existing utility classes

AESTHETIC RULES (hard rules, never break):
1. NO generic box grids — vary cell sizes, use bento layouts, break the grid
2. NO pure solid-color section backgrounds — always a subtle gradient (from-[#0d1a12] to-card, etc)
3. Always have at least one full-width image or visual that bleeds edge to edge per page
4. Floating data cards near the hero visual — not inside boxes
5. Stat numbers use DM Mono font (NOT Playfair), large (clamp-based sizing)
6. Section labels are 10px uppercase with tracking-[0.18em] in text-primary, use .label-mono class
7. Hover states: translateY(-5px) with box-shadow deepening — not color changes
8. Ambient glow orbs (radial-gradient blobs) behind key sections — subtle, blur(40px)+
9. The ticker (scrolling price bar) appears on every page that has market data
10. Never use: Syne, Inter, Roboto, Arial, Space Grotesk (old fonts removed)
```

---

## 2. Typography Utility Classes

Use these exact utility classes from globals.css:

```css
/* Display headings — Playfair Display serif */
.display-font {
  font-family: var(--font-display) !important; /* Playfair Display */
  font-weight: 500 !important;
  letter-spacing: 0em !important;
  font-style: normal;
}

/* Italic accent on display text */
.display-italic {
  font-family: var(--font-display) !important;
  font-weight: 400 !important;
  font-style: italic !important;
}

/* Section labels — DM Mono, uppercase, spaced */
.label-mono {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--g); /* #00e87a */
}

/* Stat numbers — DM Mono for precision */
.stat-num {
  font-family: var(--font-mono);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
}

/* Heading size scale — clamp-based */
.text-hero {
  font-size: clamp(52px, 8vw, 96px);
  line-height: 1;
}
.text-title {
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.05;
}
.text-h3 {
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.1;
}
.text-body {
  font-size: 16px;
  line-height: 1.7;
  font-weight: 300;
}
.text-small {
  font-size: 14px;
  line-height: 1.6;
  font-weight: 300;
}
.text-tiny {
  font-size: 12px;
  line-height: 1.5;
  font-weight: 400;
}
```

**IMPORTANT**:

- Use `.display-font` for ALL headings (NOT `.heading-display`)
- Use `.label-mono` for section labels (NOT inline styles)
- Use `.stat-num` for numbers and data
- Body text inherits DM Sans 300 (light) from globals.css

---

## 3. Visual Utility Classes

```css
/* Glass panels */
.glass {
  background: rgba(5, 8, 10, 0.82);
  backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(0, 232, 122, 0.07);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
}

/* Hover lift — cards */
.hover-lift {
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    0 0 30px rgba(0, 232, 122, 0.07);
}

/* Button glow */
.btn-glow {
  box-shadow: 0 0 24px rgba(0, 232, 122, 0.18);
}
.btn-glow:hover {
  box-shadow: 0 0 36px rgba(0, 232, 122, 0.3);
  transform: translateY(-2px);
}

/* Card shine sweep on hover */
.card-shine {
  position: relative;
  overflow: hidden;
}
.card-shine::before {
  /* Shine effect on hover */
}
```

---

## 4. Animation Classes

All animations respect `prefers-reduced-motion`:

```css
/* Ambient orbs */
.orb-1, .orb-2, .orb-3  /* Drifting background orbs */

/* Float (hero data tags) */
.float-1  /* 4.2s ease-in-out infinite */
.float-2  /* 5.1s ease-in-out 1s infinite */
.float-3  /* 3.7s ease-in-out 0.5s infinite */

/* Blink (live indicator dot) */
.blink, .blink-dot  /* 1.6s ease-in-out infinite */

/* Ticker (scrolling price bar) */
.ticker-animate  /* 36s linear infinite */
.ticker-move     /* 38s linear infinite */

/* Earth spin */
.earth-spin  /* 62s linear infinite */

/* Orbit ring pulse */
.orbit-pulse  /* 5s ease-in-out infinite */
.pulse-glow   /* 3.2s ease-in-out infinite */

/* Fade in up (page entry) */
.fade-in-up, .fade-in-up-delay-1, .fade-in-up-delay-2, .fade-in-up-delay-3
```

---

## 5. Page-by-page request templates

Copy-paste these exact prompts. Fill in the [BRACKETS].

---

### Dashboard / Trading Page

```
Build the Dashboard page for Carbon Trade X. Follow the system context exactly.

The page should include:
- Sidebar nav (fixed left, 240px wide) with: logo, nav links (Markets, Portfolio, Analytics, Reports, Settings), and a "Live" status indicator
- Main content area with:
  - Top bar: page title in Playfair Display (.display-font), date/time, user avatar
  - 3 stat cards in a row (total portfolio value, today's P&L, active positions) — NOT generic white boxes. Use the bento card style with gradient backgrounds and colored accents
  - A large chart area (use a placeholder SVG or ASCII chart — no recharts unless I ask)
  - An order book table below — minimal, DM Mono numbers, alternating row opacity

Visual rules:
- Sidebar background: #0a0a0a with a subtle right border rgba(255,255,255,0.05)
- Active nav item: left border 2px solid #00e87a, text white, bg rgba(0,232,122,0.05)
- Stat card accent colors: green (#00e87a), blue (#00b4ff), purple (#c864ff) — one each
- Numbers in stat cards use DM Mono (.stat-num) at 36–42px
- The chart area should have a faint green glow at the bottom of the chart line
- No recharts, no chart.js — just a visually convincing SVG path

Output: a single page.tsx file. Keep "use client" at the top.
Use .display-font for Playfair Display headings, DM Sans body (from globals.css).
```

---

### Markets / Order Book Page

```
Build the Markets page for Carbon Trade X. Follow the system context exactly.

Layout:
- Full-width page with the ticker bar at the top (same as homepage)
- A filter row below: credit type tabs (All, Verra, Gold Standard, CCTS, REDD+, EU ETS) — pill-style tabs, active = filled green
- Main grid: LEFT 65% = order book table, RIGHT 35% = trade panel

Order book table:
- Columns: Registry, Project Name, Vintage, Volume, Price (₹), Change, Action
- Alternating row opacity (0.04 white background on even rows)
- Price column: green for positive change, red for negative
- DM Mono font for all numbers (.stat-num or font-mono)
- "Buy" button per row: small, rounded-full, bg primary, text black

Trade panel (right):
- Sticky positioned
- Credit selector dropdown (styled, not native)
- Buy/Sell toggle (pill toggle, not radio buttons)
- Quantity input + Price input — dark input fields, no white backgrounds
- Total calculation row
- Big "Place Order" CTA button (full width, rounded-full, green glow shadow)
- Recent trades mini list below (5 rows, DM Mono, subtle)

Output: single page.tsx file.
Use .display-font for Playfair Display headings, DM Sans body (from globals.css).
```

---

### Portfolio Page

```
Build the Portfolio page for Carbon Trade X. Follow the system context exactly.

Sections:
1. Hero area (no image — use an animated SVG line chart as the hero visual, full-width, green line on dark bg)
2. Holdings table: Registry, Project, Vintage, Qty held, Avg buy price, Current price, P&L, P&L %
   - P&L column: colored (green/red) with a small pill badge
   - Rows are hover-lift on hover
   - Use DM Mono for all numbers
3. Allocation breakdown — NOT a pie chart. Use a horizontal stacked bar (CSS only, no chart library) with colored segments per registry
4. ESG summary row: 3 metric cards (CO₂ offset tonnes, SDG goals covered, Verification status) — use bento card style

Visual rules:
- The animated line chart in the hero should be a CSS/SVG path with a gradient fill below it and a glowing dot at the current point
- Horizontal stacked bar segments: each registry gets its own accent color
- No pie charts, no donut charts
- Use .display-font for Playfair Display headings, DM Sans body inherited from globals.css
- Use AnimatedBackground component for ambient orbs

Output: single page.tsx file.
```

---

### Authentication Pages (Login / Register)

```
Build the Login page for Carbon Trade X. Follow the system context exactly.

Layout: Split screen
- LEFT 55%: A full-height atmospheric image (use this URL: https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80) with:
  - brightness(0.25) filter
  - A large Playfair Display headline over it: "The carbon market, at your fingertips."
  - 3 trust badges at the bottom of the image side (Verra, Gold Standard, CCTS)
- RIGHT 45%: The login form on #05080a background
  - Carbon Trade X logo + wordmark at top
  - Email field + Password field — dark inputs (bg: rgba(255,255,255,0.04), border: rgba(255,255,255,0.08))
  - "Sign in" button: full width, rounded-full, primary green, glow shadow
  - "Forgot password" link in muted text
  - Divider line with "or"
  - "Continue with Google" ghost button
  - Sign up link at bottom

Field style rules:
- Input labels: 11px uppercase tracking-widest text-primary (use .label-mono)
- Input fields: NO white backgrounds, NO default browser styling
- Focus state: border-color rgba(0,232,122,0.4), no blue outline
- Placeholder text: rgba(255,255,255,0.2)

Output: single page.tsx file.
Use .display-font for Playfair Display headings, DM Sans body (from globals.css).
```

---

## 6. Component-level prompts

For individual components, use this format:

```
Build a [COMPONENT NAME] component for Carbon Trade X.

Follow the full system context (Playfair Display headings via .display-font, DM Sans body from globals.css, DM Mono for data, #00e87a primary, dark surfaces with glass effects, bento card style, rounded-3xl cards, rounded-full CTAs).

The component should:
- [describe what it shows/does]
- [describe any data it receives as props]
- [describe any interactions/hover states]

IMPORTANT: Export as a named export. No default export for components.
Output: a single .tsx file.
Use .display-font for Playfair Display headings, DM Sans body (from globals.css).
```

---

## 7. The 10 mistakes to call out if AI ignores them

If the AI produces something that looks generic, use these exact correction prompts:

| Problem                     | Correction prompt                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cards all the same size     | "Break the grid — make the first card span 2 columns, vary the heights. No uniform grid."                                                                         |
| Rounded corners too small   | "All cards should be rounded-3xl (24px). Increase border radius everywhere."                                                                                      |
| Headings too spaced out     | "Headings use Playfair Display with natural serif spacing (letter-spacing: 0em). Line-height should be 1.15 for readability."                                     |
| Body text too heavy         | "All paragraph text should be font-weight: 300 (light) from DM Sans. Labels use font-weight: 400 (normal). Emphasis uses font-weight: 500 (medium)."              |
| Wrong font                  | "Replace any Syne, Inter, Roboto, or system font with Playfair Display for headings (use .display-font class) and DM Sans for body (inherited from globals.css)." |
| Solid section backgrounds   | "Remove solid backgrounds. Every section should have a subtle gradient or transparent bg with ambient glow orbs."                                                 |
| Generic card hover          | "Change hover states to: transform: translateY(-5px) with deepened box-shadow. Remove color-change hovers. Use .hover-lift class."                                |
| Too much text per section   | "Cut all body text to 1–2 sentences max. Less is more. Let the visual do the work."                                                                               |
| No breathing room           | "Double all vertical padding. Sections need py-24 minimum, heroes need py-32 or more."                                                                            |
| Missing the cinematic image | "Add a full-bleed image section (100% width, 480–540px tall) with a darkened photo and text overlay. This breaks up the layout."                                  |
| Wrong number font           | "All numbers, prices, and data should use DM Mono font (.stat-num class or font-mono), NOT Playfair Display."                                                     |

---

## 8. What to never ask the AI to do

These prompts produce bad results on this project. Avoid them:

- ❌ "Make it colorful" → leads to rainbow gradients
- ❌ "Add more information" → leads to text-heavy clutter
- ❌ "Use a chart library" → unless you specify exactly which one and style it yourself
- ❌ "Make it modern" → vague, leads to purple gradients and glassmorphism excess
- ❌ "Add animations to everything" → leads to distracting micro-animations everywhere
- ❌ "Make it responsive" as the only instruction → AI will break the design to fit mobile
- ❌ "Make it look professional" → leads to boring corporate blue
- ❌ "Use Syne font" → OLD FONT, removed from design system

Instead, say:

- ✅ "Keep the existing aesthetic. Add [specific thing]."
- ✅ "Same visual language as the homepage. Now build [page]."
- ✅ "Don't change the fonts, colors, or card style. Only add [feature]."
- ✅ "Use Playfair Display for headings (.display-font), DM Sans for body, DM Mono for data."

---

## 9. The golden rule for every prompt

End every single prompt with this line:

```
Output a single page.tsx or component.tsx file. Do not add new dependencies.
Use .display-font for Playfair Display headings, DM Sans body (from globals.css), DM Mono for numbers/data.
#00e87a primary, dark surfaces with glass effects, bento layout, rounded-3xl cards.
No generic AI web design — this is editorial, cinematic, institutional.
Use existing Tailwind classes and AnimatedBackground component.
All animations respect prefers-reduced-motion.
```

---

## 10. Color Palette Reference

```css
/* Primary */
--primary: hsl(158 100% 46%) /* #00e87a — emerald green */ /* Surfaces */
  --background: hsl(222 47% 11%) /* near-black with blue tint */
  --card: hsl(224 37% 15%) /* card background */ --border: hsl(215 28% 17%)
  /* subtle borders */ /* Text */ --foreground: hsl(213 31% 91%)
  /* white text */ --muted-foreground: hsl(215 20% 65%) /* muted text */
  /* Accent colors for bento cells */ --accent-blue: #00b4ff
  --accent-purple: #c864ff --accent-yellow: #ffb400 --accent-red: #ff5c5c;
```

---

## 11. Common Patterns

### Hero Section

```tsx
<section className="relative min-h-screen flex flex-col justify-end pb-24 pt-32">
  <AnimatedBackground />
  <div className="container mx-auto px-6 lg:px-10 relative z-[2]">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-[11px] font-medium mb-8 uppercase tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-primary blink-dot" />
      Eyebrow label
    </div>
    <h1 className="display-font text-white text-hero mb-6">Headline text</h1>
    <p className="text-lg text-muted-foreground mb-10">Description text</p>
  </div>
</section>
```

### Bento Card

```tsx
<div className="bg-gradient-to-br from-[#0d1a12] to-card border border-border rounded-3xl p-8 hover-lift card-shine">
  <span className="label-mono">Section label</span>
  <h3 className="display-font text-white text-h3 mb-3">Card title</h3>
  <p className="text-muted-foreground text-small">Card description</p>
</div>
```

### Stat Display

```tsx
<div>
  <div className="stat-num text-white text-[40px]">
    ₹500<span className="text-primary">Cr+</span>
  </div>
  <div className="text-xs text-muted-foreground mt-1.5">Label text</div>
</div>
```

### Glass Tag (Floating)

```tsx
<div className="glass rounded-xl px-4 py-3 float-1">
  <div className="label-mono mb-1">VCU / VERRA</div>
  <div className="stat-num text-white text-[18px]">₹1,842</div>
  <div className="text-[10px] text-primary mt-1">↑ 2.4% today</div>
</div>
```

---

_Carbon Trade X Design System v2.0 — Updated May 2026_
_Fonts: Playfair Display (headings), DM Sans (body), DM Mono (data)_
