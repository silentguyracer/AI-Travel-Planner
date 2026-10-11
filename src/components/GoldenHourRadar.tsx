'use client';

import React from 'react';
import {
  Sun,
  Sunset,
  Sunrise,
  Camera,
  Compass,
  Sparkles,
  Clock
} from 'lucide-react';

interface GoldenHourRadarProps {
  destination: string;
  centerCoordinates: {
    lat: number;
    lng: number;
  };
}

interface PhotoSpot {
  name: string;
  type: string;
  bestTime: string;
  lightingAngle: string;
  recommendedLens: string;
  tripodAllowed: boolean;
  droneNotice: string;
  proTip: string;
}

export default function GoldenHourRadar({
  destination,
  centerCoordinates,
}: GoldenHourRadarProps) {

  // Approximate solar timetable for travelers
  const solarTimes = {
    dawn: '05:32 AM',
    sunrise: '06:04 AM',
    morningGoldenHour: '06:05 AM - 07:15 AM',
    solarNoon: '12:15 PM',
    eveningGoldenHour: '05:15 PM - 06:20 PM',
    sunset: '06:22 PM',
    blueHour: '06:25 PM - 07:05 PM',
  };

  const curatedPhotoSpots: PhotoSpot[] = [
    {
      name: `${destination} Panoramic Skyline Overlook`,
      type: 'Cityscape & Architectural Vista',
      bestTime: 'Blue Hour (06:25 PM - 07:05 PM)',
      lightingAngle: 'Side-lit golden glow transitioning into illuminated street grids',
      recommendedLens: 'Wide-angle (16-35mm) or Mid-zoom (24-70mm)',
      tripodAllowed: true,
      droneNotice: 'No-fly zone without commercial municipal permit',
      proTip: 'Arrive 45 minutes before sunset to secure prime balcony positioning before crowds gather.',
    },
    {
      name: `${destination} Historic Heritage Alleyways`,
      type: 'Street Photography & Atmospheric Lanterns',
      bestTime: 'Morning Golden Hour (06:15 AM - 07:30 AM)',
      lightingAngle: 'Low-angle sun piercing between traditional wooden facades',
      recommendedLens: 'Fast Prime (35mm or 50mm f/1.8)',
      tripodAllowed: false,
      droneNotice: 'Strictly prohibited in historic urban corridors',
      proTip: 'Shoot early when shopkeepers sweep storefronts with mist; magical atmospheric light and zero tourists.',
    },
    {
      name: `${destination} Waterfront Reflection Promenade`,
      type: 'Water Reflection & Long Exposure',
      bestTime: 'Evening Golden Hour into Dusk (05:45 PM - 06:40 PM)',
      lightingAngle: 'Backlit dramatic sky reflecting across mirror-like water',
      recommendedLens: 'Wide-angle (14-24mm) with Circular Polarizer (CPL)',
      tripodAllowed: true,
      droneNotice: 'Waterway restrictions apply',
      proTip: 'Use a slow shutter speed (1-2 seconds) to smooth water ripples and create glassy neon reflections.',
    },
    {
      name: `${destination} Grand Cathedral / Monument Plaza`,
      type: 'Monolithic Architecture & Silhouettes',
      bestTime: 'Dawn (05:40 AM - 06:20 AM)',
      lightingAngle: 'Golden light skimming top spires and domes',
      recommendedLens: 'Ultra-wide (12-24mm) or Tilt-Shift',
      tripodAllowed: true,
      droneNotice: 'Strict security perimeter around heritage monuments',
      proTip: 'Puddles after rain offer stunning symmetrical reflection compositions from ground level.',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Solar Ephemeris & Photography Radar</span>
            </span>
            <span className="text-xs text-slate-500">
              Coordinates: {centerCoordinates.lat.toFixed(4)}°, {centerCoordinates.lng.toFixed(4)}°
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Golden Hour & Photo Spot Radar for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Never miss magical natural lighting. Track morning & evening golden hour, blue hour twilight, and camera angles for instagram & professional shoots.
          </p>
        </div>
      </div>

      {/* SOLAR TIMELINE CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Morning Golden Hour */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <Sunrise className="w-4 h-4 text-amber-600" />
            <span>Morning Golden</span>
          </div>
          <div className="text-sm sm:text-base font-black text-amber-950 pt-1">
            {solarTimes.morningGoldenHour}
          </div>
          <div className="text-[11px] text-amber-700">Warm, soft directional rays</div>
        </div>

        {/* Solar Noon */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
            <Sun className="w-4 h-4 text-slate-400" />
            <span>Solar Noon</span>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 pt-1">
            {solarTimes.solarNoon}
          </div>
          <div className="text-[11px] text-slate-500">Harsh overhead shadows</div>
        </div>

        {/* Evening Golden Hour */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-200 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-orange-800 text-xs font-bold">
            <Sunset className="w-4 h-4 text-orange-600" />
            <span>Evening Golden</span>
          </div>
          <div className="text-sm sm:text-base font-black text-orange-950 pt-1">
            {solarTimes.eveningGoldenHour}
          </div>
          <div className="text-[11px] text-orange-700">Deep amber, long shadows</div>
        </div>

        {/* Blue Hour Twilight */}
        <div className="p-4 bg-gradient-to-br from-indigo-900 to-sky-900 text-white rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-sky-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Blue Hour</span>
          </div>
          <div className="text-sm sm:text-base font-black text-white pt-1">
            {solarTimes.blueHour}
          </div>
          <div className="text-[11px] text-sky-200">Electric blue skies & city lights</div>
        </div>
      </div>

      {/* CURATED PHOTO SPOTS & CAMERA GUIDELINES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-base text-slate-900">
              Top Photography Vantage Points in {destination}
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Recommended gear & legal restrictions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curatedPhotoSpots.map((spot, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {spot.type}
                  </span>
                  <h5 className="font-bold text-base text-slate-900 mt-1">{spot.name}</h5>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Prime Timing: </span>
                  <span>{spot.bestTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Recommended Lens: </span>
                  <span>{spot.recommendedLens}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-slate-800">Lighting Quality: </span>
                  <span>{spot.lightingAngle}</span>
                </div>
              </div>

              {/* Tripod & Drone Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    spot.tripodAllowed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {spot.tripodAllowed ? '✓ Tripods Permitted' : '✗ No Tripods Allowed'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Drone: {spot.droneNotice}
                </span>
              </div>

              {/* Insider Pro Tip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                <span className="font-bold text-slate-800">💡 Pro Composition Tip: </span>
                {spot.proTip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
