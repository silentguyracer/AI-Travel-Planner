'use client';

import React, { useState } from 'react';
import { PlaceToVisit } from '@/types/travel';
import { Star, MapPin, ExternalLink, Compass, Clock, Tag } from 'lucide-react';

interface PlacesListProps {
  places: PlaceToVisit[];
  destinationName: string;
  onSelectPlace?: (coords: { lat: number; lng: number; title: string }) => void;
}

export default function PlacesList({ places, destinationName, onSelectPlace }: PlacesListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(places.map((p) => p.category)))];

  const filtered = filterCategory === 'all'
    ? places
    : places.filter((p) => p.category === filterCategory);

  const getCategoryBadgeClass = (cat: PlaceToVisit['category']) => {
    switch (cat) {
      case 'museum':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'nature':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'landmark':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shopping':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'historical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Top Places & Attractions ({places.length})
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Curated sightseeing spots, cultural landmarks, and hidden gems in {destinationName}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((place, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Category, Rating, Price */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                    place.category
                  )}`}
                >
                  {place.category}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    {place.price}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {place.name}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {place.description}
              </p>

              {/* Best Time to Visit */}
              {place.bestTimeToVisit && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>
                    <strong className="text-slate-700">Best Time:</strong> {place.bestTimeToVisit}
                  </span>
                </div>
              )}

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {place.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              {onSelectPlace && (
                <button
                  type="button"
                  onClick={() =>
                    onSelectPlace({
                      lat: place.coordinates.lat,
                      lng: place.coordinates.lng,
                      title: place.name,
                    })
                  }
                  className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Show on Map</span>
                </button>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${place.name} ${place.address || destinationName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors ml-auto"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
