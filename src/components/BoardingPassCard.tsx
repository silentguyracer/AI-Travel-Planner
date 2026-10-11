'use client';

import React from 'react';
import { TripPlan } from '@/types/travel';
import { Plane, Calendar, QrCode, Sparkles, MapPin, Printer, ShieldCheck } from 'lucide-react';

interface BoardingPassCardProps {
  trip: TripPlan;
}

export default function BoardingPassCard({ trip }: BoardingPassCardProps) {
  const flightCode = `WN-${trip.destination.slice(0, 3).toUpperCase()}${trip.duration}`;
  const seatClass =
    trip.budget === 'luxury'
      ? 'FIRST CLASS'
      : trip.budget === 'moderate'
      ? 'PREMIUM TRAVELER'
      : 'STANDARD EXPLORER';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Digital Travel Credential
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Trip Boarding Pass & Itinerary Card
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            A printable summary pass for your upcoming journey to {trip.destination}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Pass</span>
        </button>
      </div>

      {/* Styled Aviation Boarding Pass Card */}
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl overflow-hidden border border-slate-700/80 flex flex-col md:flex-row relative">
        {/* Notch indicators simulating real physical boarding pass perforation */}
        <div className="hidden md:block absolute -top-3 right-56 w-6 h-6 bg-white rounded-full border border-slate-300 z-10" />
        <div className="hidden md:block absolute -bottom-3 right-56 w-6 h-6 bg-white rounded-full border border-slate-300 z-10" />

        {/* Left Primary Section */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <span className="font-black text-sm tracking-wider uppercase">WANDERAI PASS</span>
            </div>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {seatClass}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Destination</span>
              <p className="text-lg font-black text-white">{trip.destination}</p>
              <span className="text-[11px] text-slate-300">{trip.country}</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Duration</span>
              <p className="text-lg font-black text-white">{trip.duration} Days</p>
              <span className="text-[11px] text-slate-300 capitalize">{trip.budget} Tier</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Companion</span>
              <p className="text-lg font-black text-white capitalize">{trip.companion || 'Solo'}</p>
              <span className="text-[11px] text-slate-300">Travel Party</span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Pass Code</span>
              <p className="text-lg font-mono font-black text-indigo-300">{flightCode}</p>
              <span className="text-[11px] text-emerald-400 font-semibold">CONFIRMED</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
              Top Highlights
            </span>
            <p className="text-xs text-slate-300 line-clamp-2">
              {trip.highlights.slice(0, 3).join(' • ')}
            </p>
          </div>
        </div>

        {/* Right Stub Section */}
        <div className="bg-indigo-950/80 p-6 md:w-56 border-t md:border-t-0 md:border-l border-dashed border-white/20 flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">GATE PASS</span>
            <h4 className="font-black text-base text-white">{trip.destination}</h4>
            <span className="text-[11px] text-indigo-300 font-mono">{flightCode}</span>
          </div>

          {/* QR Code Illustration */}
          <div className="bg-white p-2.5 rounded-xl shadow-md">
            <QrCode className="w-20 h-20 text-slate-900" />
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            <span>VALID FOR TRAVEL</span>
            <span className="block text-slate-500">WanderAI Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
