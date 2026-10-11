'use client';

import React, { useState } from 'react';
import { RestaurantRecommendation } from '@/types/travel';
import { Utensils, Star, ExternalLink, Compass, MapPin, Sparkles, Heart, Flame, DollarSign, CalendarCheck, Camera } from 'lucide-react';
import ActivityPhoto from './ActivityPhoto';

interface RestaurantsListProps {
  restaurants: RestaurantRecommendation[];
  destinationName: string;
  onSelectRestaurant?: (coords: { lat: number; lng: number; title: string }) => void;
}

export default function RestaurantsList({
  restaurants,
  destinationName,
  onSelectRestaurant,
}: RestaurantsListProps) {
  const [filterCuisine, setFilterCuisine] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const cuisines = ['all', ...Array.from(new Set(restaurants.map((r) => r.cuisine).filter(Boolean)))];

  const filtered = filterCuisine === 'all'
    ? restaurants
    : restaurants.filter((r) => r.cuisine === filterCuisine);

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Header & Cuisine Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Curated Dining & Foodie Gems</span>
            <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
              {restaurants.length} spots
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Hand-picked authentic dining, local street eats, and memorable culinary experiences in {destinationName}
          </p>
        </div>

        {/* Cuisine Filter Pills */}
        {cuisines.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCuisine(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  filterCuisine === c
                    ? 'bg-rose-600 text-white shadow-xs scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Restaurants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((rest, idx) => {
          const isFav = !!favorites[rest.name];
          return (
            <div
              key={idx}
              style={{ animationDelay: `${Math.min(idx * 75, 450)}ms` }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm card-hover-lift hover:border-rose-300 transition-all flex flex-col justify-between group animate-slide-up-fade relative overflow-hidden"
            >
              <div>
                {/* Real Restaurant / Food Photo */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 relative">
                  <ActivityPhoto
                    locationName={rest.name}
                    activityName={`${rest.name} ${rest.cuisine || ''} dining`}
                    destination={destinationName}
                    category="food"
                    coordinates={rest.coordinates}
                    className="w-full h-full"
                  />
                </div>

                {/* Cuisine, Price, Rating & Favorite */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-rose-500" />
                    <span>{rest.cuisine}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {rest.priceTier}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{rest.rating}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(rest.name)}
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
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                  <span>{rest.name}</span>
                  <Flame className="w-3.5 h-3.5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {rest.description}
                </p>

                {/* Vibe and Logistics Pill Strip */}
                {(rest.vibe || rest.averageMealCost) && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                    {rest.vibe && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70 font-semibold text-[11px]">
                        ✨ {rest.vibe}
                      </span>
                    )}
                    {rest.averageMealCost && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-semibold text-[11px] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>{rest.averageMealCost}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Address */}
                {rest.address && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{rest.address}</span>
                  </div>
                )}

                {/* Reservation Intel */}
                {rest.reservationAdvice && (
                  <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 flex items-center gap-2">
                    <CalendarCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Reservations:</strong> {rest.reservationAdvice}
                    </span>
                  </div>
                )}

                {/* Signature Specialty */}
                {rest.signatureSpecialty && (
                  <div className="mt-2 text-xs text-amber-900 bg-amber-50/70 border border-amber-200/70 px-2.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      <strong>Signature:</strong> {rest.signatureSpecialty}
                    </span>
                  </div>
                )}

                {/* Must-Try Dishes */}
                {rest.mustTryDishes && rest.mustTryDishes.length > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-rose-50/70 to-orange-50/50 rounded-2xl border border-rose-100 text-xs">
                    <span className="font-bold text-rose-800 flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Must-Try Dishes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rest.mustTryDishes.map((dish, dIdx) => (
                        <span
                          key={dIdx}
                          className="bg-white/95 text-slate-800 px-2 py-0.5 rounded-md border border-rose-100/70 font-medium text-[11px] hover:scale-105 transition-transform"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {onSelectRestaurant && (
                  <button
                    type="button"
                    onClick={() =>
                      onSelectRestaurant({
                        lat: rest.coordinates.lat,
                        lng: rest.coordinates.lng,
                        title: rest.name,
                      })
                    }
                    className="font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Show on Map</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${rest.name} ${rest.cuisine || ''} ${destinationName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Search food photos on Google Images"
                  >
                    <Camera className="w-3 h-3 text-rose-600" />
                    <span>Food Photos</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${rest.name} ${rest.address || destinationName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-all"
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
