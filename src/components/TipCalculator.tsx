'use client';

import React, { useState } from 'react';
import { Calculator, Users, AlertCircle } from 'lucide-react';

interface TipCalculatorProps {
  destination: string;
}

export default function TipCalculator({ destination }: TipCalculatorProps) {
  const [billAmount, setBillAmount] = useState<string>('75');
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [tipPercent, setTipPercent] = useState<number>(10);

  const destLower = destination.toLowerCase();
  const isZeroTipCountry = destLower.includes('japan') || destLower.includes('tokyo') || destLower.includes('kyoto');
  const isEuropeanServiceIncluded = destLower.includes('france') || destLower.includes('paris') || destLower.includes('ital') || destLower.includes('rome') || destLower.includes('spain');

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = (bill * tipPercent) / 100;
  const total = bill + tipAmount;
  const perPerson = peopleCount > 0 ? total / peopleCount : total;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Local Tipping & Bill Splitter
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Dining Tip Calculator for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Calculate accurate tips and split bills according to local regional customs
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-slate-700">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Local Gratuity Norms</span>
        </div>
      </div>

      {/* Destination Etiquette Alert */}
      {isZeroTipCountry ? (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-0.5 text-amber-900">Zero Tipping Etiquette in Japan:</strong>
            In Japanese culture, exceptional hospitality (Omotenashi) is proudly included in the menu price. Leaving cash tips is considered unusual, can cause staff confusion, and waiters may even chase you down to return forgotten money.
          </div>
        </div>
      ) : isEuropeanServiceIncluded ? (
        <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-2xl text-xs text-sky-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-0.5 text-sky-900">Service Compris in Europe:</strong>
            Restaurant bills legally include a service charge (&ldquo;service compris&rdquo;). Rounding up the bill or leaving €1 - €2 per person in cash for good table service is appreciated, but large American-style 20% tips are not expected.
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-0.5 text-slate-900">Standard Gratuity Guidelines:</strong>
            For sit-down dining, 15% - 20% is customary for attentive service. You can adjust the tip percentage below.
          </div>
        </div>
      )}

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
        {/* Controls Column */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Bill Total Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute left-3 top-3 text-slate-400 font-bold">$</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Select Tip Percentage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    tipPercent === pct
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Split With Friends
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <Users className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="1"
                max="10"
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md shadow-emerald-700/20 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 text-xs">
              <span className="text-emerald-100">Base Bill:</span>
              <span className="font-mono font-bold">${bill.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/20 pb-2 text-xs">
              <span className="text-emerald-100">Calculated Tip ({tipPercent}%):</span>
              <span className="font-mono font-bold">+${tipAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/20 pb-2 text-sm font-bold">
              <span>Total with Gratuity:</span>
              <span className="font-mono text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md text-center">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block mb-1">
              Amount Per Traveler
            </span>
            <span className="text-3xl font-black">${perPerson.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-200 block mt-0.5">
              Split across {peopleCount} {peopleCount === 1 ? 'traveler' : 'travelers'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
