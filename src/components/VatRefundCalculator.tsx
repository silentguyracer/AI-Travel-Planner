'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Percent,
  CheckCircle,
  AlertTriangle,
  QrCode,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  FileCheck
} from 'lucide-react';

interface VatRefundCalculatorProps {
  destination: string;
  country: string;
}

interface VatRule {
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  standardVatRate: number; // e.g. 20 for 20%
  effectiveRefundRate: number; // e.g. 12% after administrative agency fees
  minSpendLocal: number;
  digitalSystem: string;
  rulesOverview: string;
  customsProcedure: string;
}

const VAT_COUNTRY_RULES: Record<string, VatRule> = {
  japan: {
    countryName: 'Japan',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    standardVatRate: 10,
    effectiveRefundRate: 10,
    minSpendLocal: 5000,
    digitalSystem: 'Passport Digital Scan at Store Register',
    rulesOverview: 'Tax-free discount is deducted directly at the store cash register upon presenting your physical passport with tourist visa stamp.',
    customsProcedure: 'Consumables (cosmetics, snacks, alcohol) are sealed in clear plastic bags with tamper-evident tape. Do not open these bags until you leave Japan. Show digital passport QR at airport customs gate.',
  },
  france: {
    countryName: 'France',
    currencyCode: 'EUR',
    currencySymbol: '€',
    standardVatRate: 20,
    effectiveRefundRate: 12,
    minSpendLocal: 100,
    digitalSystem: 'PABLO Optical Barcode Kiosks',
    rulesOverview: 'Receive an official Tax-Free Form (Bordereau de détaxe) with barcode from stores like Galeries Lafayette, Printemps, or luxury boutiques.',
    customsProcedure: 'Scan the barcode on your tax-free form at PABLO digital kiosks at Paris CDG or Orly before checking luggage. A green screen indicates instant electronic customs validation.',
  },
  italy: {
    countryName: 'Italy',
    currencyCode: 'EUR',
    currencySymbol: '€',
    standardVatRate: 22,
    effectiveRefundRate: 13,
    minSpendLocal: 70,
    digitalSystem: 'OTELLO 2.0 Digital Customs System',
    rulesOverview: 'Italy lowered its minimum spend threshold to only €70. Major tax refund operators are Global Blue and Planet Payment.',
    customsProcedure: 'Validate forms digitally at OTELLO kiosks at Rome Fiumicino or Milan Malpensa. Have purchases in hand in case random physical inspection is requested.',
  },
  spain: {
    countryName: 'Spain',
    currencyCode: 'EUR',
    currencySymbol: '€',
    standardVatRate: 21,
    effectiveRefundRate: 14,
    minSpendLocal: 0,
    digitalSystem: 'DIVA Electronic Validation Kiosks',
    rulesOverview: 'Spain has NO minimum purchase requirement (0€ limit)! Even small souvenir purchases can qualify for tax refund.',
    customsProcedure: 'Scan the DIVA barcode at electronic terminals in Barcelona El Prat or Madrid Barajas airport before security. No physical customs stamp needed if DIVA screen turns green.',
  },
};

export default function VatRefundCalculator({ destination, country }: VatRefundCalculatorProps) {
  const cLower = country.toLowerCase();
  const dLower = destination.toLowerCase();

  let countryKey = 'japan';
  if (cLower.includes('france') || dLower.includes('paris') || dLower.includes('nice')) {
    countryKey = 'france';
  } else if (cLower.includes('ital') || dLower.includes('rome') || dLower.includes('florence') || dLower.includes('milan')) {
    countryKey = 'italy';
  } else if (cLower.includes('spain') || dLower.includes('barcelona') || dLower.includes('madrid')) {
    countryKey = 'spain';
  }

  const vatRule = VAT_COUNTRY_RULES[countryKey] || VAT_COUNTRY_RULES.japan;

  const [purchaseAmount, setPurchaseAmount] = useState<string>(countryKey === 'japan' ? '50000' : '500');
  const [refundMethod, setRefundMethod] = useState<'card' | 'cash'>('card');

  const amountNumber = parseFloat(purchaseAmount) || 0;
  const isQualifying = amountNumber >= vatRule.minSpendLocal;

  // Compute refund
  const refundPercent = vatRule.effectiveRefundRate - (refundMethod === 'cash' ? 2 : 0);
  const estimatedRefund = isQualifying ? (amountNumber * refundPercent) / 100 : 0;
  const finalNetCost = amountNumber - estimatedRefund;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tax-Free & VAT Refund Master</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {vatRule.countryName} Standard VAT: {vatRule.standardVatRate}%
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Luxury Shopping Tax Refund Calculator for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Calculate your exact VAT savings, minimum spend eligibility, and step-by-step airport kiosk customs procedures.
          </p>
        </div>
      </div>

      {/* INTERACTIVE CALCULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Enter Shopping Spend
          </span>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Total Purchase Amount ({vatRule.currencySymbol} {vatRule.currencyCode})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">
                {vatRule.currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full pl-8 pr-4 py-2.5 text-sm font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Minimum spend threshold:</span>
              <span className="font-bold text-slate-700">
                {vatRule.currencySymbol}{vatRule.minSpendLocal}
              </span>
            </div>
          </div>

          {/* Refund Method Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Refund Destination
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRefundMethod('card')}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  refundMethod === 'card'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit Card (~{vatRule.effectiveRefundRate}%)</span>
              </button>

              <button
                type="button"
                onClick={() => setRefundMethod('cash')}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  refundMethod === 'cash'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Airport Cash (~{vatRule.effectiveRefundRate - 2}%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation Result Banner */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-400/30">
              Tax Refund Savings Calculation
            </span>
            <span className="text-xs text-slate-400 font-mono">
              System: {vatRule.digitalSystem}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/10 py-5">
            <div>
              <span className="text-[11px] text-slate-400 block uppercase">Gross Store Price</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                {vatRule.currencySymbol}{amountNumber.toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-emerald-400 block uppercase font-bold">
                💰 Money Refunded to You
              </span>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
                +{vatRule.currencySymbol}{Math.round(estimatedRefund).toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                ~{refundPercent}% effective cash back
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block uppercase">Final Net Cost</span>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                {vatRule.currencySymbol}{Math.round(finalNetCost).toLocaleString()}
              </div>
            </div>
          </div>

          {!isQualifying ? (
            <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Minimum spend in {vatRule.countryName} is {vatRule.currencySymbol}{vatRule.minSpendLocal}. Add {vatRule.currencySymbol}{vatRule.minSpendLocal - amountNumber} more in the same store to qualify.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Eligible for Full Tax-Free Exemption!</span>
              </span>
              <span className="text-slate-400">
                Processed via Global Blue / Planet
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4-STEP AIRPORT VALIDATION PROCEDURE */}
      <div className="space-y-4">
        <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <span>Airport Kiosk Customs Validation Guide ({vatRule.digitalSystem})</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-2">Request at Boutique</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Show your physical passport at checkout. The clerk generates the official Tax-Free Form with barcoded invoice.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-2">Pack Items Accessible</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Do not pack items into checked luggage before customs validation. Customs officers reserve the right to inspect unworn goods.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-2">Scan at Digital Kiosk</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Locate the {vatRule.digitalSystem} kiosk before security. Scan the barcode on your form. Ensure the screen turns GREEN.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h5 className="font-bold text-xs text-slate-900 mt-2">Receive Cash / Card</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Card refunds deposit automatically within 5 business days. Cash refunds are paid immediately at the airport refund counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
