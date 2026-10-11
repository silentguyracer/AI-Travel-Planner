'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Globe,
  Compass,
  Calendar,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Navigation,
  Bot,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Dices,
  Play
} from 'lucide-react';

interface QuickTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample?: (sampleId: string) => void;
}

export default function QuickTourModal({
  isOpen,
  onClose,
  onSelectSample,
}: QuickTourModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(prev + 1, 3));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'Step 1 of 4',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      title: 'Pick Any Destination on Earth',
      subtitle: 'From world capitals to hidden villages',
      icon: Globe,
      iconColor: 'text-blue-600 bg-blue-50',
      description:
        'WanderAI lets you search literally any city, town, or island across the globe, or pick directly using an interactive world map.',
      features: [
        {
          icon: '🔍',
          title: 'Live Worldwide Geocoder',
          desc: 'Type any town (e.g. Tokyo, Paris, Betul, Udaipur, Rome) — it auto-resolves state, country, and GPS coordinates.',
        },
        {
          icon: '🗺️',
          title: 'Interactive World Map Pin Drop',
          desc: 'Click "Choose from Map" to view the 3D globe and click anywhere on Earth to drop an exact pinpoint.',
        },
        {
          icon: '🎲',
          title: 'Surprise Me! Wanderlust Roulette',
          desc: 'Indecisive? Click the dice button to instantly roll a handpicked dream destination.',
        },
      ],
      previewContent: (
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 border border-slate-800 shadow-inner text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Destination Search & Geocoding</span>
            <span className="text-emerald-400 font-bold">● 1,000,000+ Global Database</span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <span className="font-bold text-white">Betul, Madhya Pradesh, India</span>
            </div>
            <span className="text-[10px] bg-blue-600/80 text-white px-2 py-0.5 rounded-full font-bold">
              GPS: 21.90° N, 77.90° E
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="bg-slate-800 px-2 py-1 rounded-lg">🗼 Tokyo</span>
            <span className="bg-slate-800 px-2 py-1 rounded-lg">🥐 Paris</span>
            <span className="bg-slate-800 px-2 py-1 rounded-lg">🏝️ Bali</span>
            <span className="bg-slate-800 px-2 py-1 rounded-lg">🏛️ Rome</span>
            <span className="text-indigo-400 font-bold ml-auto">+ 250 curated pins</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 2 of 4',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      title: 'Dates, Budget & Travel Crew',
      subtitle: 'Tailored specifically to your trip style',
      icon: Calendar,
      iconColor: 'text-indigo-600 bg-indigo-50',
      description:
        'Set your exact travel calendar or trip duration, choose your budget tier, and personalize your travel companions and vibe.',
      features: [
        {
          icon: '📅',
          title: 'Interactive Travel Calendar',
          desc: 'Select exact start/end dates with visual duration counters, or pick quick presets (3, 5, 7, 14, 30 days).',
        },
        {
          icon: '💰',
          title: '3 Smart Budget Tiers',
          desc: 'Backpacker ($50–$100/day), Moderate ($150–$250/day), or Luxury ($350+/day) with real-time currency conversion.',
        },
        {
          icon: '👥',
          title: 'Companions & Travel Vibes',
          desc: 'Solo Traveler, Couple, Family with Kids, or Friends Group with custom vibes (Culture, Foodie, Photography, Nature).',
        },
      ],
      previewContent: (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl">
            <span className="text-lg block">🎒</span>
            <span className="font-bold text-slate-800 block text-[11px] mt-1">Backpacker</span>
            <span className="text-[10px] text-slate-500">$50–$100 / day</span>
          </div>
          <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md scale-105">
            <span className="text-lg block">✨</span>
            <span className="font-bold block text-[11px] mt-1">Moderate</span>
            <span className="text-[10px] text-indigo-100">$150–$250 / day</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
            <span className="text-lg block">💎</span>
            <span className="font-bold text-slate-800 block text-[11px] mt-1">Luxury</span>
            <span className="text-[10px] text-slate-500">$350+ / day</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 3 of 4',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      title: 'Full Day-by-Day AI Generation',
      subtitle: 'Packed with 6–8 activities every single day',
      icon: Sparkles,
      iconColor: 'text-emerald-600 bg-emerald-50',
      description:
        'Unlike basic planners that only give 2–3 items, WanderAI builds an exhaustive morning, afternoon, evening, and night itinerary.',
      features: [
        {
          icon: '⏰',
          title: 'Complete Hourly Schedules',
          desc: 'Morning coffee & historical monuments, afternoon highlights, scenic viewpoints, dinner spots, and night walks.',
        },
        {
          icon: '📸',
          title: 'Real Photos & Street View',
          desc: 'Automated high-resolution imagery from Wikimedia Commons and Google Places with 360° interactive Street View.',
        },
        {
          icon: '🍽️',
          title: 'Daily Culinary Blueprint',
          desc: 'Curated breakfast spots, midday lunch spots, afternoon cafés, and evening dinner recommendations.',
        },
      ],
      previewContent: (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900">Day 1: Historic Castles & Night Markets</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              8 Stops
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">09:00 AM</span>
              <span className="truncate">Morning Castle Tour & Imperial Gardens</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">12:30 PM</span>
              <span className="truncate">Artisan Ramen & Traditional Tea House</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-indigo-600 shrink-0">06:30 PM</span>
              <span className="truncate">Illuminated Skyline Observatory & Night Walk</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 4 of 4',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      title: '25+ Smart Travel Companion Tools',
      subtitle: 'Everything you need during your trip',
      icon: Compass,
      iconColor: 'text-purple-600 bg-purple-50',
      description:
        'Once generated, your trip becomes a comprehensive digital command center equipped with 25+ specialized tools.',
      features: [
        {
          icon: '🗺️',
          title: 'Google Maps Routes & Navigation',
          desc: 'Turn-by-turn route directions, day-by-day map waypoints, terrain/satellite layers, and dual Leaflet engine.',
        },
        {
          icon: '✈️',
          title: 'Flight Radar Telemetry & Trains',
          desc: 'Simulated cockpit flight telemetry HUD, airport terminal wayfinding, and Shinkansen / bullet train schedules.',
        },
        {
          icon: '🎧',
          title: 'Audio Guide & 24/7 AI Concierge',
          desc: 'Listen to narrated audio guides for each day and ask the AI Concierge for instant local advice on the fly.',
        },
      ],
      previewContent: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-base block">🗺️</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-1">Google Maps</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-base block">✈️</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-1">Flight Radar</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-base block">🤖</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-1">AI Concierge</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-base block">📱</span>
            <span className="font-bold text-slate-800 text-[11px] block mt-1">Digital Pass</span>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  const handleStartPlanning = () => {
    onClose();
    // Scroll to trip form
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDemo = () => {
    onClose();
    if (onSelectSample) {
      onSelectSample('sample-tokyo-5d');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-tight">
                How WanderAI Works • 1-Minute Visual Tour
              </h3>
              <p className="text-[11px] text-slate-400">
                Learn how to plan custom trips anywhere in seconds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Dots */}
        <div className="px-6 pt-4 pb-1 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {slide.badge}
          </span>
        </div>

        {/* Slide Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Slide Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${slide.iconColor}`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {slide.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {slide.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {slide.description}
          </p>

          {/* Interactive Preview Widget */}
          <div className="pt-1">{slide.previewContent}</div>

          {/* 3 Key Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {slide.features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1"
              >
                <div className="text-base">{feat.icon}</div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onSelectSample && (
              <button
                type="button"
                onClick={handleDemo}
                className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View fully loaded Tokyo 5-Day demo itinerary"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                <span className="hidden sm:inline">Try Demo Itinerary</span>
              </button>
            )}
            <button
              onClick={handleStartPlanning}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/25 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartPlanning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Planning Now!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
