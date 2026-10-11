'use client';

import React, { useState, useEffect } from 'react';
import { TripPlan } from '@/types/travel';
import {
  Send,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  Heart,
  Smile,
  Coffee,
  Camera,
  MapPin,
  Check,
  Printer,
  Edit3,
  Calendar,
  PenTool,
  Stamp
} from 'lucide-react';

interface TravelJournalBookProps {
  trip: TripPlan;
}

type PostcardTheme = 'airmail' | 'minimal' | 'riviera' | 'cyberpunk';

interface JournalEntry {
  day: number;
  mood: string;
  highlight: string;
  bestDish: string;
  notes: string;
  photoUrl?: string;
}

const MOODS = [
  { emoji: '🤩', label: 'Euphoric' },
  { emoji: '🧗', label: 'Adventurous' },
  { emoji: '🍜', label: 'Food Coma' },
  { emoji: '🌿', label: 'Peaceful' },
  { emoji: '😴', label: 'Tired & Happy' },
];

export default function TravelJournalBook({ trip }: TravelJournalBookProps) {
  const [activeTab, setActiveTab] = useState<'postcard' | 'journal'>('postcard');

  // Postcard state
  const [postcardTheme, setPostcardTheme] = useState<PostcardTheme>('airmail');
  const [postcardNote, setPostcardNote] = useState<string>(
    `Sending you warm greetings from ${trip.destination}! The historical alleys, local aromas, and views have been completely surreal. Wish you were here to wander these hidden spots together!`
  );
  const [postcardRecipient, setPostcardRecipient] = useState<string>('My Beloved Family & Friends');
  const [postcardCity, setPostcardCity] = useState<string>(trip.destination);
  const [copiedLink, setCopiedLink] = useState(false);

  // Journal entries state (persisted in localStorage per trip)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`wanderai_journal_${trip.id}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    // Default initial template
    return trip.itinerary.map((d) => ({
      day: d.day,
      mood: '🤩',
      highlight: `${d.theme} highlights and sightseeing`,
      bestDish: d.diningRecommendation?.lunch || 'Local specialty dish',
      notes: '',
    }));
  });

  const [activeJournalDay, setActiveJournalDay] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`wanderai_journal_${trip.id}`, JSON.stringify(journalEntries));
    }
  }, [journalEntries, trip.id]);

  const updateJournalEntry = (dayNum: number, field: keyof JournalEntry, val: string) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.day === dayNum ? { ...e, [field]: val } : e))
    );
  };

  const handleGenerateAIMessage = () => {
    const templates = [
      `Greetings from the heart of ${trip.destination}! Today we discovered a peaceful courtyard that felt untouched by time. The coffee was rich, the people were so welcoming, and tonight we are heading out for dinner under the city lights. Thinking of you always!`,
      `Lost in the magic of ${trip.destination}! We've walked over 15,000 steps today through historic quarters, tasting unbelievable street food and watching golden hour illuminate the skyline. Sending you immense love from across the miles!`,
      `Bonjour from ${trip.destination}! Every corner holds an architectural wonder or a tucked-away bakery. Soaking in the atmosphere and gathering memories to share over dinner as soon as I return. Miss you!`,
    ];
    setPostcardNote(templates[Math.floor(Math.random() * templates.length)]);
  };

  const handlePrintPostcard = () => {
    window.print();
  };

  const currentJournalDay = journalEntries.find((e) => e.day === activeJournalDay) || journalEntries[0];

  return (
    <div className="space-y-6">
      {/* 1. Master Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/20">
                <PenTool className="w-5 h-5 text-amber-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Memories & Storytelling Studio
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {trip.destination} Postcards & Travel Journal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Design personalized vintage travel postcards to share with loved ones, or chronicle your daily impressions in the travel memory book.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('postcard')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'postcard'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Vintage Postcard</span>
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Daily Journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB: Postcard Studio */}
      {activeTab === 'postcard' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                Postcard Style:
              </span>
              {(['airmail', 'minimal', 'riviera', 'cyberpunk'] as PostcardTheme[]).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setPostcardTheme(thm)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    postcardTheme === thm
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAIMessage}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Compose Note</span>
              </button>

              <button
                onClick={handlePrintPostcard}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Postcard</span>
              </button>
            </div>
          </div>

          {/* The Physical Postcard Canvas */}
          <div
            className={`max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 shadow-2xl transition-all relative overflow-hidden ${
              postcardTheme === 'airmail'
                ? 'bg-[#fcf8f0] text-slate-900 border-8 border-dashed border-red-500/40'
                : postcardTheme === 'minimal'
                ? 'bg-white text-slate-900 border-2 border-slate-200'
                : postcardTheme === 'riviera'
                ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-sky-50 text-slate-900 border-4 border-amber-300'
                : 'bg-slate-950 text-slate-100 border-2 border-indigo-500/50 shadow-indigo-500/20'
            }`}
          >
            {/* Airmail top banner if airmail */}
            {postcardTheme === 'airmail' && (
              <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3 mb-6 text-[10px] font-black tracking-widest uppercase text-slate-400">
                <span>PAR AVION • BY AIR MAIL</span>
                <span>POST CARD / CARTE POSTALE</span>
                <span>INTERNATIONAL REPOST</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative">
              {/* Left Column: Note from the Road */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    A Message from the Journey
                  </span>
                </div>

                <textarea
                  value={postcardNote}
                  onChange={(e) => setPostcardNote(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent font-serif text-sm sm:text-base leading-relaxed outline-none resize-none placeholder-slate-400 italic"
                  placeholder="Write your personal memories or feelings here..."
                />

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">{postcardCity}</span>
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Vertical Center Divider Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-300/80 -translate-x-1/2" />

              {/* Right Column: Postage Stamp & Recipient Lines */}
              <div className="md:pl-6 space-y-6">
                {/* Postage Stamp & Cancellation Postmark */}
                <div className="flex items-start justify-end gap-3">
                  {/* Postmark stamp */}
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-600/70 text-indigo-700/80 flex flex-col items-center justify-center text-[8px] font-black uppercase text-center rotate-[-12deg] select-none">
                    <span>{trip.country.slice(0, 3)} POST</span>
                    <span className="text-[10px] my-0.5">★★</span>
                    <span>{new Date().getFullYear()}</span>
                  </div>

                  {/* Stamp */}
                  <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-600 text-white p-2 flex flex-col justify-between shadow-md border-2 border-white select-none">
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span>{trip.country.slice(0, 8)}</span>
                      <span>AIR</span>
                    </div>
                    <div className="text-center font-black text-xs leading-none">
                      {trip.destination.split(',')[0]}
                    </div>
                    <div className="text-right text-[10px] font-bold text-amber-300">
                      $1.50
                    </div>
                  </div>
                </div>

                {/* Recipient Lines */}
                <div className="space-y-4 pt-2">
                  <div className="border-b-2 border-slate-300 pb-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">To:</label>
                    <input
                      type="text"
                      value={postcardRecipient}
                      onChange={(e) => setPostcardRecipient(e.target.value)}
                      className="w-full bg-transparent font-semibold text-sm outline-none"
                    />
                  </div>

                  <div className="border-b-2 border-slate-300 pb-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Address / Family:</label>
                    <p className="text-xs text-slate-500 font-medium">Home Sweet Home, Planet Earth</p>
                  </div>

                  <div className="border-b-2 border-slate-300 pb-1">
                    <label className="block text-[10px] font-bold uppercase text-slate-400">Origin Dispatch:</label>
                    <p className="text-xs font-bold text-indigo-600">{trip.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: Travel Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {journalEntries.map((e) => (
              <button
                key={e.day}
                onClick={() => setActiveJournalDay(e.day)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  activeJournalDay === e.day
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>Day {e.day}</span>
                <span>{e.mood}</span>
              </button>
            ))}
          </div>

          {/* Active Journal Day Editor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Day {currentJournalDay.day} Memory Log
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {trip.itinerary[currentJournalDay.day - 1]?.theme || `Day ${currentJournalDay.day} Adventure`}
                </h3>
              </div>

              {/* Mood Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Today&apos;s Mood:
                </span>
                <div className="flex gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                  {MOODS.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => updateJournalEntry(currentJournalDay.day, 'mood', m.emoji)}
                      className={`p-2 rounded-xl text-lg transition-transform ${
                        currentJournalDay.mood === m.emoji
                          ? 'bg-white shadow-xs scale-110'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Entry Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlight of the Day */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Unforgettable Moment / Highlight</span>
                </label>
                <input
                  type="text"
                  value={currentJournalDay.highlight}
                  onChange={(e) => updateJournalEntry(currentJournalDay.day, 'highlight', e.target.value)}
                  placeholder="e.g. Watching sunset over the old fortress..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              {/* Best Dish */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-rose-500" />
                  <span>Best Food / Dish Eaten Today</span>
                </label>
                <input
                  type="text"
                  value={currentJournalDay.bestDish}
                  onChange={(e) => updateJournalEntry(currentJournalDay.day, 'bestDish', e.target.value)}
                  placeholder="e.g. Fresh handmade truffle pasta with local red wine..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              {/* Extended Thoughts / Journal Notes */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Personal Reflections & Travel Notes</span>
                </label>
                <textarea
                  value={currentJournalDay.notes}
                  onChange={(e) => updateJournalEntry(currentJournalDay.day, 'notes', e.target.value)}
                  rows={4}
                  placeholder="Write your genuine thoughts, conversations with locals, weather observations, or things you learned today..."
                  className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400 font-semibold border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Autosaved to your browser
              </span>
              <button
                onClick={() => window.print()}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline"
              >
                Print Full Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
