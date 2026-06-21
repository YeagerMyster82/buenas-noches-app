# Buenas Noches — Design & Feature Handoff

This document summarizes design and product decisions made while reviewing and mocking up redesigns of the Buenas Noches parent app and admin panel. It's meant as a build brief for implementing these changes in the real codebase (`YeagerMyster82/buenas-noches-app`).

Two reference mockups (interactive HTML, not real code) should be included alongside this file:
- `admin_dashboard_mockup.html` — redesigned admin panel
- `parent_app_rebuild_v9.html` — redesigned parent-facing app, including the personalized routine builder

---

## 1. Design system

**Colors** (real brand values, confirmed from the app icon SVG and existing `globals.css`):
- Navy (background/surfaces): `#16222E` (deepest), `#1F3044` (night-deep), `#28394E`, `#2D415A` (night-soft), `#4A6373`
- Cream/white (text on dark): `#FFF8EF`
- Gold (primary accent, "moon"): `#F4E7B2`
- Blue (secondary accent, "Noches" in wordmark): `#9ECFD2`
- Green (success/positive): `#8FBE9E`
- Red/coral (warnings): `#D9968C`

**Wordmark**: "BUENAS" in gold (`#F4E7B2`), "NOCHES" in blue (`#9ECFD2`), uppercase.

**Fonts**: Display/headings — **Baloo 2** (rounded, matches the real logo). Body — **Nunito Sans** (matches the existing `Avenir Next, Nunito Sans` stack in `globals.css`). Data/numbers — monospace (e.g. JetBrains Mono) for timers and stats.

**Visual principle**: commit to one dark theme throughout — no more switching between light and dark per screen. Custom-styled selects/dropdowns and file inputs everywhere (no bare OS form elements). One consistent line-icon set; no emoji used as functional icons.

---

## 2. Parent app — key feature changes

