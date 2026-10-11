'use client';

import React, { useState } from 'react';
import { ItineraryDay, ItineraryActivity } from '@/types/travel';
import { optimizeDayActivities, OptimizationResult } from '@/lib/routeOptimizer';
import { Route, Sparkles, ArrowRight, CheckCircle2, Clock, MapPin, X, ArrowDown } from 'lucide-react';

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: ItineraryDay;
  onApplyOptimization: (dayNum: number, optimizedActivities: ItineraryActivity[]) => void;
}

export default function RouteOptimizerModal({
  isOpen,
  onClose,
  day,
  onApplyOptimization,
}: RouteOptimizerModalProps) {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunOptimization = () => {
    const res = optimizeDayActivities(day.schedule);
    setResult(res);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyOptimization(day.day, result.optimizedOrder);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">AI Route Distance Optimizer</h3>
              <p className="text-xs text-slate-400">Day {day.day}: {day.title}</p>
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
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our AI geospatial engine analyzes the coordinates of all scheduled stops for Day {day.day} using a Traveling Salesperson (TSP) heuristic to find the most efficient path, eliminating unnecessary backtracking and transit delays.
          </p>

          {!result ? (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Route className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {day.schedule.length} Stops Scheduled for Day {day.day}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ready to calculate the shortest transit path between morning, afternoon, and evening stops.
                </p>
              </div>
              <button
                onClick={handleRunOptimization}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Calculate Optimal Path</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              {/* Savings Highlights Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200/80 grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                    Walking Distance Saved
                  </span>
                  <span className="text-xl font-extrabold text-emerald-800">
                    {result.savedDistanceKm > 0 ? `-${result.savedDistanceKm} km` : 'Already Optimal'}
                  </span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 shadow-2xs">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                    Estimated Transit Saved
                  </span>
                  <span className="text-xl font-extrabold text-emerald-800">
                    {result.savedMinutesEstimate > 0 ? `~${result.savedMinutesEstimate} mins` : 'Optimal Flow'}
                  </span>
                </div>
              </div>

              {/* Step Sequence Visualization */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Optimized Chronological Sequence:
                </h4>
                <div className="space-y-2">
                  {result.optimizedOrder.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{act.activity}</p>
                          <span className="text-[10px] text-slate-400">
                            {act.timeSlot} • {act.time} • {act.locationName}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Stop #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
          {result && (
            <button
              onClick={handleApply}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied to Itinerary!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Apply Optimized Route</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
