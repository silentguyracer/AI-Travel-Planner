'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TripPlan } from '@/types/travel';
import { ShieldCheck, Zap, PhoneCall, Droplets, CreditCard, Sparkles, CheckSquare, AlertTriangle, BatteryCharging, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';

interface TravelMissionControlHUDProps {
  trip: TripPlan;
}

interface ReadinessItem {
  id: string;
  title: string;
  desc: string;
  category: 'docs' | 'power' | 'finance' | 'health';
  completed: boolean;
}

// Power and utility heuristics based on destination/country
function getCountryUtilityData(countryOrDest: string) {
  const c = countryOrDest.toLowerCase();

  if (c.includes('japan')) {
    return {
      plugType: 'Type A & B (2-pin flat)',
      voltage: '100V / 50-60Hz',
      waterSafe: true,
      emergency: { police: '110', ambulance: '119' },
      tipping: 'Strictly No Tipping (considered impolite)',
      simTip: 'eSIM via Ubigi or Airalo recommended for Shinkansen transit',
    };
  }
  if (c.includes('uk') || c.includes('united kingdom') || c.includes('london')) {
    return {
      plugType: 'Type G (3-pin rectangular)',
      voltage: '230V / 50Hz',
      waterSafe: true,
      emergency: { police: '999 / 112', ambulance: '999' },
      tipping: '10-12.5% discretionary service charge on bills',
      simTip: 'Free EU/UK roaming or local Vodafone / EE eSIM',
    };
  }
  if (c.includes('france') || c.includes('italy') || c.includes('spain') || c.includes('germany') || c.includes('europe') || c.includes('switzerland')) {
    return {
      plugType: 'Type C & F (Europlug 2-pin round)',
      voltage: '230V / 50Hz',
      waterSafe: true,
      emergency: { police: '112 (EU Universal)', ambulance: '112' },
      tipping: '5-10% round-up in cash for good table service',
      simTip: 'Single EU-wide eSIM covers all Schengen borders',
    };
  }
  if (c.includes('india')) {
    return {
      plugType: 'Type C, D & M (3-pin round)',
      voltage: '230V / 50Hz',
      waterSafe: false,
      emergency: { police: '112 / 100', ambulance: '108' },
      tipping: '7-10% in restaurants; ₹50-100 for porters',
      simTip: 'Jio or Airtel 5G eSIM at airport terminal kiosk',
    };
  }
  if (c.includes('usa') || c.includes('united states')) {
    return {
      plugType: 'Type A & B (2-pin flat + ground pin)',
      voltage: '120V / 60Hz',
      waterSafe: true,
      emergency: { police: '911', ambulance: '911' },
      tipping: '18-22% standard in sit-down dining',
      simTip: 'T-Mobile or Visible eSIM with unlimited 5G',
    };
  }

  // Default international standard
  return {
    plugType: 'Universal Travel Adapter Recommended',
    voltage: '220V - 240V / 50Hz',
    waterSafe: true,
    emergency: { police: '112 / 911', ambulance: '112' },
    tipping: 'Round up small change or 10% for full service',
    simTip: 'Pre-load offline Google Maps and international eSIM',
  };
}

const DEFAULT_CHECKLIST: ReadinessItem[] = [
  { id: 'passport', title: 'Passport 6-Month Rule', desc: 'Valid for at least 6 months past return date', category: 'docs', completed: true },
  { id: 'adapter', title: 'Power Plug Adapter', desc: 'Verify pins match destination wall sockets', category: 'power', completed: false },
  { id: 'offline_maps', title: 'Offline Maps Downloaded', desc: 'Save Google Maps area offline for zero data spots', category: 'docs', completed: true },
  { id: 'notransaction', title: 'Zero FX Foreign Credit Card', desc: 'Notify bank or use Revolut / Wise to waive 3% FX fees', category: 'finance', completed: false },
  { id: 'esim', title: 'International eSIM Installed', desc: 'Scan QR code prior to airport boarding gate', category: 'power', completed: false },
  { id: 'insurance', title: 'Travel Medical Insurance', desc: 'Emergency repatriation & lost baggage coverage', category: 'health', completed: true },
  { id: 'emergency_contacts', title: 'Consulate & Emergency Tel', desc: 'Saved embassy hotline in mobile contacts', category: 'health', completed: false },
  { id: 'local_cash', title: 'Small Denomination Cash', desc: 'Taxis, small street food stalls & gratuities', category: 'finance', completed: false },
];

export default function TravelMissionControlHUD({ trip }: TravelMissionControlHUDProps) {
  const [checklist, setChecklist] = useState<ReadinessItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`wanderai_readiness_${trip.destination}`);
        if (stored) return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return DEFAULT_CHECKLIST;
  });

  const utilityData = useMemo(() => {
    return getCountryUtilityData(`${trip.destination} ${trip.country || ''}`);
  }, [trip.destination, trip.country]);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const readinessPercent = Math.round((completedCount / totalCount) * 100);

  const gaugeBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (gaugeBarRef.current) {
      gsap.to(gaugeBarRef.current, {
        width: `${readinessPercent}%`,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [readinessPercent]);

  const toggleCheck = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    try {
      localStorage.setItem(`wanderai_readiness_${trip.destination}`, JSON.stringify(updated));
    } catch { /* ignore */ }

    // If reached 100%, trigger celebration
    const allDone = updated.every((i) => i.completed);
    if (allDone) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Pre-Flight Mission Control
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Traveler Readiness & Electrical Utility HUD
          </h3>
          <p className="text-xs text-slate-400">
            Critical logistical intelligence before touching down in {trip.destination}
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 shrink-0">
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Launch Readiness</p>
            <p className="text-2xl font-black text-emerald-400 font-mono leading-tight">
              {readinessPercent}%
            </p>
          </div>
          <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              ref={gaugeBarRef}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Key Utility Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Wall Plug Standard */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <BatteryCharging className="w-4 h-4" />
            <span>Power & Socket</span>
          </div>
          <p className="text-sm font-black text-white">{utilityData.plugType}</p>
          <p className="text-[11px] text-slate-400 font-mono">{utilityData.voltage}</p>
        </div>

        {/* Tap Water Quality */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
            <Droplets className="w-4 h-4" />
            <span>Drinking Water</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                utilityData.waterSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {utilityData.waterSafe ? 'Safe to Drink' : 'Bottled Water Only'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {utilityData.waterSafe ? 'Municipal tap water meets safe potable standards' : 'Avoid unsealed ice & tap faucets'}
          </p>
        </div>

        {/* Emergency Dialing */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Dialers</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-sm font-black">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">POLICE</span>
              <span className="text-white">{utilityData.emergency.police}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">AMBULANCE</span>
              <span className="text-white">{utilityData.emergency.ambulance}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Accessible from unlocked mobile SIMs</p>
        </div>

        {/* Tipping & Etiquette */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <CreditCard className="w-4 h-4" />
            <span>Tipping Customs</span>
          </div>
          <p className="text-xs font-bold text-slate-200 line-clamp-2">
            {utilityData.tipping}
          </p>
          <p className="text-[10px] text-slate-400">Check restaurant receipts for service charge</p>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Pre-Departure Flight Checklist ({completedCount}/{totalCount})</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Click items to check off</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-white'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'border-slate-600 bg-slate-900'
                }`}
              >
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <p className={`text-xs font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
