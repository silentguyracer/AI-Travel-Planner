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
  Plane,
  Layers,
  ArrowRight,
  ShieldCheck,
  Dices,
  Play,
  Moon,
  Shuffle
} from 'lucide-react';
import { playPop, playChime } from '@/lib/interactiveAudio';

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
        playPop();
        setCurrentSlide((prev) => Math.min(prev + 1, 3));
      } else if (e.key === 'ArrowLeft') {
        playPop();
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
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Commercial Flight Cockpit & 100K+ Geocoder',
      subtitle: 'From your local airport to any city on Earth',
      icon: Plane,
      iconColor: 'text-indigo-400 bg-indigo-500/20',
      description:
        'WanderAI connects your home departure airport to any destination on Earth with real-time geodesic flight telemetry, distance calculation, visa status, and live geocoding.',
      features: [
        {
          icon: '🛫',
          title: 'Two-Way Route Cockpit',
          desc: 'Select Departure Hub (DEL, BOM, JFK, LHR, DXB) and Destination, or hit "⇄" to swap routes instantly.',
        },
        {
          icon: '📡',
          title: 'Live Flight Telemetry Radar',
          desc: 'Instant great-circle distance (km), non-stop flight times, recommended airlines, and fare benchmarks.',
        },
        {
          icon: '🗺️',
          title: 'Interactive 3D Map Pin Drop',
          desc: 'Open the interactive world map to pick any city, town, or island directly with zero typing.',
        },
      ],
      previewContent: (
        <div className="bg-slate-900/90 rounded-2xl p-4 text-white space-y-3 border border-white/10 shadow-inner text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Flight Telemetry Radar
            </span>
            <span className="text-emerald-400 font-mono font-bold">DEL ➔ HND (5,860 km)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block font-bold">NON-STOP FLIGHT</span>
              <span className="text-white font-bold">7h 35m</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block font-bold">PARTNER AIRLINES</span>
              <span className="text-white font-bold">ANA · JAL · Air India</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block font-bold">VISA STATUS</span>
              <span className="text-indigo-300 font-bold">eVisa / 90D Waiver</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block font-bold">JETLAG RISK</span>
              <span className="text-amber-300 font-bold">+3.5h (Mild)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 2 of 4',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      title: '6 Curated Travel Modes & Vibe Matcher',
      subtitle: 'Tune your journey with MakeMyTrip-style experience tabs',
      icon: Compass,
      iconColor: 'text-violet-400 bg-violet-500/20',
      description:
        'Switch between curated vacation categories with 1 click, or let the 3-question "Match My Vibe" quiz discover your dream destination.',
      features: [
        {
          icon: '🏖️',
          title: '6 Curated Travel Modes',
          desc: 'Complete Holiday, Solo Backpacker, Romance & Couples, Family & Kids, Luxury VIP, and Scenic Rail Tour.',
        },
        {
          icon: '🎯',
          title: '3-Question Vibe Matcher',
          desc: 'Pick your rhythm, travel crew, and spend style to get an instant tailored destination match with 98% accuracy.',
        },
        {
          icon: '🎓',
          title: 'Special Traveler Fare Passes',
          desc: 'Toggle Student Pass, Senior Citizen, Digital Nomad, or Family with Stroller for tailored perks.',
        },
      ],
      previewContent: (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <span className="text-lg block">🎒</span>
            <span className="font-bold text-white block text-[11px] mt-1">Solo Backpacker</span>
            <span className="text-[10px] text-slate-400">Hostels & Street Eats</span>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-md scale-105 border border-indigo-400/40">
            <span className="text-lg block">🏖️</span>
            <span className="font-bold block text-[11px] mt-1">Complete Holiday</span>
            <span className="text-[10px] text-indigo-100">Top Sights & Dining</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <span className="text-lg block">💑</span>
            <span className="font-bold text-white block text-[11px] mt-1">Couples & Romance</span>
            <span className="text-[10px] text-slate-400">Boutique & Sunsets</span>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 3 of 4',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Real-Time Fare & Multi-Currency Calculator',
      subtitle: 'Dynamic budgeting before you pack your bags',
      icon: DollarSign,
      iconColor: 'text-emerald-400 bg-emerald-500/20',
      description:
        'As you adjust your calendar dates, duration slider, budget tier, or travel crew, WanderAI recalculates your estimated trip expenses in real time.',
      features: [
        {
          icon: '💱',
          title: '6 Global Currencies',
          desc: 'Instant 1-click toggling between USD ($), INR (₹), EUR (€), GBP (£), AED (د.إ), and JPY (¥).',
        },
        {
          icon: '📊',
          title: 'Itemized Fare Breakdown',
          desc: 'Inspect estimated costs separated into Flights & Transit, Hotel Stays, and Dining & Sightseeing.',
        },
        {
          icon: '💡',
          title: 'Daily Average Index',
          desc: 'See daily estimated spend per traveler to ensure your trip fits your exact financial comfort zone.',
        },
      ],
      previewContent: (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 shadow-inner space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-extrabold text-white">Estimated 5-Day Couple Trip</span>
            <span className="text-sm font-black text-emerald-400 font-mono">$1,250 / ₹1,04,500</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-white/5 p-1.5 rounded-lg">
              <span className="text-slate-400 block">✈️ Flights</span>
              <span className="text-white font-bold">$550</span>
            </div>
            <div className="bg-white/5 p-1.5 rounded-lg">
              <span className="text-slate-400 block">🏨 4 Nights</span>
              <span className="text-white font-bold">$420</span>
            </div>
            <div className="bg-white/5 p-1.5 rounded-lg">
              <span className="text-slate-400 block">🍽️ Dining & Sights</span>
              <span className="text-white font-bold">$280</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Step 4 of 4',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: 'Action-Packed Schedules & 34 Smart Modules',
      subtitle: '6 to 8 events per day with AI Day Doctor remixing',
      icon: Sparkles,
      iconColor: 'text-rose-400 bg-rose-500/20',
      description:
        'WanderAI generates a comprehensive day-by-day plan packed with morning sunrise vantages, food markets, museums, golden hour viewpoints, and evening night walks.',
      features: [
        {
          icon: '🪄',
          title: 'AI Day Doctor Remix',
          desc: 'Rainy forecast? Foodie craving? Remix any individual day into a Rain Rescue or Night Owl plan without regenerating.',
        },
        {
          icon: '🌙',
          title: 'Dark & Light Theme Switcher',
          desc: 'Switch between Cinematic Deep-Space Dark Mode and Clean Light Mode anytime from the top navigation bar.',
        },
        {
          icon: '📱',
          title: 'Zero-Login Offline Export',
          desc: 'Printable A4 pocket travel booklets with taxi cards, QR boarding passes, and instant URL hash sharing.',
        },
      ],
      previewContent: (
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-3 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-extrabold text-white">Day 1: Historic Castles & Night Markets</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              8 Stops Scheduled
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold text-indigo-400 shrink-0">08:00 AM</span>
              <span className="truncate">Meiji Jingu Shrine & Morning Forest Walk</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold text-indigo-400 shrink-0">12:30 PM</span>
              <span className="truncate">Tsukiji Outer Market Seafood Tasting Crawl</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-bold text-indigo-400 shrink-0">06:30 PM</span>
              <span className="truncate">Shibuya Sky Golden Hour Panoramic Observatory</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  const handleStartPlanning = () => {
    playChime();
    onClose();
    setTimeout(() => {
      document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDemo = () => {
    playChime();
    if (onSelectSample) {
      onSelectSample('sample-tokyo-5d');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f0f2a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Welcome to WanderAI</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${slide.badgeColor}`}>
                  {slide.badge}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">1-Minute Visual Walkthrough</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Tour (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playPop();
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 bg-indigo-500'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {slide.badge}
          </span>
        </div>

        {/* Slide Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Slide Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${slide.iconColor}`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                {slide.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {slide.description}
          </p>

          {/* Interactive Preview Widget */}
          <div className="pt-1">{slide.previewContent}</div>

          {/* 3 Key Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {slide.features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1"
              >
                <div className="text-base">{feat.icon}</div>
                <h4 className="font-bold text-xs text-white leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-white/[0.03] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onSelectSample && (
              <button
                type="button"
                onClick={handleDemo}
                className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View fully loaded Tokyo 5-Day demo itinerary"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                <span className="hidden sm:inline">Try Demo Itinerary</span>
              </button>
            )}
            <button
              onClick={handleStartPlanning}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                onClick={() => {
                  playPop();
                  setCurrentSlide((prev) => Math.max(prev - 1, 0));
                }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => {
                  playPop();
                  setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer hover:scale-105 active:scale-95"
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
