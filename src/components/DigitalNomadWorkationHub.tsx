'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Laptop,
  Clock,
  Zap,
  Coffee,
  Globe,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Sliders,
  DollarSign
} from 'lucide-react';
import { TripPlan } from '@/types/travel';

interface DigitalNomadWorkationHubProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalNomadWorkationHub({ trip, isOpen, onClose }: DigitalNomadWorkationHubProps) {
  const [selectedHomeTimezone, setSelectedHomeTimezone] = useState<string>('America/New_York');
  const [selectedTimeHour, setSelectedTimeHour] = useState<number>(14); // 2:00 PM local

  // City-specific remote work intelligence
  const dest = trip.destination.toLowerCase();
  const isJapan = dest.includes('tokyo') || dest.includes('japan') || dest.includes('kyoto') || dest.includes('osaka');
  const isEurope = dest.includes('paris') || dest.includes('france') || dest.includes('rome') || dest.includes('italy') || dest.includes('barcelona') || dest.includes('london');
  const isSEAsia = dest.includes('bali') || dest.includes('thailand') || dest.includes('bangkok') || dest.includes('vietnam');

  // Wi-Fi Benchmark
  const downloadSpeed = isJapan ? 185 : isEurope ? 140 : isSEAsia ? 95 : 120;
  const uploadSpeed = isJapan ? 90 : isEurope ? 65 : isSEAsia ? 45 : 55;
  const latencyMs = isJapan ? 12 : isEurope ? 18 : isSEAsia ? 32 : 20;

  // Electrical Plug Intelligence
  const plugTypes = isJapan ? ['Type A', 'Type B (100V / 50-60Hz)'] : isEurope ? ['Type C', 'Type E/F (230V / 50Hz)'] : isSEAsia ? ['Type C', 'Type G (220V / 50Hz)'] : ['Type A', 'Type C (110-230V)'];

  // Coworking & Work-Friendly Cafes
  const workSpots = [
    {
      name: isJapan ? 'WeWork Shibuya Scramble Square' : isEurope ? 'Station F / Spaces Co-Working' : 'Dojo Coworking Hub',
      type: 'Coworking Space',
      dayPass: isJapan ? '$28 / day' : isEurope ? '€32 / day' : '$14 / day',
      wifi: '250+ Mbps',
      outlets: 'Outlets at every seat',
      noise: 'Quiet Focus Zones',
      ergonomics: 'Herman Miller Chairs'
    },
    {
      name: isJapan ? 'Fuglen Coffee Roasters' : isEurope ? 'Ten Belles Craft Cafe' : 'Revolver Espresso Cafe',
      type: 'Laptop-Friendly Cafe',
      dayPass: isJapan ? '$4.50 Flat White' : isEurope ? '€4.00 Cappuccino' : '$2.80 Cold Brew',
      wifi: '95 Mbps',
      outlets: 'Window bar counter outlets',
      noise: 'Bustling Chill Beats',
      ergonomics: 'Wood bench & patio'
    },
    {
      name: isJapan ? 'Tsutaya Books & Anjin Lounge Daikanyama' : isEurope ? 'La Gaîté Lyrique Work Lounge' : 'Tropical Nomad Co-Work',
      type: 'Design Library Lounge',
      dayPass: isJapan ? '$15 / 2 hours' : isEurope ? 'Free Public Entry' : '$18 / day',
      wifi: '140 Mbps',
      outlets: 'Discreet floor sockets',
      noise: 'Whisper-Quiet',
      ergonomics: 'Leather armchairs'
    }
  ];

  // Timezone Offsets (Destination approx vs Home)
  const homeTimezones = [
    { label: 'New York (EST/EDT, UTC-4)', offset: -4 },
    { label: 'San Francisco (PST/PDT, UTC-7)', offset: -7 },
    { label: 'London (GMT/BST, UTC+1)', offset: 1 },
    { label: 'Berlin / Paris (CET, UTC+2)', offset: 2 },
    { label: 'Sydney (AEST, UTC+10)', offset: 10 },
  ];

  const destOffset = isJapan ? 9 : isEurope ? 2 : isSEAsia ? 7 : 0;
  const selectedHtz = homeTimezones.find(tz => tz.label.includes(selectedHomeTimezone)) || homeTimezones[0];
  const offsetDiff = destOffset - selectedHtz.offset;

  // Calculate home team time when destination is at selectedTimeHour
  const homeHour = ((selectedTimeHour - offsetDiff) % 24 + 24) % 24;
  const isOverlapGood = (homeHour >= 9 && homeHour <= 18) && (selectedTimeHour >= 8 && selectedTimeHour <= 22);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Digital Nomad & Workation Hub</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Remote Work Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Verified Wi-Fi speeds, laptop-friendly cafes, and global team timezone overlap for {trip.destination}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connectivity Speed Benches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Download Speed</span>
              <div className="text-xl font-black text-white">{downloadSpeed} Mbps</div>
              <span className="text-[10px] text-emerald-400">4K Zoom & Video Call Ready</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Ping / Latency</span>
              <div className="text-xl font-black text-white">{latencyMs} ms</div>
              <span className="text-[10px] text-slate-400">Fiber-optic backbone</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Power Plug Types</span>
              <div className="text-sm font-bold text-white truncate max-w-[150px]">{plugTypes.join(', ')}</div>
              <span className="text-[10px] text-amber-300">Dual-voltage check required</span>
            </div>
          </div>
        </div>

        {/* Interactive Global Timezone Overlap Matrix */}
        <div className="bg-slate-950/90 border border-indigo-500/30 rounded-3xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Team Timezone Synchronizer
              </h3>
              <p className="text-[11px] text-slate-400">Find golden meeting windows between {trip.destination} and your home office</p>
            </div>

            <select
              value={selectedHomeTimezone}
              onChange={(e) => setSelectedHomeTimezone(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-hidden"
            >
              {homeTimezones.map(tz => (
                <option key={tz.label} value={tz.label}>{tz.label}</option>
              ))}
            </select>
          </div>

          {/* Time Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">
                Destination Local Time: <strong className="text-white text-sm">{selectedTimeHour}:00</strong> ({selectedTimeHour >= 12 ? 'PM' : 'AM'})
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                isOverlapGood ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {isOverlapGood ? '✓ Golden Synchronous Work Window' : 'Asynchronous Communication Window'}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={23}
              value={selectedTimeHour}
              onChange={(e) => setSelectedTimeHour(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Dual Clock Readout */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">{trip.destination} (Traveler)</span>
              <span className="text-lg font-bold text-white">{selectedTimeHour}:00</span>
            </div>
            <div className="border-l border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Home HQ ({selectedHtz.label.split('(')[0]})</span>
              <span className="text-lg font-bold text-indigo-300">{homeHour}:00</span>
            </div>
          </div>
        </div>

        {/* Top Coworking Spaces & Laptop Cafes */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-amber-400" /> Curated Remote Work Sanctuaries
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {workSpots.map((spot, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {spot.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{spot.dayPass}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 leading-snug">{spot.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-indigo-400 shrink-0" /> {spot.wifi}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Power Outlets:</span>
                    <strong className="text-slate-200">{spot.outlets}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Acoustic Vibe:</span>
                    <strong className="text-slate-200">{spot.noise}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
