# 🌍 WanderAI — Autonomous AI Travel Planner & Mission Control

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-049EF4?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A commercial-grade, full-stack travel operating system built with **Next.js (App Router)**, **OpenAI GPT-4o**, **Three.js WebGL**, **GSAP Animations**, and **Google Maps API**.

WanderAI transforms any destination, travel duration (1–14 days), group size, and budget into an immersive, hyper-personalized expedition. Featuring an interactive 3D flight globe, an aerospace-style mission control HUD, turn-by-turn inter-stop transit matrices, on-the-fly AI Day Remixing, offline printable pocket booklets, and native audio speech synthesis.

---

## 📑 Table of Contents

- [✨ Key Highlights](#-key-highlights)
- [🧩 All 30 Built-In Travel Modules](#-all-30-built-in-travel-modules)
  - [1. Intelligent Itinerary & Planning](#1-intelligent-itinerary--planning)
  - [2. 3D Flight & Geospatial Navigation](#2-3d-flight--geospatial-navigation)
  - [3. Finance, Budget & Taxes](#3-finance-budget--taxes)
  - [4. Traveler Safety & Emergency Hub](#4-traveler-safety--emergency-hub)
  - [5. Smart Companion & Sensory Audio](#5-smart-companion--sensory-audio)
  - [6. Export, Sharing & Offline Print](#6-export-sharing--offline-print)
- [🏗️ System Architecture & Directory Structure](#️-system-architecture--directory-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Quickstart & Installation](#-quickstart--installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚢 Production Deployment (Vercel, Cloudflare, Docker)](#-production-deployment)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Highlights

- 🌐 **Full 14-Day Seamless Multi-Day Itinerary Engine**: Complete Day 1 to Day 14 day-by-day scheduling with morning, afternoon, and evening slots, timing buffers, and dynamic day selector tabs with dedicated Back and Home controls.
- 🪐 **Interactive 3D Flight Trajectory Globe**: WebGL rotating globe rendering great-circle geodesic flight arcs between origin and destination with animated flight markers, day/night terminator lines, and atmospheric bloom.
- 🎛️ **Aerospace Travel Mission Control HUD**: Floating heads-up display showing live travel telemetry, destination coordinates, solar azimuth, elevation profiles, and countdown clocks.
- 🪄 **Live AI Itinerary Doctor & Day Re-Mixer**: Instantly transforms any day of your trip into Rainy Day Rescue, Foodie Deep Dive, Slow Travel Wellness, High-Energy Adventure, or Night Owl Speakeasies without regenerating the entire trip.
- 🔊 **Web Speech Voice Audio Guide & Soundscapes**: Native speech synthesis tour guide with variable speed narration, plus ambient soundscapes (Kyoto Zen bells, Paris bistro, ocean surf).
- 📱 **Zero-Account Offline Mode**: LocalStorage persistence, instant shareable URL hash compression, and printable A4 pocket travel booklets with show-to-taxi driver flashcards.

---

## 🧩 All 34 Built-In Travel Modules

### 1. Intelligent Itinerary & Planning
1. **Interactive Day-by-Day Timeline**: Chronological morning (09:00–12:00), afternoon (13:00–17:00), and evening schedules with category tags (*Culture, Culinary, Nature, Leisure*).
2. **AI Day Re-Mixer (Live API)**: Re-plans any single day for rain, foodie excursions, or late-night itineraries with side-by-side diff previews.
3. **Smart In-Place Activity Editor**: Edit, rename, reorder, adjust durations, or delete individual itinerary stops with real-time budget and pacing recalculation.
4. **Visual Master Travel Calendar**: 3 views (Month Grid Matrix, Gantt Timeline, Chronological Agenda) with direct 1-click **Google Calendar** web sync and `.ics` download.
5. **AI TSP Route Distance Optimizer**: Solves the Travelling Salesperson Problem using Haversine distance heuristics to eliminate backtracking between daily attractions.
6. **Curated Nearby Day Trips & Excursions**: 1-click day trips that seamlessly append to the end of the active trip (e.g., Mount Fuji from Tokyo, Versailles from Paris).
7. **Trip Quality & Pace Score Dashboard**: 100-point algorithmic evaluation scoring cultural balance, walking fatigue index, relaxation ratio, and budget efficiency.

### 2. 3D Flight & Geospatial Navigation
8. **3D Flight Path Globe (Three.js WebGL)**: Interactive globe with spherical geodesics, real flight path curves, orbital camera controls, and city pin drop animations.
9. **Hopper-Grade Flight Price Predictor**: 30-day historical and projected fare curve with confidence band canvas, volatility score, and "Wait vs Buy Now" machine learning verdict.
10. **Flight Radar Simulator**: Live radar sweep visualizing aircraft callsigns, altitude, groundspeed, and radar cross-section.
11. **Interactive Google Maps + GIS Vector Engine**: Custom categorized map markers (Sightseeing, Dining, Activities) with polyline walking paths and fallback coordinate canvas.
12. **High-Speed Rail & Bullet Train Explorer**: Rail network planner covering Shinkansen, TGV, Frecciarossa, and Eurostar with JR Pass & Eurail pass cost calculations.
13. **Inter-Stop Turn-by-Turn Transit Matrix**: Distance, walking duration, subway line options, and taxi fare estimates between every consecutive stop.
14. **Interactive Destination Map Picker**: Click anywhere on a world map modal to set destinations and inspect regional highlights.

### 3. Finance, Budget & Luggage Logistics
15. **3D Suitcase Tetris & Center-of-Gravity Balance**: Interactive compartment luggage packer (Upper Mesh, Heavy Basin, Tech Sleeve, Toiletry Pouch) with tip-over balance physics and TSA 3-1-1 compliance checks.
16. **Real-Time Travel Expense Tracker**: Category breakdowns (*Food, Transit, Lodging, Activities, Shopping*) with budget utilization progress bars.
17. **Group Bill Splitter & "Who Owes Who" Settler**: Greedy debt minimization algorithm simplifying webs of group expenses into minimal payments with 1-click WhatsApp export.
18. **Live Multi-Currency Converter & Ticker**: Real-time conversion across 12 world currencies (USD, EUR, GBP, JPY, INR, AUD, CAD, CHF, SGD, AED, etc.).
19. **VAT / Tax-Free Shopping Refund Calculator**: Country-specific VAT refund rates, minimum spend threshold checks, and airport customs stamp checklists.
20. **Local Tipping & Etiquette Advisor**: Country-specific gratuity standards for restaurants, bars, taxis, bellhops, and tour guides.

### 4. Traveler Safety & Emergency Hub
21. **Traveler Safety Shield & Scam Radar**: Verified intelligence database of top tourist scams (e.g. fake petitions, taxi meter refusal, nightlife touts) with threat meters and counter-tactics.
22. **One-Tap Emergency Dialing**: Instant `tel:` links to local Police, Ambulance, Fire Department, and universal GSM helpline numbers.
23. **Visa & Entry Requirements Advisor**: Passport validity rules, Schengen 90/180-day calculators, e-Visa / ETA requirements, and mandatory tourist cards.
24. **Severe Allergy & Dietary Flashcards**: High-contrast, full-screen cards in local characters for peanut allergies, celiac/gluten-free, strict vegetarian, and taxi drivers.

### 5. Smart Companion & Sensory Audio
25. **Autonomous AI Flight & Ground Copilot HUD**: Floating voice-enabled copilot with live audio visualizer waveforms, speech synthesis, microphone recognition, and contextual itinerary intelligence.
26. **Digital Nomad & Workation Hub**: Verified Wi-Fi speed and latency benchmarks, top laptop-friendly cafes, dual-clock timezone overlap synchronizer, and electrical plug adapter guides.
27. **AI Concierge Live Chat**: Floating real-time travel assistant answering local questions, cultural nuances, and packing advice.
28. **Native Speech Audio Tour Guide**: Multi-lingual browser audio tour guide with speed controls (0.65x study speed vs 1.0x native).
29. **Ambient Soundscape Generator**: Procedural background audio players (Rain on Window, Zen Temple Bells, Cafe Ambient, Ocean Waves).
30. **Avoid-the-Crowds & Foot-Traffic Radar**: Hourly crowd density heatmaps (06:00 to 23:00) with best arrival windows to bypass long queues.
31. **Golden Hour & Astro-Photo Radar**: Solar ephemeris calculating Sunrise, Morning Golden Hour, Solar Noon, Sunset, and Blue Hour with lens recommendations.

### 6. Export, Sharing & Offline Print
32. **Offline Pocket Travel Booklet**: Clean printable CSS layout formatted for A4 paper folding with emergency contacts, taxi cards, and schedules.
33. **Luggage Weight & Baggage Calculator**: Visual airline scale checker against cabin and checked limits (23kg / 32kg) with excess baggage fee alerts.
34. **Digital Boarding Pass & URL Hash Compression**: Airline-style boarding pass card with QR code, plus instant URL hash sharing (no database login required).

---

## 🏗️ System Architecture & Directory Structure

```text
ai-travel-planner/
├── public/                     # Static assets, SVG icons, fonts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat-concierge/ # Streaming / JSON AI concierge assistant
│   │   │   ├── cities/         # Global world cities search & autocompletion
│   │   │   ├── generate-trip/  # Master itinerary & trip generation engine
│   │   │   ├── place-image/    # Dynamic place photography resolver
│   │   │   └── remix-day/      # On-the-fly single day AI transformation
│   │   ├── favicon.ico
│   │   ├── globals.css         # Tailwind CSS v4 styling & dark theme tokens
│   │   ├── layout.tsx          # Master HTML root layout & metadata
│   │   └── page.tsx            # Main application controller & state machine
│   ├── components/
│   │   ├── AIDayRemixModal.tsx         # AI Day Re-Mixer modal
│   │   ├── AIConciergeModal.tsx        # Floating AI chat concierge
│   │   ├── AmbientSoundscapePlayer.tsx # Ambient audio player
│   │   ├── AudioTourGuide.tsx          # Speech synthesis tour narration
│   │   ├── BoardingPassCard.tsx        # Airline boarding pass generator
│   │   ├── BudgetBreakdown.tsx         # Cost & category visualizer
│   │   ├── CarbonFootprint.tsx         # Eco-emissions calculator
│   │   ├── CrowdRadar.tsx              # Attraction foot-traffic heatmap
│   │   ├── DayItinerary.tsx            # Day schedule view & day switcher
│   │   ├── DayTripSuggester.tsx        # Excursion recommendation modal
│   │   ├── DestinationGallery.tsx      # Unsplash photo showcase
│   │   ├── DestinationMapPickerModal.tsx # Interactive world map destination picker
│   │   ├── ExpenseTracker.tsx          # Local spend logger & budget tracker
│   │   ├── FlightHotelFinder.tsx       # Flight/Hotel deep link portal
│   │   ├── FlightRadarSimulator.tsx    # Radar sweep simulator
│   │   ├── FloatingNavDock.tsx         # Persistent 2-tier navigation dock
│   │   ├── GlobeFlightPath3D.tsx       # Three.js 3D flight trajectory globe
│   │   ├── GoldenHourRadar.tsx         # Sun ephemeris & photo spots
│   │   ├── GoogleMapView.tsx           # Google Maps & vector GIS renderer
│   │   ├── GroupExpenseSplitter.tsx    # Debt settler & WhatsApp exporter
│   │   ├── HighSpeedRailPlanner.tsx    # Bullet train & rail pass planner
│   │   ├── JetLagAdvisor.tsx           # Circadian sleep adjustment planner
│   │   ├── LiveCurrencyTicker.tsx      # Floating live exchange rate ticker
│   │   ├── LiveTranslator.tsx          # Speech translator & allergy cards
│   │   ├── LuggageWeightCalculator.tsx # Airline baggage scale calculator
│   │   ├── OfflinePassModal.tsx        # Printable pocket guidebook
│   │   ├── PackingCustomizer.tsx       # Checkable luggage checklist
│   │   ├── RouteOptimizerModal.tsx     # TSP route distance optimizer
│   │   ├── SafetyShield.tsx            # Scam radar & emergency dialer
│   │   ├── SmartActivityEditor.tsx     # In-place itinerary activity editor
│   │   ├── TipCalculator.tsx           # Global tipping standards
│   │   ├── TravelCalendarView.tsx      # 3-view travel calendar & Google sync
│   │   ├── TravelJournalBook.tsx       # Memory book & AI vintage postcards
│   │   ├── TravelMissionControlHUD.tsx # Aerospace floating telemetry HUD
│   │   ├── TrekElevationProfile.tsx    # Topographic elevation chart
│   │   ├── TripForm.tsx                # Trip generator form & vibe selector
│   │   ├── TripProgressRing.tsx        # Circular pacing indicator
│   │   ├── TripScoreDashboard.tsx      # 100-point trip quality radar
│   │   ├── VatRefundCalculator.tsx     # Duty-free VAT refund calculator
│   │   ├── VisaEntryRequirements.tsx   # Visa rules & Schengen calculator
│   │   └── WeatherWidget.tsx           # 5-day destination forecast
│   ├── lib/
│   │   ├── aiClient.ts         # OpenAI API & heuristic fallback client
│   │   ├── calendarExport.ts   # RFC 5545 .ics iCalendar generator
│   │   ├── currency.ts         # Currency rates & formatters
│   │   ├── gsapAnimations.ts   # GSAP scroll triggers & micro-interactions
│   │   ├── routeOptimizer.ts   # Haversine & 2-Opt TSP solver
│   │   ├── sampleTrips.ts      # High-fidelity offline sample itineraries
│   │   ├── shareUrl.ts         # Compressed URL hash encoder/decoder
│   │   ├── storage.ts          # LocalStorage saved trips manager
│   │   ├── transitMatrix.ts    # Inter-stop transit heuristic calculations
│   │   └── worldCities.ts      # Curated world cities database
│   └── types/
│       └── travel.ts           # Strict TypeScript interfaces & schema types
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/generate-trip` | `POST` | Generates a full multi-day itinerary, dining recommendations, and budget using GPT-4o with automated heuristic fallback. |
| `/api/remix-day` | `POST` | Re-engineers a specific itinerary day based on 6 selectable modes (*Rainy Day, Foodie, Wellness, Adventure, Night Owl, Custom*). |
| `/api/chat-concierge`| `POST` | Real-time conversational AI travel concierge answering destination questions. |
| `/api/cities` | `GET` | Autocomplete search across 100+ top world destinations with coordinates and badges. |
| `/api/place-image` | `GET` | Fetches high-resolution travel photography for destinations and attractions. |

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm, yarn, or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/silentguyracer/AI-Travel-Planner.git
cd AI-Travel-Planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Populate your API keys:
```env
# Optional: OpenAI API Key for real-time generative responses
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Optional: Google Maps JavaScript API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyYourGoogleMapsKey
```

> **Note:** The app features complete **zero-config offline support**. If no API keys are provided, WanderAI automatically operates via its built-in heuristic AI engines and vector coordinate mapping!

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | No | Internal Heuristics | Powers GPT-4o trip generation, day remixing, and AI concierge. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Vector GIS Canvas | Powers interactive Google Maps tiles and satellite views. |

---

## 🚢 Production Deployment

### Option A: Deploy with Vercel (Recommended)
1. Fork or push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Select `AI-Travel-Planner` from your repository list.
4. Add your optional `OPENAI_API_KEY` in the Environment Variables section.
5. Click **Deploy**.

### Option B: Cloudflare Pages
1. Go to **Cloudflare Dashboard** $\to$ **Compute (Workers & Pages)** $\to$ **Create application**.
2. Connect your GitHub repository `AI-Travel-Planner`.
3. Choose the **Next.js** framework preset.
4. Click **Save and Deploy**.

### Option C: Production Node.js Build
```bash
npm run build
npm start
```
The optimized production server will listen on `http://localhost:3000`.

---

## ⌨️ Navigation & Keyboard Shortcuts

- **Day Selector Tabs**: Click any day number (Day 1 – 14) or use the `← Prev Day` and `Next Day →` buttons to navigate multi-day plans.
- **Top Bar Home & Back Buttons**: Quick navigation to return to the trip planner form or previous view at any time.
- **Quick Jump Dock**: Floating bar at the bottom of the viewport for instant 1-click access to the top 6 tools.
- **27-Module Search**: Click the grid icon in the floating dock to search all capabilities via instant modal filter.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ for modern travelers worldwide.
</p>
