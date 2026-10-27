'use client';

import React from 'react';
import { Compass, Bookmark, Key, Sparkles, HelpCircle, Home, ArrowLeft, Moon, Sun } from 'lucide-react';
import { getSavedTrips, getUserSettings } from '@/lib/storage';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenSavedTrips: () => void;
  onSelectSample: () => void;
  onOpenTour?: () => void;
  savedCount?: number;
  onGoHome?: () => void;
  isTripActive?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function Header({
  onOpenSettings,
  onOpenSavedTrips,
  onSelectSample,
  onOpenTour,
  savedCount: propSavedCount,
  onGoHome,
  isTripActive = false,
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  const hasCustomKey = typeof window !== 'undefined'
    ? Boolean(getUserSettings().openaiApiKey || getUserSettings().googleMapsApiKey)
    : false;

  const displayCount = propSavedCount !== undefined
    ? propSavedCount
    : (typeof window !== 'undefined' ? getSavedTrips().length : 0);

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
      isDark
        ? 'bg-[#0a0a1a]/85 border-white/10 text-white'
        : 'bg-white/90 border-slate-200/90 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => {
            if (onGoHome) onGoHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-extrabold text-lg tracking-tight bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-white via-indigo-200 to-sky-300'
                  : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700'
              }`}>
                WanderAI
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border ${
                isDark
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
              }`}>
                Planner
              </span>
            </div>
            <p className={`text-[10px] hidden sm:block -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              AI Itineraries & Google Maps
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back & Home Buttons when a trip is open */}
          {isTripActive && onGoHome && (
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={onGoHome}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer border ${
                  isDark
                    ? 'text-slate-300 bg-white/5 hover:bg-white/10 border-white/10'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200/90 border-slate-200/80'
                }`}
                title="Back to Trip Planner"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Go to Homepage"
              >
                <Home className="w-3.5 h-3.5 text-indigo-400" />
                <span>Home</span>
              </button>
            </div>
          )}

          {/* How It Works Visual Tour Trigger */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer border ${
                isDark
                  ? 'text-indigo-300 bg-white/5 hover:bg-white/10 border-white/10'
                  : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200/80'
              }`}
              title="Interactive 1-minute visual guide to WanderAI"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>How It Works</span>
            </button>
          )}

          {/* Sample Trips Quick Button */}
          <button
            onClick={onSelectSample}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-white/5'
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample Trips</span>
          </button>

          {/* Saved Trips Drawer Trigger */}
          <button
            onClick={onOpenSavedTrips}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              isDark
                ? 'text-slate-200 bg-white/5 hover:bg-white/10 border-white/10'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200/80 border-slate-200/80'
            }`}
          >
            <Bookmark className="w-4 h-4 text-indigo-500" />
            <span>Saved Trips</span>
            {displayCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {displayCount}
              </span>
            )}
          </button>

          {/* 🌙 / ☀️ Interactive Theme Mode Switcher */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px]">Light</span>
                </>
              )}
            </button>
          )}

          {/* API Key Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-colors border flex items-center gap-1.5 ${
              isDark
                ? 'text-slate-300 bg-white/5 hover:bg-white/10 border-white/10'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200/80 border-slate-200/80'
            }`}
            title="Configure OpenAI and Google Maps API Keys"
          >
            <Key className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">API Keys (Optional)</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Key Connected" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
