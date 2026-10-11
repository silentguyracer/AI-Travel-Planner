'use client';

import React, { useState } from 'react';
import {
  Plane,
  Clock,
  Compass,
  MapPin,
  Luggage,
  ShieldCheck,
  Train,
  Wifi,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface FlightRadarSimulatorProps {
  destination: string;
}

interface SimulatedFlight {
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: string;
  originCode: string;
  destAirport: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: 'In Flight - Cruising' | 'Descending' | 'Final Approach' | 'Landed & Taxiing' | 'On Time';
  progressPercent: number;
  altitudeFt: number;
  groundSpeedMph: number;
  gate: string;
  terminal: string;
  baggageCarousel: string;
  customsTerminalNotes: string;
  transitOption: string;
}

const PRESET_FLIGHTS: Record<string, SimulatedFlight[]> = {
  tokyo: [
    {
      flightNumber: 'JL 005',
      airline: 'Japan Airlines',
      aircraft: 'Airbus A350-1000',
      origin: 'New York (JFK)',
      originCode: 'JFK',
      destAirport: 'Tokyo Haneda International Airport',
      destCode: 'HND',
      departureTime: '11:30 AM',
      arrivalTime: '02:45 PM (+1)',
      duration: '14h 15m',
      status: 'In Flight - Cruising',
      progressPercent: 78,
      altitudeFt: 38000,
      groundSpeedMph: 564,
      gate: '114',
      terminal: 'Terminal 3 (International)',
      baggageCarousel: 'Carousel 05',
      customsTerminalNotes: 'Scan Visit Japan Web QR code at the automated electronic declaration kiosks before baggage exit.',
      transitOption: 'Tokyo Monorail or Keikyu Airport Line directly connects to Yamanote line (Hamamatsucho/Shinagawa) in 13 mins.',
    },
    {
      flightNumber: 'NH 105',
      airline: 'All Nippon Airways (ANA)',
      aircraft: 'Boeing 787-9 Dreamliner',
      origin: 'Los Angeles (LAX)',
      originCode: 'LAX',
      destAirport: 'Tokyo Haneda International Airport',
      destCode: 'HND',
      departureTime: '12:05 AM',
      arrivalTime: '04:55 AM (+1)',
      duration: '11h 50m',
      status: 'Descending',
      progressPercent: 92,
      altitudeFt: 18500,
      groundSpeedMph: 480,
      gate: '108',
      terminal: 'Terminal 3',
      baggageCarousel: 'Carousel 03',
      customsTerminalNotes: 'Early morning arrivals have fast 15-minute immigration lines at Terminal 3.',
      transitOption: 'Limousine Bus ticket counters open at 06:00 AM on 2F Arrival Lobby.',
    },
  ],
  paris: [
    {
      flightNumber: 'AF 022',
      airline: 'Air France',
      aircraft: 'Boeing 777-300ER',
      origin: 'New York (JFK)',
      originCode: 'JFK',
      destAirport: 'Paris Charles de Gaulle Airport',
      destCode: 'CDG',
      departureTime: '04:30 PM',
      arrivalTime: '06:00 AM (+1)',
      duration: '7h 30m',
      status: 'Final Approach',
      progressPercent: 96,
      altitudeFt: 4200,
      groundSpeedMph: 210,
      gate: 'K43',
      terminal: 'Terminal 2E',
      baggageCarousel: 'Carousel 12',
      customsTerminalNotes: 'Use PARAFE automated biometric passport e-gates if holding an eligible e-passport.',
      transitOption: 'Take RER B express train directly into central Paris (Gare du Nord/Châtelet) from Terminal 2 level -1.',
    },
  ],
  rome: [
    {
      flightNumber: 'AZ 608',
      airline: 'ITA Airways',
      aircraft: 'Airbus A350-900',
      origin: 'New York (JFK)',
      originCode: 'JFK',
      destAirport: 'Rome Leonardo da Vinci–Fiumicino',
      destCode: 'FCO',
      departureTime: '05:40 PM',
      arrivalTime: '08:15 AM (+1)',
      duration: '8h 35m',
      status: 'In Flight - Cruising',
      progressPercent: 82,
      altitudeFt: 36000,
      groundSpeedMph: 540,
      gate: 'E18',
      terminal: 'Terminal 3',
      baggageCarousel: 'Carousel 08',
      customsTerminalNotes: 'Walk through Green channel (Nothing to Declare) after retrieving bags at Carousel 08.',
      transitOption: 'Leonardo Express non-stop train departs every 15 mins directly to Roma Termini station (32 mins).',
    },
  ],
};

export default function FlightRadarSimulator({ destination }: FlightRadarSimulatorProps) {
  const destLower = destination.toLowerCase();
  let defaultFlights = PRESET_FLIGHTS.tokyo;
  if (destLower.includes('paris') || destLower.includes('france')) {
    defaultFlights = PRESET_FLIGHTS.paris;
  } else if (destLower.includes('rome') || destLower.includes('ital')) {
    defaultFlights = PRESET_FLIGHTS.rome;
  }

  const [selectedFlightIdx, setSelectedFlightIdx] = useState<number>(0);
  const flight = defaultFlights[selectedFlightIdx] || defaultFlights[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-sky-600" />
              <span>In-Flight Telemetry & Arrival Wayfinder</span>
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {flight.status}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Flight Radar & Terminal Navigator for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time in-flight speed, cruising altitude, arrival terminal gate, baggage carousel, and express city train connections.
          </p>
        </div>

        {/* Flight Selection Pills */}
        <div className="flex items-center gap-2">
          {defaultFlights.map((f, i) => (
            <button
              key={f.flightNumber}
              type="button"
              onClick={() => setSelectedFlightIdx(i)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                selectedFlightIdx === i
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {f.flightNumber} ({f.originCode} → {f.destCode})
            </button>
          ))}
        </div>
      </div>

      {/* FLIGHT TELEMETRY HUD */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          {/* Origin */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Departure
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {flight.originCode}
            </div>
            <div className="text-xs text-slate-300">{flight.origin}</div>
            <div className="text-xs font-bold text-amber-300">{flight.departureTime}</div>
          </div>

          {/* Animated Route Line */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-4 space-y-2 text-center">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{flight.duration} Nonstop</span>
              <span className="text-emerald-400 font-bold">{flight.aircraft}</span>
            </div>
            <div className="relative flex items-center">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${flight.progressPercent}%` }}
                />
              </div>
              {/* Airplane Icon on the line */}
              <div
                className="absolute -top-2.5 transition-all duration-700"
                style={{ left: `calc(${flight.progressPercent}% - 12px)` }}
              >
                <div className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg">
                  <Plane className="w-3.5 h-3.5 transform rotate-45" />
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {flight.progressPercent}% Completed • In Air
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1 text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Arrival
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">
              {flight.destCode}
            </div>
            <div className="text-xs text-slate-300">{flight.destAirport.split(' ')[0]}</div>
            <div className="text-xs font-bold text-emerald-300">{flight.arrivalTime}</div>
          </div>
        </div>

        {/* Live Gauges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Altitude</span>
            <div className="text-lg font-black text-sky-300 font-mono">
              {flight.altitudeFt.toLocaleString()} FT
            </div>
            <div className="text-[10px] text-slate-500">Cruising flight level</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Ground Speed</span>
            <div className="text-lg font-black text-amber-300 font-mono">
              {flight.groundSpeedMph} MPH
            </div>
            <div className="text-[10px] text-slate-500">~{Math.round(flight.groundSpeedMph * 1.609)} km/h</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Arrival Gate</span>
            <div className="text-lg font-black text-emerald-300 font-mono">
              Gate {flight.gate}
            </div>
            <div className="text-[10px] text-slate-500">{flight.terminal}</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Baggage Claim</span>
            <div className="text-lg font-black text-purple-300 font-mono">
              {flight.baggageCarousel}
            </div>
            <div className="text-[10px] text-slate-500">International Hall</div>
          </div>
        </div>
      </div>

      {/* 5-STEP AIRPORT ARRIVAL WAYFINDER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-base text-slate-900">
              Arrival Terminal Step-by-Step Wayfinder
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            From jetbridge touchdown to downtown train
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1: Disembark */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h5 className="font-bold text-xs text-slate-900 mt-2">Disembark & Gate</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Exit via Gate {flight.gate}. Follow the overhead illuminated &ldquo;Arrivals / Baggage Claim&rdquo; signage.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
              ~5 mins walk
            </div>
          </div>

          {/* Step 2: Immigration */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h5 className="font-bold text-xs text-slate-900 mt-2">Passport e-Gates</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Biometric automated lanes available for eligible foreign passports. Have entry QR code or disembarkation card ready.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
              ~15-25 mins queue
            </div>
          </div>

          {/* Step 3: Baggage Claim */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h5 className="font-bold text-xs text-slate-900 mt-2">Baggage Carousel</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Locate {flight.baggageCarousel}. Carts are complimentary right beside the belt.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
              Belts start ~20m post-landing
            </div>
          </div>

          {/* Step 4: Customs */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h5 className="font-bold text-xs text-slate-900 mt-2">Customs Kiosk</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {flight.customsTerminalNotes}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200">
              Green line for tourists
            </div>
          </div>

          {/* Step 5: Express Train */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h5 className="font-bold text-xs text-indigo-950 mt-2">Transit & Trains</h5>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                {flight.transitOption}
              </p>
            </div>
            <div className="text-[10px] text-indigo-700 font-bold pt-1 border-t border-indigo-200">
              Direct City Link
            </div>
          </div>
        </div>
      </div>

      {/* AIRPORT ARRIVAL SURVIVAL TIPS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Wifi className="w-4 h-4 text-sky-600" />
            <span>eSIM & Pocket WiFi Pickup</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Telecom service counters are located directly on 2F Arrival Lobby. Activate eSIM data roaming before exiting customs.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Luggage className="w-4 h-4 text-amber-600" />
            <span>Luggage Delivery to Hotel</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Hands-free travel: Drop large suitcases at airport baggage forwarding counters (e.g. Yamato Ta-Q-Bin) for same-day delivery to your hotel.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fee-Free ATMs</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Use Bank ATMs inside terminal lobby. Always decline the ATM&apos;s proposed conversion rate to let your home bank convert at wholesale spot rate.
          </p>
        </div>
      </div>
    </div>
  );
}
