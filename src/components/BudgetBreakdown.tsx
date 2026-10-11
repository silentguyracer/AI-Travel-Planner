'use client';

import React, { useState } from 'react';
import { BudgetBreakdown as BudgetType, PracticalTips } from '@/types/travel';
import {
  DollarSign,
  Plane,
  Building,
  Utensils,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  CloudSun,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';

interface BudgetBreakdownProps {
  budget: BudgetType;
  practicalTips: PracticalTips;
  budgetTier: string;
}

export default function BudgetBreakdown({
  budget,
  practicalTips,
  budgetTier,
}: BudgetBreakdownProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Estimated Cost Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Budget Overview • {budgetTier} tier
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              Estimated Trip Cost Breakdown
            </h3>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-5 py-3 rounded-2xl shadow-md shadow-emerald-700/20 text-right">
            <span className="text-[11px] uppercase tracking-wider text-emerald-100 font-semibold block">
              Estimated Total
            </span>
            <span className="text-xl sm:text-2xl font-extrabold">{budget.totalEstimate}</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Flights / Transport */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Plane className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Flights & Transit</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{budget.flightsOrTransport}</p>
            <p className="text-[11px] text-slate-500">Includes local trains, metro, passes</p>
          </div>

          {/* Accommodation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 text-sky-600 mb-1">
              <Building className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Lodging & Hotel</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{budget.accommodation}</p>
            <p className="text-[11px] text-slate-500">Based on {budgetTier} accommodations</p>
          </div>

          {/* Food & Dining */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <Utensils className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Food & Drinks</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{budget.foodAndDrinks}</p>
            <p className="text-[11px] text-slate-500">Daily meals, snacks, cafes & drinks</p>
          </div>

          {/* Sightseeing */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Ticket className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Activities</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{budget.activitiesAndSightseeing}</p>
            <p className="text-[11px] text-slate-500">Museum admissions, tours & entries</p>
          </div>
        </div>
      </div>

      {/* 2. Practical Travel Essentials & Packing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Packing Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-lg text-slate-900">Packing Checklist</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click any item to mark it packed before your departure
            </p>

            <div className="space-y-2">
              {practicalTips.packing.map((item, idx) => {
                const isChecked = Boolean(checkedItems[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-indigo-50/40 border-indigo-100 text-slate-700 hover:bg-indigo-50/70'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs sm:text-sm font-medium leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Local Etiquette & Tips */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-lg text-slate-900">Local Etiquette & Culture</h4>
          </div>

          <div className="space-y-3">
            {practicalTips.localEtiquette.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>

          {/* Transportation Advice */}
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <span>Local Transit Advice</span>
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {practicalTips.transportation}
            </p>
          </div>

          {/* Payments & Currency */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>Currency & Payments</span>
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {practicalTips.currencyAndPayments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
