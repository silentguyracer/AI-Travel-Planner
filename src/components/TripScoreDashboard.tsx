'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TripPlan } from '@/types/travel';
import { gsap } from 'gsap';
import { Star, Zap, MapPin, Utensils, Camera, Shield, TrendingUp } from 'lucide-react';

interface TripScoreDashboardProps {
  trip: TripPlan;
}

interface ScoreMetric {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

function computeScores(trip: TripPlan): ScoreMetric[] {
  const daysCount = trip.itinerary?.length || 0;
  const activitiesPerDay = daysCount > 0
    ? (trip.itinerary.reduce((sum, d) => sum + d.schedule.length, 0) / daysCount)
    : 0;

  const diversityStyles = (trip.travelStyles?.length ?? 0);
  const placesCount = trip.placesToVisit?.length || 0;
  const restaurantsCount = trip.restaurants?.length || 0;

  const attractionScore = Math.min(100, Math.round((placesCount / 10) * 100));
  const diningScore = Math.min(100, Math.round((restaurantsCount / 8) * 100));
  const activityScore = Math.min(100, Math.round((activitiesPerDay / 6) * 100));
  const styleScore = Math.min(100, Math.round((diversityStyles / 4) * 100)) || 60;
  const budgetScore = trip.budget === 'luxury' ? 95 : trip.budget === 'moderate' ? 78 : 62;
  const durationScore = Math.min(100, Math.round((daysCount / 14) * 100));

  return [
    { label: 'Attractions', value: attractionScore, max: 100, color: '#6366f1', icon: MapPin, description: `${placesCount} curated spots` },
    { label: 'Dining',      value: diningScore,     max: 100, color: '#f97316', icon: Utensils, description: `${restaurantsCount} restaurants` },
    { label: 'Activities',  value: activityScore,   max: 100, color: '#22c55e', icon: Zap, description: `${activitiesPerDay.toFixed(1)}/day avg` },
    { label: 'Photography', value: styleScore,      max: 100, color: '#eab308', icon: Camera, description: `${diversityStyles} travel styles` },
    { label: 'Budget Fit',  value: budgetScore,     max: 100, color: '#0ea5e9', icon: Shield, description: `${trip.budget} tier` },
    { label: 'Duration',    value: durationScore,   max: 100, color: '#a855f7', icon: TrendingUp, description: `${daysCount}-day trip` },
  ];
}

export default function TripScoreDashboard({ trip }: TripScoreDashboardProps) {
  const scores = computeScores(trip);
  const overallScore = Math.round(scores.reduce((sum, s) => sum + s.value, 0) / scores.length);
  const [displayOverall, setDisplayOverall] = useState(0);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Animate overall counter
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: overallScore,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2,
      onUpdate: () => setDisplayOverall(Math.round(obj.val)),
    });

    // Animate bars
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const target = scores[i].value;
      gsap.from(bar, {
        width: '0%',
        duration: 0.9,
        delay: 0.1 * i + 0.3,
        ease: 'power2.out',
      });
      gsap.to(bar, {
        width: `${target}%`,
        duration: 0.9,
        delay: 0.1 * i + 0.3,
        ease: 'power2.out',
      });
    });

    // Card entrance
    if (cardRef.current) {
      gsap.from(cardRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    }

    return () => { tween.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallScore]);

  const scoreLabel =
    overallScore >= 90 ? 'Exceptional ✨' :
    overallScore >= 75 ? 'Excellent 🌟' :
    overallScore >= 60 ? 'Great 👍' :
    'Good 👌';

  const scoreGradient =
    overallScore >= 90 ? 'from-amber-500 to-yellow-400' :
    overallScore >= 75 ? 'from-indigo-500 to-sky-400' :
    overallScore >= 60 ? 'from-emerald-500 to-teal-400' :
    'from-slate-500 to-slate-400';

  return (
    <div ref={cardRef} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${scoreGradient} p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Trip Intelligence Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black leading-none">{displayOverall}</span>
              <span className="text-lg font-bold opacity-70">/100</span>
            </div>
            <p className="text-sm font-bold mt-1 opacity-90">{scoreLabel}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Score Bars */}
      <div className="p-5 space-y-3.5">
        {scores.map((score, i) => {
          const Icon = score.icon;
          return (
            <div key={score.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span style={{ color: score.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-slate-700">{score.label}</span>
                  <span className="text-[10px] text-slate-400">{score.description}</span>
                </div>
                <span className="text-xs font-black" style={{ color: score.color }}>
                  {score.value}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  ref={(el) => { barRefs.current[i] = el; }}
                  className="h-full rounded-full"
                  style={{
                    width: `${score.value}%`,
                    background: `linear-gradient(90deg, ${score.color}, ${score.color}99)`,
                    boxShadow: `0 0 8px ${score.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="px-5 pb-4 text-[10px] text-slate-400 font-medium">
        Score calculated from attractions count, dining variety, activities density, travel styles & budget tier.
      </div>
    </div>
  );
}
