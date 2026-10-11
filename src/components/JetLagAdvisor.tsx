'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Coffee, ShieldCheck, Sparkles, PlaneTakeoff, Compass } from 'lucide-react';

interface JetLagAdvisorProps {
  destination: string;
}

const DESTINATION_TIMEZONES: Record<string, { tz: string; label: string; offsetHours: number }> = {
  tokyo: { tz: 'Asia/Tokyo', label: 'JST (UTC+9)', offsetHours: 9 },
  kyoto: { tz: 'Asia/Tokyo', label: 'JST (UTC+9)', offsetHours: 9 },
  paris: { tz: 'Europe/Paris', label: 'CEST (UTC+2)', offsetHours: 2 },
  rome: { tz: 'Europe/Rome', label: 'CEST (UTC+2)', offsetHours: 2 },
  barcelona: { tz: 'Europe/Madrid', label: 'CEST (UTC+2)', offsetHours: 2 },
  london: { tz: 'Europe/London', label: 'BST (UTC+1)', offsetHours: 1 },
  'new york': { tz: 'America/New_York', label: 'EDT (UTC-4)', offsetHours: -4 },
  bali: { tz: 'Asia/Makassar', label: 'WITA (UTC+8)', offsetHours: 8 },
  bangkok: { tz: 'Asia/Bangkok', label: 'ICT (UTC+7)', offsetHours: 7 },
  dubai: { tz: 'Asia/Dubai', label: 'GST (UTC+4)', offsetHours: 4 },
  sydney: { tz: 'Australia/Sydney', label: 'AEST (UTC+10)', offsetHours: 10 },
};

export default function JetLagAdvisor({ destination }: JetLagAdvisorProps) {
  const [localTime, setLocalTime] = useState<string>('');
  const [destTime, setDestTime] = useState<string>('');
  const [timeDiffHours, setTimeDiffHours] = useState<number>(0);

  const destLower = destination.toLowerCase();
  let matchedTz = 'Asia/Tokyo';
  let tzLabel = 'UTC+9';

  for (const [key, val] of Object.entries(DESTINATION_TIMEZONES)) {
    if (destLower.includes(key)) {
      matchedTz = val.tz;
      tzLabel = val.label;
      break;
    }
  }

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      try {
        const destDateStr = now.toLocaleTimeString([], {
          timeZone: matchedTz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setDestTime(destDateStr);

        // Calculate hours difference
        const localUtcHours = now.getTime() / (1000 * 60 * 60);
        const destTimeString = now.toLocaleString('en-US', { timeZone: matchedTz });
        const destDate = new Date(destTimeString);
        const destUtcHours = destDate.getTime() / (1000 * 60 * 60);
        const diff = Math.round(destUtcHours - localUtcHours);
        setTimeDiffHours(diff);
      } catch {
        setDestTime(now.toLocaleTimeString());
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [matchedTz]);

  const scheduleDays = [
    {
      phase: '24 Hours Before Departure',
      badge: 'Preparation',
      icon: Sun,
      title: 'Gradual Circadian Shift',
      desc: 'Shift your bedtime 1 hour closer to destination time. Drink plenty of water and avoid heavy alcohol.',
      rule: 'Hydrate well before boarding',
    },
    {
      phase: 'Day 1: Arrival Day',
      badge: 'Circadian Reset',
      icon: Sun,
      title: 'Morning Natural Light Exposure',
      desc: 'Get 30+ minutes of direct morning outdoor sunlight. Natural morning photons suppress melatonin and sync your internal clock.',
      rule: 'No caffeine after 2:00 PM local time',
    },
    {
      phase: 'Day 2: Rhythm Adaptation',
      badge: 'Metabolic Sync',
      icon: Coffee,
      title: 'Align Meal Timings with Local Clock',
      desc: 'Eat breakfast, lunch, and dinner strictly on destination hours, even if you do not feel hungry.',
      rule: 'Limit daytime naps to max 20 minutes',
    },
    {
      phase: 'Day 3: Full Acclimation',
      badge: '100% Synced',
      icon: Moon,
      title: 'Deep Rest & Peak Energy',
      desc: 'Your body temperature curve and hormone production are now fully aligned with the local time zone.',
      rule: 'Enjoy your vacation with zero fog',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Circadian Science
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Time Zone & Jet Lag Acclimation for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Live world clocks and a personalized 3-day circadian recovery schedule
          </p>
        </div>

        {/* Live World Clocks Card */}
        <div className="flex items-center gap-3 bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-md border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Local Time</span>
            <span className="text-base sm:text-lg font-mono font-bold">{localTime || '--:--'}</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">{destination} ({tzLabel})</span>
            <span className="text-base sm:text-lg font-mono font-bold text-indigo-200">{destTime || '--:--'}</span>
          </div>
        </div>
      </div>

      {/* Difference Callout */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-xs text-purple-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>Time Shift:</strong> {destination} is approximately{' '}
            <strong>{Math.abs(timeDiffHours)} hours {timeDiffHours >= 0 ? 'ahead of' : 'behind'}</strong> your current local timezone.
          </span>
        </div>
        <span className="text-[11px] font-bold bg-white text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 shrink-0">
          Circadian Protocol Active
        </span>
      </div>

      {/* 4-Phase Acclimation Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scheduleDays.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-purple-50/40 p-4 rounded-2xl border border-slate-200/80 hover:border-purple-200 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                    {item.badge}
                  </span>
                  <Icon className="w-4 h-4 text-purple-600" />
                </div>

                <span className="text-[11px] font-semibold text-slate-400 block">{item.phase}</span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-purple-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{item.rule}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
