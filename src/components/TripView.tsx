'use client';

import React, { useState, useEffect } from 'react';
import { TripPlan, ItineraryDay } from '@/types/travel';
import {
  Bookmark,
  Share2,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Users,
  Compass,
  MapPin,
  Utensils,
  Sparkles,
  Check,
  CalendarPlus,
  Coins,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveTrip, isTripSaved, exportTripToJson } from '@/lib/storage';
import { downloadCalendarICS } from '@/lib/calendarExport';
import { CURRENCIES, SupportedCurrency, convertAmount, parseUsdAmount } from '@/lib/currency';
import DayItinerary from './DayItinerary';
import PlacesList from './PlacesList';
import RestaurantsList from './RestaurantsList';
import GoogleMapView from './GoogleMapView';
import BudgetBreakdown from './BudgetBreakdown';
import ExpenseTracker from './ExpenseTracker';

interface TripViewProps {
  trip: TripPlan;
  onTripSavedChange?: () => void;
  onNewPlanClick: () => void;
}

type TabType = 'itinerary' | 'map' | 'places' | 'restaurants' | 'budget' | 'expenses';

export default function TripView({ trip: initialTrip, onTripSavedChange, onNewPlanClick }: TripViewProps) {
  const [trip, setTrip] = useState<TripPlan>(initialTrip);
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [isSaved, setIsSaved] = useState<boolean>(() => isTripSaved(initialTrip.id));
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    setTrip(initialTrip);
    setIsSaved(isTripSaved(initialTrip.id));
  }, [initialTrip]);

  const handleToggleSave = () => {
    saveTrip(trip);
    setIsSaved(true);
    if (onTripSavedChange) onTripSavedChange();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleUpdateItinerary = (updatedSchedule: ItineraryDay[]) => {
    const updatedTrip: TripPlan = {
      ...trip,
      itinerary: updatedSchedule,
    };
    setTrip(updatedTrip);
    if (isSaved) {
      saveTrip(updatedTrip);
      if (onTripSavedChange) onTripSavedChange();
    }
  };

  const handleShare = () => {
    const text = `Take a look at this AI-generated ${trip.duration}-day travel plan for ${trip.destination}!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link to trip planner copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectMapPoint = (point: { lat: number; lng: number; title: string }) => {
    setSelectedMapLocation(point);
    setActiveTab('map');
    const mapSection = document.getElementById('map-container-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Convert estimate to selected currency
  const rawTotalEstimateUsd = parseUsdAmount(trip.estimatedBudget?.totalEstimate || '$1500');
  const convertedTotalEstimate = convertAmount(rawTotalEstimateUsd, currency);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Trip Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Country & Meta Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40">
                {trip.country || 'Destination'}
              </span>
              <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {trip.bestTimeToVisit}
              </span>

              {/* Currency Selector */}
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c} ({CURRENCIES[c as SupportedCurrency].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {trip.destination}
            </h1>

            {/* Key Trip Parameters */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{trip.duration} Days</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium capitalize">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>
                  {trip.budget} Budget (~{convertedTotalEstimate})
                </span>
              </div>
              {trip.companion && (
                <div className="flex items-center gap-1.5 font-medium capitalize">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{trip.companion}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl pt-2">
              {trip.summary}
            </p>
          </div>

          {/* Action Buttons Column */}
          <div className="flex flex-wrap lg:flex-col items-center gap-3 shrink-0 w-full sm:w-auto">
            {/* Save Trip Button */}
            <button
              onClick={handleToggleSave}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Trips</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Trip for Later</span>
                </>
              )}
            </button>

            {/* Sub-actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              <button
                onClick={() => downloadCalendarICS(trip)}
                title="Add to Google / Apple Calendar"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-sky-300" />
                <span>Calendar</span>
              </button>

              <button
                onClick={handleShare}
                title="Share Trip"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => exportTripToJson(trip)}
                title="Download JSON"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                onClick={handlePrint}
                title="Print Itinerary"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>

            {/* Plan Another Button */}
            <button
              onClick={onNewPlanClick}
              className="text-xs text-indigo-300 hover:text-white underline font-semibold mt-1"
            >
              ← Plan Another Trip
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trip Highlights</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-200">
              {trip.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'itinerary'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Itinerary</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'map'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Interactive Map</span>
        </button>

        <button
          onClick={() => setActiveTab('places')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'places'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Places ({trip.placesToVisit?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'restaurants'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Dining ({trip.restaurants?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'budget'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Budget & Tips</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Expense Tracker</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div>
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            <DayItinerary
              itinerary={trip.itinerary}
              onSelectActivityLocation={handleSelectMapPoint}
              onUpdateItinerary={handleUpdateItinerary}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div id="map-container-section" className="space-y-6">
            <GoogleMapView
              center={trip.centerCoordinates}
              destinationName={trip.destination}
              places={trip.placesToVisit || []}
              restaurants={trip.restaurants || []}
              itinerary={trip.itinerary || []}
              selectedPlace={selectedMapLocation}
            />
          </div>
        )}

        {activeTab === 'places' && (
          <PlacesList
            places={trip.placesToVisit || []}
            destinationName={trip.destination}
            onSelectPlace={handleSelectMapPoint}
          />
        )}

        {activeTab === 'restaurants' && (
          <RestaurantsList
            restaurants={trip.restaurants || []}
            destinationName={trip.destination}
            onSelectRestaurant={handleSelectMapPoint}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetBreakdown
            budget={trip.estimatedBudget}
            practicalTips={trip.practicalTips}
            budgetTier={trip.budget}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker
            tripId={trip.id}
            destination={trip.destination}
            totalEstimatedBudgetStr={trip.estimatedBudget?.totalEstimate || '$1500'}
          />
        )}
      </div>
    </div>
  );
}
