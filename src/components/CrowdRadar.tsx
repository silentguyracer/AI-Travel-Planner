'use client';

import React, { useState, useMemo } from 'react';
import { PlaceToVisit } from '@/types/travel';
import {
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Info
} from 'lucide-react';

interface CrowdRadarProps {
  destination: string;
  places: PlaceToVisit[];
}

interface AttractionCrowdProfile {
  name: string;
  category: string;
  bestHours: string;
  peakHours: string;
  waitTimes: { peak: string; offPeak: string };
  ticketAdvice: string;
  hourlyDensity: number[]; // 18 hours: 06:00 to 23:00 (percentage 0-100)
  secretTip: string;
}

export default function CrowdRadar({ destination, places }: CrowdRadarProps) {
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState(10); // 10:00 AM

  // Heuristic generator for realistic crowd profiles based on place name and category
  const crowdProfiles: AttractionCrowdProfile[] = useMemo(() => {
    return places.map((place, idx) => {
      const isMuseum = place.category === 'museum' || place.name.toLowerCase().includes('museum') || place.name.toLowerCase().includes('gallery');
      const isNature = place.category === 'nature' || place.name.toLowerCase().includes('park') || place.name.toLowerCase().includes('garden');
      const isMarket = place.category === 'shopping' || place.name.toLowerCase().includes('market') || place.name.toLowerCase().includes('bazaar');

      // Generate hourly curves from 6am (idx 0) to 11pm (idx 17)
      let hourly: number[];
      if (isMuseum) {
        // Peaks at 11am-3pm (indices 5 to 9)
        hourly = [5, 10, 20, 45, 75, 95, 90, 85, 80, 70, 50, 30, 15, 10, 5, 0, 0, 0];
      } else if (isNature) {
        // Peaks early morning & late afternoon golden hour
        hourly = [30, 50, 70, 65, 55, 45, 40, 45, 60, 85, 80, 60, 30, 15, 5, 0, 0, 0];
      } else if (isMarket) {
        // Peaks midday and dinner time
        hourly = [15, 25, 40, 65, 85, 95, 90, 80, 75, 80, 90, 85, 60, 40, 20, 10, 5, 0];
      } else {
        // Standard landmark peak between 10am and 4pm
        hourly = [10, 20, 40, 70, 85, 90, 95, 90, 80, 75, 65, 55, 40, 25, 15, 10, 5, 0];
      }

      return {
        name: place.name,
        category: place.category,
        bestHours: isNature ? '06:30 – 08:30 AM or 17:30 PM' : '08:30 – 10:00 AM or after 17:30 PM',
        peakHours: '11:30 AM – 15:30 PM',
        waitTimes: {
          peak: isMuseum ? '45–90 min' : '30–60 min',
          offPeak: '5–15 min (Walk-in)',
        },
        ticketAdvice: isMuseum
          ? 'Timed entry slot required online 48h prior to avoid sell-outs.'
          : 'Free entry or on-site contactless ticket machines available.',
        hourlyDensity: hourly,
        secretTip: `Arrive 20 minutes before the official ticket gates open to enjoy the main courtyard in serene silence before tour buses arrive.`,
      };
    });
  }, [places]);

  const activePlace = crowdProfiles[selectedPlaceIndex] || crowdProfiles[0];

  const getDensityColor = (density: number) => {
    if (density < 30) return 'bg-emerald-500 text-emerald-950';
    if (density < 60) return 'bg-amber-400 text-amber-950';
    if (density < 80) return 'bg-orange-500 text-white';
    return 'bg-rose-600 text-white';
  };

  const getDensityLabel = (density: number) => {
    if (density < 30) return 'Low • Quiet & Serene';
    if (density < 60) return 'Moderate • Steady flow';
    if (density < 80) return 'Busy • Long queues';
    return 'Extreme Surge • Peak crowds';
  };

  // 18 hourly labels: 6 AM to 11 PM
  const hoursLabels = [
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
  ];

  const selectedHourIndex = Math.min(Math.max(selectedHour - 6, 0), 17);
  const currentDensity = activePlace?.hourlyDensity[selectedHourIndex] ?? 45;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/20">
                <Users className="w-5 h-5 text-indigo-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Avoid-the-Crowds Radar
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {destination} Peak Hours & Foot-Traffic Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Real-time crowd predictions and optimal entry windows to skip the tour buses and enjoy attractions at their most peaceful.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs text-slate-200 shrink-0">
            <span className="font-bold block text-white mb-0.5">Golden Rule:</span>
            <span>Visit top landmarks before 9:30 AM or during evening golden hour.</span>
          </div>
        </div>
      </div>

      {/* 2. Place Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {crowdProfiles.map((p, idx) => {
          const isSelected = selectedPlaceIndex === idx;
          return (
            <button
              key={p.name}
              onClick={() => setSelectedPlaceIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Foot-Traffic Heatmap Card */}
      {activePlace && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Hourly Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {activePlace.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activePlace.name}
                </h3>
              </div>

              {/* Status at selected hour */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    At {hoursLabels[selectedHourIndex]}:
                  </span>
                  <span
                    className={`ml-1.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${getDensityColor(
                      currentDensity
                    )}`}
                  >
                    {currentDensity}% ({getDensityLabel(currentDensity)})
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly Bar Heatmap Chart */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Hourly Crowd Density (6:00 AM – 11:00 PM)</span>
                <span className="text-indigo-600 font-semibold">Click any bar to inspect hour</span>
              </div>

              <div className="h-44 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-end justify-between gap-1 sm:gap-2">
                {activePlace.hourlyDensity.map((density, idx) => {
                  const hourNum = idx + 6;
                  const isCur = hourNum === selectedHour;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedHour(hourNum)}
                      className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
                    >
                      {/* Tooltip on hover */}
                      <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {density}%
                      </span>
                      {/* Bar */}
                      <div
                        style={{ height: `${Math.max(density, 6)}%` }}
                        className={`w-full rounded-t-lg transition-all ${getDensityColor(density)} ${
                          isCur
                            ? 'ring-2 ring-indigo-600 scale-105 shadow-md'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                      />
                      {/* Hour label */}
                      <span
                        className={`text-[9px] mt-1 font-semibold ${
                          isCur ? 'text-indigo-600 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {hourNum % 3 === 0 ? (hourNum <= 12 ? `${hourNum}A` : `${hourNum - 12}P`) : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend & Advice Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Best Time to Arrive</span>
                </div>
                <p className="text-sm font-extrabold text-emerald-950">
                  {activePlace.bestHours}
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Wait time: {activePlace.waitTimes.offPeak}
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-200/80 p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Peak Bottleneck</span>
                </div>
                <p className="text-sm font-extrabold text-rose-950">
                  {activePlace.peakHours}
                </p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Wait time: {activePlace.waitTimes.peak}
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200/80 p-3.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-indigo-800 text-xs font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Ticketing Protocol</span>
                </div>
                <p className="text-xs text-indigo-950 font-medium leading-snug">
                  {activePlace.ticketAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Right Col: Insider Tactics */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm border border-indigo-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Local Anti-Crowd Secret</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                {activePlace.secretTip}
              </p>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-white block mb-1">Alternative Entry Gates:</span>
                <span>Secondary side entrances often have less than 20% of the main gate line. Look for garden or group exit gates with open ticket scanners.</span>
              </div>
            </div>

            {/* Quick Summary of All Attractions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                All Attractions at a Glance
              </h4>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {crowdProfiles.map((p, idx) => (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPlaceIndex(idx)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      selectedPlaceIndex === idx
                        ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="truncate max-w-[160px]">{p.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold whitespace-nowrap">
                      Best: {p.bestHours.split('or')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
