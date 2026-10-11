'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Compass,
  ArrowUp,
  RotateCcw,
  MapPin,
  Utensils,
  Camera,
  Layers,
  ChevronDown,
  Home,
  ArrowLeft
} from 'lucide-react';
import { TripPlan } from '@/types/travel';

interface FloatingNavDockProps {
  trip: TripPlan | null;
  onNewPlanClick: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function FloatingNavDock({
  trip,
  onNewPlanClick,
  activeTab,
  onSelectTab,
}: FloatingNavDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDaysMenu, setShowDaysMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dock after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setShowDaysMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDay = (dayNum: number) => {
    setShowDaysMenu(false);
    // Find the day element or switch to itinerary tab
    if (onSelectTab && activeTab !== 'itinerary') {
      onSelectTab('itinerary');
    }
    setTimeout(() => {
      const el = document.getElementById(`day-section-${dayNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  if (!trip || !isVisible) return null;

  return (
    <aside aria-label="Trip Navigation Dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 animate-slide-up-fade">
      <div className="bg-slate-900/90 hover:bg-slate-900 backdrop-blur-xl text-white px-3 sm:px-4 py-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2 sm:gap-3 transition-all">
        {/* Destination & Day Counter Pill */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80 text-xs">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-[11px]">
            {trip.duration}d
          </div>
          <span className="font-extrabold max-w-[100px] sm:max-w-[140px] truncate hidden sm:inline">
            {trip.destination}
          </span>
        </div>

        {/* Day Selector Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDaysMenu((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Days ({trip.itinerary.length})</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDaysMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-2 shadow-2xl min-w-[200px] max-h-56 overflow-y-auto z-50 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Jump to Day Itinerary
              </div>
              {trip.itinerary.map((d) => (
                <button
                  key={d.day}
                  onClick={() => scrollToDay(d.day)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="font-bold">Day {d.day}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {d.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fast Tab Shortcuts */}
        {onSelectTab && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectTab('map')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Interactive Map"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Map</span>
            </button>

            <button
              onClick={() => onSelectTab('gallery')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Photo Gallery"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Photos</span>
            </button>
          </div>
        )}

        {/* Back to Itinerary if viewing another tab */}
        {activeTab && activeTab !== 'itinerary' && onSelectTab && (
          <button
            onClick={() => onSelectTab('itinerary')}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Back to Itinerary"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Itinerary</span>
          </button>
        )}

        {/* Home Button */}
        <button
          onClick={onNewPlanClick}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Return to Home Planner"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Plan New Trip */}
        <button
          onClick={onNewPlanClick}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Plan another destination"
        >
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">New Plan</span>
        </button>

        {/* Scroll Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
