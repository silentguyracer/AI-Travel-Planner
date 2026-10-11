'use client';

import React from 'react';
import { SAMPLE_TRIPS } from '@/lib/sampleTrips';
import { TripPlan } from '@/types/travel';
import { X, Sparkles, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface SampleTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (trip: TripPlan) => void;
}

export default function SampleTripsModal({
  isOpen,
  onClose,
  onSelectSample,
}: SampleTripsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Curated Sample Itineraries</h3>
              <p className="text-xs text-slate-400">
                Explore complete travel plans ready to browse and save
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {SAMPLE_TRIPS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="bg-slate-50 hover:bg-indigo-50/50 rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  {sample.country}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {sample.duration} Days
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {sample.budget} Tier
                  </span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>{sample.destination}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </h4>

              <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {sample.summary}
              </p>

              {/* Highlights tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sample.highlights.slice(0, 3).map((h, hIdx) => (
                  <span
                    key={hIdx}
                    className="text-[11px] bg-white text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200/70 font-medium"
                  >
                    • {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
