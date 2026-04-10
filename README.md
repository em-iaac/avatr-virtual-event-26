# AVATR Virtual Event 2026

A luxury automotive virtual event platform for the AVATR brand — designed as an immersive, room-based digital experience leading up to a live premiere on **May 1, 2026 at 8:00 PM (Kuwait, GMT+3)**.

**Live Site:** [https://em-iaac.github.io/avatr-virtual-event-26/](https://em-iaac.github.io/avatr-virtual-event-26/)  
**Local Dev:** `http://localhost:5173/avatr-virtual-event-26/`

---

## Concept

The site reimagines a car launch event as an explorable virtual venue. Visitors enter a **Lobby** — styled as a floorplan of the AVATR logo emblem — and navigate between four distinct rooms, each offering a different facet of the brand experience:

| Room | Purpose |
|------|---------|
| **Lobby** | Central hub with emblem-shaped interactive floorplan, particle constellation, and countdown |
| **Waiting Room** | Pre-event engagement — brand story, vehicle lineup, performance stats, speed challenge game, and a knowledge quiz |
| **Reveal Room** | 3D car model experience (AVATR 011 via Three.js with fog + spotlight reveal) |
| **Watching Room** | Live video premiere (YouTube embed) with pre/live/post phases |
| **Invitation Room** | RSVP & shareable invitation card — **locked** until the quiz is completed |

### Narrative Flow

1. Visitors land on the Lobby and explore freely during the **pre-event** countdown phase.
2. The Waiting Room offers interactive content and a **7-question quiz** about AVATR (passing score: 4/7).
3. Completing the quiz unlocks the **Invitation Room**, where users can RSVP and generate a shareable card.
4. When the premiere goes live, the Watching Room switches from countdown to a live YouTube stream.
5. Post-event, the site enters **replay mode**.

### Design Language

- **Dark luxury aesthetic** — near-black backgrounds (`#060608`) with gold accent (`#c8a96e`)
- **Typography** — Outfit (display) + Inter (body)
- **Glass morphism** panels with subtle gold glow effects
- **Bilingual support** — English and Arabic (virtual host messages)

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Routing | Vue Router 4 (hash-free history mode) |
| 3D | Three.js + GLTFLoader (18.5 MB `.glb` model) |
| Animation | GSAP 3 |
| Build | Vite 8 |
| Deployment | GitHub Pages (static, base path `/avatr-virtual-event-26/`) |

### Project Structure

```
src/
├── config.js              # Event date, brand info, phase logic
├── main.js                # App bootstrap
├── App.vue                # Root component
├── router/index.js        # 5 routes + invitation guard
├── layouts/
│   └── RoomLayout.vue     # Global wrapper (loader, transitions, overlays)
├── views/
│   ├── LobbyView.vue      # Hub with emblem floorplan
│   ├── WaitingRoomView.vue # Tabbed: story / lineup / stats / game / quiz
│   ├── RevealRoomView.vue  # 3D car reveal
│   ├── WatchingRoomView.vue# Video premiere (pre/live/post)
│   └── InvitationRoomView.vue # RSVP + shareable card
├── components/
│   ├── SiteLoader.vue      # Launch animation (emblem PNG reveal)
│   ├── SoundManager.vue    # Procedural ambient audio per room
│   ├── VirtualHost.vue     # AI guide "Ava" (bilingual narration)
│   ├── RoomTransition.vue  # Door-style route transitions
│   ├── CarReveal.vue       # Three.js 3D model viewer
│   ├── VideoPlayer.vue     # YouTube embed wrapper
│   ├── QuizModule.vue      # 7-question trivia with hints
│   ├── SpeedChallenge.vue  # Reaction-time game
│   ├── BrandStory.vue      # Scrollable brand narrative
│   ├── VehicleLineup.vue   # Vehicle card carousel
│   ├── VehicleCard.vue     # Individual vehicle display
│   ├── PerformanceStats.vue# Animated spec comparisons
│   ├── SignupSection.vue   # RSVP form
│   ├── CountdownTimer.vue  # Days/hours/mins/secs to event
│   ├── CursorGlow.vue      # Interactive cursor trail
│   ├── FloatingDiamonds.vue# Decorative particle layer
│   ├── MagneticButton.vue  # Hover-attract button effect
│   ├── TiltCard.vue        # 3D perspective tilt on hover
│   ├── ScrollReveal.vue    # Intersection Observer animations
│   ├── TextReveal.vue      # Character-by-character text animation
│   ├── SectionHeading.vue  # Styled heading component
│   ├── FooterSection.vue   # Site footer
│   └── ComingSoon.vue      # Placeholder for unreleased content
├── data/
│   ├── vehicles.json       # 3 vehicle specs (011, 012, 06)
│   └── quiz.json           # 7 questions, 4/7 pass threshold
├── styles/
│   └── main.css            # Design tokens, global styles, glass panels
└── assets/                 # Images, 3D model (.glb), audio
```

### Key Systems

**Event Phase Engine** (`config.js`)  
Determines UI state site-wide via `getEventPhase()`:
- `pre` — countdown timers, teaser content
- `live` — live badge, video stream, full access
- `post` — replay mode

**Room Ambient Audio** (`SoundManager.vue`)  
Procedurally generated via Web Audio API — each room has a unique sonic profile:
- Sub-bass oscillator (sine wave, room-specific frequency)
- Mid-range with LFO modulation
- Bandpass-filtered noise atmosphere
- Crossfades on route change

**Virtual Host — Ava** (`VirtualHost.vue`)  
- Bilingual welcome (English + Arabic) with cultural greetings
- Audio narration playback
- Shows once per room per session, dismissible with mini-button re-trigger

**Route Guard** (`router/index.js`)  
The Invitation room checks `localStorage('avatr-quiz-completed')` via a `beforeEnter` guard. Unattempted users are redirected to the Waiting Room quiz tab.

**3D Car Reveal** (`CarReveal.vue`)  
- Loads `avatr-011-model.glb` via Three.js GLTFLoader
- Fog + spotlight dramatic reveal sequence
- Interactive orbit controls

### Vehicle Data

| Model | Type | Power | Range | 0–100 km/h |
|-------|------|-------|-------|-------------|
| AVATR 011 | Luxury SUV | 578 HP | 680 km | 3.98s |
| AVATR 012 | Executive Sedan | 578 HP | 700 km | 3.9s |
| AVATR 06 | Compact SUV | 425 HP | 620 km | 4.5s |

---

## Getting Started

> **Every time you open the project**, you need to start the dev server to view it locally.

### 1. Install dependencies (first time only, or after adding new packages)

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

This starts Vite and serves the site at:  
**http://localhost:5173/avatr-virtual-event-26/**

> The server must stay running in the terminal while you work. If you close the terminal or restart your computer, run `npm run dev` again.

### 3. Other commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Pre-Launch Checklist

1. Replace the YouTube video ID in `src/config.js` (`EVENT.videoId`)
2. Set the Google Apps Script endpoint in `src/config.js` (`API.sheetsEndpoint`) for RSVP collection
3. Verify the event date/time in `EVENT.date`

---

## Deployment

Deployed to **GitHub Pages** from the `gh-pages` branch. The Vite config sets `base: '/avatr-virtual-event-26/'` for correct asset paths.

```bash
npm run build
# Push dist/ contents to gh-pages branch
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `vue` 3.x | UI framework |
| `vue-router` 4.x | Client-side routing |
| `three` 0.183 | 3D model rendering |
| `gsap` 3.x | Animation engine |
| `@vueuse/core` | Vue composition utilities |
| `@formkit/auto-animate` | List transition animations |
| `html2canvas` | Shareable invitation card generation |

---

*MACAD Module 02 — Computational & Building Design Methods*
