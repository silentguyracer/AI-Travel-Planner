'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Play, Pause, Square, Volume2, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { ItineraryDay } from '@/types/travel';
import { animateAudioWaveform } from '@/lib/gsapAnimations';

interface AudioTourGuideProps {
  day: ItineraryDay;
  destination: string;
}

export default function AudioTourGuide({ day, destination }: AudioTourGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = animateAudioWaveform(waveformRef.current, isPlaying);
    return () => {
      tl?.kill();
    };
  }, [isPlaying]);

  // Build narration script
  const script = `Welcome to Day ${day.day} of your journey in ${destination}. Today's theme is ${day.theme}. 
${day.schedule
  .map(
    (act, i) =>
      `Stop number ${i + 1} is ${act.activity} at ${act.locationName || 'the city center'}, scheduled for ${act.timeSlot} at ${act.time}. ${act.description}. Insider tip: ${act.tip}.`
  )
  .join(' ')} 
${day.diningRecommendation ? `For culinary delights today, we recommend lunch at ${day.diningRecommendation.lunch || 'a local favourite'}, and dinner at ${day.diningRecommendation.dinner || 'a top-rated restaurant'}.` : ''} Enjoy this remarkable day in ${destination}!`;

  const handlePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Audio speech synthesis is not supported on this browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-900/50 space-y-5">
      {/* Player Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Headphones className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                AI Voice Tour Guide
              </span>
              <span className="text-xs text-slate-400">Day {day.day} Audio Narration</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mt-1">
              Audio Walkthrough: {day.title}
            </h4>
          </div>
        </div>

        {/* Audio Waveform Animation when playing */}
        <div
          ref={waveformRef}
          className={`flex items-center gap-1 h-6 px-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 transition-opacity duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <span className="audio-bar w-1 bg-indigo-400 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-indigo-300 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-indigo-200 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-indigo-400 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-sky-300 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-indigo-300 rounded-full h-5 origin-bottom" />
          <span className="audio-bar w-1 bg-indigo-400 rounded-full h-5 origin-bottom" />
        </div>
      </div>

      {/* Audio Player Controls Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Play / Pause / Stop Buttons */}
        <div className="flex items-center gap-2.5">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isPaused ? 'Resume Narration' : 'Play Audio Tour'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Pause className="w-4 h-4 fill-slate-950" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs disabled:opacity-30 transition-colors"
            title="Stop narration"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector & Transcript Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Speed:</span>
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  speechRate === rate ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showTranscript ? 'Hide Script' : 'Read Transcript'}</span>
          </button>
        </div>
      </div>

      {/* Script Transcript Reader */}
      {showTranscript && (
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto space-y-2 animate-in fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Audio Tour Transcript
          </span>
          <p>{script}</p>
        </div>
      )}
    </div>
  );
}
