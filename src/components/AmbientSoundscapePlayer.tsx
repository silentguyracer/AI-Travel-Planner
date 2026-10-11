'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Headphones,
  Sparkles,
  Radio,
  Sliders,
  Waves
} from 'lucide-react';

interface AmbientSoundscapePlayerProps {
  destination: string;
}

type SoundscapeMode = 'kyoto_zen' | 'paris_cafe' | 'tokyo_neon' | 'mediterranean_sea';

interface SoundscapePreset {
  id: SoundscapeMode;
  name: string;
  icon: string;
  tagline: string;
  description: string;
}

const SOUNDSCAPES: SoundscapePreset[] = [
  {
    id: 'kyoto_zen',
    name: 'Zen Garden & Temple Rain',
    icon: '⛩️',
    tagline: 'Kyoto, Japan',
    description: 'Gentle raindrops falling on wooden eaves, rustling bamboo, and meditative temple tranquility.',
  },
  {
    id: 'paris_cafe',
    name: 'Sidewalk Bistro & Accordion',
    icon: '🥐',
    tagline: 'Paris, France',
    description: 'Warm cafe reverberations, soft clinking porcelain, and gentle Parisian atmospheric melodies.',
  },
  {
    id: 'tokyo_neon',
    name: 'Neon Metropolis & Rain',
    icon: '🏮',
    tagline: 'Tokyo, Japan',
    description: 'Low midnight urban frequencies, illuminated subway chimes, and electric evening city pulse.',
  },
  {
    id: 'mediterranean_sea',
    name: 'Coastal Azure Waves',
    icon: '🌊',
    tagline: 'Mediterranean Riviera',
    description: 'Rhythmic sea swells washing over warm pebbles and refreshing ocean coastal breeze.',
  },
];

export default function AmbientSoundscapePlayer({ destination }: AmbientSoundscapePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeMode>('kyoto_zen');
  const [volume, setVolume] = useState<number>(0.5);
  const [isNarrating, setIsNarrating] = useState(false);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const soundNodesRef = useRef<Array<AudioNode | { stop?: () => void }>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop current Web Audio nodes
  const stopAudio = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    soundNodesRef.current.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        if ('disconnect' in node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {
        // ignore
      }
    });
    soundNodesRef.current = [];
  }, []);

  // Initialize Audio Context on demand
  const getOrCreateAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = volume;
      gain.connect(audioCtxRef.current.destination);
      masterGainRef.current = gain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Generate procedural sound synthesis using Web Audio API
  const startSoundscape = useCallback((mode: SoundscapeMode) => {
    stopAudio();
    const ctx = getOrCreateAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (mode === 'kyoto_zen') {
      // 1. Rain noise generator (pink noise filtered)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.08;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 950;

      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.22;

      whiteNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      whiteNoise.start();
      soundNodesRef.current.push(whiteNoise, rainFilter, rainGain);

      // 2. Periodic Shishi-Odoshi / Bell resonance
      const playBellClack = () => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(293.66, ctx.currentTime + 1.8);

        bellGain.gain.setValueAtTime(0.12, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

        osc.connect(bellGain);
        bellGain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      };

      playBellClack();
      timerRef.current = setInterval(playBellClack, 7000);
    } else if (mode === 'mediterranean_sea') {
      // Ocean wave swell using modulated bandpass noise
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.18;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'bandpass';
      waveFilter.frequency.value = 350;
      waveFilter.Q.value = 1.2;

      // LFO for wave swells (0.12 Hz = approx 8 sec wave cycle)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 280;
      lfo.connect(waveFilter.frequency);

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.35;

      noise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(master);

      noise.start();
      lfo.start();
      soundNodesRef.current.push(noise, lfo, waveFilter, waveGain, lfoGain);
    } else if (mode === 'paris_cafe') {
      // Soft warm café warmth with subtle accordion triad drone
      const baseFreqs = [220, 277.18, 329.63]; // A major warm triad
      baseFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        chordGain.gain.value = 0.035 / (idx + 1);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;

        osc.connect(filter);
        filter.connect(chordGain);
        chordGain.connect(master);
        osc.start();
        soundNodesRef.current.push(osc, filter, chordGain);
      });
    } else {
      // Tokyo neon midnight: deep ambient drone & subtle shimmer
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 110; // A2 deep drone

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.08;

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 440; // Harmonic shimmer

      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.02;

      osc.connect(droneGain);
      droneGain.connect(master);
      osc2.connect(shimmerGain);
      shimmerGain.connect(master);

      osc.start();
      osc2.start();
      soundNodesRef.current.push(osc, osc2, droneGain, shimmerGain);
    }
  }, [stopAudio, volume]);

  // Handle master volume changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [stopAudio]);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startSoundscape(activeSoundscape);
      setIsPlaying(true);
    }
  };

  const handleSelectSoundscape = (mode: SoundscapeMode) => {
    setActiveSoundscape(mode);
    if (isPlaying) {
      startSoundscape(mode);
    }
  };

  // AI Audio Storyteller (Narration using Web Speech)
  const handleToggleNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationScript = `Welcome to ${destination}. As you begin this journey, immerse yourself in the living rhythm of the city. From quiet morning alleyways where the aroma of fresh baking fills the cool air, to centuries-old architectural landmarks standing proud against the shifting skyline. Every neighborhood tells a story of heritage, culinary dedication, and vibrant community. Take your time, walk at your own pace, and let the unexpected discoveries become the greatest memories of your trip. WanderAI is here to guide every step of your adventure.`;

    const utterance = new SpeechSynthesisUtterance(narrationScript);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsNarrating(true);
      // Auto-start ambient soundscape gently if not playing
      if (!isPlaying) {
        startSoundscape(activeSoundscape);
        setIsPlaying(true);
      }
    };
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden space-y-6">
      {/* Background glow visual */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-indigo-300" />
              <span>Spatial Ambient Soundscapes & Storyteller</span>
            </span>
            <span className="text-xs text-slate-400">
              Procedural Web Audio Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Immersive Soundscapes for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Listen to ambient procedural atmospheres while exploring your trip plan, or listen to the AI narrative audio overview.
          </p>
        </div>

        {/* Master Play & Narration Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleNarration}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isNarrating
                ? 'bg-amber-500 text-slate-950 animate-pulse ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-300" />
            <span>{isNarrating ? 'Pause Audio Story' : 'Play AI Destination Story'}</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`p-3 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center ${
              isPlaying
                ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
            title={isPlaying ? 'Pause Ambient Soundscape' : 'Play Ambient Soundscape'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Preset Soundscapes Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {SOUNDSCAPES.map((preset) => {
          const isSelected = activeSoundscape === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectSoundscape(preset.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/15 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{preset.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {preset.tagline}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{preset.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {isSelected && isPlaying && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-[10px] font-bold uppercase text-emerald-400 ml-1">
                    Streaming Audio
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Audio Controls Bar */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Waves className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold">
            Status: {isPlaying ? 'Playing Audio' : 'Paused (Tap Play to Activate)'}
          </span>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
            className="text-slate-400 hover:text-white"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-indigo-400 cursor-pointer"
            title="Adjust Ambient Volume"
          />
          <span className="font-mono text-[11px] text-slate-400 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
