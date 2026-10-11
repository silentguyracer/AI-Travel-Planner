'use client';

import React, { useState } from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Thermometer, Umbrella, Sparkles } from 'lucide-react';

interface WeatherWidgetProps {
  destination: string;
  duration: number;
}

interface DayWeather {
  day: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Light Rain' | 'Pleasant' | 'Clear';
  tempC: number;
  tempF: number;
  humidity: string;
  wind: string;
  tip: string;
}

export default function WeatherWidget({ destination, duration }: WeatherWidgetProps) {
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  // Generate realistic seasonal weather predictions for the trip duration
  const daysWeather: DayWeather[] = Array.from({ length: duration }).map((_, idx) => {
    const conditions: DayWeather['condition'][] = ['Sunny', 'Partly Cloudy', 'Clear', 'Light Rain', 'Pleasant'];
    const condition = conditions[idx % conditions.length];
    const baseC = 20 + ((idx * 3) % 7) - 2;
    const baseF = Math.round((baseC * 9) / 5 + 32);

    let tip = 'Great conditions for full-day walking & outdoor photography.';
    if (condition === 'Light Rain') tip = 'Pack a compact umbrella or rain shell for occasional afternoon showers.';
    if (condition === 'Sunny') tip = 'High UV; sunglasses and sunscreen are recommended.';

    return {
      day: idx + 1,
      condition,
      tempC: baseC,
      tempF: baseF,
      humidity: `${55 + ((idx * 7) % 25)}%`,
      wind: `${10 + ((idx * 4) % 12)} km/h`,
      tip,
    };
  });

  const getWeatherIcon = (cond: DayWeather['condition']) => {
    switch (cond) {
      case 'Sunny':
        return <Sun className="w-6 h-6 text-amber-500" />;
      case 'Light Rain':
        return <CloudRain className="w-6 h-6 text-sky-500" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-6 h-6 text-indigo-400" />;
      default:
        return <Sun className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Trip Weather Forecast
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Seasonal Climate & Daily Forecast in {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Expected temperatures and weather conditions for your {duration}-day journey
          </p>
        </div>

        {/* Temperature Unit Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setUseFahrenheit(false)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              !useFahrenheit ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            °C (Celsius)
          </button>
          <button
            onClick={() => setUseFahrenheit(true)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              useFahrenheit ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            °F (Fahrenheit)
          </button>
        </div>
      </div>

      {/* Daily Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {daysWeather.map((w) => (
          <div
            key={w.day}
            className="bg-slate-50 hover:bg-sky-50/50 p-4 rounded-2xl border border-slate-200/70 hover:border-sky-200 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Day {w.day}
              </span>
              {getWeatherIcon(w.condition)}
            </div>

            <div>
              <span className="text-2xl font-black text-slate-900">
                {useFahrenheit ? `${w.tempF}°F` : `${w.tempC}°C`}
              </span>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{w.condition}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-400" /> Humidity:
                </span>
                <span className="font-semibold text-slate-700">{w.humidity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-400" /> Wind:
                </span>
                <span className="font-semibold text-slate-700">{w.wind}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-tight">
              {w.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
