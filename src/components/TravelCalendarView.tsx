'use client';

import React, { useState, useMemo } from 'react';
import { TripPlan, ItineraryDay, ItineraryActivity } from '@/types/travel';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  ExternalLink,
  Download,
  Share2,
  CalendarPlus,
  Check,
  Sun,
  Utensils,
  Compass,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { downloadCalendarICS, generateGoogleCalendarUrl } from '@/lib/calendarExport';

interface TravelCalendarViewProps {
  trip: TripPlan;
}

type CalendarMode = 'month' | 'timeline' | 'agenda';
type ActivityCategory = 'all' | 'culture' | 'food' | 'nature' | 'nightlife';

export default function TravelCalendarView({ trip }: TravelCalendarViewProps) {
  // Default departure date: user-selected trip.startDate or upcoming Monday
  const defaultStartDate = useMemo(() => {
    if (trip.startDate) return trip.startDate;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    d.setDate(d.getDate() + (daysUntilNextMonday === 0 ? 7 : daysUntilNextMonday));
    return d.toISOString().split('T')[0];
  }, [trip.startDate]);

  const [startDateStr, setStartDateStr] = useState<string>(defaultStartDate);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('timeline');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Month navigation for Month View
  const [monthOffset, setMonthOffset] = useState<number>(0);

  const parsedStartDate = useMemo(() => {
    const [y, m, d] = startDateStr.split('-').map(Number);
    return new Date(y, m - 1, d, 9, 0, 0);
  }, [startDateStr]);

  // Compute real dates for each itinerary day
  const itineraryWithDates = useMemo(() => {
    return trip.itinerary.map((day, idx) => {
      const date = new Date(parsedStartDate);
      date.setDate(parsedStartDate.getDate() + idx);
      return {
        ...day,
        dateObj: date,
        dateFormatted: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        fullDateFormatted: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    });
  }, [trip.itinerary, parsedStartDate]);

  // Selected Day
  const activeDay = itineraryWithDates[selectedDayIndex] || itineraryWithDates[0];

  // Days until trip starts
  const daysUntilTrip = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(parsedStartDate);
    start.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [parsedStartDate]);

  // Quick shift helpers
  const handleShiftDate = (days: number) => {
    const next = new Date(parsedStartDate);
    next.setDate(next.getDate() + days);
    setStartDateStr(next.toISOString().split('T')[0]);
  };

  // Month view generation
  const activeCalendarMonth = useMemo(() => {
    const base = new Date(parsedStartDate);
    base.setMonth(base.getMonth() + monthOffset);
    const year = base.getFullYear();
    const month = base.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Build day cells
    const cells: Array<{
      dayNum: number;
      dateStr: string;
      isTripDay: boolean;
      tripDayIndex: number;
      dayData?: (typeof itineraryWithDates)[0];
    }> = [];

    // Empty leading padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ dayNum: 0, dateStr: '', isTripDay: false, tripDayIndex: -1 });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const tripMatchIdx = itineraryWithDates.findIndex(
        (itDay) =>
          itDay.dateObj.getFullYear() === cellDate.getFullYear() &&
          itDay.dateObj.getMonth() === cellDate.getMonth() &&
          itDay.dateObj.getDate() === cellDate.getDate()
      );

      cells.push({
        dayNum: d,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isTripDay: tripMatchIdx !== -1,
        tripDayIndex: tripMatchIdx,
        dayData: tripMatchIdx !== -1 ? itineraryWithDates[tripMatchIdx] : undefined,
      });
    }

    return { monthName, cells };
  }, [parsedStartDate, monthOffset, itineraryWithDates]);

  // Categorize activities helper
  const getActivityCategory = (activity: ItineraryActivity): ActivityCategory => {
    const text = `${activity.activity} ${activity.description} ${activity.locationName}`.toLowerCase();
    if (text.includes('eat') || text.includes('food') || text.includes('dine') || text.includes('lunch') || text.includes('dinner') || text.includes('breakfast') || text.includes('ramen') || text.includes('cafe')) {
      return 'food';
    }
    if (text.includes('park') || text.includes('mountain') || text.includes('beach') || text.includes('garden') || text.includes('nature') || text.includes('lake') || text.includes('hike')) {
      return 'nature';
    }
    if (text.includes('bar') || text.includes('pub') || text.includes('club') || text.includes('night') || text.includes('lounge') || text.includes('cocktail')) {
      return 'nightlife';
    }
    return 'culture';
  };

  const getCategoryColor = (cat: ActivityCategory) => {
    switch (cat) {
      case 'food':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'nature':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'nightlife':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  // Google Calendar URL for an activity
  const makeGoogleActivityUrl = (activity: ItineraryActivity, date: Date) => {
    // Estimate hour
    let startHour = 9;
    if (activity.timeSlot === 'Afternoon') startHour = 14;
    if (activity.timeSlot === 'Evening') startHour = 19;
    if (activity.timeSlot === 'Night') startHour = 21;

    const timeMatch = activity.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const isPM = timeMatch[3].toUpperCase() === 'PM';
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      startHour = h;
    }

    const eventDate = new Date(date);
    eventDate.setHours(startHour, 0, 0, 0);

    return generateGoogleCalendarUrl({
      title: `${trip.destination}: ${activity.activity}`,
      details: `${activity.description}\n\nCost: ${activity.cost}\nInsider Tip: ${activity.tip}`,
      location: `${activity.locationName}, ${trip.destination}`,
      startDate: eventDate,
      durationHours: 2,
    });
  };

  // Google Calendar URL for entire day
  const makeGoogleDayUrl = (day: (typeof itineraryWithDates)[0]) => {
    const summary = day.schedule.map((s) => `• [${s.timeSlot}] ${s.activity} (${s.locationName})`).join('\n');
    const dayStart = new Date(day.dateObj);
    dayStart.setHours(9, 0, 0, 0);

    return generateGoogleCalendarUrl({
      title: `[Day ${day.day}] ${trip.destination} - ${day.theme}`,
      details: `Full day schedule in ${trip.destination}:\n\n${summary}`,
      location: trip.destination,
      startDate: dayStart,
      durationHours: 12,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Control Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/20">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Visual Travel Schedule & Calendar
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {trip.destination} Itinerary Calendar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Map your {trip.duration}-day journey onto real calendar dates. Sync with Google, Apple, or Outlook with one click.
            </p>
          </div>

          {/* Quick Date Picker & Shift */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border-0 focus:ring-2 focus:ring-indigo-400 outline-none shadow-inner"
              />
            </div>

            <div className="flex sm:flex-col justify-between sm:justify-center gap-1.5 text-xs text-slate-200 pt-1 sm:pt-0">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">
                  {daysUntilTrip > 0
                    ? `Starts in ${daysUntilTrip} days`
                    : daysUntilTrip === 0
                    ? 'Departing Today!'
                    : 'Custom dates'}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleShiftDate(7)}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded text-[10px] font-bold transition-all"
                  title="Shift 1 week later"
                >
                  +1 Wk
                </button>
                <button
                  onClick={() => handleShiftDate(30)}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 rounded text-[10px] font-bold transition-all"
                  title="Shift 1 month later"
                >
                  +1 Mo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode & Export Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Segmented View Mode */}
          <div className="flex bg-black/30 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setCalendarMode('timeline')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                calendarMode === 'timeline'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Gantt</span>
            </button>
            <button
              onClick={() => setCalendarMode('month')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                calendarMode === 'month'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month Matrix</span>
            </button>
            <button
              onClick={() => setCalendarMode('agenda')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                calendarMode === 'agenda'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Master Agenda</span>
            </button>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCalendarICS(trip, parsedStartDate)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Download standard .ICS file for Apple Calendar, Outlook, and Google"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export .ICS</span>
            </button>

            <a
              href={makeGoogleDayUrl(itineraryWithDates[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Sync Google Calendar</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Month Matrix View */}
      {calendarMode === 'month' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {/* Month Header Nav */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                {activeCalendarMonth.monthName}
              </h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
                Trip Dates: {itineraryWithDates[0]?.dateFormatted} – {itineraryWithDates[itineraryWithDates.length - 1]?.dateFormatted}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMonthOffset(0)}
                className="px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Current
              </button>
              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {activeCalendarMonth.cells.map((cell, idx) => {
              if (cell.dayNum === 0) {
                return <div key={`empty-${idx}`} className="h-24 sm:h-28 rounded-2xl bg-slate-50/50" />;
              }

              const isSelected = cell.isTripDay && cell.tripDayIndex === selectedDayIndex;

              return (
                <div
                  key={`cell-${cell.dateStr}`}
                  onClick={() => {
                    if (cell.isTripDay) setSelectedDayIndex(cell.tripDayIndex);
                  }}
                  className={`h-24 sm:h-28 rounded-2xl p-2 sm:p-2.5 transition-all flex flex-col justify-between border ${
                    cell.isTripDay
                      ? isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-[1.02] cursor-pointer'
                        : 'bg-indigo-50/70 hover:bg-indigo-100/70 text-slate-900 border-indigo-200 cursor-pointer'
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        cell.isTripDay
                          ? isSelected
                            ? 'bg-white text-indigo-600'
                            : 'bg-indigo-600 text-white font-extrabold'
                          : 'text-slate-500'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {cell.isTripDay && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-indigo-700 text-white' : 'bg-indigo-200/80 text-indigo-800'
                        }`}
                      >
                        Day {cell.dayData?.day}
                      </span>
                    )}
                  </div>

                  {cell.isTripDay && cell.dayData && (
                    <div className="mt-1">
                      <p
                        className={`text-[11px] font-bold line-clamp-1 ${
                          isSelected ? 'text-indigo-100' : 'text-slate-800'
                        }`}
                      >
                        {cell.dayData.theme}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isSelected ? 'bg-indigo-800/80 text-white' : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {cell.dayData.schedule.length} stops
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Horizontal Day Selector Pill Row (Synced across views) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itineraryWithDates.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-xs font-black ${
                  isSelected ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-800'
                }`}
              >
                <span>D{day.day}</span>
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {day.dateFormatted}
                </p>
                <p
                  className={`text-[10px] font-medium truncate max-w-[120px] ${
                    isSelected ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  {day.theme}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Timeline View: Active Day Detailed Hourly Schedule */}
      {calendarMode === 'timeline' && activeDay && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Schedule Stream */}
          <div className="lg:col-span-2 space-y-4">
            {/* Day Header Banner */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    Day {activeDay.day} of {trip.duration}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeDay.fullDateFormatted}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {activeDay.theme}
                </h3>
              </div>

              {/* Day Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={makeGoogleDayUrl(activeDay)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-200"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Add Day to Google Cal</span>
                </a>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mr-1">
                Filter:
              </span>
              {(['all', 'culture', 'food', 'nature', 'nightlife'] as ActivityCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl capitalize transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Activities Stream */}
            <div className="space-y-4">
              {activeDay.schedule
                .filter((item) => {
                  if (categoryFilter === 'all') return true;
                  return getActivityCategory(item) === categoryFilter;
                })
                .map((item, actIdx) => {
                  const cat = getActivityCategory(item);
                  const googleCalUrl = makeGoogleActivityUrl(item, activeDay.dateObj);

                  return (
                    <div
                      key={actIdx}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Time Slot Badge */}
                          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex flex-col items-center justify-center shrink-0 w-16 text-center">
                            <Clock className="w-4 h-4 text-indigo-600 mb-1" />
                            <span className="leading-tight">{item.time}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.timeSlot}
                            </span>
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(
                                  cat
                                )}`}
                              >
                                {cat}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {item.locationName}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {item.activity}
                            </h4>

                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Tip & Cost */}
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                              {item.cost && (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <DollarSign className="w-3 h-3" />
                                  {item.cost}
                                </span>
                              )}
                              {item.tip && (
                                <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span>{item.tip}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Calendar Sync Shortcut */}
                        <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-start">
                          <a
                            href={googleCalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200"
                            title="Add this activity to Google Calendar"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Col: Day Smart Insights & Pacing */}
          <div className="space-y-4">
            {/* Pacing Radar Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 rounded-3xl p-6 border border-indigo-100 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Daily Pacing & Timing</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-indigo-100/60">
                  <span className="text-slate-600">Total Planned Stops</span>
                  <span className="font-bold text-slate-900">{activeDay.schedule.length} Activities</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-indigo-100/60">
                  <span className="text-slate-600">Estimated Duration</span>
                  <span className="font-bold text-slate-900">~8.5 Hours</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-indigo-100/60">
                  <span className="text-slate-600">Transit Buffer</span>
                  <span className="font-bold text-emerald-600">30–45 min between stops</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-600">Recommended Start</span>
                  <span className="font-bold text-indigo-600">09:00 AM Local Time</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-indigo-600/5 rounded-2xl border border-indigo-200 text-xs text-indigo-900">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Smart Scheduling Advice</span>
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Morning slots feature outdoor sight-seeing before peak tourist crowds arrive. Evening meals match authentic local dining hours in {trip.destination}.
                </p>
              </div>
            </div>

            {/* Quick Master Cal Export Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Calendar Integrations
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Export all {trip.duration} days of activities into your native mobile calendar. Events include GPS addresses, estimated costs, and insider tips.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => downloadCalendarICS(trip, parsedStartDate)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Download Apple / Outlook .ICS</span>
                </button>

                <a
                  href={makeGoogleDayUrl(activeDay)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-indigo-200"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Sync Active Day to Google Cal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Master Agenda View (Print / Table format) */}
      {calendarMode === 'agenda' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 overflow-x-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Master Chronological Travel Agenda
              </h3>
              <p className="text-xs text-slate-500">
                Complete trip itinerary matrix mapped against calendar dates
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Print Schedule
            </button>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Morning (09:00 - 12:00)</th>
                <th className="py-3 px-3">Afternoon (13:00 - 17:00)</th>
                <th className="py-3 px-3">Evening / Night</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itineraryWithDates.map((day) => {
                const morningAct = day.schedule.find((s) => s.timeSlot === 'Morning') || day.schedule[0];
                const afternoonAct = day.schedule.find((s) => s.timeSlot === 'Afternoon') || day.schedule[1];
                const eveningAct = day.schedule.find((s) => s.timeSlot === 'Evening' || s.timeSlot === 'Night') || day.schedule[2];

                return (
                  <tr key={day.day} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {day.dateFormatted}
                    </td>
                    <td className="py-3 px-3 font-semibold text-indigo-600">
                      Day {day.day}
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">{morningAct?.activity}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{morningAct?.locationName}</p>
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">{afternoonAct?.activity}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{afternoonAct?.locationName}</p>
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">{eveningAct?.activity}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{eveningAct?.locationName}</p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <a
                        href={makeGoogleDayUrl(day)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Google Cal</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
