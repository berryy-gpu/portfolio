# Portfolio Rebuild Spec

Site: Baran Haider — web development, social media, video, SEO, AI automation.
Live on Vercel. Full rebuild of the presentation layer; the data layer stays.

## Design direction

A quiet, expensive-feeling dark room where the work is the only thing lit.
Restraint over spectacle. Slow, heavy motion — never bouncy. Enormous type.
Atmospheric 3D, never decorative.

Three rules that hold it together:
1. ONE MOVING THING AT A TIME. Never two competing animations on screen.
2. ACCENT IS AN EVENT. Terracotta appears on: active nav, one hero word, hover
   states, the single filled CTA. Nowhere else. Rarity is what makes it read
   as expensive.
3. EVERYTHING DEGRADES. Every effect defines its reduced-motion, touch, and
   low-tier behaviour before it ships.

## Type scale — USE THE TOP TIERS

globals.css defines display-xxl (10rem) and display-xl (7.5rem) and the current
site never uses either. That is the single cheapest premium signal available.
  Hero headline      → text-display / md:text-display-xl / xl:text-display-xxl
  Section headlines  → text-h1 / md:text-display
  Footer name        → text-display-xxl, clipped by the viewport edge
  All mono labels    → font-mono text-caption tracking-caption, uppercase

## Motion vocabulary

lib/reveal-presets.ts defines named grammars. NO TWO ADJACENT SECTIONS MAY USE
THE SAME ONE. The old site used a single fade-up everywhere; that is why it read
as a template.

  maskUp         line rises from behind an overflow-hidden mask   headlines
  charCascade    per-character stagger, 0.012s                    hero only
  clipReveal     clip-path inset wipe, image counter-scales 1.1→1 images
  scrubHighlight text scrubs tertiary→primary word by word        statement
  horizontalPin  section pins, content translates X               reel wall
  counterUp      numbers count from 0                             stats
  settle         gentle fade-up — the EXCEPTION now, not the rule process, footer

## Quality tiers — providers/quality-provider.tsx

Detect once on mount from navigator.hardwareConcurrency, navigator.deviceMemory,
(pointer: coarse), prefers-reduced-motion (reduce always forces 'low').
Return 'low' during SSR and until the first client effect (follow the existing
use-media-query.ts pattern) so nothing hydration-mismatches.
Runtime downgrade: sample frame time over 60 frames; median > 22ms → drop a tier.

                 high            medium           low
  WebGL          full + postFX   plane, no FX     static poster
  DPR            2               1.5              —
  Pinned         yes             yes              no, stacked fallback
  Custom cursor  yes             yes              no
  Marquee vel.   yes             yes              static
  Video          autoplay        autoplay         poster + tap

## Architecture

