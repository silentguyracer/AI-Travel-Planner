'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Coins } from 'lucide-react';
import { gsap } from 'gsap';

interface CurrencyRate {
  code: string;
  symbol: string;
  rate: number;
  change: number; // simulated % change
  flag: string;
  name: string;
}

const BASE_RATES: CurrencyRate[] = [
  { code: 'EUR', symbol: '€', rate: 0.92,  change: 0.12,  flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79,  change: -0.08, flag: '🇬🇧', name: 'Pound' },
  { code: 'JPY', symbol: '¥', rate: 149.5, change: 0.31,  flag: '🇯🇵', name: 'Yen' },
  { code: 'INR', symbol: '₹', rate: 83.2,  change: -0.15, flag: '🇮🇳', name: 'Rupee' },
  { code: 'AUD', symbol: 'A\$', rate: 1.53, change: 0.05,  flag: '🇦🇺', name: 'AUD' },
  { code: 'CAD', symbol: 'C\$', rate: 1.36, change: -0.04, flag: '🇨🇦', name: 'CAD' },
  { code: 'CHF', symbol: 'Fr', rate: 0.89,  change: 0.07,  flag: '🇨🇭', name: 'Franc' },
  { code: 'SGD', symbol: 'S\$', rate: 1.34, change: 0.09,  flag: '🇸🇬', name: 'SGD' },
  { code: 'AED', symbol: 'د.إ', rate: 3.67, change: 0.00,  flag: '🇦🇪', name: 'Dirham' },
  { code: 'THB', symbol: '฿', rate: 35.1,  change: -0.22, flag: '🇹🇭', name: 'Baht' },
];

interface LiveCurrencyTickerProps {
  baseCurrency?: string;
  baseAmount?: number;
}

export default function LiveCurrencyTicker({
  baseCurrency = 'USD',
  baseAmount = 1,
}: LiveCurrencyTickerProps) {
  const [rates, setRates] = useState<CurrencyRate[]>(BASE_RATES);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rateRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Simulate small live fluctuations
  const jitterRates = useCallback(() => {
    setRates((prev) =>
      prev.map((r) => {
        const jitter = (Math.random() - 0.5) * 0.002;
        const newRate = parseFloat((r.rate + jitter).toFixed(4));
        const newChange = parseFloat((r.change + (Math.random() - 0.5) * 0.02).toFixed(3));
        return { ...r, rate: newRate, change: newChange };
      })
    );
  }, []);

  // Animate a specific rate span when it changes
  const flashRate = useCallback((index: number) => {
    const el = rateRefs.current[index];
    if (!el) return;
    gsap.fromTo(
      el,
      { color: '#4ade80', scale: 1.1 },
      { color: '#f1f5f9', scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      jitterRates();
      // Flash a random rate
      const randomIdx = Math.floor(Math.random() * BASE_RATES.length);
      flashRate(randomIdx);
    }, 2500);
    return () => clearInterval(interval);
  }, [jitterRates, flashRate]);

  // Ticker marquee animation
  useEffect(() => {
    if (!tickerRef.current) return;
    const ticker = tickerRef.current;
    const totalWidth = ticker.scrollWidth;

    gsap.to(ticker, {
      x: -totalWidth / 2,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        opacity: 0.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          jitterRates();
          setLastUpdated(new Date());
          setIsRefreshing(false);
        },
      });
    }
  };

  const displayRates = [...rates, ...rates]; // double for seamless loop

  return (
    <div
      ref={wrapperRef}
      className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl"
    >
      {/* Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Live Exchange · 1 {baseCurrency} =
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-500 font-medium">
            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ticker Track */}
      <div className="relative overflow-hidden py-2">
        <div
          ref={tickerRef}
          className="flex items-center gap-0 w-max"
        >
          {displayRates.map((rate, i) => {
            const convertedAmount = (baseAmount * rate.rate).toFixed(rate.rate > 10 ? 0 : 2);
            const isUp = rate.change >= 0;

            return (
              <div
                key={`${rate.code}-${i}`}
                className="flex items-center gap-2 px-4 py-1 border-r border-slate-800/50 flex-shrink-0"
              >
                <span className="text-base leading-none">{rate.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-white">{rate.code}</span>
                    <span
                      ref={(el) => { if (i < BASE_RATES.length) rateRefs.current[i] = el; }}
                      className="text-[11px] font-bold text-slate-100"
                    >
                      {rate.symbol}{convertedAmount}
                    </span>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[9px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    <span>{isUp ? '+' : ''}{rate.change.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-950/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-950/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
