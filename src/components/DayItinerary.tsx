'use client';

import React, { useState } from 'react';
import { ItineraryDay, ItineraryActivity } from '@/types/travel';
import {
  Clock,
  MapPin,
  Utensils,
  Lightbulb,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Compass,
  Calendar
} from 'lucide-react';

interface DayItineraryProps {
  itinerary: ItineraryDay[];
  onSelectActivityLocation?: (coords: { lat: number; lng: number; title: string }) => void;
}

export default function DayItinerary({ itinerary, onSelectActivityLocation }: DayItineraryProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);

  const activeDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  const getTimeSlotColor = (slot: ItineraryActivity['timeSlot']) => {
    switch (slot) {
      case 'Morning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Afternoon':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Evening':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Navigation Pills */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {itinerary.map((day) => {
            const isSelected = selectedDay === day.day && !expandedAll;
            return (
              <button
                key={day.day}
                onClick={() => {
                  setSelectedDay(day.day);
                  setExpandedAll(false);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day {day.day}</span>
              </button>
            );
          })}

          <button
            onClick={() => setExpandedAll(!expandedAll)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 border ${
              expandedAll
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {expandedAll ? 'Show Single Day' : 'View All Days'}
          </button>
        </div>
      </div>

      {/* Render Days */}
      <div className="space-y-8">
        {(expandedAll ? itinerary : [activeDayData]).map((day) => (
          <div
            key={day.day}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden"
          >
            {/* Day Header Banner */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Day {day.day} Program
                </span>
                <span className="text-xs font-semibold text-slate-500 italic">
                  Theme: {day.theme}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                {day.title}
              </h3>
            </div>

            {/* Timeline Activities */}
            <div className="relative border-l-2 border-indigo-100 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-8">
              {day.schedule.map((activity, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline node icon */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <span className="text-[10px] sm:text-xs font-bold">{idx + 1}</span>
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 hover:border-indigo-200 transition-all hover:shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTimeSlotColor(
                            activity.timeSlot
                          )}`}
                        >
                          {activity.timeSlot}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activity.time}</span>
                        </div>
                      </div>

                      {activity.cost && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <DollarSign className="w-3 h-3" />
                          <span>{activity.cost}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {activity.activity}
                    </h4>

                    {activity.locationName && (
                      <div className="flex items-center justify-between mt-1 text-xs text-indigo-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{activity.locationName}</span>
                        </div>
                        {activity.coordinates && onSelectActivityLocation && (
                          <button
                            type="button"
                            onClick={() =>
                              onSelectActivityLocation({
                                lat: activity.coordinates!.lat,
                                lng: activity.coordinates!.lng,
                                title: activity.locationName,
                              })
                            }
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 underline font-semibold flex items-center gap-1"
                          >
                            <Compass className="w-3 h-3" />
                            <span>Locate on Map</span>
                          </button>
                        )}
                      </div>
                    )}

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {activity.description}
                    </p>

                    {activity.tip && (
                      <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Insider Tip:</span> {activity.tip}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Dining Spotlight */}
            <div className="mt-8 pt-6 border-t border-slate-100 bg-gradient-to-r from-rose-50/50 to-orange-50/50 rounded-2xl p-5 border border-rose-100/70">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                <Utensils className="w-4 h-4 text-rose-500" />
                <span>Recommended Dining for Day {day.day}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs">
                  <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] block mb-1">
                    Midday Lunch Recommendation
                  </span>
                  <p className="leading-snug">{day.diningRecommendation.lunch}</p>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-rose-100 shadow-2xs">
                  <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] block mb-1">
                    Evening Dinner Recommendation
                  </span>
                  <p className="leading-snug">{day.diningRecommendation.dinner}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
