'use client';

import React, { useState } from 'react';
import { PlaceToVisit } from '@/types/travel';
import { Star, MapPin, ExternalLink, Compass, Clock, Tag, Heart, Sparkles, Train, Lightbulb, Hourglass, Camera } from 'lucide-react';
import ActivityPhoto from './ActivityPhoto';

interface PlacesListProps {
  places: PlaceToVisit[];
  destinationName: string;
  onSelectPlace?: (coords: { lat: number; lng: number; title: string }) => void;
}

export default function PlacesList({ places, destinationName, onSelectPlace }: PlacesListProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Top Places & Attractions</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {places.length} curated
            </span>
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
                  ? 'bg-indigo-600 text-white shadow-xs scale-105'
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
        {filtered.map((place, idx) => {
          const isFav = !!favorites[place.name];
          return (
            <div
              key={idx}
              style={{ animationDelay: `${Math.min(idx * 75, 450)}ms` }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm card-hover-lift hover:border-indigo-300 transition-all flex flex-col justify-between group animate-slide-up-fade relative overflow-hidden"
            >
              <div>
                {/* Real Landmark Photo */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 relative">
                  <ActivityPhoto
                    locationName={place.name}
                    activityName={place.name}
                    destination={destinationName}
                    category="landmark"
                    coordinates={place.coordinates}
                    className="w-full h-full"
                  />
                </div>

                {/* Category, Rating, Price & Favorite button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                      place.category
                    )}`}
                  >
                    {place.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{place.rating}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {place.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(place.name)}
                      className={`p-1.5 rounded-full transition-all ${
                        isFav
                          ? 'text-rose-500 bg-rose-50 scale-110'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <span>{place.name}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {place.description}
                </p>

                {/* Detailed Travel Intel Strip */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {place.bestTimeToVisit && (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-800">Best Time:</strong> {place.bestTimeToVisit}
                        </span>
                      </div>
                    )}

                    {place.durationRecommended && (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Hourglass className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-800">Duration:</strong> {place.durationRecommended}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {place.openingHours && (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-800">Hours:</strong> {place.openingHours}
                        </span>
                      </div>
                    )}

                    {place.nearestTransit && (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Train className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-800">Transit:</strong> {place.nearestTransit}
                        </span>
                      </div>
                    )}
                  </div>

                  {place.insiderSecret && (
                    <div className="p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-amber-900 flex items-start gap-2 text-xs">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Insider Secret:</strong> {place.insiderSecret}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {place.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
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
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Show on Map</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${place.name} ${destinationName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Search Google Images"
                  >
                    <Camera className="w-3 h-3 text-blue-600" />
                    <span>Photos</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${place.address || destinationName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-all"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
