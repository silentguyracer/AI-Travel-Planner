'use client';

import React, { useState } from 'react';
import {
  Train,
  Clock,
  Gauge,
  Luggage,
  Sparkles,
  Ticket,
  Leaf,
  Info,
  Check,
  Plus
} from 'lucide-react';
import { ItineraryDay } from '@/types/travel';

interface HighSpeedRailPlannerProps {
  destination: string;
  onAppendCityLeg?: (newDay: ItineraryDay) => void;
  currentDayCount?: number;
}

interface TrainRoute {
  id: string;
  fromCity: string;
  toCity: string;
  trainName: string;
  operator: string;
  duration: string;
  topSpeedKmh: number;
  frequency: string;
  co2SavedKg: number;
  ticketPriceEst: string;
  passEligibility: string;
  baggagePolicy: string;
  scenicSeatTip: string;
  sampleDayTitle: string;
  sampleActivity: string;
}

const REGIONAL_ROUTES: Record<string, TrainRoute[]> = {
  japan: [
    {
      id: 'shinkansen-kyoto',
      fromCity: 'Tokyo',
      toCity: 'Kyoto',
      trainName: 'Tokaido Shinkansen (Nozomi / Hikari)',
      operator: 'JR Central',
      duration: '2h 15m',
      topSpeedKmh: 285,
      frequency: 'Every 8 - 10 minutes',
      co2SavedKg: 95,
      ticketPriceEst: '¥14,170 ($95 USD)',
      passEligibility: 'Hikari covered by JR Pass; Nozomi requires minor surcharge or SmartEX point ticket.',
      baggagePolicy: 'Suitcases over 160cm to 250cm total dimensions require reserving a "Seat with Oversized Baggage Area" in advance.',
      scenicSeatTip: 'Book Seat E (window on the right side from Tokyo) for breathtaking panoramic views of Mount Fuji around Shin-Fuji station.',
      sampleDayTitle: 'Bullet Train to Kyoto: Arashiyama Bamboo Grove & Gion',
      sampleActivity: 'Morning high-speed Shinkansen transit, afternoon walking through thousand Torii gates at Fushimi Inari, evening dining in historic Gion.',
    },
    {
      id: 'shinkansen-osaka',
      fromCity: 'Tokyo',
      toCity: 'Osaka',
      trainName: 'Tokaido Shinkansen (Nozomi)',
      operator: 'JR Central',
      duration: '2h 30m',
      topSpeedKmh: 285,
      frequency: 'Every 10 minutes',
      co2SavedKg: 105,
      ticketPriceEst: '¥14,720 ($98 USD)',
      passEligibility: 'Point-to-point ticket on SmartEX app with QR code gate tapping.',
      baggagePolicy: 'Oversized baggage area behind last row of Car 1-3 (Ordinary) and Car 8-10 (Green Car).',
      scenicSeatTip: 'Grab a gourmet seasonal Ekiben bento box at Tokyo Station Gransta before boarding platform 14-19.',
      sampleDayTitle: 'Osaka Gastronomy Expedition: Dotonbori & Shinsekai',
      sampleActivity: 'Arrive at Shin-Osaka, explore street-food takoyaki stalls in Dotonbori, and visit Osaka Castle grounds.',
    },
    {
      id: 'shinkansen-kanazawa',
      fromCity: 'Tokyo',
      toCity: 'Kanazawa',
      trainName: 'Hokuriku Shinkansen (Kagayaki)',
      operator: 'JR East / JR West',
      duration: '2h 30m',
      topSpeedKmh: 260,
      frequency: 'Every 30 minutes',
      co2SavedKg: 85,
      ticketPriceEst: '¥14,380 ($96 USD)',
      passEligibility: '100% covered by national JR Pass and Hokuriku Arch Pass.',
      baggagePolicy: 'Standard overhead racks hold 24-inch luggage comfortably; oversized storage available.',
      scenicSeatTip: 'Scenic crossing of the Japanese Alps with snow-capped mountain views in winter and spring.',
      sampleDayTitle: 'Kanazawa Gold Leaf Art & Kenroku-en Garden',
      sampleActivity: 'Visit Kenroku-en (one of Japan top 3 landscape gardens), historic samurai district, and Omicho seafood market.',
    },
  ],
  france: [
    {
      id: 'tgv-lyon',
      fromCity: 'Paris',
      toCity: 'Lyon',
      trainName: 'TGV INOUI',
      operator: 'SNCF',
      duration: '1h 56m',
      topSpeedKmh: 320,
      frequency: 'Every 30 minutes from Paris Gare de Lyon',
      co2SavedKg: 78,
      ticketPriceEst: '€35 - €75 ($40 - $80 USD)',
      passEligibility: 'Eurail Pass valid (requires €10-€20 seat reservation).',
      baggagePolicy: 'No strict weight limit; luggage must fit in floor-level end racks or overhead shelves.',
      scenicSeatTip: 'Rolling Burgundy vineyard landscapes skimming by at 300 km/h.',
      sampleDayTitle: 'Lyon Gastronomy & Old Renaissance Traboules',
      sampleActivity: 'Arrive in the culinary capital of France, dine in an authentic Bouchon, and walk secret covered passageways.',
    },
    {
      id: 'eurostar-london',
      fromCity: 'Paris',
      toCity: 'London',
      trainName: 'Eurostar e320',
      operator: 'Eurostar',
      duration: '2h 16m',
      topSpeedKmh: 300,
      frequency: 'Hourly from Paris Gare du Nord to St Pancras',
      co2SavedKg: 120,
      ticketPriceEst: '€55 - €120',
      passEligibility: 'Advance booking essential; Eurail seat reservation required.',
      baggagePolicy: '2 large suitcases + 1 hand luggage permitted per traveler without weight fees.',
      scenicSeatTip: 'Channel Tunnel transit under the English Channel takes only 20 minutes.',
      sampleDayTitle: 'London Day: Westminster & Covent Garden',
      sampleActivity: 'Step off directly into central London at St Pancras, visit British Museum, and see Big Ben.',
    },
  ],
  italy: [
    {
      id: 'freccia-florence',
      fromCity: 'Rome',
      toCity: 'Florence',
      trainName: 'Frecciarossa 1000 / Italo',
      operator: 'Trenitalia / Italo',
      duration: '1h 36m',
      topSpeedKmh: 300,
      frequency: 'Every 15 minutes from Roma Termini',
      co2SavedKg: 65,
      ticketPriceEst: '€25 - €50',
      passEligibility: 'Eurail Pass valid (requires €13 reservation).',
      baggagePolicy: 'Overhead racks and central car luggage bays.',
      scenicSeatTip: 'Sweeping vistas across the Tuscan hills, cypress trees, and historic hilltop villages.',
      sampleDayTitle: 'Florence Renaissance: Duomo & Uffizi Gallery',
      sampleActivity: 'Arrive at Santa Maria Novella station, climb Brunelleschi Dome, and stroll the Ponte Vecchio.',
    },
    {
      id: 'freccia-venice',
      fromCity: 'Rome',
      toCity: 'Venice',
      trainName: 'Frecciarossa 1000',
      operator: 'Trenitalia',
      duration: '3h 45m',
      topSpeedKmh: 300,
      frequency: 'Every 30 minutes',
      co2SavedKg: 110,
      ticketPriceEst: '€45 - €85',
      passEligibility: 'Direct high-speed connection into Santa Lucia island.',
      baggagePolicy: 'No luggage restrictions; easy roll-on access.',
      scenicSeatTip: 'Crossing the 3-kilometer causeway bridge into Venice lagoon over water is breathtaking.',
      sampleDayTitle: 'Venice Grand Canal & St. Mark’s Basilica',
      sampleActivity: 'Step out of Santa Lucia station directly onto the Grand Canal, take a Vaporetto water bus, and visit Doge Palace.',
    },
  ],
};

