'use client';

import React from 'react';
import { Compass, Train, Clock, Plus, ExternalLink, Sparkles, Check } from 'lucide-react';
import { ItineraryDay } from '@/types/travel';

interface DayTripSuggesterProps {
  destination: string;
  onAddDayTrip: (newDay: ItineraryDay) => void;
  currentDayCount: number;
}

interface Excursion {
  title: string;
  distance: string;
  transitTime: string;
  highlights: string[];
  description: string;
  transportGuide: string;
}

const EXCURSIONS_DATABASE: Record<string, Excursion[]> = {
  tokyo: [
    {
      title: 'Mount Fuji & Lake Kawaguchiko',
      distance: '105 km west',
      transitTime: '1 hr 55 mins via JR Chuo Line / Fuji Excursion Express',
      highlights: ['Chureito Pagoda views', 'Kawaguchiko Ropeway', 'Hoto noodle lunch'],
      description: 'Iconic postcard views of snowy Mount Fuji reflecting in serene lake waters, surrounded by cedar forests and lakeside onsen.',
      transportGuide: 'Direct Limited Express from Shinjuku Station to Kawaguchiko Station.',
    },
    {
      title: 'Historic Kamakura & Coastal Enoshima',
      distance: '55 km south',
      transitTime: '55 mins via JR Yokosuka Line',
      highlights: ['Kotoku-in Giant Bronze Buddha', 'Hase-dera ocean temple', 'Retro Enoden coastal train'],
      description: 'Ancient samurai capital filled with tranquil Zen temples, towering bamboo groves, and Pacific ocean beaches.',
      transportGuide: 'Direct train from Tokyo or Shinjuku Station to Kamakura Station.',
    },
    {
      title: 'Nikko National Park & Toshogu Shrine',
      distance: '140 km north',
      transitTime: '1 hr 45 mins via Tobu Spacia Limited Express',
      highlights: ['Ornate gold Toshogu Shrine', 'Kegon Waterfall', 'Lake Chuzenji'],
      description: 'UNESCO World Heritage mountain sanctuary famous for intricately carved cedar shrines and dramatic waterfalls.',
      transportGuide: 'Tobu Railway express from Asakusa Station directly to Tobu-Nikko.',
    },
  ],
  paris: [
    {
      title: 'Palace of Versailles & Royal Gardens',
      distance: '20 km southwest',
      transitTime: '40 mins via RER C Train',
      highlights: ['Hall of Mirrors', 'Grand Trianon & Queen’s Hamlet', 'Musical Fountain show'],
      description: 'The opulent seat of French monarchy built by the Sun King Louis XIV, surrounded by 2,000 acres of manicured classical gardens.',
      transportGuide: 'RER C line from central Paris (Saint-Michel or Champ de Mars) to Versailles Château Rive Gauche.',
    },
    {
      title: 'Claude Monet’s Gardens at Giverny',
      distance: '75 km northwest',
      transitTime: '45 mins train + 15 mins shuttle',
      highlights: ['Japanese Green Bridge', 'Water lily pond', 'Monet’s pastel pink house'],
      description: 'Step directly into the living canvas that inspired Monet’s iconic Impressionist water lily masterpieces.',
      transportGuide: 'SNCF train from Paris Gare Saint-Lazare to Vernon, followed by quick shuttle bus.',
    },
    {
      title: 'Reims & Champagne Cellars',
      distance: '130 km northeast',
      transitTime: '45 mins via TGV InOui Bullet Train',
      highlights: ['Gothic Notre-Dame de Reims', 'Historic chalk cellars (Crayères)', 'Taittinger / Veuve Clicquot tastings'],
      description: 'Coronation cathedral of French kings paired with cellar tours through UNESCO-protected subterranean Champagne labyrinths.',
      transportGuide: 'High-speed TGV from Paris Gare de l’Est directly to Reims Central.',
    },
  ],
};

export default function DayTripSuggester({
  destination,
  onAddDayTrip,
  currentDayCount,
}: DayTripSuggesterProps) {
  const destLower = destination.toLowerCase();
  let key = 'tokyo';
  if (destLower.includes('paris') || destLower.includes('france')) {
    key = 'paris';
  }

  const excursions = EXCURSIONS_DATABASE[key] || [
    {
      title: `${destination} Coastal / Mountain Countryside`,
      distance: '45 - 75 km away',
      transitTime: '1 hour via regional express train or coach',
      highlights: ['Scenic viewpoints', 'Historic village center', 'Traditional regional lunch'],
      description: `Escape the urban bustle and experience charming village life, artisan farm-to-table cuisine, and scenic topography just outside ${destination}.`,
      transportGuide: `Direct regional rail or comfortable express coach service from ${destination} central station.`,
    },
    {
      title: `${destination} Heritage Castle & Lake Excursion`,
      distance: '60 km away',
      transitTime: '1 hr 15 mins via express transit',
      highlights: ['Ancient fortification', 'Lake boat cruise', 'Botanical grounds'],
      description: `A celebrated day excursion showcasing centuries-old architecture, panoramic landscapes, and tranquil walking trails.`,
      transportGuide: `Regular hourly departures from central transit hubs in ${destination}.`,
    },
  ];

  const handleAddExcursionToTrip = (exc: Excursion) => {
    const newDayNumber = currentDayCount + 1;
    const newDay: ItineraryDay = {
      day: newDayNumber,
      title: `Day ${newDayNumber} Excursion: ${exc.title}`,
      theme: 'Day Trip & Regional Heritage',
      schedule: [
        {
          timeSlot: 'Morning',
          time: '08:30 AM',
          activity: `Morning Transit & Arrival at ${exc.title}`,
          locationName: exc.title,
          description: `Depart early via ${exc.transportGuide} to maximize your time. Arrive and explore the primary landmark.`,
          cost: '$20 - $35 train transit',
          tip: 'Book express train tickets the day prior for reserved window seating.',
        },
        {
          timeSlot: 'Afternoon',
          time: '01:00 PM',
          activity: `Sightseeing: ${exc.highlights.join(', ')}`,
          locationName: `${exc.title} Highlights`,
          description: exc.description,
          cost: '$15 - $25 entrance fees',
          tip: 'Sample fresh regional lunch dishes at local village inns.',
        },
        {
          timeSlot: 'Evening',
          time: '06:30 PM',
          activity: `Return Transit to ${destination}`,
          locationName: `${destination} City Center`,
          description: `Enjoy the scenic return journey back to your hotel, followed by a relaxed evening dinner.`,
          cost: 'Included in return transit',
          tip: 'Review your photos and enjoy a quiet nightcap.',
        },
      ],
      diningRecommendation: {
        lunch: `Local specialty tavern in ${exc.title}`,
        dinner: `Relaxed bistro back in ${destination}`,
      },
    };

    onAddDayTrip(newDay);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Regional Excursions
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Top Day Trips from {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Unforgettable countryside, mountain, and historic escapes easily accessible by train
          </p>
        </div>
      </div>

      {/* Excursion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {excursions.map((exc, idx) => (
          <div
            key={idx}
            className="bg-slate-50 hover:bg-teal-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-teal-200 transition-all flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  {exc.distance}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-teal-600" />
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {exc.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="line-clamp-1">{exc.transitTime}</span>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {exc.description}
              </p>

              {/* Highlights */}
              <div className="mt-3 flex flex-wrap gap-1">
                {exc.highlights.map((h, hIdx) => (
                  <span
                    key={hIdx}
                    className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                  >
                    • {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => handleAddExcursionToTrip(exc)}
                className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add as Day {currentDayCount + 1} to Itinerary</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
