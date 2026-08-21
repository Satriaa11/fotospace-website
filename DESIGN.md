---
name: Foto Space
description: Upload ribuan foto event ke FotoYu, otomatis.
colors:
  darkroom-black: "#0e0c0c"
  darkroom-pit: "#0a0909"
  darkroom-bench: "#1d1a1a"
  darkroom-panel: "#262120"
  safelight-coral: "#ff6363"
  safelight-bright: "#ff7575"
  safelight-deep: "#d72a2a"
  paper-white: "#f7f4f2"
  ash-warm: "#8a8280"
  edge-faint: "#403a38"
  edge-strong: "#57504d"
  signal-green: "#30d158"
  signal-blue: "#0a84ff"
typography:
  display:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.5vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.safelight-coral}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.safelight-bright}"
    textColor: "#ffffff"
  button-primary-active:
    backgroundColor: "{colors.safelight-deep}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.darkroom-panel}"
  card:
    backgroundColor: "{colors.darkroom-bench}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.darkroom-panel}"
    textColor: "{colors.ash-warm}"
    rounded: "999px"
    padding: "4px 12px"
  nav-link:
    textColor: "{colors.ash-warm}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  nav-link-hover:
    backgroundColor: "{colors.darkroom-panel}"
    textColor: "{colors.paper-white}"
---

# Design System: Foto Space

## 1. Overview

**Creative North Star: "The Safelight Darkroom"**

A darkroom at work: a near-black room, quiet and deliberate, with one red safelight that lets you see without ruining the print. Foto Space is that room for event photographers. The interface is dark by conviction, not by trend: photographers stare at bright editing screens all day, and this site is read on a laptop between sessions, often at night, in a dim venue corridor. Coral is the safelight itself. It appears only where action or meaning lives, and its rarity is what makes it trustworthy.

The system rejects, by name, everything in PRODUCT.md's anti-references: no purple-blue SaaS gradients, no rows of three identical cards, no emoji confetti, no gradient text, no decorative glassmorphism, no neon hype, no everything-animating-at-once. The bar we study is the restraint of Linear and Stripe: confident spacing, exact typography, evidence on screen.

Motion behaves like a print developing: things appear, they never bounce. Ease-out exponential curves only, state changes over choreography, and every non-essential animation off under `prefers-reduced-motion`.

**Key Characteristics:**
- Restrained color strategy: tinted warm neutrals + one accent (safelight coral) under 10% of any screen
- Flat by default: depth comes from tonal layering (pit → black → bench), not shadows
- Solid, precise components: small radii (4–6px), 1px edges, no decoration
- Evidence-first content: real screenshots, real numbers, real version tags
- Inter only, tight tracking at display sizes, generous line-height at body sizes

## 2. Colors

Every neutral carries a whisper of coral warmth; nothing is pure black or pure white. The palette is the darkroom: charcoal surfaces at three depths, warm paper for text, and one safelight.

