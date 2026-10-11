'use client';

import React from 'react';
import { Leaf, Award, Compass, Trees, Recycle, Sparkles } from 'lucide-react';
import { BudgetTier } from '@/types/travel';

interface CarbonFootprintProps {
  destination: string;
  duration: number;
  budget: BudgetTier;
}

export default function CarbonFootprint({
  destination,
  duration,
  budget,
}: CarbonFootprintProps) {
  // Approximate emissions calculation:
  // Baseline flight/transit: ~320 kg CO2 per person round trip
  // Accommodation & local transit: ~28 kg CO2 per day
  const transitCo2 = 320;
  const dailyCo2 = budget === 'luxury' ? 42 : budget === 'economy' ? 18 : 26;
  const totalCo2Kg = Math.round(transitCo2 + duration * dailyCo2);
  const treesNeeded = Math.max(1, Math.round(totalCo2Kg / 22)); // 1 tree absorbs ~22kg CO2/year

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Eco-Travel Intelligence
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Trip Carbon Footprint & Green Advice
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Estimated environmental impact and sustainability recommendations for {destination}
          </p>
        </div>

        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-200" />
          <div>
            <span className="text-[10px] text-emerald-200 font-bold block">Estimated Footprint</span>
            <span className="text-lg font-black">{totalCo2Kg} kg CO₂</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase">
            <Trees className="w-4 h-4" />
            <span>Offset Equivalent</span>
          </div>
          <p className="text-2xl font-black text-emerald-950">{treesNeeded} Trees</p>
          <p className="text-[11px] text-emerald-700">Annual carbon absorption equivalent</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Green Rating</span>
          </div>
          <p className="text-2xl font-black text-slate-900">Eco-Conscious</p>
          <p className="text-[11px] text-slate-500">Public transit itineraries minimize urban footprint</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase">
            <Recycle className="w-4 h-4 text-sky-500" />
            <span>Daily Average</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{dailyCo2} kg / day</p>
          <p className="text-[11px] text-slate-500">Includes lodging & local food footprint</p>
        </div>
      </div>

      {/* Actionable Green Tips */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          How to Travel More Sustainably in {destination}:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <span className="text-base">🚆</span>
            <div>
              <strong className="text-slate-900 block mb-0.5">Use Electric Rail & Metro</strong>
              <span>
                Trains generate up to 80% fewer emissions than taxis or domestic short-haul flights.
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <span className="text-base">🥗</span>
            <div>
              <strong className="text-slate-900 block mb-0.5">Eat at Local Farmer-Sourced Bistros</strong>
              <span>
                Dining at authentic regional eateries cuts food-mile transport pollution and supports local growers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