export default function HighSpeedRailPlanner({
  destination,
  onAppendCityLeg,
  currentDayCount = 3,
}: HighSpeedRailPlannerProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('shinkansen-kyoto');
  const [addedRouteId, setAddedRouteId] = useState<string | null>(null);

  const destLower = destination.toLowerCase();
  let routeGroup = REGIONAL_ROUTES.japan;
  if (destLower.includes('paris') || destLower.includes('france')) {
    routeGroup = REGIONAL_ROUTES.france;
  } else if (destLower.includes('rome') || destLower.includes('ital')) {
    routeGroup = REGIONAL_ROUTES.italy;
  }

  const activeRoute = routeGroup.find((r) => r.id === selectedRouteId) || routeGroup[0];

  const handleAppendLeg = (route: TrainRoute) => {
    if (!onAppendCityLeg) return;

    const newDayNumber = currentDayCount + 1;
    const newDay: ItineraryDay = {
      day: newDayNumber,
      title: route.sampleDayTitle,
      theme: `🚄 High-Speed Rail Extension to ${route.toCity}`,
      schedule: [
        {
          timeSlot: 'Morning',
          time: '08:30 AM',
          activity: `High-Speed Train Transit: ${route.fromCity} to ${route.toCity}`,
          locationName: `${route.fromCity} Central Station`,
          description: `Board the ${route.trainName}. Enjoy comfortable high-speed transit at ${route.topSpeedKmh} km/h with onboard dining and scenic views.`,
          cost: route.ticketPriceEst,
          tip: route.scenicSeatTip,
        },
        {
          timeSlot: 'Afternoon',
          time: '01:00 PM',
          activity: `${route.toCity} Historic Quarter Exploration`,
          locationName: `${route.toCity} City Center`,
          description: route.sampleActivity,
          cost: '$20 - $35',
          tip: 'Leave your luggage at the station lockers (Coin Lockers) before setting out.',
        },
        {
          timeSlot: 'Evening',
          time: '06:30 PM',
          activity: `Traditional Dinner in ${route.toCity}`,
          locationName: `${route.toCity} Cultural Dining District`,
          description: `Savor acclaimed regional culinary dishes unique to ${route.toCity}.`,
          cost: '$35 - $60',
          tip: 'Sample seasonal specialties not found in the capital city.',
        },
      ],
      diningRecommendation: {
        lunch: `Station gourmet Ekiben bento box aboard the train`,
        dinner: `Authentic regional restaurant in central ${route.toCity}`,
      },
    };

    onAppendCityLeg(newDay);
    setAddedRouteId(route.id);
    setTimeout(() => setAddedRouteId(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-purple-600" />
              <span>Multi-City High-Speed Rail Hub</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Top Speeds: 285 - 320 km/h
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Inter-City Bullet Train Connections from {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Extend your trip into neighboring cultural capitals. Compare bullet train lines, seat reservation tips, and append days to your itinerary.
          </p>
        </div>
      </div>

      {/* ROUTE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routeGroup.map((r) => {
          const isSelected = selectedRouteId === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-purple-50/50 border-purple-400 ring-2 ring-purple-400/30 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-700 font-mono">
                    {r.fromCity} → {r.toCity}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {r.duration}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{r.trainName}</h4>
                <div className="text-xs text-slate-500 font-medium">{r.operator}</div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span>Speed:</span>
                  <span className="font-bold text-slate-900">{r.topSpeedKmh} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Fare:</span>
                  <span className="font-bold text-emerald-700">{r.ticketPriceEst}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    CO₂ Saved:
                  </span>
                  <span>{r.co2SavedKg} kg vs Flight</span>
                </div>
              </div>

              {onAppendCityLeg && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAppendLeg(r);
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    addedRouteId === r.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  {addedRouteId === r.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Leg Appended to Trip!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Append Leg to Itinerary (+1 Day)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* SELECTED ROUTE DEEP DIVE */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">
              {activeRoute.trainName}: {activeRoute.fromCity} to {activeRoute.toCity}
            </span>
          </div>
          <span className="text-slate-500 font-semibold">
            Departs: {activeRoute.frequency}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-purple-600" />
              <span>Pass & Ticket Advice</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {activeRoute.passEligibility}
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Luggage className="w-3.5 h-3.5 text-amber-600" />
              <span>Luggage Dimension Rules</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {activeRoute.baggagePolicy}
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Insider Scenic Seat Booking</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {activeRoute.scenicSeatTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
