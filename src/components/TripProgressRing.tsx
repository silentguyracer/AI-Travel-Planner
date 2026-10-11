'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TripPlan } from '@/types/travel';
import { gsap } from 'gsap';
import { CheckCircle2, Star, Flame, Trophy } from 'lucide-react';

interface TripProgressRingProps {
  trip: TripPlan;
  visitedKeys: Set<string>;
}

const RANK_THRESHOLDS = [
  { min: 0,   max: 25,  label: 'Explorer',   emoji: '🗺️', color: '#64748b' },
  { min: 25,  max: 50,  label: 'Adventurer',  emoji: '🧭', color: '#3b82f6' },
  { min: 50,  max: 75,  label: 'Trailblazer', emoji: '🔥', color: '#f97316' },
  { min: 75,  max: 100, label: 'Legend',      emoji: '🏆', color: '#eab308' },
] as const;

function getRank(pct: number) {
  return RANK_THRESHOLDS.find((r) => pct >= r.min && pct < r.max) ?? RANK_THRESHOLDS[3];
}

export default function TripProgressRing({ trip, visitedKeys }: TripProgressRingProps) {
  const svgCircleRef = useRef<SVGCircleElement | null>(null);
  const pctTextRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const totalActivities = useMemo(() => {
    return trip.itinerary.reduce((acc, day) => acc + day.schedule.length, 0);
  }, [trip.itinerary]);

  const visitedCount = visitedKeys.size;
  const pct = totalActivities > 0 ? Math.round((visitedCount / totalActivities) * 100) : 0;
  const rank = getRank(pct);

  // SVG ring math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  // GSAP animate the ring and text on pct change
  useEffect(() => {
    if (!svgCircleRef.current) return;
    const circle = svgCircleRef.current;
    const targetOffset = circumference - (pct / 100) * circumference;

    gsap.to(circle, {
      strokeDashoffset: targetOffset,
      duration: 0.9,
      ease: 'power2.out',
    });
  }, [pct, circumference]);

  // Entrance animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 12,
        duration: 0.5,
        ease: 'back.out(1.4)',
      });
    }
  }, []);

  // Animate counter text
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    const obj = { val: displayPct };
    const tween = gsap.to(obj, {
      val: pct,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => setDisplayPct(Math.round(obj.val)),
    });
    return () => { tween.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  const dayBreakdown = useMemo(() => {
    return trip.itinerary.map((day) => {
      const dayVisited = day.schedule.filter((act) => {
        const key = `${trip.destination}-${day.day}-${act.activity}`;
        return visitedKeys.has(key);
      }).length;
      return {
        day: day.day,
        total: day.schedule.length,
        visited: dayVisited,
        pct: day.schedule.length > 0 ? Math.round((dayVisited / day.schedule.length) * 100) : 0,
      };
    });
  }, [trip.itinerary, trip.destination, visitedKeys]);

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow orb */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 70% 50%, ${rank.color}33, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg width={120} height={120} className="rotate-[-90deg]">
            {/* Track */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              strokeWidth="10"
              stroke="#1e293b"
            />
            {/* Progress arc */}
            <circle
              ref={svgCircleRef}
              cx="60" cy="60" r={radius}
              fill="none"
              strokeWidth="10"
              stroke={rank.color}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ filter: `drop-shadow(0 0 6px ${rank.color}80)` }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              ref={pctTextRef}
              className="text-2xl font-black text-white leading-none"
              style={{ color: rank.color }}
            >
              {displayPct}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Done</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          {/* Rank */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-lg">{rank.emoji}</span>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Rank</p>
              <p className="text-base font-black text-white leading-tight">{rank.label}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-bold">{visitedCount} visited</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Star className="w-3.5 h-3.5" />
              <span className="font-semibold">{totalActivities - visitedCount} remaining</span>
            </div>
          </div>

          {/* Next rank nudge */}
          {pct < 100 && (
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {pct < 25
                ? `Check in ${25 - pct}% more to become an Adventurer 🧭`
                : pct < 50
                ? `${50 - pct}% more to become a Trailblazer 🔥`
                : pct < 75
                ? `${75 - pct}% more to become a Legend 🏆`
                : `Almost there! Complete all activities to be a Legend.`}
            </p>
          )}

          {pct === 100 && (
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-xl px-3 py-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300">Trip Fully Completed! Legendary Status!</span>
            </div>
          )}
        </div>
      </div>

      {/* Per-Day Progress Bars */}
      {dayBreakdown.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
            <Flame className="w-3 h-3 text-amber-400" />
            Daily Progress
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {dayBreakdown.map((d) => (
              <div key={d.day} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold">Day {d.day}</span>
                  <span className="font-black" style={{ color: d.pct === 100 ? '#4ade80' : '#94a3b8' }}>
                    {d.visited}/{d.total}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${d.pct}%`,
                      background: d.pct === 100
                        ? 'linear-gradient(90deg, #4ade80, #22d3ee)'
                        : `linear-gradient(90deg, ${rank.color}, ${rank.color}bb)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
