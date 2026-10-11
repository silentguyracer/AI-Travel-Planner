'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ItineraryDay, ItineraryActivity } from '@/types/travel';
import {
  Clock,
  MapPin,
  Utensils,
  Lightbulb,
  DollarSign,
  Compass,
  Calendar,
  Plus,
  Trash2,
  X,
  Route,
  Sparkles,
  Train,
  Footprints,
  ExternalLink,
  Camera,
  Shirt,
  Ticket,
  ChevronDown,
  ChevronUp,
  Zap,
  Coffee,
  Info,
  Flame,
  CheckCircle2,
  CheckCheck,
  Navigation,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import RouteOptimizerModal from './RouteOptimizerModal';
import AudioTourGuide from './AudioTourGuide';
import AIDayRemixModal from './AIDayRemixModal';
import ActivityPhoto from './ActivityPhoto';
import { computeTransitBetweenStops } from '@/lib/transitMatrix';
import { animateStaggerCards, animateSpringPop } from '@/lib/gsapAnimations';
import SmartActivityEditor from './SmartActivityEditor';

interface DayItineraryProps {
  itinerary: ItineraryDay[];
  onSelectActivityLocation?: (coords: { lat: number; lng: number; title: string }) => void;
  onUpdateItinerary?: (updated: ItineraryDay[]) => void;
  destination?: string;
  onOpenCalendar?: () => void;
}

export default function DayItinerary({
  itinerary,
  onSelectActivityLocation,
  onUpdateItinerary,
  destination = '',
  onOpenCalendar,
}: DayItineraryProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);
  const [showAllDeepDetails, setShowAllDeepDetails] = useState<boolean>(true);
  const [expandedActivityKeys, setExpandedActivityKeys] = useState<Record<string, boolean>>({});
  const [speakingActivityKey, setSpeakingActivityKey] = useState<string | null>(null);

  // Web Speech API Text-to-Speech audio guide
  const handleToggleSpeak = (key: string, textToRead: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingActivityKey === key) {
      window.speechSynthesis.cancel();
      setSpeakingActivityKey(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingActivityKey(null);
    utterance.onerror = () => setSpeakingActivityKey(null);
    setSpeakingActivityKey(key);
    window.speechSynthesis.speak(utterance);
  };

  // Live checklist tracking of visited stops with localStorage persistence
  const visitedStorageKey = `wanderai_visited_${destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const [visitedActivities, setVisitedActivities] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(visitedStorageKey);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.children;
      animateStaggerCards(items as unknown as HTMLElement[], {
        yOffset: 16,
        stagger: 0.05,
        duration: 0.45,
      });
    }
  }, [selectedDay, expandedAll]);

  const toggleVisited = (dayNum: number, activityIdx: number, element?: HTMLElement | null) => {
    if (element) {
      animateSpringPop(element, { scale: 1.25, rotation: 6 });
    }
    const nodeIcon = document.getElementById(`timeline-node-${dayNum}-${activityIdx}`);
    if (nodeIcon) {
      animateSpringPop(nodeIcon, { scale: 1.35, rotation: -8 });
    }

    const key = `day-${dayNum}-act-${activityIdx}`;
    const willBeVisited = !visitedActivities[key];
    const updated = { ...visitedActivities, [key]: willBeVisited };
    setVisitedActivities(updated);
    try {
      localStorage.setItem(visitedStorageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (willBeVisited) {
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }
  };

  const toggleActivityExpand = (key: string) => {
    setExpandedActivityKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // New activity form modal state
  const [isAddingActivityForDay, setIsAddingActivityForDay] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newSlot, setNewSlot] = useState<ItineraryActivity['timeSlot']>('Morning');
  const [newCost, setNewCost] = useState('Free');
  const [newDesc, setNewDesc] = useState('');

  // Route optimizer state
  const [optimizingDay, setOptimizingDay] = useState<ItineraryDay | null>(null);

  // AI Day Remix state
  const [remixingDay, setRemixingDay] = useState<ItineraryDay | null>(null);

  // Smart AI Activity Editor state
  const [smartEditTarget, setSmartEditTarget] = useState<{
    dayIndex: number;
    activityIndex: number;
  } | null>(null);

  const handleApplyDayRemix = (dayNum: number, remixedDay: ItineraryDay) => {
    if (!onUpdateItinerary) return;
    const updated = itinerary.map((d) => (d.day === dayNum ? remixedDay : d));
    onUpdateItinerary(updated);
  };

  const handleApplySmartEdit = (updatedActivity: ItineraryActivity) => {
    if (!onUpdateItinerary || !smartEditTarget) return;
    const { dayIndex, activityIndex } = smartEditTarget;
    const updated = itinerary.map((d, di) => {
      if (di === dayIndex) {
        return {
          ...d,
          schedule: d.schedule.map((act, ai) => (ai === activityIndex ? updatedActivity : act)),
        };
      }
      return d;
    });
    onUpdateItinerary(updated);
    setSmartEditTarget(null);
  };

  const getSynthesizedIntel = (activity: ItineraryActivity, dest: string) => {
    const transit =
      activity.transitInfo ||
      `Express transit / local tram to ${activity.locationName.split(' ')[0]} station • 4-min walk`;
    const photo =
      activity.photoSpot ||
      `Exterior vantage point during golden hour or morning soft light for optimal angles`;
    const dress =
      activity.dressCode ||
      `Comfortable walking footwear; smart casual attire recommended for indoor halls`;
    const trivia =
      activity.audioTrivia ||
      `A storied cultural touchpoint celebrated by locals and travelers exploring ${dest}.`;
    return { transit, photo, dress, trivia };
  };

  const activeDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  const getTimeSlotColor = (slot: ItineraryActivity['timeSlot']) => {
    switch (slot) {
      case 'Morning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Afternoon':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Evening':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDeleteActivity = (dayNum: number, activityIdx: number) => {
    if (!onUpdateItinerary) return;
    const updated = itinerary.map((d) => {
      if (d.day === dayNum) {
        return {
          ...d,
          schedule: d.schedule.filter((_, idx) => idx !== activityIdx),
        };
      }
      return d;
    });
    onUpdateItinerary(updated);
  };

  const handleSaveNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingActivityForDay || !newTitle.trim() || !onUpdateItinerary) return;

    const newActivity: ItineraryActivity = {
      timeSlot: newSlot,
      time: newTime,
      activity: newTitle.trim(),
      locationName: newLocation.trim() || newTitle.trim(),
      description: newDesc.trim() || 'Custom planned activity.',
      cost: newCost.trim() || 'Free',
      tip: 'Custom traveler scheduled stop.',
    };

    const updated = itinerary.map((d) => {
      if (d.day === isAddingActivityForDay) {
        return {
          ...d,
          schedule: [...d.schedule, newActivity],
        };
      }
      return d;
    });

    onUpdateItinerary(updated);
    setIsAddingActivityForDay(null);
    setNewTitle('');
    setNewLocation('');
    setNewDesc('');
  };

  const handleApplyRouteOptimization = (dayNum: number, optimizedActivities: ItineraryActivity[]) => {
    if (!onUpdateItinerary) return;
    const updated = itinerary.map((d) => {
      if (d.day === dayNum) {
        return {
          ...d,
          schedule: optimizedActivities,
        };
      }
      return d;
    });
    onUpdateItinerary(updated);
  };

  return (
    <div className="space-y-6">
      {/* Quick Visual Calendar Callout Banner */}
      {onOpenCalendar && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-400/20 shrink-0">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  Visual Calendar & Google Sync
                </span>
                <span className="text-xs text-indigo-300 font-semibold">• Month Grid & Timeline</span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                View this itinerary on the interactive Travel Calendar
              </h4>
            </div>
          </div>
          <button
            onClick={onOpenCalendar}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Open Calendar View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Day Selector Navigation Pills - Sticky Floating Header */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-md space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg border border-indigo-100">
              {expandedAll ? `Viewing All ${itinerary.length} Days` : `Viewing Day ${selectedDay} of ${itinerary.length}`}
            </span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Click any day pill below to jump directly
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedAll(!expandedAll)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                expandedAll
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {expandedAll ? 'Show 1 Day at a Time' : `Show All ${itinerary.length} Days at Once`}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {itinerary.map((day) => {
              const isSelected = selectedDay === day.day && !expandedAll;
              return (
                <button
                  key={day.day}
                  onClick={() => {
                    setSelectedDay(day.day);
                    setExpandedAll(false);
                    const el = document.getElementById(`day-section-${day.day}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.03]'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Day {day.day}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAllDeepDetails(!showAllDeepDetails)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              showAllDeepDetails
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle full logistical transit, photo spots, attire rules and historical lore across all stops"
          >
            {showAllDeepDetails ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAllDeepDetails ? 'Deep Logistics Active' : 'Compact Cards'}</span>
          </button>
        </div>
      </div>

      {/* Render Days */}
      <div className="space-y-8">
        {(expandedAll ? itinerary : [activeDayData]).map((day) => (
          <div
            key={day.day}
            id={`day-section-${day.day}`}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden space-y-6 scroll-mt-24"
          >
            {/* Visual Day Hero Image Header */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-44 sm:h-56 bg-slate-900 border border-slate-200/80 shadow-md group">
              <img
                src={`/api/place-image?query=${encodeURIComponent(`${day.title} ${destination}`)}&category=landmark&redirect=true`}
                alt={day.title}
                className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white backdrop-blur-md border border-blue-400/40 shadow-xs">
                      Day {day.day} Panorama
                    </span>
                    <span className="text-xs text-slate-200 font-semibold hidden sm:inline">
                      {destination}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${day.title} ${destination}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1.5 text-white transition-all border border-white/30 shadow-xs"
                    title="Search high-res Google Images for this destination"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-300" />
                    <span>Google Images Gallery ↗</span>
                  </a>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">{day.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">{day.theme}</p>
              </div>
            </div>

            {/* Day Header Banner */}
            <div className="border-b border-slate-100 pb-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      Day {day.day} Program
                    </span>
                    {day.date && (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {day.date}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 italic">
                      Theme: {day.theme}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                    {day.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setRemixingDay(day)}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="AI Re-Mix: Rainy Day rescue, foodie focus, or slow travel transformation"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Re-Mix / Doctor</span>
                  </button>

                  <button
                    onClick={() => setOptimizingDay(day)}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Optimize stop order to minimize transit distance"
                  >
                    <Route className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Optimize Route</span>
                  </button>

                  {onUpdateItinerary && (
                    <button
                      onClick={() => setIsAddingActivityForDay(day.day)}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stop</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Day Metrics Strip: Energy pacing, walking distance & day budget */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                {day.energyLevel && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pacing: {day.energyLevel}</span>
                  </div>
                )}
                {day.walkingDistance && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-900 border border-sky-200 rounded-full font-bold">
                    <Footprints className="w-3.5 h-3.5 text-sky-600" />
                    <span>Est. Walk: {day.walkingDistance}</span>
                  </div>
                )}
                {day.estimatedDayBudget && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Est. Day Budget: {day.estimatedDayBudget}</span>
                  </div>
                )}
              </div>

              {/* Daily Pro Tip */}
              {day.dailyProTip && (
                <div className="p-3 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border border-indigo-100/90 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-950">
                  <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-extrabold text-indigo-900">Day {day.day} Pro-Tip: </strong>
                    {day.dailyProTip}
                  </div>
                </div>
              )}

              {/* Hourly Chronological Day Flow Strip */}
              {day.schedule && day.schedule.length > 0 && (
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                      <Clock className="w-3.5 h-3.5" /> Chronological Day Timeline
                    </span>
                    <span className="font-mono text-slate-400">{day.schedule.length} curated stops</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {day.schedule.map((act, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2 shrink-0">
                        <div className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs flex items-center gap-2 shadow-2xs">
                          <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                            {act.time}
                          </span>
                          <span className="font-bold text-slate-800 text-xs truncate max-w-[130px]">
                            {act.locationName || act.activity}
                          </span>
                        </div>
                        {aIdx < day.schedule.length - 1 && (
                          <span className="text-slate-300 font-bold text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Tour Guide Widget for this Day */}
            <AudioTourGuide day={day} destination={destination} />

            {/* Live Day Checklist Progress Bar */}
            {(() => {
              const dayActivities = day.schedule;
              const completedCount = dayActivities.filter(
                (_, actIdx) => visitedActivities[`day-${day.day}-act-${actIdx}`]
              ).length;
              const totalCount = dayActivities.length;
              const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Day {day.day} Travel Progress</span>
                    </span>
                    <span className="font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
                      {completedCount} of {totalCount} stops visited ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {percent === 100 && (
                    <div className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                      <span>🎉</span>
                      <span>Day {day.day} Completed! You explored every curated stop today!</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Timeline Activities */}
            <div ref={timelineRef} className="relative border-l-2 border-indigo-100 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-6">
              {day.schedule.map((activity, idx) => {
                const nextActivity = day.schedule[idx + 1];
                const transit = nextActivity
                  ? computeTransitBetweenStops(activity, nextActivity, destination)
                  : null;
                const actKey = `${day.day}-${idx}`;
                const isExpanded = !!expandedActivityKeys[actKey];
                const isVisited = !!visitedActivities[`day-${day.day}-act-${idx}`];
                const hasDetailedIntel = Boolean(
                  activity.transitInfo ||
                  activity.photoSpot ||
                  activity.dressCode ||
                  activity.audioTrivia ||
                  activity.insiderTip
                );
                const intel = getSynthesizedIntel(activity, destination);

                return (
                  <div key={idx} className="relative group space-y-4">
                    {/* Timeline node icon */}
                    <div
                      id={`timeline-node-${day.day}-${idx}`}
                      className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isVisited
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-indigo-600 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                      }`}
                    >
                      {isVisited ? (
                        <CheckCheck className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] sm:text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Activity Card */}
                    <div
                      className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-3 ${
                        isVisited
                          ? 'bg-emerald-50/20 border-emerald-300 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200/70 hover:border-indigo-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Real Activity Landmark Photo */}
                        <div className="w-full md:w-44 h-40 md:h-auto rounded-2xl overflow-hidden shrink-0">
                          <ActivityPhoto
                            locationName={activity.locationName}
                            activityName={activity.activity}
                            destination={destination}
                            category={activity.timeSlot === 'Evening' || activity.timeSlot === 'Night' ? 'food' : 'landmark'}
                            coordinates={activity.coordinates}
                            className="w-full h-full min-h-[140px]"
                          />
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTimeSlotColor(
                                  activity.timeSlot
                                )}`}
                              >
                                {activity.timeSlot}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{activity.time}</span>
                              </div>
                              {activity.durationMin && (
                                <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                  ⏱️ {activity.durationMin} mins
                                </span>
                              )}
                              {activity.crowdLevel && (
                                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                                  👥 {activity.crowdLevel} crowds
                                </span>
                              )}
                              {activity.bookingStatus && (
                                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                  <Ticket className="w-3 h-3 text-purple-600" />
                                  <span>{activity.bookingStatus}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Visited Check-In Button */}
                              <button
                                type="button"
                                onClick={(e) => toggleVisited(day.day, idx, e.currentTarget)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isVisited
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
                                }`}
                                title={isVisited ? 'Mark as not visited' : 'Mark as visited / completed'}
                              >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${isVisited ? 'text-white' : 'text-slate-400'}`} />
                                <span>{isVisited ? 'Visited' : 'Check In'}</span>
                              </button>

                              {activity.cost && (
                                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{activity.cost}</span>
                                </div>
                              )}
                              {onUpdateItinerary && (
                                <>
                                  <button
                                    onClick={() => {
                                      const dayIdx = itinerary.findIndex((d) => d.day === day.day);
                                      setSmartEditTarget({ dayIndex: dayIdx, activityIndex: idx });
                                    }}
                                    title="Edit this activity with AI"
                                    className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black flex items-center gap-1 border border-indigo-200 transition-colors"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    AI Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteActivity(day.day, idx)}
                                    title="Remove this stop"
                                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className={isVisited ? 'line-through text-slate-500' : ''}>
                              {activity.activity}
                            </span>
                            {isVisited && (
                              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                                ✓ Done
                              </span>
                            )}
                          </h4>

                          {activity.locationName && (
                            <div className="flex items-center justify-between text-xs text-indigo-600 font-medium">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{activity.locationName}</span>
                              </div>
                            </div>
                          )}

                          <p className="text-sm text-slate-600 leading-relaxed">
                            {activity.description}
                          </p>

                          {activity.tip && (
                            <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold">Insider Tip:</span> {activity.tip}
                              </div>
                            </div>
                          )}

                          {/* Quick Photo & Map Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 text-xs">
                            <a
                              href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${activity.locationName || activity.activity} ${destination}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                              title="Search authentic photos on Google Images"
                            >
                              <Camera className="w-3.5 h-3.5 text-blue-600" />
                              <span>Google Images</span>
                            </a>

                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.locationName || activity.activity} ${destination}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                              title="Open on Google Maps"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              <span>Google Maps</span>
                            </a>

                            {/* Speech Synthesis Voice Audio Guide */}
                            <button
                              type="button"
                              onClick={() => {
                                const speechText = `${activity.activity} at ${activity.locationName}. ${activity.description}. Insider tip: ${activity.tip || ''}. Historical trivia: ${intel.trivia}`;
                                handleToggleSpeak(actKey, speechText);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                speakingActivityKey === actKey
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                              title="Listen to hands-free audio narration for this stop"
                            >
                              {speakingActivityKey === actKey ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                              <span>{speakingActivityKey === actKey ? 'Stop Voice' : 'Listen Guide'}</span>
                            </button>

                            {activity.coordinates && onSelectActivityLocation && (
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectActivityLocation({
                                    lat: activity.coordinates!.lat,
                                    lng: activity.coordinates!.lng,
                                    title: activity.locationName,
                                  })
                                }
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ml-auto"
                              >
                                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Focus on Map</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Manual Accordion Toggle when Deep Logistics is not globally pinned */}
                      {!showAllDeepDetails && (
                        <button
                          type="button"
                          onClick={() => toggleActivityExpand(actKey)}
                          className="mt-3 w-full py-2 px-3 bg-white hover:bg-indigo-50/60 text-indigo-900 rounded-xl text-xs font-bold transition-all flex items-center justify-between border border-slate-200/80"
                        >
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              {isExpanded ? 'Hide Deep Travel Intel' : 'Show Deep Travel Intel & Logistics'}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          )}
                        </button>
                      )}

                      {/* 4-Quadrant Deep Travel Intel Grid (Full Details) */}
                      {(showAllDeepDetails || isExpanded) && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                          {/* 1. Transit & Station Access */}
                          <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1">
                            <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                              <Train className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Transit & Station Access</span>
                            </div>
                            <p className="text-slate-600 leading-snug">{intel.transit}</p>
                          </div>

                          {/* 2. Photo Spot & Vantage Angle */}
                          <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-2xs space-y-1">
                            <div className="font-bold text-amber-700 flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-amber-600" />
                              <span>Best Photo Spot & Vantage</span>
                            </div>
                            <p className="text-slate-600 leading-snug">{intel.photo}</p>
                          </div>

                          {/* 3. Dress Code & Etiquette */}
                          <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs space-y-1">
                            <div className="font-bold text-sky-700 flex items-center gap-1.5">
                              <Shirt className="w-3.5 h-3.5 text-sky-600" />
                              <span>Attire & Footwear Etiquette</span>
                            </div>
                            <p className="text-slate-600 leading-snug">{intel.dress}</p>
                          </div>

                          {/* 4. Historical Lore & Trivia */}
                          <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-2xs space-y-1">
                            <div className="font-bold text-purple-700 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>Historical Lore & Architecture</span>
                            </div>
                            <p className="text-slate-600 leading-snug">{intel.trivia}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Inter-Stop Transit Step Indicator */}
                    {transit && (
                      <div className="ml-1 sm:ml-2 my-3 p-3 bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-white border border-indigo-100/90 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-xs text-slate-700 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-white border border-indigo-200/80 flex items-center justify-center shadow-2xs shrink-0 text-indigo-600">
                            {transit.mode === 'metro' ? (
                              <Train className="w-4 h-4" />
                            ) : (
                              <Footprints className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 leading-tight">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 text-xs">
                                Next Leg:
                              </span>
                              <span className="font-semibold text-slate-700 truncate">
                                {transit.summary}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                {transit.distanceKm} km • ~{transit.estimatedMinutes} min
                              </span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={transit.navigationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0 hover:shadow-indigo-500/20 active:scale-95 ml-auto sm:ml-2"
                          title="Open turn-by-turn directions on Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5 fill-white" />
                          <span>Google Maps Directions</span>
                          <ExternalLink className="w-3 h-3 text-white/80" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Dining Spotlight */}
            {day.diningRecommendation && (day.diningRecommendation.breakfast || day.diningRecommendation.lunch || day.diningRecommendation.snack || day.diningRecommendation.dinner) && (
              <div className="mt-8 pt-6 border-t border-slate-100 bg-gradient-to-r from-rose-50/50 to-orange-50/50 rounded-2xl p-5 border border-rose-100/70">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4 text-rose-500" />
                  <span>Culinary Blueprint for Day {day.day}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700">
                  {day.diningRecommendation.breakfast && (
                    <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] block mb-1 flex items-center gap-1">
                          <Coffee className="w-3 h-3" /> Breakfast / Morning
                        </span>
                        <p className="leading-snug">{day.diningRecommendation.breakfast}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${day.diningRecommendation.breakfast} ${destination}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 pt-1"
                      >
                        <MapPin className="w-3 h-3" /> Find on Maps ↗
                      </a>
                    </div>
                  )}
                  {day.diningRecommendation.lunch && (
                    <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] block mb-1">
                          Midday Lunch Recommendation
                        </span>
                        <p className="leading-snug">{day.diningRecommendation.lunch}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${day.diningRecommendation.lunch} ${destination}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 pt-1"
                      >
                        <MapPin className="w-3 h-3" /> Find on Maps ↗
                      </a>
                    </div>
                  )}
                  {day.diningRecommendation.snack && (
                    <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-orange-700 uppercase tracking-wider text-[10px] block mb-1">
                          Afternoon Snack / Café
                        </span>
                        <p className="leading-snug">{day.diningRecommendation.snack}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${day.diningRecommendation.snack} ${destination}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 pt-1"
                      >
                        <MapPin className="w-3 h-3" /> Find on Maps ↗
                      </a>
                    </div>
                  )}
                  {day.diningRecommendation.dinner && (
                    <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] block mb-1">
                          Evening Dinner Recommendation
                        </span>
                        <p className="leading-snug">{day.diningRecommendation.dinner}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${day.diningRecommendation.dinner} ${destination}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 pt-1"
                      >
                        <MapPin className="w-3 h-3" /> Find on Maps ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Day Paging Navigation Strip at bottom of each day */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                  Day {day.day} of {itinerary.length} Complete
                </span>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  {itinerary.length - day.day > 0
                    ? `${itinerary.length - day.day} more days to explore!`
                    : 'Final day of your adventure!'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {day.day > 1 && (
                  <button
                    onClick={() => {
                      setSelectedDay(day.day - 1);
                      setExpandedAll(false);
                      const el = document.getElementById(`day-section-${day.day - 1}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    ← Day {day.day - 1}
                  </button>
                )}

                <button
                  onClick={() => setExpandedAll(!expandedAll)}
                  className={`px-4 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    expandedAll
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-2xs'
                  }`}
                >
                  {expandedAll ? 'Show 1 Day' : `View All ${itinerary.length} Days`}
                </button>

                {day.day < itinerary.length && (
                  <button
                    onClick={() => {
                      setSelectedDay(day.day + 1);
                      setExpandedAll(false);
                      const el = document.getElementById(`day-section-${day.day + 1}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <span>Next Day (Day {day.day + 1}) →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Distance Optimizer Modal */}
      {optimizingDay && (
        <RouteOptimizerModal
          isOpen={Boolean(optimizingDay)}
          onClose={() => setOptimizingDay(null)}
          day={optimizingDay}
          onApplyOptimization={handleApplyRouteOptimization}
        />
      )}

      {/* Inline Modal to Add New Activity */}
      {isAddingActivityForDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900">
                Add Activity to Day {isAddingActivityForDay}
              </h4>
              <button
                onClick={() => setIsAddingActivityForDay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset drinks at rooftop bar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value as ItineraryActivity['timeSlot'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Terrace"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $15 or Free"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes about reservations, dress code, etc."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingActivityForDay(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Day Re-Mix Modal */}
      {remixingDay && (
        <AIDayRemixModal
          isOpen={Boolean(remixingDay)}
          onClose={() => setRemixingDay(null)}
          day={remixingDay}
          destination={destination}
          onApplyRemix={handleApplyDayRemix}
        />
      )}

      {/* Smart AI Activity Editor Drawer */}
      {smartEditTarget && (() => {
        const dayData = itinerary[smartEditTarget.dayIndex];
        const actData = dayData?.schedule[smartEditTarget.activityIndex];
        if (!dayData || !actData) return null;
        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
              onClick={() => setSmartEditTarget(null)}
            />
            <SmartActivityEditor
              activity={actData}
              dayIndex={smartEditTarget.dayIndex}
              activityIndex={smartEditTarget.activityIndex}
              destination={destination}
              onApply={handleApplySmartEdit}
              onClose={() => setSmartEditTarget(null)}
            />
          </>
        );
      })()}
    </div>
  );
}
