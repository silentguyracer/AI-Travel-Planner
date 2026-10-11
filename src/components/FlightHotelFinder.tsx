'use client';

import React from 'react';
import { Plane, Building, ExternalLink, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';
import { BudgetTier } from '@/types/travel';

interface FlightHotelFinderProps {
  destination: string;
  duration: number;
  budget: BudgetTier;
}

export default function FlightHotelFinder({
  destination,
  duration,
  budget,
}: FlightHotelFinderProps) {
  const destEncoded = encodeURIComponent(destination);

  const bookingLinks = [
    {
      name: 'Google Flights',
      type: 'flight',
      desc: 'Real-time price graph, fare alerts & lowest calendar dates',
      url: `https://www.google.com/travel/flights?q=flights+to+${destEncoded}`,
      badge: 'Best Fare Graph',
      color: 'from-blue-600 to-sky-600',
    },
    {
      name: 'Skyscanner',
      type: 'flight',
      desc: 'Compares budget carriers & multi-city connection routes',
      url: `https://www.skyscanner.com/transport/flights/to/${destEncoded}`,
      badge: 'Budget Airlines',
      color: 'from-sky-500 to-teal-500',
    },
    {
      name: 'Booking.com',
      type: 'hotel',
      desc: 'Verified guest reviews, central boutique stays & free cancellation',
      url: `https://www.booking.com/searchresults.html?ss=${destEncoded}`,
      badge: 'Top Hotel Inventory',
      color: 'from-indigo-600 to-blue-700',
    },
    {
      name: 'Airbnb',
      type: 'stay',
      desc: 'Authentic local apartments, rooftop studios & villas',
      url: `https://www.airbnb.com/s/${destEncoded}/homes`,
      badge: 'Neighborhood Living',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  const getLodgingAdvice = () => {
    switch (budget) {
      case 'luxury':
        return 'Look for 5-star palace hotels or premier waterfront suites with private concierge and spa facilities.';
      case 'economy':
        return 'Seek vibrant social hostels or budget guesthouses located within a 5-minute walk of major metro/rail stations.';
      default:
        return 'Look for charming boutique 3-4 star design hotels in walkable central neighborhoods with high walk-scores.';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Smart Travel Booking
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Flights & Accommodation for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Pre-configured direct search links tailored for your {duration}-day {budget} trip
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          <span className="capitalize">{budget} Tier Recommendations</span>
        </div>
      </div>

      {/* Lodging Tip Box */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
        <Building className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Neighborhood & Stay Strategy:</span>{' '}
          {getLodgingAdvice()}
        </div>
      </div>

      {/* Booking Portals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookingLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between bg-white"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {link.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {link.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Search live availability</span>
              <span className="text-slate-400 font-normal">Opens new tab →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
