'use client';

import React from 'react';
import { RestaurantRecommendation } from '@/types/travel';
import { Utensils, Star, ExternalLink, Compass, MapPin, Sparkles } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>Curated Dining & Foodie Gems</span>
          <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
            {restaurants.length} spots
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Hand-picked authentic dining, local street eats, and memorable culinary experiences in {destinationName}
        </p>
      </div>

      {/* Grid of Restaurants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {restaurants.map((rest, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Cuisine, Price, Rating */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Utensils className="w-3 h-3 text-rose-500" />
                  <span>{rest.cuisine}</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    {rest.priceTier}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rest.rating}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {rest.name}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {rest.description}
              </p>

              {/* Address */}
              {rest.address && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{rest.address}</span>
                </div>
              )}

              {/* Must-Try Dishes */}
              {rest.mustTryDishes && rest.mustTryDishes.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-rose-50/60 to-orange-50/40 rounded-2xl border border-rose-100 text-xs">
                  <span className="font-bold text-rose-800 flex items-center gap-1 mb-1.5">
                    <Sparkles className="w-3 h-3 text-rose-600" /> Must-Try Dishes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rest.mustTryDishes.map((dish, dIdx) => (
                      <span
                        key={dIdx}
                        className="bg-white/90 text-slate-800 px-2 py-0.5 rounded-md border border-rose-100/70 font-medium text-[11px]"
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
                  className="font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Show on Map</span>
                </button>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${rest.name} ${rest.address || destinationName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors ml-auto"
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