### Routine builder (Rutina tab) — the core fix
The current "Rutina" tab shows generic static tips. It should instead be the actual personalized routine generator:
1. **Input form**: wake time, **target bedtime** (new — see sleep window warning below), dinner time, prep duration, nap toggle.
2. **Generated plan**: full list of steps from `buildPlan()` in `lib/routine.js`, clearly marking which steps are profile-personalized (`mover`, `calmar_el_cuerpo`, `extra_calma` — pull from the child's activity catalog) vs. shared across all profiles (`bano_tibio`, `ponerse_pijama`, `cepillarse_los_dientes`, `gargaras_tarareo_mmm`, `a_la_cama`, `dormir`).
3. **Two ways to run it**:
   - **Guided player**: one step at a time, live per-step countdown, auto-advances, auto-logs the night (matches existing `routinePlayerOpen` behavior).
   - **Manual mode** (new, requested by a parent): full step list visible at once, parent controls timing themselves. See timing fix below.
4. **Video links**: any step with a matching entry in `routineVideoResources` should show a tappable video chip/button (already exists in `getRoutineVideosForStep()` — just wasn't surfaced in the redesign until added back in).

### Manual mode timing fix (important)
A single start/stop timer would corrupt sleep-latency data by including bath/teeth/pajama time. Manual mode needs **three captured moments**, matching the `nightly_logs` schema (`routine_start_time`, `in_bed_at`, `fell_asleep_at`):
1. "Iniciar rutina" — marks `routine_start_time`, starts a total-elapsed readout.
2. "Ya está en la cama" — marks `in_bed_at`, starts a second, highlighted "tiempo para dormir" readout from zero.
3. "Se durmió" — marks `fell_asleep_at`. `sleep_latency_minutes` = step 3 minus step 2, **not** step 3 minus step 1.

### Ideal sleep window warning (new)
Next to "¿A qué hora se despertó hoy?", add "¿A qué hora te gustaría que se duerma?" (target bedtime). Compute the child's ideal window live using the existing `calculateSleepWindow()` logic (age + nap status → a `[min,max]` minutes-awake range). If the entered target bedtime falls outside that window, show a clear warning: *"[time] está fuera de la ventana ideal de [child]. Según su edad y la hora en que despertó, lo ideal es entre [window]."* Show a positive confirmation if it falls inside the window.

**⚠ Known bug to fix while doing this**: `calculateSleepWindow()` and `calculateBedtime()` use different hardcoded minute constants and can disagree at certain ages (e.g. a 2-year-old with no nap: `calculateBedtime` adds 735 min while `calculateSleepWindow`'s range tops out at 720 min for that bracket). Reconcile these before shipping — right now the app can show a parent two different "ideal" answers depending which screen they're on.

### Trust/credibility elements (new)
- Persistent small strip under the header: *"Creado por especialistas en sistema nervioso infantil · QuiroKids® Lima, Perú."*
- Trust card on Inicio: positions QuiroKids as the only pediatric neurological chiropractic center in Peru, references real clinical experience, includes a founder note/quote from Joline Yeager.
- Science citations (already present in `avoidItems` data — AAP, Harvard Medical School, Sleep Foundation, etc.) surfaced as visible small citation tags, not buried in body copy.
- Privacy reassurance microcopy next to email/data-collection fields.

### Free vs. premium boundary (confirmed direction)
The free sleep timer stays a plain stopwatch — no routine content, no teasers. Underneath it, a single quiet upsell card: *"¿Quieres una rutina paso a paso para que tu hijo se duerma más rápido?"* → links to the Rutina tab (where the real premium gate already lives). No partial/locked previews of routine steps.

### Avatars
Keep the existing 5 profile illustrations (owl, fox, bear, cat, bunny — already in `/brand/profile-avatars/`). Use them prominently in: child switcher, quiz profile-reveal moment (the biggest emotional payoff in the app — give it a moment, e.g. a soft entrance animation), and the Niño profile screen.

---

## 3. Admin panel — key feature changes

The current admin panel reuses the parent app's shell (child selector, bottom nav with Niño/Rutina/Video) — none of that applies in an admin context and should be replaced with a dedicated layout (sidebar nav: Dashboard, Usuarios, Mensajes, Reseñas).

- **Fix the broken "Usuarios del app desde hoy" counter** — `buildAdminUserMix()` only counts users created *today*, while the list below it shows everyone, which is why it shows 0 while Premium users are listed underneath. Replace with real KPI cards (total, premium, free, trial, conversion rate, cancellations) plus a 30/90-day trend, not a today-only snapshot.
- **User table**: search + status filter, click-to-expand row showing that user's child profile(s) and real activity (replaces the currently-empty Perfiles/Actividad columns).
- **Support message routing**: messages tagged "Soporte" should surface WhatsApp/email quick-action buttons instead of (or in addition to) the in-app reply box.
- **Review moderation gate**: 5-star reviews currently auto-publish to the wall (`public_approved: rating === 5` in `saveAppReview()`). Add a manual approve/hide step before anything goes public, and route sub-5-star feedback to a private "comentarios para mejorar" queue (the data model already supports this via `needs_follow_up` — just needs a UI).
- Fix overlapping send/delete buttons in the Mensajes tab (currently stacked, easy to misclick).

---

## 4. Native in-app purchases (build this)

**Goal**: $9.99/month or $79/year subscription, sold through Apple/Google's native purchase system (user has explicitly chosen this over a Stripe-only path, accepting the 15–30% commission for simpler App Store approval and no regional payment-link gray areas).

**Recommended approach**: [RevenueCat](https://www.revenuecat.com/) as the layer between native StoreKit/Play Billing and Supabase. It handles receipt validation and cross-platform subscription state so the code doesn't have to.

**Code-level work Claude Code can do now:**
1. Add the RevenueCat Capacitor SDK (`@revenuecat/purchases-capacitor`).
2. Create a new Supabase table (or extend `purchase_access`) to store subscription status driven by RevenueCat: `active`, `trialing`, `past_due`, `canceled`, `expired`, plus `renews_at` / `expires_at`.
3. Add a new webhook route, e.g. `app/api/revenuecat/route.js`, mirroring the existing pattern in `app/api/captivationhub/route.js` (shared-secret header check, parse event, upsert subscription status by email). RevenueCat webhook events: `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, `BILLING_ISSUE`.
4. Update `getPremiumAccessByEmail()` in `lib/purchases.js` to check this new subscription status (in addition to, not replacing, the existing Captivation Hub course-purchase path — those are different products).
5. Replace `SALES_FUNNEL_URL` links (currently pointing to the external course sales page) with a native paywall trigger inside the app for the subscription product specifically — the course and the app subscription are different purchases and shouldn't share one redirect.

**What only the user can do (Claude Code should ask for these, not guess):**
- Create the $9.99/mo and $79/yr subscription products in App Store Connect and Google Play Console (needs her developer accounts, which require identity/banking verification only she can complete).
- Create a RevenueCat account, connect it to both stores, and provide the API keys as environment variables.
- Decide the product/SKU IDs (e.g. `buenas_noches_monthly`, `buenas_noches_annual`) — these need to match exactly across App Store Connect, Play Console, and RevenueCat.

## 5. App store shell (build this)

**The architectural constraint**: this app's backend isn't static — `/api/*` routes run server-side (Supabase queries, the support-message/review/admin logic, the webhooks above). A standard Capacitor static-export wrap would silently break all of it.

**Recommended approach**: wrap the *live deployed app*, not a static build. Capacitor's `server.url` config can point the native WebView at the production Vercel URL, so the UI loads and calls `/api/*` exactly as it does today — no Next.js restructuring needed.

```js
// capacitor.config.json
{
  "appId": "com.quirokids.buenasnoches",
  "appName": "Buenas Noches",
  "webDir": "public",
  "server": {
    "url": "https://app.quirokids.com",
    "cleartext": false
  }
}
```

**Code-level work Claude Code can do now:**
1. `npm install @capacitor/core @capacitor/cli`, `npx cap init`, add iOS and Android platforms.
2. Set `server.url` as above (staging vs. production should be swappable via env/build config, not hardcoded).
3. Generate app icons/splash screens from the existing `public/icons/buenas-noches-icon.svg` and `public/brand/` assets at the sizes each store requires.
4. Wire up native push notifications (APNs/FCM) as a Capacitor plugin alongside the existing web-push setup in `lib/push-notifications.js` — these are separate systems; native push doesn't reuse the VAPID web-push keys.
5. Add the RevenueCat purchase UI as a native screen/sheet (not a web `<iframe>` or redirect) so it matches Apple/Google's required purchase flow.

**What only the user can do:**
- Enroll in the Apple Developer Program ($99/yr) and Google Play Console ($25 one-time) if not already done, and provide Claude Code the signing certificates / provisioning profiles or build access (Xcode Cloud / EAS / Fastlane credentials) needed to actually produce installable builds.
- Approve App Store / Play Store listing content (screenshots, description, privacy policy URL) before submission — Claude Code can draft these, but submission itself needs her account access.
