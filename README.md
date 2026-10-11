# 🌍 WanderAI - Advanced AI Travel Planner

A commercial-grade, full-stack travel planning platform built with **Next.js (App Router)**, **OpenAI API**, and **Google Maps API**. 

Pick any destination and budget, then instantly generate a complete, personalized trip with top attractions, dining recommendations, and an organized day-by-day itinerary. Save your favorite trips for later, explore them on an interactive map, optimize transit paths, listen to native phrase pronunciations, track live expenses, and export to calendars.

---

## ✨ Full Suite of Advanced Capabilities

### 1. 🎯 Trip Planning & Customization
- **Global Autocomplete Search**: Interactive search across top global destinations with country badges and emoji markers.
- **Duration & Budget Tiers**: Choose 1 to 14 days with benchmarks for **Economy** ($), **Moderate** ($$), and **Luxury** ($$$).
- **Travel Companion & Vibes**: Solo, Couple, Family, Friends with vibes like *Foodie, Cultural, Adventure, Relaxed, Photography, Nightlife*.
- **Special Requests**: Custom prompt inputs (e.g. *vegetarian dining, romantic spots, wheelchair accessible*).

### 2. 🤖 AI Generation & Live Concierge (OpenAI API)
- **Structured Output Engine**: Uses `gpt-4o-mini` with strict JSON schema enforcing accurate GPS coordinates, cost breakdowns, and timing.
- **Live AI Concierge Drawer**: Real-time conversational chat assistant answering destination questions with trip context.
- **Curated Fallback Engine**: Works seamlessly right out of the box with built-in itineraries even before an API key is entered.

### 3. 🗺️ Interactive Google Maps & Route Paths
- **Custom Categorized Markers**:
  - 🟣 Attractions & Sightseeing
  - 🔴 Culinary & Dining Spots
  - 🟢 Daily Activities
- **Interactive Polyline Paths**: Visual walking/transit paths connecting morning, afternoon, and evening stops.
- **Vector Coordinate Fallback**: Interactive digital GIS coordinate viewer with zoom, drag, and pan controls.

### 4. 🧠 Geospatial AI Route Distance Optimizer (TSP)
- **Haversine Distance & TSP Heuristic**: Calculates geographic distances between scheduled stops for each day.
- **1-Click Route Optimization**: Eliminates backtracking, computes kilometers saved and estimated transit minutes saved, and updates the itinerary.

### 5. 🔊 Voice Audio Speech Synthesis Phrasebook
- **Native Audio Pronunciation**: Uses the Web Speech API to speak essential local phrases aloud in native **Japanese (`ja-JP`)**, **French (`fr-FR`)**, **Italian (`it-IT`)**, and **Spanish (`es-ES`)**.
- **1-Click Copy**: Copy phrase text to clipboard.
- **Emergency Directory**: Police, Ambulance, Fire, and Universal GSM helpline numbers.

### 6. 🚆 Nearby Excursions & Day Trip Extensions
- **Curated Day Trips**: Recommends nearby escapes (e.g. *Mount Fuji, Kamakura, Nikko from Tokyo*; *Versailles, Giverny, Champagne from Paris*).
- **1-Click Add**: Extends your trip duration and appends the day trip directly to the active itinerary.

### 7. ✈️ Smart Flight & Hotel Booking Finder
- **Pre-Configured Deep Links**: 1-click links to **Google Flights**, **Skyscanner**, **Booking.com**, and **Airbnb** with pre-filled destination parameters.

### 8. 🧾 Real-Time Travel Expense Tracker
- **Budget Consumed Progress Bar**: Compares actual spend against the estimated AI trip budget.
- **Receipt Logger**: Log expenses categorized by *Food, Transit, Lodging, Activities, Shopping*. Stored in `localStorage`.

### 9. 📅 Direct Calendar Sync & Multi-Currency Converter
- **`.ics` iCalendar Export**: Imports the itinerary into **Google Calendar**, **Apple Calendar**, or **Outlook**.
- **Multi-Currency Converter**: Instant currency switcher between **USD ($)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, **INR (₹)**, **AUD (A$)**, and **CAD (C$)**.

### 10. 🌱 Carbon Footprint & Eco-Travel Estimator
- Computes estimated kg CO₂ emissions based on transit and lodging tier.
- Displays equivalent trees needed for annual absorption and actionable green travel tips.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS v4
- **AI Engine**: OpenAI API (`gpt-4o-mini`)
- **Maps**: Google Maps JavaScript API
- **Audio**: Web Speech API (`SpeechSynthesis`)
- **Algorithms**: Haversine Formula & 2-Opt TSP Nearest Neighbor Heuristic
- **Calendar**: RFC 5545 iCalendar (`.ics`) standard
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage with JSON export/import

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

*(Note: API keys can also be configured directly in the browser via the **"API Keys"** button in the header).*

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```
