'use client';

import React, { useState } from 'react';
import { ItineraryDay, ItineraryActivity } from '@/types/travel';
import {
  Clock,
  MapPin,
  Utensils,
  Lightbulb,
  DollarSign,
  Compass,
  Calendar,
  Plus,
  Trash2,
  X,
  Check
} from 'lucide-react';

interface DayItineraryProps {
  itinerary: ItineraryDay[];
  onSelectActivityLocation?: (coords: { lat: number; lng: number; title: string }) => void;
  onUpdateItinerary?: (updated: ItineraryDay[]) => void;
}

export default function DayItinerary({
  itinerary,
  onSelectActivityLocation,
  onUpdateItinerary,
}: DayItineraryProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);

  // New activity form modal state
  const [isAddingActivityForDay, setIsAddingActivityForDay] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newSlot, setNewSlot] = useState<ItineraryActivity['timeSlot']>('Morning');
  const [newCost, setNewCost] = useState('Free');
  const [newDesc, setNewDesc] = useState('');

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

  const handleDeleteActivity = (dayNum: number, activityIdx: number) => {
    if (!onUpdateItinerary) return;
    const updated = itinerary.map((d) => {
      if (d.day === dayNum) {
        return {
          ...d,
          schedule: d.schedule.filter((_, idx) => idx !== activityIdx),
        };
      }
      return d;
    });
    onUpdateItinerary(updated);
  };

  const handleSaveNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingActivityForDay || !newTitle.trim() || !onUpdateItinerary) return;

    const newActivity: ItineraryActivity = {
      timeSlot: newSlot,
      time: newTime,
      activity: newTitle.trim(),
      locationName: newLocation.trim() || newTitle.trim(),
      description: newDesc.trim() || 'Custom planned activity.',
      cost: newCost.trim() || 'Free',
      tip: 'Custom traveler scheduled stop.',
    };

    const updated = itinerary.map((d) => {
      if (d.day === isAddingActivityForDay) {
        return {
          ...d,
          schedule: [...d.schedule, newActivity],
        };
      }
      return d;
    });

    onUpdateItinerary(updated);
    setIsAddingActivityForDay(null);
    setNewTitle('');
    setNewLocation('');
    setNewDesc('');
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
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
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
            <div className="border-b border-slate-100 pb-5 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
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

              {onUpdateItinerary && (
                <button
                  onClick={() => setIsAddingActivityForDay(day.day)}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              )}
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

                      <div className="flex items-center gap-2">
                        {activity.cost && (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <DollarSign className="w-3 h-3" />
                            <span>{activity.cost}</span>
                          </div>
                        )}
                        {onUpdateItinerary && (
                          <button
                            onClick={() => handleDeleteActivity(day.day, idx)}
                            title="Remove this stop"
                            className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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

      {/* Inline Modal to Add New Activity */}
      {isAddingActivityForDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900">
                Add Activity to Day {isAddingActivityForDay}
              </h4>
              <button
                onClick={() => setIsAddingActivityForDay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset drinks at rooftop bar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value as ItineraryActivity['timeSlot'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Terrace"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $15 or Free"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes about reservations, dress code, etc."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingActivityForDay(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
