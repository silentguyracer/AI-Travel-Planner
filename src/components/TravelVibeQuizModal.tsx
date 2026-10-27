'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, RotateCcw, Check, Compass, Heart, MapPin } from 'lucide-react';
import { playPop, playChime } from '@/lib/interactiveAudio';
import { BudgetTier, CompanionType, TravelStyle } from '@/types/travel';

export interface VibeQuizResult {
  destination: string;
  duration: number;
  budget: BudgetTier;
  companion: CompanionType;
  styles: TravelStyle[];
  interests: string;
  flag: string;
  matchScore: number;
  reason: string;
  bestMonths: string;
}

interface TravelVibeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (result: VibeQuizResult) => void;
}

const RHYTHMS = [
  {
    id: 'metropolis',
    title: 'Neon Metropolis',
    icon: '🏙️',
    desc: 'Electric skylines, late night ramen, street style & rooftop lounges',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'tropical',
    title: 'Tropical Sanctuary',
    icon: '🌴',
    desc: 'Turquoise lagoons, swaying palms, beach sunsets & chilled coconuts',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'alpine',
    title: 'Alpine Wonderland',
    icon: '🏔️',
    desc: 'Glacier vistas, fresh crisp air, cable cars & scenic panoramic trains',
    gradient: 'from-sky-600 to-cyan-600',
  },
  {
    id: 'heritage',
    title: 'Timeless Heritage',
    icon: '🏛️',
    desc: 'Cobblestone streets, royal palaces, artisan bistros & world-class art',
    gradient: 'from-amber-600 to-rose-600',
  },
];

const COMPANIONS = [
  { id: 'solo' as CompanionType, label: 'Solo Explorer', icon: '🚶', desc: 'Total freedom & spontaneous detours' },
  { id: 'couple' as CompanionType, label: 'Romantic Escape', icon: '💑', desc: 'Candlelight dinners & scenic views' },
  { id: 'family' as CompanionType, label: 'Family with Kids', icon: '👨‍👩‍👧', desc: 'Fun attractions, parks & easy transit' },
  { id: 'friends' as CompanionType, label: 'Squad / Friends', icon: '👥', desc: 'Nightlife, group feasts & adventures' },
];

const SPENDS = [
  { id: 'economy' as BudgetTier, label: 'Smart Backpacker', icon: '🎒', range: '$40 - $90 / day', desc: 'Hostels, metro, legendary street food' },
  { id: 'moderate' as BudgetTier, label: 'Sweet Spot Comfort', icon: '✨', range: '$120 - $250 / day', desc: 'Boutique hotels, curated tours & bistros' },
  { id: 'luxury' as BudgetTier, label: 'VIP Splurge', icon: '💎', range: '$350+ / day', desc: '5-star resorts, private guides & champagne' },
];

// Matrix to compute destination based on user answers
function getBestMatch(rhythm: string, companion: CompanionType, budget: BudgetTier): VibeQuizResult {
  if (rhythm === 'metropolis') {
    if (companion === 'couple' && budget === 'luxury') {
      return {
        destination: 'Dubai, UAE',
        duration: 5,
        budget: 'luxury',
        companion: 'couple',
        styles: ['photography', 'foodie', 'relaxed'],
        interests: 'Burj Khalifa Sky lounge, private desert safari, Dubai Marina yacht cruise',
        flag: '🇦🇪',
        matchScore: 99,
        reason: 'The ultimate luxury desert metropolis with futuristic architecture & world-class dining.',
        bestMonths: 'Nov – March (Pleasant 24°C)',
      };
    }
    return {
      destination: 'Tokyo, Japan',
      duration: 5,
      budget,
      companion,
      styles: ['cultural', 'foodie', 'photography'],
      interests: 'Shibuya crossing, Akihabara arcade crawl, Michelin ramen, Shinjuku Golden Gai',
      flag: '🇯🇵',
      matchScore: 98,
      reason: 'A high-energy neon wonder combining timeless shrines with vibrant subcultures and incredible food.',
      bestMonths: 'March – May & Oct – Nov',
    };
  }

  if (rhythm === 'tropical') {
    if (budget === 'economy' || companion === 'solo') {
      return {
        destination: 'Bali, Indonesia',
        duration: 6,
        budget,
        companion,
        styles: ['relaxed', 'nature', 'adventure'],
        interests: 'Canggu surf beaches, Ubud jungle waterfalls, volcanic sunrise hike, beach clubs',
        flag: '🇮🇩',
        matchScore: 97,
        reason: 'Tropical paradise with lush rice paddies, spiritual energy, and relaxed ocean vibes.',
        bestMonths: 'April – October (Dry & Sunny)',
      };
    }
    return {
      destination: 'Santorini, Greece',
      duration: 4,
      budget,
      companion,
      styles: ['relaxed', 'photography', 'foodie'],
      interests: 'Oia cliffside sunset, white-washed alleys, catamaran sailing, Mediterranean seafood',
      flag: '🇬🇷',
      matchScore: 99,
      reason: 'Breathtaking Aegean caldera views, world-famous sunsets, and intimate coastal romance.',
      bestMonths: 'May – June & Sept – Oct',
    };
  }

  if (rhythm === 'alpine') {
    return {
      destination: 'Interlaken, Switzerland',
      duration: 5,
      budget,
      companion,
      styles: ['nature', 'adventure', 'photography'],
      interests: 'Jungfraujoch Top of Europe, Lauterbrunnen 72 waterfalls, panoramic mountain trains',
      flag: '🇨🇭',
      matchScore: 96,
      reason: 'Dramatic snow-capped peaks, crystal alpine lakes, and world-class scenic railway journeys.',
      bestMonths: 'June – Sept (Lush Green) or Dec – March (Snow)',
    };
  }

  // rhythm === 'heritage'
  if (budget === 'luxury' || companion === 'couple') {
    return {
      destination: 'Paris, France',
      duration: 4,
      budget,
      companion,
      styles: ['cultural', 'foodie', 'relaxed'],
      interests: 'Louvre private gallery, Seine sunset river cruise, Montmartre bistros, Eiffel lights',
      flag: '🇫🇷',
      matchScore: 98,
      reason: 'The timeless capital of art, gastronomy, romance, and iconic architecture.',
      bestMonths: 'April – June & Sept – Oct',
    };
  }
  return {
    destination: 'Udaipur, India',
    duration: 4,
    budget,
    companion,
    styles: ['cultural', 'photography', 'relaxed'],
    interests: 'City Palace on Lake Pichola, Jag Mandir boat ride, Rajasthani royal dining, Monsoon Palace',
    flag: '🇮🇳',
    matchScore: 97,
    reason: 'The Venice of the East, famed for shimmering lake palaces, royal havelis, and rich culture.',
    bestMonths: 'Oct – March (Crisp & Pleasant)',
  };
}

