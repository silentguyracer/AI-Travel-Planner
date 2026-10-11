'use client';

import React, { useState } from 'react';
import { ItineraryDay, ItineraryActivity } from '@/types/travel';
import {
  Sparkles,
  CloudRain,
  UtensilsCrossed,
  Coffee,
  Zap,
  Moon,
  Wand2,
  X,
  Check,
  ArrowRight,
  Clock,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getUserSettings } from '@/lib/storage';

interface AIDayRemixModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: ItineraryDay;
  destination: string;
  onApplyRemix: (dayNum: number, remixedDay: ItineraryDay) => void;
}

type RemixMode = 'rainy' | 'foodie' | 'relaxed' | 'adventure' | 'nightlife' | 'custom';

const REMIX_PRESETS: {
  id: RemixMode;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge: string;
  color: string;
}[] = [
  {
    id: 'rainy',
    title: 'Rainy Day Rescue',
    icon: CloudRain,
    description: 'Swaps outdoor walks for covered arcades, top art galleries, and indoor tea halls.',
    badge: 'Weather Proof',
    color: 'from-sky-500/20 to-blue-500/10 text-sky-700 border-sky-300',
  },
  {
    id: 'foodie',
    title: 'Foodie Deep Dive',
    icon: UtensilsCrossed,
    description: 'Re-centers day on vibrant food markets, street stalls, and Michelin Bib Gourmand eats.',
    badge: 'Epicurean',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-700 border-amber-300',
  },
  {
    id: 'relaxed',
    title: 'Slow Travel & Wellness',
    icon: Coffee,
    description: 'Starts at 10:30 AM with gentle botanical gardens, thermal baths, and sunset wine.',
    badge: 'No Rushing',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-700 border-emerald-300',
  },
  {
    id: 'adventure',
    title: 'High-Energy Adventure',
    icon: Zap,
    description: 'Packed with panoramic fortress climbs, bike explorations, and dramatic skywalks.',
    badge: 'Active & Thrilling',
    color: 'from-violet-500/20 to-purple-500/10 text-violet-700 border-violet-300',
  },
  {
    id: 'nightlife',
    title: 'Night Owl & Speakeasies',
    icon: Moon,
    description: 'Afternoon creative cafes into hidden alley cocktail bars, live jazz, and midnight bites.',
    badge: 'After Dark',
    color: 'from-indigo-500/20 to-pink-500/10 text-indigo-700 border-indigo-300',
  },
  {
    id: 'custom',
    title: 'Custom AI Request',
    icon: Wand2,
    description: 'Instruct AI with specific hobbies, mobility needs, or special interests.',
    badge: 'Personalized',
    color: 'from-pink-500/20 to-rose-500/10 text-pink-700 border-pink-300',
  },
];

export default function AIDayRemixModal({
  isOpen,
  onClose,
  day,
  destination,
  onApplyRemix,
}: AIDayRemixModalProps) {
  const [selectedMode, setSelectedMode] = useState<RemixMode>('rainy');
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remixedPreview, setRemixedPreview] = useState<ItineraryDay | null>(null);

  if (!isOpen) return null;

  const handleGenerateRemix = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const settings = getUserSettings();
      const res = await fetch('/api/remix-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          day,
          remixMode: selectedMode,
          customInstruction: selectedMode === 'custom' ? customText : undefined,
          customApiKey: settings.openaiApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate remix schedule.');
      }

      const data = await res.json();
      setRemixedPreview(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error remixing itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmApply = () => {
    if (!remixedPreview) return;
    onApplyRemix(day.day, remixedPreview);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-3 py-0.5 rounded-full border border-indigo-400/30">
                AI Itinerary Doctor & Re-Mixer
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Day {day.day} • {destination}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Transform Day {day.day}: {day.title}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Plans change on the road. Instantly re-curate this day for weather, culinary passion, or relaxed vibes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Selector Grid */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Choose Transformation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {REMIX_PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedMode(preset.id);
                      setRemixedPreview(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-2xs border ${
                            isSelected ? 'text-indigo-600 border-indigo-200' : 'text-slate-600 border-slate-200'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                          {preset.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1">{preset.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{preset.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Instruction Input */}
          {selectedMode === 'custom' && (
            <div className="space-y-2 animate-in fade-in">
              <label className="text-xs font-bold text-slate-700 block">
                What would you like AI to tailor for Day {day.day}?
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Focus on vintage camera shops, vegetarian cafes, and wheelchair accessible viewpoints..."
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Action Trigger Button */}
          {!remixedPreview && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleGenerateRemix}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Curating Custom Schedule...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Re-Mix Day {day.day} Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Side-by-Side Preview when Generated */}
          {remixedPreview && (
            <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Previewing AI Re-Mix
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {remixedPreview.title}
                  </h3>
                  <p className="text-xs text-slate-500">{remixedPreview.theme}</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateRemix}
                  disabled={isLoading}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Try Another Variation</span>
                </button>
              </div>

              {/* Activities Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Schedule (Compact) */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 opacity-75">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Original Day {day.day}
                  </div>
                  <div className="space-y-2 text-xs">
                    {day.schedule.map((act: ItineraryActivity, i: number) => (
                      <div key={i} className="p-2 rounded-xl bg-white border border-slate-200/80">
                        <div className="font-semibold text-slate-800">{act.activity}</div>
                        <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{act.timeSlot} • {act.time}</span>
                          {act.cost && <span>({act.cost})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remixed Schedule (Highlighted) */}
                <div className="bg-indigo-50/50 rounded-2xl p-4 border-2 border-indigo-500/50 space-y-3">
                  <div className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>New AI Re-Mixed Schedule</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {remixedPreview.schedule.map((act: ItineraryActivity, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{act.activity}</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {act.timeSlot}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {act.time}
                          </span>
                          {act.locationName && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-500" />
                              {act.locationName}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-snug">
                          {act.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>

          {remixedPreview && (
            <button
              type="button"
              onClick={handleConfirmApply}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply Transformation to Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
