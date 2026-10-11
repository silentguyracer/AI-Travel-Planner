'use client';

import React, { useState } from 'react';
import {
  Luggage,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Plane,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface LuggageWeightCalculatorProps {
  destination: string;
}

interface WeightItem {
  id: string;
  name: string;
  unitWeightKg: number;
  qty: number;
  category: 'clothing' | 'electronics' | 'shoes' | 'toiletries' | 'case';
}

export default function LuggageWeightCalculator({ destination }: LuggageWeightCalculatorProps) {
  // Mode: Checked (23kg standard) vs Carry-On (7kg standard)
  const [bagType, setBagType] = useState<'checked' | 'carryon'>('checked');

  const maxLimitKg = bagType === 'checked' ? 23.0 : 7.0;

  const [items, setItems] = useState<WeightItem[]>([
    { id: 'case', name: 'Empty Hardshell Suitcase Tare Weight', unitWeightKg: 3.8, qty: 1, category: 'case' },
    { id: 'tops', name: 'Shirts / T-Shirts / Blouses', unitWeightKg: 0.25, qty: 6, category: 'clothing' },
    { id: 'pants', name: 'Jeans / Trousers', unitWeightKg: 0.6, qty: 3, category: 'clothing' },
    { id: 'jacket', name: 'Winter Coat / Outerwear Jacket', unitWeightKg: 1.2, qty: 1, category: 'clothing' },
    { id: 'shoes', name: 'Spare Shoes / Sneakers', unitWeightKg: 0.85, qty: 2, category: 'shoes' },
    { id: 'laptop', name: 'Laptop + Power Brick', unitWeightKg: 1.8, qty: 1, category: 'electronics' },
    { id: 'cables', name: 'Power Bank & Electronics Pouch', unitWeightKg: 0.5, qty: 1, category: 'electronics' },
    { id: 'toiletry', name: 'Toiletry Bag & Liquid Bottles', unitWeightKg: 1.2, qty: 1, category: 'toiletries' },
  ]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, item.qty + delta);
          return { ...item, qty: next };
        }
        return item;
      })
    );
  };

  const totalKg = items.reduce((acc, curr) => acc + curr.unitWeightKg * curr.qty, 0);
  const totalLbs = totalKg * 2.20462;
  const remainingAllowanceKg = maxLimitKg - totalKg;
  const isOverweight = remainingAllowanceKg < 0;
  const isApproaching = remainingAllowanceKg >= 0 && remainingAllowanceKg < 2.0;

  const percentageUsed = Math.min(100, Math.round((totalKg / maxLimitKg) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Luggage Physics & Overweight Penalty Shield</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Trip to {destination}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Baggage Weight Estimator & Airline Limit Radar
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Prevent costly \$100-\$200 airport gate excess baggage penalty fees. Simulate item weights in real time.
          </p>
        </div>

        {/* Bag Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setBagType('checked')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              bagType === 'checked'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Checked Bag (23 kg / 50 lbs)
          </button>
          <button
            type="button"
            onClick={() => setBagType('carryon')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              bagType === 'carryon'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cabin Carry-On (7 kg / 15 lbs)
          </button>
        </div>
      </div>

      {/* WEIGHT GAUGE DASHBOARD */}
      <div
        className={`p-6 rounded-3xl border transition-all text-white relative overflow-hidden space-y-4 ${
          isOverweight
            ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 border-rose-500/40'
            : isApproaching
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 border-amber-500/40'
            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-white/10'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Estimated Baggage Weight
            </span>
            <div className="text-3xl sm:text-5xl font-black font-mono mt-1 flex items-baseline gap-3">
              <span>{totalKg.toFixed(1)} KG</span>
              <span className="text-lg sm:text-2xl text-slate-400 font-normal">
                ({totalLbs.toFixed(1)} LBS)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Airline Limit ({bagType.toUpperCase()})
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
              {maxLimitKg}.0 KG
            </span>
            <div className="text-xs mt-0.5">
              {isOverweight ? (
                <span className="text-rose-400 font-bold">
                  ⚠️ Overweight by {Math.abs(remainingAllowanceKg).toFixed(1)} kg!
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  ✓ {remainingAllowanceKg.toFixed(1)} kg allowance remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverweight ? 'bg-rose-500' : isApproaching ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 kg</span>
            <span>{maxLimitKg / 2} kg</span>
            <span>{maxLimitKg} kg limit</span>
          </div>
        </div>

        {isOverweight && (
          <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-400/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>
              <strong>Warning:</strong> Major airlines charge $100 to $200 for bags over {maxLimitKg}kg. Wear your heaviest coat and boots onto the plane, or move electronics to your personal backpack!
            </span>
          </div>
        )}
      </div>

      {/* PACKED ITEMS COUNTER LIST */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Packed Items & Estimated Weights
        </span>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white hover:bg-slate-50/60 transition-colors flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="text-[11px] text-slate-400">
                  Unit weight: {item.unitWeightKg} kg • Total: {(item.unitWeightKg * item.qty).toFixed(2)} kg
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    disabled={item.qty === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold font-mono text-slate-900 w-4 text-center">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