export default function TravelVibeQuizModal({ isOpen, onClose, onApplyResult }: TravelVibeQuizModalProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedRhythm, setSelectedRhythm] = useState<string>('metropolis');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionType>('couple');
  const [selectedSpend, setSelectedSpend] = useState<BudgetTier>('moderate');

  if (!isOpen) return null;

  const result = getBestMatch(selectedRhythm, selectedCompanion, selectedSpend);

  const handleApply = () => {
    playChime();
    onApplyResult(result);
    onClose();
    setStep(1);
  };

  const reset = () => {
    playPop();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f0f2a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Trip Vibe Matcher</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {step <= 3 ? `Question ${step} of 3` : 'Match Found!'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Discover your ideal destination in 3 quick taps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center mb-5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 1</span>
                <h4 className="text-lg font-black text-white mt-0.5">What is your dream vacation rhythm?</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RHYTHMS.map((r) => {
                  const isSelected = selectedRhythm === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        setSelectedRhythm(r.id);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{r.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center justify-between">
                            <span>{r.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center mb-5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 2</span>
                <h4 className="text-lg font-black text-white mt-0.5">Who is packing their bags with you?</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANIONS.map((c) => {
                  const isSelected = selectedCompanion === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        setSelectedCompanion(c.id);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{c.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center justify-between">
                            <span>{c.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center mb-5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step 3</span>
                <h4 className="text-lg font-black text-white mt-0.5">What travel spend tier feels right?</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {SPENDS.map((s) => {
                  const isSelected = selectedSpend === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        setSelectedSpend(s.id);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/40 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{s.icon}</span>
                          <div>
                            <div className="font-bold text-sm text-white">{s.label}</div>
                            <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-400">{s.range}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400 ml-auto mt-1" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
              {/* Result Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-slate-900/40 border border-indigo-500/40 text-center relative overflow-hidden shadow-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{result.matchScore}% Match Score</span>
                </div>

                <div className="text-5xl mb-2">{result.flag}</div>
                <h3 className="text-2xl font-black text-white">{result.destination}</h3>
                <p className="text-xs text-indigo-200 mt-1 max-w-md mx-auto">{result.reason}</p>

                {/* Key metadata pills */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-white/10 rounded-xl font-bold text-slate-200 border border-white/10">
                    ⏱️ Recommended: {result.duration} Days
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-xl font-bold text-slate-200 border border-white/10">
                    🗓️ Best Season: {result.bestMonths}
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-xl font-bold text-slate-200 border border-white/10 capitalize">
                    💎 Budget: {result.budget}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
                  <strong className="text-slate-200">Curated highlights:</strong> {result.interests}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 pt-2 border-t border-white/10 flex items-center justify-between">
          {step > 1 && step <= 3 && (
            <button
              type="button"
              onClick={() => {
                playPop();
                setStep(s => s - 1);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Back
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          )}

          <div className="ml-auto">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setStep(s => s + 1);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : step === 3 ? (
              <button
                type="button"
                onClick={() => {
                  playChime();
                  setStep(4);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Show My Match</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply to Planner ({result.destination})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
