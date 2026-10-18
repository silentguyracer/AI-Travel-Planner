'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  X,
  Compass,
  Clock,
  Shirt,
  MapPin,
  UtensilsCrossed,
  ShieldAlert,
  Send,
  Radio,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { TripPlan } from '@/types/travel';

interface AICopilotVoiceHUDProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  category?: 'alert' | 'recommendation' | 'etiquette' | 'weather';
}

export default function AICopilotVoiceHUD({ trip, isOpen, onClose }: AICopilotVoiceHUDProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeVoiceSpeed, setActiveVoiceSpeed] = useState<number>(1.0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      text: `Greetings traveler! I'm your WanderAI Autonomous Flight & Ground Copilot for ${trip.destination}. I'm synced with your ${trip.duration}-day ${trip.budget} itinerary. Ask me anything via voice or quick prompts!`,
      timestamp: 'Just now',
      category: 'recommendation'
    }
  ]);

  const quickPrompts = [
    { label: '🌤️ What to wear right now?', query: `What should I pack or wear today in ${trip.destination}?` },
    { label: '🍵 Nearest hidden spot', query: `Recommend a peaceful hidden gem or secret tea/coffee spot in ${trip.destination} away from crowds.` },
    { label: '🗣️ Order food like a local', query: `How do I politely order food and ask for the bill in the local language of ${trip.destination}?` },
    { label: '🚨 Local safety alert', query: `What are the most important neighborhood safety tips and common tourist traps in ${trip.destination}?` },
    { label: '⚡ Optimize afternoon schedule', query: `How should I best structure my afternoon between attractions to avoid peak traffic?` },
  ];

  // Synthesize Speech using Web Speech API
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown/emojis for cleaner speech
    const cleanText = text.replace(/[*_#`]/g, '').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = activeVoiceSpeed;
    utterance.pitch = 1.05;

    // Pick English or local accent if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Live Audio Waveform Canvas Animation
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += isSpeaking || isListening ? 0.08 : 0.02;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseAmp = isSpeaking ? 24 : isListening ? 18 : 6;
        const amp = baseAmp - w * 4;
        const freq = 0.015 + w * 0.005;
        const color = isSpeaking
          ? `rgba(99, 102, 241, ${0.7 - w * 0.2})`
          : isListening
          ? `rgba(239, 68, 68, ${0.8 - w * 0.25})`
          : `rgba(148, 163, 184, ${0.4 - w * 0.1})`;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5 - w * 0.5;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * freq + step + w) * Math.cos(x * 0.004 + step) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isSpeaking, isListening, isMinimized]);

  // Voice Recognition via Web Speech API
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    // Check for SpeechRecognition
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Generate intelligent contextual response
  const generateCopilotResponse = (query: string): string => {
    const q = query.toLowerCase();
    const dest = trip.destination;

    if (q.includes('wear') || q.includes('pack') || q.includes('clothes') || q.includes('weather')) {
      return `For ${dest}, layer lightweight breathable clothing with comfortable walking shoes. Bring a compact windproof umbrella and a light fleece or cardigan for air-conditioned transit and brisk evenings. Sunglasses and SPF 50 are recommended!`;
    }
    if (q.includes('hidden') || q.includes('secret') || q.includes('peaceful') || q.includes('gem')) {
      return `Hidden gem alert for ${dest}: Seek out the quiet side-alley artisan cafes or historical backstreets 3 blocks away from the main square. Early mornings between 07:30 and 09:00 offer stunning crowd-free photography before tour buses arrive.`;
    }
    if (q.includes('order') || q.includes('language') || q.includes('food') || q.includes('bill')) {
      return `When dining in ${dest}, always greet your server with a polite smile. To request the check, make a discreet signing gesture or say the local phrase for "The bill, please". Tipping is generally modest or rounded up to the nearest round note.`;
    }
    if (q.includes('safety') || q.includes('trap') || q.includes('scam') || q.includes('emergency')) {
      return `Safety briefing for ${dest}: Always keep backpacks zipped and held in front on crowded metro trains. Ignore uninvited street strangers offering free friendship bracelets, petitions, or unsolicited photo assistance. Keep emergency numbers stored in your phone!`;
    }
    if (q.includes('optimize') || q.includes('route') || q.includes('time') || q.includes('schedule')) {
      return `For Day ${trip.itinerary[0]?.day || 1} in ${dest}, group your northern attractions together in the morning to minimize subway transfers. Reserve 13:30–15:00 for indoor museums during peak midday heat, and head to high vantage points for 18:00 sunset views.`;
    }

    return `Understood! With your ${trip.budget} pace in ${dest}, I recommend allowing 45-minute buffers between main stops. Check local opening hours before visiting, and stay hydrated while exploring!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate copilot reply
    setTimeout(() => {
      const replyText = generateCopilotResponse(text);
      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: replyText,
        timestamp: 'Just now',
        category: 'recommendation'
      };
      setMessages(prev => [...prev, copilotMsg]);
      speakText(replyText);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      {isMinimized ? (
        /* Minimized Floating Pill */
        <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 text-white rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-3 cursor-pointer hover:border-indigo-400 group"
          onClick={() => setIsMinimized(false)}>
          <div className="relative">
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
          </div>
          <span className="text-xs font-semibold tracking-wide">AI Flight Copilot Active</span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Full Holographic HUD Card */
        <div className="w-[380px] sm:w-[420px] bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.35)] overflow-hidden flex flex-col text-white">
          {/* Top Aerospace Bar */}
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 px-4 py-3 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Autonomous Copilot</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{trip.destination} • Ground & Air Intel</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  speechEnabled ? 'text-indigo-300 hover:bg-indigo-900/40' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={speechEnabled ? 'Mute Speech Narration' : 'Enable Speech Narration'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Minimize HUD"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Audio Waveform Canvas */}
          <div className="relative bg-slate-900/60 border-b border-indigo-500/10 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${isSpeaking ? 'text-indigo-400 animate-spin' : isListening ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                {isSpeaking ? 'Narrating Audio...' : isListening ? 'Listening via Mic...' : 'Telemetry Audio Standby'}
              </span>
            </div>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="text-[10px] text-indigo-300 hover:text-indigo-200 underline font-medium"
              >
                Stop Voice
              </button>
            )}
            <canvas ref={canvasRef} width={120} height={24} className="opacity-90" />
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 max-h-[300px] overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin scrollbar-thumb-indigo-900">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts Radar */}
          <div className="px-3 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/20 hover:border-indigo-400/50 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3 bg-slate-950 border-t border-indigo-500/20 flex items-center gap-2">
            <button
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/30'
                  : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak via Microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? 'Listening to speech...' : `Ask copilot about ${trip.destination}...`}
              className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-indigo-500/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden transition-colors"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
