'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import TripForm from '@/components/TripForm';
import TripView from '@/components/TripView';
import SettingsModal from '@/components/SettingsModal';
import SavedTripsModal from '@/components/SavedTripsModal';
import SampleTripsModal from '@/components/SampleTripsModal';
import { TripGenerationRequest, TripPlan } from '@/types/travel';
import { getSavedTrips } from '@/lib/storage';
import { SAMPLE_TRIPS } from '@/lib/sampleTrips';
import { Sparkles, MapPin, Compass, AlertCircle, Calendar, Globe, Plane, Star, ArrowRight } from 'lucide-react';
import { decodeTripFromUrl } from '@/lib/shareUrl';
import InteractiveBackground from '@/components/InteractiveBackground';
import QuickTourModal from '@/components/QuickTourModal';
import { animateStaggerCards, attachMagneticHover } from '@/lib/gsapAnimations';

const HERO_DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', emoji: '🗼', gradient: 'from-rose-500 to-pink-600', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { name: 'Paris', country: 'France', emoji: '🥐', gradient: 'from-amber-400 to-orange-500', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', gradient: 'from-emerald-500 to-teal-600', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { name: 'Dubai', country: 'UAE', emoji: '🏙️', gradient: 'from-sky-500 to-indigo-600', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { name: 'Santorini', country: 'Greece', emoji: '⛵', gradient: 'from-blue-400 to-cyan-500', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  { name: 'New York', country: 'USA', emoji: '🗽', gradient: 'from-violet-500 to-purple-600', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
];

const STATS = [
  { value: '248+', label: 'World Cities', icon: Globe },
  { value: '34', label: 'AI Modules', icon: Sparkles },
  { value: '14', label: 'Days Planning', icon: Calendar },
  { value: '100%', label: 'AI Powered', icon: Star },
];

export default function Home() {
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [activeDestIdx, setActiveDestIdx] = useState(0);

  const featuresGridRef = useRef<HTMLDivElement | null>(null);

  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    if (typeof window !== 'undefined') return getSavedTrips();
    return [];
  });

  // Rotate hero destination cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDestIdx(prev => (prev + 1) % HERO_DESTINATIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentTrip && featuresGridRef.current) {
      const cards = featuresGridRef.current.children;
      animateStaggerCards(cards as unknown as HTMLElement[], { yOffset: 24, stagger: 0.08, delay: 0.3 });
    }
  }, [currentTrip]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('trip=')) {
      const hash = window.location.hash.replace('#trip=', '');
      if (hash) {
        const decoded = decodeTripFromUrl(hash);
        if (decoded) setCurrentTrip(decoded);
      }
    }
  }, []);

  const refreshSavedTrips = () => setSavedTrips(getSavedTrips());

  const handleGenerateTrip = async (request: TripGenerationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate itinerary. Please try again.');
      }
      const plan: TripPlan = await response.json();
      setCurrentTrip(plan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_TRIPS.find(s => s.id === sampleId);
    if (found) {
      setCurrentTrip(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden bg-[#0a0a1a]">
      <InteractiveBackground />

      {/* ─── Animated star/particle background ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2e] to-[#0a0f2e]" />
        {/* Aurora blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-700/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-sky-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* ─── Header ─── */}
      <div className="relative z-20">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
          onSelectSample={() => setIsSampleModalOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
          savedCount={savedTrips.length}
          onGoHome={() => setCurrentTrip(null)}
          isTripActive={Boolean(currentTrip)}
        />
      </div>

      {/* ─── Main ─── */}
      <main className="flex-1 relative z-10">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center justify-between gap-3 text-rose-200 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-xs font-bold text-rose-300 hover:text-rose-100 underline">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {currentTrip ? (
          /* ─── Trip View ─── */
          <div className="animate-in fade-in duration-500">
            <TripView
              trip={currentTrip}
              onTripSavedChange={refreshSavedTrips}
              onNewPlanClick={() => setCurrentTrip(null)}
            />
          </div>
        ) : (
          /* ─── Home / Planner ─── */
          <div>
            {/* ══════════════════════════════════════════
                CINEMATIC HERO SECTION
            ══════════════════════════════════════════ */}
            <section className="relative pt-10 pb-6 sm:pt-16 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                {/* ── Left: Hero Copy ── */}
                <div className="flex-1 text-center lg:text-left space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>Next-Gen AI Travel Planner • 34 Modules</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
                    Your Dream{' '}
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                        Journey
                      </span>
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full" />
                    </span>
                    <br />
                    Designed by AI.
                  </h1>

                  {/* Subtext */}
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Pick any city, set your budget, and get a complete{' '}
                    <span className="text-white font-semibold">day-by-day itinerary</span> with attractions,
                    dining, maps, and 34 smart travel tools — all in seconds.
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                    {STATS.map(({ value, label, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 backdrop-blur-sm">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="text-white font-black text-sm leading-none">{value}</div>
                          <div className="text-slate-500 text-[10px] mt-0.5">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Sample Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                    <span className="text-slate-500 text-xs self-center font-medium">Try a sample:</span>
                    {[
                      { id: 'sample-tokyo-5d', label: '🗼 Tokyo' },
                      { id: 'sample-paris-4d', label: '🥐 Paris' },
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSample(s.id)}
                        className="text-xs bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white font-semibold px-3.5 py-1.5 rounded-full transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Right: Rotating Destination Cards ── */}
                <div className="flex-1 flex items-center justify-center lg:justify-end">
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                    {HERO_DESTINATIONS.map((dest, idx) => {
                      const isActive = idx === activeDestIdx;
                      const isPrev = idx === (activeDestIdx - 1 + HERO_DESTINATIONS.length) % HERO_DESTINATIONS.length;
                      return (
                        <div
                          key={dest.name}
                          onClick={() => setActiveDestIdx(idx)}
                          className={`absolute inset-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ${
                            isActive
                              ? 'opacity-100 scale-100 z-20 shadow-2xl shadow-indigo-900/60'
                              : isPrev
                              ? 'opacity-30 scale-90 z-10 -translate-x-4 translate-y-4'
                              : 'opacity-0 scale-75 z-0'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dest.img}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${dest.gradient} opacity-60`} />
                          {/* Text */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="text-3xl mb-1">{dest.emoji}</div>
                            <div className="text-white font-black text-xl leading-tight">{dest.name}</div>
                            <div className="text-white/70 text-sm font-medium">{dest.country}</div>
                          </div>
                          {/* Shimmer border */}
                          <div className={`absolute inset-0 rounded-3xl ring-2 ${isActive ? 'ring-white/30' : 'ring-transparent'} transition-all duration-700`} />
                        </div>
                      );
                    })}

                    {/* Dot indicators */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-1.5">
                      {HERO_DESTINATIONS.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveDestIdx(idx)}
                          className={`h-1.5 rounded-full transition-all ${idx === activeDestIdx ? 'w-6 bg-indigo-400' : 'w-1.5 bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                PLANNER FORM — Glassmorphism Card
            ══════════════════════════════════════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-12 sm:mt-16">
              {/* Scroll anchor id for smooth scrolling */}
              <div id="planner" />

              {/* Form wrapper with glass effect */}
              <div className="relative rounded-3xl overflow-hidden">
                {/* Glass border gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-sky-500/20 p-px">
                  <div className="absolute inset-px rounded-3xl bg-[#0e0e28]/90 backdrop-blur-2xl" />
                </div>

                {/* Form glow blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-1">
                  <TripForm
                    onGenerate={handleGenerateTrip}
                    isLoading={isLoading}
                    onSelectSampleTrip={handleSelectSample}
                  />
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                FEATURE CARDS
            ══════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-14 sm:mt-20 pb-16">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Why WanderAI</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Everything a traveler needs
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
                  34 built-in modules covering every step of your journey — from planning to landing.
                </p>
              </div>

              <div ref={featuresGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Calendar,
                    title: 'Visual Travel Calendar',
                    desc: 'Month Grid + Gantt Timeline + 1-click Google Calendar sync with exact departure dates.',
                    badge: 'Google Sync',
                    borderHover: 'hover:border-indigo-500/30',
                    glow: 'from-indigo-600/10',
                    iconBg: 'bg-indigo-500/15 border-indigo-500/20',
                    iconColor: 'text-indigo-400',
                    badgeStyle: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
                  },
                  {
                    icon: Plane,
                    title: 'Flight Radar & Trains',
                    desc: 'Cockpit telemetry HUD, flight price predictor, and Shinkansen / TGV rail planner.',
                    badge: 'ML Powered',
                    borderHover: 'hover:border-sky-500/30',
                    glow: 'from-sky-600/10',
                    iconBg: 'bg-sky-500/15 border-sky-500/20',
                    iconColor: 'text-sky-400',
                    badgeStyle: 'bg-sky-500/15 text-sky-300 border-sky-500/20'
                  },
                  {
                    icon: Sparkles,
                    title: 'AI Day Doctor',
                    desc: '1-click day remixes for rain, foodie dive, adventure or night-owl — no regeneration.',
                    badge: 'Live AI',
                    borderHover: 'hover:border-violet-500/30',
                    glow: 'from-violet-600/10',
                    iconBg: 'bg-violet-500/15 border-violet-500/20',
                    iconColor: 'text-violet-400',
                    badgeStyle: 'bg-violet-500/15 text-violet-300 border-violet-500/20'
                  },
                  {
                    icon: MapPin,
                    title: 'Safety & Voice Guide',
                    desc: 'Tourist scam radar, emergency dialer, AI voice copilot and dietary allergy cards.',
                    badge: 'Always On',
                    borderHover: 'hover:border-rose-500/30',
                    glow: 'from-rose-600/10',
                    iconBg: 'bg-rose-500/15 border-rose-500/20',
                    iconColor: 'text-rose-400',
                    badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/20'
                  },
                ].map(({ icon: Icon, title, desc, badge, borderHover, glow, iconBg, iconColor, badgeStyle }) => (
                  <div
                    key={title}
                    className={`group relative rounded-3xl p-5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] ${borderHover} transition-all duration-300 cursor-default overflow-hidden`}
                  >
                    {/* Hover glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none`} />

                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${iconBg}`}>
                          <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                          {badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white leading-snug">{title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Start Planning My Trip
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-black/20 backdrop-blur-sm py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-400">WanderAI</span>
            <span className="text-slate-600">• Next.js · OpenAI · Google Maps</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-indigo-400 transition-colors font-medium">API Keys</button>
            <button onClick={() => setIsSavedTripsOpen(true)} className="hover:text-indigo-400 transition-colors font-medium">
              Saved Trips ({savedTrips.length})
            </button>
          </div>
        </div>
      </footer>

      {/* ─── Modals ─── */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => { setCurrentTrip(trip); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onRefreshList={refreshSavedTrips}
      />
      <SampleTripsModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={(trip) => { setCurrentTrip(trip); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />
      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectSample={(sampleId) => { handleSelectSample(sampleId); setIsTourOpen(false); }}
      />
    </div>
  );
}