### Primary
- **Safelight Coral** (#ff6363): the only saturated color on the site. CTAs, active states, key numbers, focus rings. Hover brightens to Safelight Bright (#ff7575); press deepens to Safelight Deep (#d72a2a). Never used for large fills or backgrounds; it is a light source, not a wall.

### Neutral
- **Darkroom Black** (#0e0c0c): page background. Near-black warmed by 25° hue.
- **Darkroom Pit** (#0a0909): sunken areas, footer, code-like strips. The darkest step.
- **Darkroom Bench** (#1d1a1a): raised surfaces, cards, the app-window mock frame.
- **Darkroom Panel** (#262120): hover surfaces, badges, secondary fills.
- **Paper White** (#f7f4f2): headings and body text. Warm off-white, never #fff.
- **Ash Warm** (#8a8280): secondary text, captions, inactive nav. Holds 4.5:1 on Darkroom Black.
- **Edge Faint** (#403a38) / **Edge Strong** (#57504d): 1px borders at rest and on hover.

### Signals (sparing, functional only)
- **Signal Green** (#30d158): success states, "terupload" counts.
- **Signal Blue** (#0a84ff): informational links where coral would overheat.

### Named Rules
**The Safelight Rule.** Coral occupies less than 10% of any screen. It marks the path: one CTA per viewport, the active nav item, the live progress number. If coral is everywhere, nothing is lit.

**The Warm Neutral Rule.** No #000, no #fff, no cool grays. Every neutral is tinted toward coral at hue 25°. Cool gray reads as "generic dark SaaS"; warm charcoal reads as a room with a red lamp in it.

## 3. Typography

**Body Font:** Inter Variable (with ui-sans-serif, system-ui fallbacks)

**Character:** One family, all the way down. Inter's tight x-height at 600 weight with negative tracking reads engineered and calm; at body sizes with 1.65 line-height it reads human. The hierarchy is carried by scale and weight contrast (≥1.25 between steps), never by color decoration.

### Hierarchy
- **Display** (600, clamp(2.75rem, 5.5vw, 4.25rem), 1.05, -0.03em): hero headline only. One per page.
- **Headline** (600, clamp(1.75rem, 3vw, 2.25rem), 1.15, -0.02em): section headings.
- **Title** (600, 1.125rem, 1.3, -0.01em): card and list-item titles.
- **Body** (400, 1rem, 1.65, 0): paragraphs, capped at 68ch.
- **Label** (500, 0.8125rem, 1.4, 0.01em): captions, metadata, table headers, tier specs. Never uppercased; Indonesian copy uppercases badly.

### Named Rules
**The One Display Rule.** Exactly one Display-size headline per page, in the hero. Everything after it steps down. If a section feels like it needs Display, the section is trying to be a second hero; rewrite the section.

**The 68ch Rule.** Body copy never exceeds 68 characters per line. Wide text blocks are a wall; photographers scan, they don't read walls.

## 4. Elevation

Flat by default, tonal for depth. Surfaces stack by tone, not by shadow: Pit sits lowest, Black is the floor, Bench is the work surface, Panel is what the hand touches. Shadows exist for exactly two jobs: the hero app-window mock (a print under the enlarger, one ambient shadow) and focus rings (a coral ring, not a glow).

### Shadow Vocabulary
- **Enlarger Ambient** (`box-shadow: 0 32px 96px rgba(0 0 0 / 0.55)`): hero device mock only. One per page, maximum.
- **Focus Ring** (`box-shadow: 0 0 0 2px #0e0c0c, 0 0 0 4px #ff6363`): keyboard focus on interactive elements. Coral, crisp, 2px offset over background.

### Named Rules
**The Flat Darkroom Rule.** Cards, rows, and sections are flat at rest with a 1px Edge Faint border where separation is needed. A card that needs a shadow to be noticed has the wrong content.

## 5. Components

Solid and precise, like calibrated instruments. Small radii, exact borders, state changes that feel mechanical rather than bouncy.

### Buttons
- **Shape:** gently curved edges (6px radius)
- **Primary:** Safelight Coral fill, white label, 10px 20px padding, 14px/500 text. One per viewport (The Safelight Rule).
- **Hover / Focus:** hover shifts to Safelight Bright over 150ms ease-out; focus-visible draws the Focus Ring; active presses to Safelight Deep with no transform tricks.
- **Secondary:** 1px Edge Faint border over transparent, Paper White label; hover fills Darkroom Panel. For the one action per section that is not the download.

### Badges
- **Style:** Darkroom Panel pill (999px radius), Ash Warm 13px label, no border
- **State:** static markers only ("v1.1.7", "Windows", "Gratis 7 hari"). Badges never act as buttons.

### Cards / Containers
- **Corner Style:** 10px radius for standalone cards; 6px for nested content blocks
- **Background:** Darkroom Bench on Darkroom Black floor
- **Shadow Strategy:** none (The Flat Darkroom Rule)
- **Border:** 1px Edge Faint; hover on interactive cards moves to Edge Strong, never to coral
- **Internal Padding:** 24px, breathing to 32px on feature statements
- Nested cards are forbidden; a Bench card never contains another Bench card.

### App-Window Mock (signature component)
A faithful, flat recreation of the Foto Space desktop window: title bar with traffic dots, sidebar, content grid, all built in markup (not a screenshot) until real screenshots arrive. It sits on the Enlarger Ambient shadow and is the only element allowed that shadow. It shows the product working: file grid, progress bar mid-run, success counts. This is the hero's proof, and in M4 it becomes the Remotion loop.

### Navigation
- Sticky top bar, 56px, Darkroom Black at 80% opacity with backdrop blur (functional blur for readability, not glassmorphism), 1px bottom Edge Faint border
- Links: Label-size Ash Warm; hover fills Darkroom Panel and lifts to Paper White; the current page is Paper White, no coral underline
- The bar's one coral element is the Unduh button

## 6. Do's and Don'ts

### Do:
- **Do** keep coral under 10% of any screen (The Safelight Rule): one primary CTA per viewport, coral for live numbers and active states only.
- **Do** tint every neutral toward hue 25° (The Warm Neutral Rule). Audit test: if a gray looks cool next to #ff6363, it is wrong.
- **Do** separate surfaces with tone steps and 1px borders, not shadows (The Flat Darkroom Rule).
- **Do** use ease-out exponential curves (ease-out-quart or gentler) for every transition; 150–250ms for states.
- **Do** ship evidence: real app screenshots, real version numbers, real spec numbers (4–8 worker paralel adaptif, kompresi ≤200 KB, resume anti-gagal).
- **Do** honor `prefers-reduced-motion`: disable reveals, keep opacity-only fallbacks.
- **Do** keep body copy ≤68ch (The 68ch Rule) and exactly one Display headline per page (The One Display Rule).

### Don't:
- **Don't** build the template SaaS generik: no purple-blue gradient hero, no row of three identical icon cards, no emoji, no fake-feeling testimonials.
- **Don't** produce AI slop klasik: no gradient text (background-clip: text), no decorative glassmorphism, no glowing neon, no "AI-powered" badges.
- **Don't** drift into startup hype / crypto style: no bombast claims, no neon-on-black, no fake urgency or countdown timers.
- **Don't** make it terlalu ramai: no everything-animating-at-once, no scroll-jacking, no parallax layers.
- **Don't** use colored side-stripe borders (border-left accents) on cards or callouts; use full borders or leading icons.
- **Don't** use #000 or #fff anywhere; use Darkroom Black and Paper White.
- **Don't** use em dashes in copy; use commas, colons, or periods.
- **Don't** nest cards, and don't give cards shadows to compensate for weak content.
