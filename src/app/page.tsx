'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TripForm from '@/components/TripForm';
import TripView from '@/components/TripView';
import SettingsModal from '@/components/SettingsModal';
import SavedTripsModal from '@/components/SavedTripsModal';
import SampleTripsModal from '@/components/SampleTripsModal';
import { TripGenerationRequest, TripPlan } from '@/types/travel';
import { getSavedTrips } from '@/lib/storage';
import { SAMPLE_TRIPS } from '@/lib/sampleTrips';
import { Sparkles, MapPin, Compass, AlertCircle, Shield, ArrowUpRight } from 'lucide-react';

import { decodeTripFromUrl } from '@/lib/shareUrl';

export default function Home() {
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);

  // Saved trips cache
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);

  useEffect(() => {
    setSavedTrips(getSavedTrips());

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        onSelectSample={() => setIsSampleModalOpen(true)}
        savedCount={savedTrips.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
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
          <TripView
            trip={currentTrip}
            onTripSavedChange={refreshSavedTrips}
            onNewPlanClick={() => setCurrentTrip(null)}
          />
        ) : (
          <div className="space-y-12">
            {/* Planner Form */}
            <TripForm
              onGenerate={handleGenerateTrip}
              isLoading={isLoading}
              onSelectSampleTrip={handleSelectSample}
            />

            {/* Feature Cards Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Custom Day-by-Day Schedules</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Morning, afternoon, and evening timelines tailored to your pace, companion, and budget preferences with real insider tips.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Interactive Google Maps</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every attraction, monument, and restaurant is geo-tagged with exact coordinates and navigation shortcuts for seamless on-the-ground routing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Save & Export for Offline</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Store multiple itineraries in your browser, export as JSON, or print a travel-ready clean summary to take on your vacation.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
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
    </div>
  );
}
