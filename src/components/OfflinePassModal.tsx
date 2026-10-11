'use client';

import React from 'react';
import { TripPlan } from '@/types/travel';
import {
  Printer,
  X,
  MapPin
} from 'lucide-react';

interface OfflinePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripPlan;
}

export default function OfflinePassModal({
  isOpen,
  onClose,
  trip,
}: OfflinePassModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Controls Header */}
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/30">
              Offline Pocket Booklet & PDF Mode
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Optimized for offline reading & paper printing
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Booklet Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-slate-900">
          {/* 1. Header Banner */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
                WANDERAI OFFLINE TRAVEL COMPANION
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                {trip.destination}
              </h1>
              <div className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {trip.country} • {trip.duration} Days • {trip.budget.toUpperCase()} Tier
              </div>
            </div>

            <div className="text-right sm:text-right text-xs text-slate-400 space-y-0.5">
              <div>Trip ID: <span className="font-mono font-bold text-slate-700">{trip.id}</span></div>
              <div>Generated: {new Date(trip.createdAt).toLocaleDateString()}</div>
              <div>Offline Emergency Protocol Included</div>
            </div>
          </div>

          {/* 2. Taxi Card in Big Legible Font */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border-2 border-slate-900 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              🚕 Taxi & Transit Card (Show to Driver)
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {trip.destination} Center
            </div>
            <div className="text-xs text-slate-600 font-medium">
              GPS Coordinates: {trip.centerCoordinates.lat.toFixed(5)}, {trip.centerCoordinates.lng.toFixed(5)}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              &ldquo;Please take me to the central plaza / hotel area in {trip.destination}. Thank you!&rdquo;
            </p>
          </div>

          {/* 3. Emergency Hotlines Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 block">Police</span>
              <span className="text-base font-black text-slate-900 font-mono">110 / 112 / 911</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 block">Medical</span>
              <span className="text-base font-black text-slate-900 font-mono">119 / 112 / 911</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 block">Universal GSM</span>
              <span className="text-base font-black text-slate-900 font-mono">112</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 block">Tap Water</span>
              <span className="text-sm font-bold text-emerald-700">Safe to Drink</span>
            </div>
          </div>

          {/* 4. Day-by-Day Condensed Timeline */}
          <div className="space-y-6">
            <div className="text-sm font-black uppercase tracking-wider border-b border-slate-300 pb-2 text-slate-900">
              Complete Itinerary Timetable
            </div>

            <div className="space-y-6">
              {trip.itinerary.map((day) => (
                <div key={day.day} className="space-y-3 break-inside-avoid">
                  <div className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Day {day.day}: {day.title}
                    </h3>
                    <span className="text-xs text-indigo-700 font-semibold">{day.theme}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {day.schedule.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                          <span>{act.timeSlot}</span>
                          <span>{act.time}</span>
                        </div>
                        <div className="font-bold text-slate-900 leading-snug">{act.activity}</div>
                        {act.locationName && (
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                            <span className="truncate">{act.locationName}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {day.diningRecommendation && (
                    <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 flex flex-wrap gap-4">
                      <span><strong>Lunch:</strong> {day.diningRecommendation.lunch}</span>
                      <span><strong>Dinner:</strong> {day.diningRecommendation.dinner}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Essential Packing & Local Etiquette */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 break-inside-avoid text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Luggage Checklist
              </span>
              <ul className="space-y-1 text-slate-700">
                {trip.practicalTips.packing?.slice(0, 4).map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border border-slate-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Local Etiquette Guidelines
              </span>
              <ul className="space-y-1 text-slate-700">
                {trip.practicalTips.localEtiquette?.slice(0, 3).map((e, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