ONE persistent <Canvas> for the whole site — multiple canvases mean multiple
WebGL contexts and browsers silently kill the oldest past ~8-16. Use drei's
<View.Port /> and have sections declare 3D slots with <View track={ref} />.

  src/components/
    providers/  webgl-provider · transition-provider · cursor-provider
                sound-provider · quality-provider
    three/      scenes/hero-scene · scenes/cta-scene · materials/ · effects
    motion/     split-text · reveal-image · magnetic · marquee · parallax
    layout/     navigation · footer · preloader · page-transition
                transition-link · custom-cursor · sound-toggle
    sections/   one file per homepage section
    ui/         button · badge · container · section · section-header
                video-player · form-field · logo
  src/hooks/    use-lenis-velocity · use-quality-tier · use-scroll-scrub
                use-scroll-reveal (extend, don't replace)
  src/lib/      reveal-presets

## Global systems

NAVIGATION — fixed top. Transparent at scroll 0, --surface at 80% with
backdrop-blur-functional after. Left: "BARAN HAIDER" in font-mono. Centre: nav
links, each a maskUp label swap on hover (one overflow-hidden span, two stacked
children). Active route gets an --accent underline that slides between items via
Framer layoutId. Right: availability dot (--success, slow pulse) + "Let's talk".
Hides on scroll down, reveals on scroll up. Mobile: fullscreen overlay, links at
text-h1 staggered in, clip-path wipe.

PRELOADER — once per session (sessionStorage). Counter 00→100 in font-mono at
text-display-xl, --text-tertiary, tabular-nums. 1px rule scaling X 0→1 in
--accent, origin left. REAL progress: document.fonts.ready + hero video
canplaythrough + WebGL first frame. Min 1.2s, hard timeout 4s. Exit: fade
counter 0.3s, then panel clip-path inset(0 0 0% 0)→inset(0 0 100% 0) over 0.9s
expo.out. lenis.stop() throughout, lenis.start() on exit.

PAGE TRANSITIONS — do NOT use AnimatePresence for App Router route exits; it
does not reliably fire. Use a controlled overlay: <TransitionLink> intercepts the
click → overlay wipes in (clip-path inset(100% 0 0 0)→inset(0), 0.6s expo.inOut,
--surface, destination name in mono) → lenis.stop() → router.push() → on mount
lenis.scrollTo(0,{immediate:true}) → overlay wipes out → lenis.start().
router.prefetch on pointerenter. Budget 1.2s total. Reduced motion: 200ms
crossfade. FAILSAFE: force the overlay out after 2s if the route hasn't mounted —
a stuck overlay is a dead site. TransitionLink must still render a real <a href>
so middle-click, ctrl+click and crawlers work.

CUSTOM CURSOR — gate on (hover:hover) and (pointer:fine) AND tier !== 'low'.
8px --text-primary dot damped 0.9 + 40px 1px ring damped 0.15. Both positioned
with transform: translate3d() in ONE shared rAF loop. NEVER React state per
frame. NEVER left/top. States via data-cursor attributes read by a single
delegated pointerover listener:
  default dot+ring · hover ring→64px · view 96px filled accent "VIEW"
  play 72px accent play glyph · drag 80px ring ←→ · text 2px bar
Only apply cursor:none once the custom cursor has mounted and received its first
pointermove.

SOUND — DEFAULT OFF. Files at /public/audio/{ambient,hover,click,transition}.mp3,
already mono and loudness-matched (ambient −24 LUFS, UI −20 LUFS) so use ONE gain
stage: ambient 0.08, UI 0.15. No per-file corrections. ambient.mp3 is a 96s loop
with 2s fades — cross-fade the loop point by 2s or you get an audible dip every
96 seconds. transition.mp3 is 0.91s: fire on transition START, not completion.
Toggle bottom-right, 4 equaliser bars. Preference in localStorage. One shared
AudioContext, suspended on visibilitychange. Silent under prefers-reduced-motion.

## Pages

### / — Home. Section order, alternating heavy and light:

01 HERO — heavy, WebGL
   Video texture: /videos/hero/hero-desktop.webm (<source> first) with
   /videos/hero/hero-desktop.mp4 fallback; /videos/hero/hero-mobile.mp4 on
   coarse pointers; poster /images/posters/hero.jpg.
   muted loop playsInline preload="auto".
   Custom shaderMaterial via drei's shaderMaterial helper:
     - The footage is ALREADY a warm red/orange plexus on near-black, close to
       the site palette. Desaturate to ~25% (NOT 15%) and apply only a light
       accent multiply — over-tinting crushes it to a flat orange smear.
     - Cursor ripple: normalised pointer uniform, radial UV displacement,
       damped with maath damp3 so it TRAILS the cursor.
     - Slow uTime noise so it lives when the pointer is still.
     - Vertical vignette: bottom third fades to --background.
   Effects: high → Bloom(0.35, threshold 0.75) + Noise(0.025) + Vignette(0.4);
   medium → Noise only; low → no Canvas, poster + CSS grain.
   Layout: availability pill top-left · tagline from src/data/hero.ts at
   display→display-xl→display-xxl, maskUp per line 0.08s apart, expo.out 1.1s,
   the word "grow" in --accent (the only colour in the viewport) · two CTAs
   ("View Work" outline, "Let's talk" ghost) wrapped in <Magnetic> · bottom-left
   "LAHORE, PK" + live local time in mono, updating each second (render nothing
   until after mount to avoid hydration mismatch) · bottom-centre 1px rule with a
   40px accent segment travelling down it on a 2.4s loop · bottom-right "SCROLL"
   rotated 90°.
   RUNS ON MOBILE. dpr 1, no postFX. Do not hide it.

02 STATEMENT — light, no 3D. After the hero, the site goes quiet.
   One statement pinned ~150vh, each word transitioning --text-tertiary →
   --text-primary as it crosses the scroll midpoint. scrubHighlight, scrub: 1.
   text-h2 → md:text-h1. Copy lives in src/data/manifesto.ts.

03 CLIENT MARQUEE — light
   Infinite marquee of client logos from /images/logos/mono/<clientId>.png
   (white #f5f3ee on transparency — do NOT apply a CSS filter to recolour, they
   are already correct). Render at 60% opacity → 100% on hover.
   friends-perk-cafe has NO logo: fall back to its name as a wordmark.
   Velocity-coupled via use-lenis-velocity — scrolling down accelerates, up
   reverses, clamped ±3x. Each is a TransitionLink to /work/[clientId].

04 FEATURED WORK — heavy. ★ FROZEN FILE ★
   Render <FeaturedWork /> unchanged. Do not restyle or rewrite it.

05 CAPABILITIES — medium
   The six services as full-width editorial rows, NOT cards.
   Row: 01 mono index · title at text-h2 font-heading · category badges right ·
   1px bottom rule. Hover: title translates x 24px and shifts to --accent, rule
   wipes in from left in accent, row height eases 96px→132px so the list makes
   room. A ~340x240 preview image follows the cursor with 0.12s damping, revealed
   by clip-path from centre, tilted up to 6° from pointer velocity.
   Add a `previewImage` field to the Service interface — this is a sanctioned
   data change. Map to existing real files only.
   Touch/low: static rows, no preview, no height change.

06 MOTION REEL — heavy, horizontalPin
   Pin, translate X through the clips from getCraftInMotionMedia(). 9:16, ~420px,
   gap-6. Videos muted loop playsInline preload="none" with posters. An
   IntersectionObserver plays ONLY what is on screen and pauses the rest —
   critical, several decoding at once stalls the main thread. Hover: scale 1.02,
   neighbours to 60% opacity, data-cursor="play". Click → lightbox with sound and
   a focus trap. Header pinned left with an incrementing 01/08 counter in mono.
   Mobile/low: native scroll, snap-x snap-mandatory, no pin, no GSAP.

07 PROCESS — light, deliberately the slowest moment
   The six stages from src/data/philosophy.ts as a restrained text sequence.
   Stage numbers scale to text-display in --text-tertiary at 20% opacity as each
   enters. Connecting vertical rule draws down via scaleY, scrubbed. `settle`
   preset. It should barely feel animated. Add nothing else here.

08 STATS — light, counterUp
   Four figures at text-display, mono labels, thin accent rules between. Every
   number DERIVED from src/data/* at build time, never hardcoded: client count,
   website count, social post count (flatMap images across socialCampaigns),
   video count (reels + showreels). Omit any stat that computes to 0.

09 TESTIMONIALS — medium
   getFeaturedTestimonials() only. Pull-quote at text-h2 font-heading, client
   logo + mono attribution, arrow nav, maskUp per line on change.
   Returns null when the array is empty.

10 CTA — heavy, second and FINAL 3D moment
   Full viewport. <View> slot: slow-rotating shape with drei
   MeshTransmissionMaterial (thickness 0.6, roughness 0.1, chromaticAberration
   0.05), RoomEnvironment, accent-tinted, 30% opacity, drifting behind the type.
   Tier 'high' only. Type at display-xl with maskUp. The single filled --accent
   button on the homepage, wrapped in <Magnetic>: within 120px it translates up
   to 12px toward the cursor via damp3, label counter-translating 4px, springs
   back on exit. Email beneath as a mono link with an animated underline.

11 FOOTER
   siteConfig.name at display-xxl, clipped by the viewport bottom edge so it
   bleeds off. Three columns: nav / socials / "LAHORE, PK" + live clock +
   availability. Link hover: maskUp label swap. Socials render nothing when
   socialLinks is empty.

### /work
Header "SELECTED WORK" at display-xl with a live count in mono. Filter pills with
a Framer layoutId indicator sliding between them; items re-flow with
AnimatePresence + layout. Client rows with the cursor-following preview primitive
from section 05. Keep cursor-spotlight.tsx exactly as-is (FROZEN — read its
comment block, it documents a real profiled scroll-freeze fix).

### /work/[clientId]  — the most important page on the site
Clients read exactly one case study before deciding. Structure it as an article.
  Hero: client logo + name at display-xxl, one full-bleed image with clipReveal,
    meta row (year · services · role · live domain).
  Sticky sidebar (lg+): client, services, deliverable counts, live URL. Collapses
    to a normal block below lg.
  Body: brief / approach / outcome as editorial blocks from src/data/case-studies.ts,
    alternating full-bleed and contained images with clipReveal and counter-parallax.
  Testimonial pull-quote via getTestimonialByClientId(), omitted if none.
  Social gallery: masonry, clipReveal staggered BY COLUMN so it doesn't reveal as
    one wave. WARNING: public/images/social/"friends perk" has a literal space in
    the folder name plus inconsistent casing and mixed .jpg/.jpeg — URL-encode.
  Video section for video-only clients (eternal, friends-perk-cafe).
  Next project: full-viewport block for the next client in workOrder. Scrolling
    into it fills a progress rule; completing it auto-navigates through the
    transition layer. Cancellable by scrolling back up. NEVER auto-navigates
    under reduced motion — plain link instead.
  friends-perk-cafe has NO case study and NO logo: render a gallery-only variant,
    never an empty article shell.

### /services
Hero at display-xl. Six service blocks, each a tall editorial section with title,
description, related work links, and a real image. Alternating alignment.
Reuse the Process section. CTA.

### /about
Portrait from the optimised /images/profile/ variant with clipReveal and
grayscale→colour scrubbed to scroll. Statement paragraphs from about.ts revealed
one at a time with maskUp. Timeline: vertical rule drawing down, scrubbed. Tools
as a velocity marquee. CTA.

### /contact
Split: form left, large type right at display-xl. DO NOT touch the API route,
Zod schema, or Resend client — presentation only. Per-field focus in --accent
with a label floating up. Inline validation from the existing schema. Submit
morphs label→spinner→checkmark, success state preserves form height so nothing
jumps. Errors must be honest: if RESEND_API_KEY is missing the route 500s, so say
sending failed and offer the mailto: fallback. Never claim success.

### /not-found + /error
Custom, using the site's motion language.

## Performance budget
LCP < 2.5s · CLS < 0.1 · INP < 200ms · initial JS < 250KB gzipped.
@react-three/* dynamically imported with ssr:false everywhere (~150KB).
Transform and opacity only in scroll and pointer loops — never left, top, width,
height, or filter.

## Build phases
  1  Performance: next.config, image conversion, posters
  2  Motion foundation: presets, SplitText, magnetic, marquee, quality provider
  3  Content load: testimonials, socials, logos, case studies, about
  4  Cursor + transitions + preloader
  5  Navigation + footer + WebGL provider
  6  Hero
  7  Homepage sections 02, 03, 05
  8  Homepage sections 06, 07, 08, 09, 10
  9  /work + /work/[clientId]
 10  /services + /about + /contact + 404
 11  Sound + audit
