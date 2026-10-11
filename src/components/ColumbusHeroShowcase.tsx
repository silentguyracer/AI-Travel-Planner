'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TripPlan } from '@/types/travel';
import { Sparkles, Bot, CalendarPlus, Compass, ArrowUpRight, Plus, MapPin, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { attachMagneticHover, animateStaggerCards } from '@/lib/gsapAnimations';

interface ColumbusHeroShowcaseProps {
  trip: TripPlan;
  convertedTotalEstimate: string;
  onOpenConcierge: () => void;
  onOpenCalendar: () => void;
  onOpenMap: () => void;
}

export default function ColumbusHeroShowcase({
  trip,
  convertedTotalEstimate,
  onOpenConcierge,
  onOpenCalendar,
  onOpenMap,
}: ColumbusHeroShowcaseProps) {
  // Animated metric counters using GSAP tween
  const [ticketCount, setTicketCount] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);
  const consultBtnRef = useRef<HTMLButtonElement | null>(null);
  const metricsGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const counterObj = { ticket: 0, sat: 0 };
    const tween = gsap.to(counterObj, {
      ticket: 250,
      sat: 99,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setTicketCount(Math.round(counterObj.ticket));
        setSatisfactionRate(Math.round(counterObj.sat));
      },
    });

    if (metricsGridRef.current) {
      animateStaggerCards(metricsGridRef.current.children as unknown as HTMLElement[], {
        yOffset: 16,
        stagger: 0.08,
        duration: 0.5,
      });
    }

    const cleanupMagnetic = consultBtnRef.current
      ? attachMagneticHover(consultBtnRef.current, 0.22)
      : undefined;

    return () => {
      tween.kill();
      cleanupMagnetic?.();
    };
  }, []);

  return (
    <div className="space-y-6 overflow-hidden">
      {/* 1. Columbus Travel Signature Double Kinetic Marquee Line */}
      <div className="bg-[#0f172a] py-3 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="animate-columbus-marquee whitespace-nowrap text-xs sm:text-sm font-black tracking-widest uppercase text-sky-400 flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="text-amber-400">✦</span>
            COLUMBUS-INSPIRED CURATED EXPEDITION: {trip.destination}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-white">
            <span className="text-indigo-400">✦</span>
            {trip.duration} DAYS OF UNFORGETTABLE JOURNEY
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="text-emerald-400">✦</span>
            BUDGET: {convertedTotalEstimate} ({trip.budget.toUpperCase()})
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-rose-300">
            <span className="text-rose-400">✦</span>
            {trip.country || 'GLOBAL DESTINATION'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-sky-300">
            <span className="text-amber-400">✦</span>
            TAILORED SIGHTSEEING & MICHELIN DINING
          </span>
          <span className="text-slate-600">•</span>
          {/* Duplicate loop */}
          <span className="flex items-center gap-2">
            <span className="text-amber-400">✦</span>
            COLUMBUS-INSPIRED CURATED EXPEDITION: {trip.destination}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-white">
            <span className="text-indigo-400">✦</span>
            {trip.duration} DAYS OF UNFORGETTABLE JOURNEY
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="text-emerald-400">✦</span>
            BUDGET: {convertedTotalEstimate} ({trip.budget.toUpperCase()})
          </span>
          <span className="text-slate-600">•</span>
        </div>

        {/* Reverse Marquee */}
        <div className="animate-columbus-marquee-reverse whitespace-nowrap text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-6 mt-1.5 opacity-90">
          <span>HIGH-SPEED TRAINS</span>
          <span className="text-sky-500">◆</span>
          <span>CROWD FOOT-TRAFFIC RADAR</span>
          <span className="text-sky-500">◆</span>
          <span>LIVE CURRENCY & VAT TAX-FREE</span>
          <span className="text-sky-500">◆</span>
          <span>AUDIO SOUNDSCAPES</span>
          <span className="text-sky-500">◆</span>
          <span>TOURIST SAFETY SHIELD</span>
          <span className="text-sky-500">◆</span>
          <span>AI CONCIERGE 24/7</span>
          <span className="text-sky-500">◆</span>
          {/* Duplicate loop */}
          <span>HIGH-SPEED TRAINS</span>
          <span className="text-sky-500">◆</span>
          <span>CROWD FOOT-TRAFFIC RADAR</span>
          <span className="text-sky-500">◆</span>
          <span>LIVE CURRENCY & VAT TAX-FREE</span>
          <span className="text-sky-500">◆</span>
          <span>AUDIO SOUNDSCAPES</span>
          <span className="text-sky-500">◆</span>
          <span>TOURIST SAFETY SHIELD</span>
          <span className="text-sky-500">◆</span>
          <span>AI CONCIERGE 24/7</span>
          <span className="text-sky-500">◆</span>
        </div>
      </div>

      {/* 2. Columbus Travel Signature Experience Counters with Big Numbers */}
      <div className="bg-gradient-to-r from-slate-900 via-[#161f38] to-slate-900 rounded-3xl p-6 sm:p-8 border border-white/10 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-400 flex items-center gap-1.5 mb-1">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Columbus Travel Experience Matrix
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              A wealth of curated precision &amp; bespoke luxury
            </h3>
          </div>

          {/* Columbus Style Magnetic Button with Diagonal Arrow Slide */}
          <button
            ref={consultBtnRef}
            type="button"
            onClick={onOpenConcierge}
            className="group flex items-center gap-3 bg-white hover:bg-sky-400 text-slate-950 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-sky-400/20 active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-indigo-600 group-hover:text-slate-950 transition-colors" />
            <span>Consult AI Concierge</span>
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center columbus-arrow-circle group-hover:bg-slate-950">
              <ArrowUpRight className="w-3.5 h-3.5 columbus-arrow-icon" />
            </div>
          </button>
        </div>

        {/* 3 Animated Number Counters */}
        <div ref={metricsGridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10 pt-1">
          {/* Counter 1 */}
          <div className="pt-4 sm:pt-0 sm:px-4 first:pl-0">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                +{ticketCount}
              </span>
              <span className="text-sm font-bold text-sky-400">Cities</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Global curated destinations with 0ms instant discovery and real-time transit wayfinding.
            </p>
          </div>

          {/* Counter 2 */}
          <div className="pt-4 sm:pt-0 sm:px-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {satisfactionRate}%
              </span>
              <span className="text-sm font-bold text-emerald-400">Match</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Bespoke travel vibe alignment tailored to your {trip.companion || 'group'} preference.
            </p>
          </div>

          {/* Counter 3 */}
          <div className="pt-4 sm:pt-0 sm:px-4 last:pr-0">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {convertedTotalEstimate}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Transparent cost blueprint across boutique lodging, gourmet dining, and daily activities.
            </p>
          </div>
        </div>

        {/* Interactive Quick Action Bar with Rotating Plus Icons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Fast Jump:
            </span>
            <button
              type="button"
              onClick={onOpenCalendar}
              className="group px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-sky-300" />
              <span>Visual Calendar</span>
              <div className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center columbus-plus-btn">
                <Plus className="w-3 h-3" />
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenMap}
              className="group px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>Interactive Map</span>
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center columbus-plus-btn">
                <Plus className="w-3 h-3" />
              </div>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Seamless Business &amp; Leisure Architecture
          </span>
        </div>
      </div>
    </div>
  );
}
