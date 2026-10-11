'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Bookmark, Key, Sparkles, Map } from 'lucide-react';
import { getSavedTrips, getUserSettings } from '@/lib/storage';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenSavedTrips: () => void;
  onSelectSample: () => void;
  savedCount?: number;
}

export default function Header({
  onOpenSettings,
  onOpenSavedTrips,
  onSelectSample,
  savedCount: propSavedCount
}: HeaderProps) {
  const [savedCount, setSavedCount] = useState<number>(propSavedCount ?? 0);
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(false);

  useEffect(() => {
    if (propSavedCount !== undefined) {
      setSavedCount(propSavedCount);
    } else {
      const trips = getSavedTrips();
      setSavedCount(trips.length);
    }
    const settings = getUserSettings();
    setHasCustomKey(Boolean(settings.openaiApiKey || settings.googleMapsApiKey));
  }, [propSavedCount]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                WanderAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/60">
                Planner
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block -mt-0.5">
              AI Itineraries & Google Maps
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample Trips Quick Button */}
          <button
            onClick={onSelectSample}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample Trips</span>
          </button>

          {/* Saved Trips Drawer Trigger */}
          <button
            onClick={onOpenSavedTrips}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/60 shadow-sm"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* API Key Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60 flex items-center gap-1.5"
            title="Configure OpenAI and Google Maps API Keys"
          >
            <Key className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">API Keys</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Key Connected" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
