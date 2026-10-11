'use client';

import React, { useState } from 'react';
import {
  BudgetTier,
  CompanionType,
  TravelStyle,
  TripGenerationRequest
} from '@/types/travel';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Loader2,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { getUserSettings } from '@/lib/storage';

interface TripFormProps {
  onGenerate: (data: TripGenerationRequest) => Promise<void>;
  isLoading: boolean;
  onSelectSampleTrip: (sampleId: string) => void;
}

const POPULAR_DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', emoji: '🗼' },
  { name: 'Paris', country: 'France', emoji: '🥐' },
  { name: 'Rome', country: 'Italy', emoji: '🏛️' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴' },
  { name: 'Barcelona', country: 'Spain', emoji: '🎨' },
  { name: 'New York', country: 'USA', emoji: '🗽' },
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️' },
  { name: 'London', country: 'UK', emoji: '🎡' },
];

const TRAVEL_STYLES: { id: TravelStyle; label: string; icon: string }[] = [
  { id: 'cultural', label: 'Cultural & Heritage', icon: '🏛️' },
  { id: 'foodie', label: 'Foodie & Dining', icon: '🍜' },
  { id: 'adventure', label: 'Adventure & Outdoors', icon: '🧗' },
  { id: 'relaxed', label: 'Relaxed & Wellness', icon: '🌿' },
  { id: 'nature', label: 'Nature & Scenery', icon: '🏔️' },
  { id: 'shopping', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'nightlife', label: 'Nightlife & Bars', icon: '🍸' },
];

const BUDGET_OPTIONS: { id: BudgetTier; label: string; desc: string; icon: string; range: string }[] = [
  {
    id: 'economy',
    label: 'Economy',
    desc: 'Hostels, public transit, street eats',
    icon: '🎒',
    range: '$40 - $90 / day'
  },
  {
    id: 'moderate',
    label: 'Moderate',
    desc: 'Boutique hotels, cozy bistros, top sights',
    icon: '✨',
    range: '$120 - $250 / day'
  },
  {
    id: 'luxury',
    label: 'Luxury',
    desc: '5-star resorts, private tours, fine dining',
    icon: '💎',
    range: '$350+ / day'
  }
];

const COMPANIONS: { id: CompanionType; label: string; icon: string }[] = [
  { id: 'solo', label: 'Solo Traveler', icon: '🚶' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧' },
  { id: 'friends', label: 'Friends Group', icon: '👥' },
];

export default function TripForm({ onGenerate, isLoading, onSelectSampleTrip }: TripFormProps) {
  const [destination, setDestination] = useState('Tokyo');
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [companion, setCompanion] = useState<CompanionType>('couple');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(['cultural', 'foodie', 'photography']);
  const [specificInterests, setSpecificInterests] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const toggleStyle = (style: TravelStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isLoading) return;

    const userSettings = getUserSettings();

    // Loading step simulation
    setLoadingStep(1);
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      await onGenerate({
        destination: destination.trim(),
        duration,
        budget,
        companion,
        travelStyles: selectedStyles,
        specificInterests: specificInterests.trim() || undefined,
        customApiKey: userSettings.openaiApiKey,
      });
    } finally {
      clearInterval(stepInterval);
      setLoadingStep(0);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Heading */}
      <div className="relative mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Generation AI Travel Curator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Craft Your Dream Trip in Seconds
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Choose a destination and your preferred budget. WanderAI builds a full personalized itinerary with top places, local food spots, and an interactive Google Map.
        </p>

        {/* Quick Sample Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Quick load popular:</span>
          <button
            type="button"
            onClick={() => onSelectSampleTrip('sample-tokyo-5d')}
            className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🗼 Tokyo (5 Days)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleTrip('sample-paris-4d')}
            className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🥐 Paris (4 Days)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-6">
        {/* 1. Destination Input & Popular Suggestions */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Where do you want to go?</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Tokyo, Rome, Barcelona, Kyoto, New York, Bali..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 shadow-xs transition-all"
            />
            <Compass className="w-5 h-5 text-indigo-500 absolute left-3.5 top-4" />
          </div>

          {/* Destination Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-2 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Trending:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => setDestination(dest.name)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium ${
                  destination.toLowerCase() === dest.name.toLowerCase()
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {dest.emoji} {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Duration & Companion in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Trip Duration</span>
              </label>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {duration} {duration === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <input
                type="range"
                min="1"
                max="10"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setDuration((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setDuration((prev) => Math.min(10, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Travel Companion */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Who is traveling?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMPANIONS.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setCompanion(comp.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center gap-2 ${
                    companion === comp.id
                      ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 shadow-xs ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{comp.icon}</span>
                  <span className="font-semibold">{comp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Budget Tier */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Select Your Budget Tier</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BUDGET_OPTIONS.map((opt) => {
              const isSelected = budget === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setBudget(opt.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-50/70 to-sky-50/60 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{opt.icon}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.range}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{opt.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Travel Vibes & Styles */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Travel Styles & Vibes (Select all that apply)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {selectedStyles.length} selected
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => toggleStyle(style.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Custom Requests / Dietary */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Special Requests or Preferences (Optional)</span>
          </label>
          <input
            type="text"
            value={specificInterests}
            onChange={(e) => setSpecificInterests(e.target.value)}
            placeholder="e.g. Vegetarian food options, wheelchair accessible, art museums, romantic spots..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>
                  {loadingStep === 1
                    ? 'Consulting AI travel intelligence...'
                    : loadingStep === 2
                    ? 'Curating top attractions & restaurants...'
                    : loadingStep === 3
                    ? 'Calculating routes & day-by-day itinerary...'
                    : 'Generating your custom trip plan...'}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Complete Trip Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
