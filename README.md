# 🌍 WanderAI - AI Travel Planner

A full-stack AI-powered travel planning application built with **Next.js (App Router)**, **OpenAI API**, and **Google Maps API**. 

Pick any destination and budget, then instantly generate a complete, personalized trip with top attractions, dining recommendations, and an organized day-by-day itinerary. Save your favorite trips for later, explore them on an interactive map, and export them for your travels.

---

## ✨ Features

- **🎯 Destination & Budget Customization**
  - Choose any worldwide destination (or pick trending destinations like Tokyo, Paris, Rome, Bali, Barcelona, New York).
  - Select trip duration from 1 to 14 days.
  - Pick your budget tier (**Economy**, **Moderate**, **Luxury**) with realistic cost benchmarks.
  - Select travel companions (Solo, Couple, Family, Friends) and travel vibes (Foodie, Cultural, Adventure, Relaxed, Photography, Nightlife, etc.).
  - Add optional custom preferences (e.g. vegetarian dining, accessibility, romantic spots).

- **🤖 AI Travel Generation Engine (OpenAI API)**
  - Powered by OpenAI (`gpt-4o-mini` with structured JSON schema output) via `/api/generate-trip`.
  - Intelligently generates complete day-by-day schedules with Morning, Afternoon, and Evening activities, insider tips, and specific cost estimates.
  - **Graceful Fallback Mode**: Works seamlessly right out of the box with built-in high-fidelity trip curation even before an OpenAI API key is configured.

- **🗺️ Interactive Google Maps Integration**
  - Live Google Maps JavaScript API rendering with custom colored markers for:
    - 🟣 **Attractions & Places to Visit**
    - 🔴 **Restaurants & Culinary Gems**
    - 🟢 **Day-by-Day Itinerary Activities**
  - Interactive InfoWindows with photos, ratings, price tiers, and "Open in Google Maps Directions".
  - Filter map markers by category or specific trip day.
  - **Visual Coordinate Fallback**: If a Google Maps API key is not supplied, an interactive digital coordinate map viewer with zoom & pan controls plots all pins accurately without throwing errors.

- **💾 Save Trips for Later (LocalStorage & Export)**
  - Save trips with 1 click (with celebratory confetti animation).
  - Browse saved trips in the **My Saved Trips** drawer.
  - Quick restore / switch between saved itineraries.
  - Export trips as structured `.json` files.
  - Print-friendly layout (or Save as PDF) formatted for clean offline travel reading.
  - Share summary text to clipboard.

- **💼 Practical Travel Advisory & Packing Checklist**
  - Estimated expense breakdown (Flights/Transit, Lodging, Food, Activities, Total).
  - Interactive interactive packing checklist with toggleable checkboxes.
  - Local etiquette rules, tipping culture, and transit guidelines.
  - Weather overview and payment advice.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + TypeScript + React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Engine**: [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`)
- **Maps**: [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage with JSON export/import

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your keys:

```env
# OpenAI API Key for live AI generation
OPENAI_API_KEY=sk-proj-...

# Google Maps API Key for live Google Maps tiles & satellite layers
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

> **Note**: You can also enter or update your API keys directly inside the application UI by clicking the **"API Keys"** button in the top navigation bar.

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

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-trip/
│   │   │       └── route.ts        # Next.js API Route for OpenAI itinerary generation
│   │   ├── globals.css             # Tailwind v4 setup & print styles
│   │   ├── layout.tsx              # Root HTML & metadata
│   │   └── page.tsx                # Main application page & state orchestrator
│   ├── components/
│   │   ├── Header.tsx              # Top navigation bar with Saved Trips badge & API key modal
│   │   ├── TripForm.tsx            # Trip configuration form (destination, budget, companions)
│   │   ├── TripView.tsx            # Master trip plan container & tab switcher
│   │   ├── DayItinerary.tsx        # Day-by-day morning/afternoon/evening schedule
│   │   ├── GoogleMapView.tsx       # Google Maps view with markers, filters & interactive fallback
│   │   ├── PlacesList.tsx          # Attractions & sightseeing cards with categories and ratings
│   │   ├── RestaurantsList.tsx     # Culinary spots cards with cuisines and must-try dishes
│   │   ├── BudgetBreakdown.tsx     # Expense calculator, packing checklist & etiquette
│   │   ├── SavedTripsModal.tsx     # Saved trips manager (open, export JSON, delete)
│   │   ├── SampleTripsModal.tsx    # Instant sample itinerary picker (Tokyo, Paris, etc.)
│   │   └── SettingsModal.tsx       # In-app API keys configuration modal
│   ├── lib/
│   │   ├── openai.ts               # OpenAI client & prompt engineering
│   │   ├── sampleTrips.ts          # Curated sample itineraries for instant testing
│   │   └── storage.ts              # LocalStorage helper for trips and preferences
│   └── types/
│       └── travel.ts               # Complete TypeScript data models
├── .env.example
├── package.json
└── tsconfig.json
```
