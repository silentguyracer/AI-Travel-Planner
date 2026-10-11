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
import { Sparkles, MapPin, Compass, AlertCircle, Calendar } from 'lucide-react';

import { decodeTripFromUrl } from '@/lib/shareUrl';
import InteractiveBackground from '@/components/InteractiveBackground';
import QuickTourModal from '@/components/QuickTourModal';
import { animateStaggerCards, attachMagneticHover, animateTabTransition } from '@/lib/gsapAnimations';

export default function Home() {
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [hasDismissedWelcomeBanner, setHasDismissedWelcomeBanner] = useState<boolean>(false);

  // GSAP Animation Refs
  const welcomeBannerRef = useRef<HTMLDivElement | null>(null);
  const tourBtnRef = useRef<HTMLButtonElement | null>(null);
  const featuresGridRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Saved trips cache
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(() => {
    if (typeof window !== 'undefined') {
      return getSavedTrips();
    }
    return [];
  });

  useEffect(() => {
    // Coordinated GSAP entrance animations for home view
    if (!currentTrip && featuresGridRef.current) {
      const cards = featuresGridRef.current.children;
      animateStaggerCards(cards as unknown as HTMLElement[], {
        yOffset: 24,
        stagger: 0.08,
        delay: 0.15,
      });
    }

    if (tourBtnRef.current) {
      return attachMagneticHover(tourBtnRef.current, 0.25);
    }
  }, [currentTrip, hasDismissedWelcomeBanner]);

  useEffect(() => {
    // Check for shared trip encoded in URL hash
    if (typeof window !== 'undefined' && window.location.hash.includes('trip=')) {
      const hash = window.location.hash.replace('#trip=', '');
      if (hash) {
        const decoded = decodeTripFromUrl(hash);
        if (decoded) {
          setCurrentTrip(decoded);
        }
      }
    }
  }, []);

  const refreshSavedTrips = () => {
    setSavedTrips(getSavedTrips());
  };

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

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Generation failed:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong while generating the itinerary.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_TRIPS.find((s) => s.id === sampleId);
    if (found) {
      setCurrentTrip(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/75 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Interactive Atmospheric Canvas & Mood Glow */}
      <InteractiveBackground />

      {/* Navbar */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onSelectSample={() => setIsSampleModalOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        savedCount={savedTrips.length}
        onGoHome={() => setCurrentTrip(null)}
        isTripActive={Boolean(currentTrip)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-900 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Conditional View: Generated Trip Plan vs Planner Form */}
        {currentTrip ? (
          <div className="animate-scale-in-fade">
            <TripView
              trip={currentTrip}
              onTripSavedChange={refreshSavedTrips}
              onNewPlanClick={() => setCurrentTrip(null)}
            />
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {/* Friendly Quick-Start Guide Callout Banner */}
            {!hasDismissedWelcomeBanner && (
              <div
                ref={welcomeBannerRef}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-scale-in-fade"
              >
                <div className="space-y-1 z-10 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👋</span>
                    <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      New to WanderAI?
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    Get Familiarized in 60 Seconds
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                    Discover how to drop exact GPS map pins, customize 6–8 daily activities, generate authentic dining blueprints, and use 25+ smart companion tools.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 z-10">
                  <button
                    ref={tourBtnRef}
                    onClick={() => setIsTourOpen(true)}
                    className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Take 1-Min Tour</span>
                  </button>
                  <button
                    onClick={() => setHasDismissedWelcomeBanner(true)}
                    className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Got It
                  </button>
                </div>
                {/* Background decorative glow */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>
            )}

            {/* Planner Form */}
            <TripForm
              onGenerate={handleGenerateTrip}
              isLoading={isLoading}
              onSelectSampleTrip={handleSelectSample}
            />

            {/* Feature Cards Showcase */}
            <div ref={featuresGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Visual Travel Calendar</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Interactive Month Matrix and hourly Timeline view with 1-click sync to Google Calendar, Apple, and Outlook.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 hover:border-sky-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Flight Radar & Trains</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Simulated cockpit telemetry HUD, 5-step terminal wayfinding, and Shinkansen / TGV high-speed rail planner.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">AI Day Doctor & Sound</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  1-click rainy day rescues, foodie deep dives, and Web Audio procedural ambient soundscapes with voice narration.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 hover:border-rose-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Safety & Voice Companion</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  City tourist scam alerts, 1-tap local emergency dialer, speech translation, and dietary allergy cards in native script.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">WanderAI Travel Planner</span>
            <span>• Next.js, OpenAI API, and Google Maps API</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Configure API Keys
            </button>
            <button
              onClick={() => setIsSavedTripsOpen(true)}
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
            >
              Saved Trips ({savedTrips.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setCurrentTrip(trip);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRefreshList={refreshSavedTrips}
      />

      <SampleTripsModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={(trip) => {
          setCurrentTrip(trip);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectSample={(sampleId) => {
          handleSelectSample(sampleId);
          setIsTourOpen(false);
        }}
      />
    </div>
  );
}
