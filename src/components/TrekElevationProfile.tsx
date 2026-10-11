'use client';

import React, { useMemo } from 'react';
import { TripPlan } from '@/types/travel';
import { Footprints, Flame, Droplets, Mountain, HeartPulse, Sparkles, TrendingUp } from 'lucide-react';

interface TrekElevationProfileProps {
  trip: TripPlan;
}

export default function TrekElevationProfile({ trip }: TrekElevationProfileProps) {
  // Compute daily metrics based on itinerary
  const dailyMetrics = useMemo(() => {
    return trip.itinerary.map((day, idx) => {
      const activityCount = day.schedule.length;
      // Estimate steps based on activities and pacing
      const baseSteps = 4500;
      const activitySteps = activityCount * 1800;
      const energyMultiplier =
        day.energyLevel === 'High-Energy' ? 1.3 : day.energyLevel === 'Relaxed' ? 0.8 : 1.05;
      const totalSteps = Math.round((baseSteps + activitySteps) * energyMultiplier);
      const distanceKm = parseFloat(((totalSteps * 0.76) / 1000).toFixed(1));
      const caloriesBurned = Math.round(totalSteps * 0.042);
      const elevationGainM = Math.round(80 + (idx % 3) * 65 + activityCount * 15);
      const hydrationLiters = (1.5 + distanceKm * 0.12).toFixed(1);

      return {
        day: day.day,
        title: day.title,
        steps: totalSteps,
        distanceKm,
        calories: caloriesBurned,
        elevationM: elevationGainM,
        hydration: hydrationLiters,
      };
    });
  }, [trip.itinerary]);

  const totalTripKm = dailyMetrics.reduce((sum, d) => sum + d.distanceKm, 0).toFixed(1);
  const totalTripCalories = dailyMetrics.reduce((sum, d) => sum + d.calories, 0);
  const totalTripSteps = dailyMetrics.reduce((sum, d) => sum + d.steps, 0);
  const maxElevation = Math.max(...dailyMetrics.map((d) => d.elevationM), 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Footprints className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Pedestrian Stamina & Wellness Tracker
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Daily Walking Distance & Elevation Profile
          </h3>
          <p className="text-xs text-slate-500">
            Estimated physical movement, caloric exertion & elevation climbs for {trip.destination}
          </p>
        </div>

        {/* Aggregate Trip Stamina Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200/80 text-emerald-950">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Walking</span>
            <span className="text-base font-black font-mono">{totalTripKm} km</span>
          </div>
          <div className="bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200/80 text-amber-950">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Active Calories</span>
            <span className="text-base font-black font-mono">~{totalTripCalories.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Footprints className="w-4 h-4 text-emerald-600" />
            <span>Avg Daily Steps</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {Math.round(totalTripSteps / (dailyMetrics.length || 1)).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400">~{((parseFloat(totalTripKm) / (dailyMetrics.length || 1))).toFixed(1)} km / day</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Avg Burn</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {Math.round(totalTripCalories / (dailyMetrics.length || 1))}
          </p>
          <p className="text-[10px] text-slate-400">kcal per day</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Mountain className="w-4 h-4 text-indigo-600" />
            <span>Peak Climb</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            +{maxElevation} m
          </p>
          <p className="text-[10px] text-slate-400">Vertical ascent</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>Hydration Target</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            2.2 L
          </p>
          <p className="text-[10px] text-slate-400">Electrolytes advised</p>
        </div>
      </div>

      {/* SVG Elevation & Stamina Wave Profile */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold flex items-center gap-1.5 text-slate-300">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Trip Elevation & Fatigue Profile</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">DAY 1 → DAY {dailyMetrics.length}</span>
        </div>

        {/* SVG Curve */}
        <div className="relative h-32 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={`M 0,100 ${dailyMetrics
                .map((d, i) => {
                  const x = (i / (dailyMetrics.length - 1 || 1)) * 500;
                  const y = 90 - (d.elevationM / maxElevation) * 75;
                  return `L ${x},${y}`;
                })
                .join(' ')} L 500,100 Z`}
              fill="url(#elevationGrad)"
            />

            {/* Line curve */}
            <path
              d={`M 0,${90 - (dailyMetrics[0]?.elevationM / maxElevation) * 75} ${dailyMetrics
                .map((d, i) => {
                  const x = (i / (dailyMetrics.length - 1 || 1)) * 500;
                  const y = 90 - (d.elevationM / maxElevation) * 75;
                  return `L ${x},${y}`;
                })
                .join(' ')}`}
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
            />

            {/* Data point circles */}
            {dailyMetrics.map((d, i) => {
              const x = (i / (dailyMetrics.length - 1 || 1)) * 500;
              const y = 90 - (d.elevationM / maxElevation) * 75;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        {/* Day X-Axis Markers */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
          {dailyMetrics.map((d) => (
            <div key={d.day} className="text-center">
              <span className="block font-bold text-slate-300">D{d.day}</span>
              <span className="text-[9px] text-emerald-400">+{d.elevationM}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-Day Walk Cards Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          Day-by-Day Physical Exertion Matrix
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dailyMetrics.map((d) => (
            <div
              key={d.day}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Day {d.day}
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {d.distanceKm} km
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 truncate">{d.title}</p>
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/60 text-[10px] text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400 block font-sans">STEPS</span>
                  <span className="font-bold text-slate-900">{d.steps.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">CAL</span>
                  <span className="font-bold text-orange-600">{d.calories}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">WATER</span>
                  <span className="font-bold text-sky-600">{d.hydration}L</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
