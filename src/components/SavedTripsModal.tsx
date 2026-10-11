'use client';

import React from 'react';
import { TripPlan } from '@/types/travel';
import { deleteSavedTrip, exportTripToJson } from '@/lib/storage';
import { Bookmark, Calendar, DollarSign, Trash2, Download, ExternalLink, X, Compass, Share2 } from 'lucide-react';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: TripPlan[];
  onSelectTrip: (trip: TripPlan) => void;
  onRefreshList: () => void;
}

export default function SavedTripsModal({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onRefreshList,
}: SavedTripsModalProps) {
  if (!isOpen) return null;

  const handleDelete = (id: string, destination: string) => {
    if (window.confirm(`Are you sure you want to remove your saved trip to ${destination}?`)) {
      deleteSavedTrip(id);
      onRefreshList();
    }
  };

  const handleShare = (trip: TripPlan) => {
    const text = `Check out my ${trip.duration}-day travel plan for ${trip.destination} (${trip.budget} budget)! Generated with WanderAI AI Travel Planner.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Trip summary copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">My Saved Trips</h3>
              <p className="text-xs text-slate-400">
                {savedTrips.length} {savedTrips.length === 1 ? 'itinerary' : 'itineraries'} stored locally
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

        {/* List of Saved Trips */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No Saved Trips Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Plan a new itinerary and click &quot;Save Trip&quot; to bookmark your favorite travel plans for later viewing anytime.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-slate-50 hover:bg-indigo-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {trip.country || 'Global'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Saved {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {trip.destination}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {trip.duration} Days
                    </span>
                    <span className="flex items-center gap-1 capitalize font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {trip.budget} Tier
                    </span>
                    <span className="text-slate-400">
                      • {trip.placesToVisit?.length || 0} sights
                    </span>
                    <span className="text-slate-400">
                      • {trip.restaurants?.length || 0} dining
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Plan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => exportTripToJson(trip)}
                    title="Export JSON"
                    className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleShare(trip)}
                    title="Share Summary"
                    className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(trip.id, trip.destination)}
                    title="Delete Saved Trip"
                    className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Trips are stored in your device&apos;s localStorage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
