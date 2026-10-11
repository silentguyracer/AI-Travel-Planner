'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ItineraryActivity, ItineraryDay } from '@/types/travel';
import { Bot, Send, X, Sparkles, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { gsap } from 'gsap';

interface SmartActivityEditorProps {
  activity: ItineraryActivity;
  dayIndex: number;
  activityIndex: number;
  destination: string;
  onApply: (updatedActivity: ItineraryActivity) => void;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Make it more budget-friendly',
  'Find a similar activity nearby',
  'Add a photography tip',
  'Best time to visit this spot',
  'Add family-friendly note',
  'Hidden gem alternative?',
];

export default function SmartActivityEditor({
  activity,
  dayIndex,
  activityIndex,
  destination,
  onApply,
  onClose,
}: SmartActivityEditorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI activity assistant 🤖\n\nYou're editing **${activity.activity}** at ${activity.locationName}. Tell me how you'd like to change it, or pick a quick action below.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<ItineraryActivity>(activity);
  const [hasDraft, setHasDraft] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (drawerRef.current) {
      gsap.from(drawerRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callAI = async (userMessage: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    const systemPrompt = `You are an expert travel itinerary editor for ${destination}.
The user wants to modify this activity:
- Activity: ${activity.activity}
- Location: ${activity.locationName}
- Time: ${activity.time} (${activity.timeSlot})
- Cost: ${activity.cost}
- Description: ${activity.description}
- Tip: ${activity.tip}

When suggesting changes, respond in this EXACT JSON format wrapped in <edit>...</edit> tags:
<edit>
{
  "activity": "updated activity name",
  "locationName": "updated location",
  "description": "updated description (2-3 sentences)",
  "cost": "updated cost estimate",
  "tip": "updated insider tip",
  "time": "${activity.time}",
  "timeSlot": "${activity.timeSlot}"
}
</edit>

Also provide a brief friendly explanation outside the JSON. Keep it concise.`;

    try {
      const storedKey = typeof window !== 'undefined'
        ? (localStorage.getItem('wanderai_gemini_key') || localStorage.getItem('wanderai_openai_key') || '')
        : '';

      const response = await fetch('/api/chat-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          question: `${userMessage}\n\nInstructions:\n${systemPrompt}`,
          tripContext: `Activity: ${activity.activity} at ${activity.locationName}`,
          customApiKey: storedKey || undefined,
        }),
      });

      // Fallback: parse locally if API doesn't support or returned generic
      let aiText = '';
      if (!response.ok) {
        aiText = generateLocalSuggestion(userMessage, activity, destination);
      } else {
        try {
          const data = await response.json();
          aiText = data?.reply || data?.suggestion || generateLocalSuggestion(userMessage, activity, destination);
        } catch {
          aiText = generateLocalSuggestion(userMessage, activity, destination);
        }
      }

      // Parse <edit> block if present
      const editMatch = aiText.match(/<edit>([\s\S]*?)<\/edit>/);
      if (editMatch) {
        try {
          const parsed = JSON.parse(editMatch[1].trim()) as Partial<ItineraryActivity>;
          const merged: ItineraryActivity = {
            ...activity,
            ...parsed,
            timeSlot: activity.timeSlot,
            time: activity.time,
          };
          setDraft(merged);
          setHasDraft(true);
          aiText = aiText.replace(/<edit>[\s\S]*?<\/edit>/, '').trim();
        } catch {
          // parse failed, show as text
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiText || 'Here is a suggestion for you!' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: generateLocalSuggestion(userMessage, activity, destination) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    callAI(msg);
  };

  const handleApply = () => {
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onApply(draft);
          onClose();
        },
      });
    } else {
      onApply(draft);
      onClose();
    }
  };

  const handleClose = () => {
    if (drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={drawerRef}
      className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-sky-600 p-4 text-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">AI Activity Editor</p>
            <p className="text-sm font-black leading-tight truncate max-w-[220px]">{activity.activity}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Activity Preview */}
      <div className="mx-4 mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex-shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Current</p>
        <p className="text-xs font-bold text-slate-900">{activity.locationName}</p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-3 mt-2 text-[11px]">
          <span className="text-indigo-600 font-bold">{activity.time}</span>
          <span className="text-emerald-600 font-bold">{activity.cost}</span>
        </div>
      </div>

      {/* Draft Preview if available */}
      {hasDraft && (
        <div className="mx-4 mt-3 p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Draft</p>
            <button
              onClick={() => { setDraft(activity); setHasDraft(false); }}
              className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
          <p className="text-xs font-bold text-indigo-900">{draft.locationName}</p>
          <p className="text-xs text-indigo-700 mt-0.5 line-clamp-2">{draft.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[11px]">
            <span className="text-indigo-600 font-bold">{draft.time}</span>
            <span className="text-emerald-600 font-bold">{draft.cost}</span>
          </div>
          <button
            onClick={handleApply}
            className="mt-2.5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Apply Changes to Itinerary
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
            >
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>
                  {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                  {j < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="bg-slate-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => callAI(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors border border-indigo-200 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe how to change this activity..."
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Local fallback when API is unavailable
function generateLocalSuggestion(
  prompt: string,
  activity: ItineraryActivity,
  destination: string,
): string {
  const lp = prompt.toLowerCase();

  if (lp.includes('budget') || lp.includes('cheap') || lp.includes('free')) {
    return (
      `Great idea! Here's a budget-friendly version of **${activity.activity}**:\n\n` +
      `<edit>{"activity":"${activity.activity} (Free Entry)","locationName":"${activity.locationName}","description":"Visit the exterior and surrounding area of ${activity.locationName} for free. Many viewpoints and street-level experiences are available without paying admission.","cost":"Free / \$0","tip":"Arrive early morning for the best light and fewest crowds.","time":"${activity.time}","timeSlot":"${activity.timeSlot}"}</edit>\n\n` +
      `Many popular sites in ${destination} have free access to exterior areas, nearby parks, or specific hours. This version keeps the spirit of the activity at zero cost!`
    );
  }

  if (lp.includes('photo') || lp.includes('camera') || lp.includes('instagram')) {
    return (
      `📸 Photography tips for **${activity.locationName}**:\n\n` +
      `<edit>{"activity":"${activity.activity} + Photography","locationName":"${activity.locationName}","description":"${activity.description} Best photography spots include the main entrance facade and the surrounding gardens. Golden hour (1hr after sunrise or before sunset) offers magical lighting conditions.","cost":"${activity.cost}","tip":"Bring a wide-angle lens for architectural shots. The best Instagram angle is from the northwest corner 45 minutes after sunrise.","time":"${activity.time}","timeSlot":"${activity.timeSlot}"}</edit>\n\n` +
      `Updated with insider photography spots and the optimal timing for Instagram-worthy shots!`
    );
  }

  if (lp.includes('family') || lp.includes('kids') || lp.includes('children')) {
    return (
      `🧒 Family-friendly version of **${activity.activity}**:\n\n` +
      `<edit>{"activity":"${activity.activity} (Family Edition)","locationName":"${activity.locationName}","description":"${activity.description} The site offers dedicated family tours, audio guides for children, and interactive exhibits. Stroller-friendly paths are available throughout.","cost":"${activity.cost} (children under 12 often free)","tip":"Ask at the entrance for the family activity booklet — it turns the visit into a scavenger hunt for kids.","time":"${activity.time}","timeSlot":"${activity.timeSlot}"}</edit>\n\n` +
      `Made it more engaging for families with young children!`
    );
  }

  if (lp.includes('hidden') || lp.includes('gem') || lp.includes('alternative') || lp.includes('nearby')) {
    return (
      `💎 Hidden gem near **${activity.locationName}** in ${destination}:\n\n` +
      `<edit>{"activity":"Local Hidden Gem Near ${activity.locationName}","locationName":"${activity.locationName} surroundings","description":"Skip the tourist crowds and explore the surrounding neighbourhood. Local cafés, artisan shops, and street murals are within a 5-minute walk from ${activity.locationName} and offer an authentic ${destination} experience.","cost":"Free – \$10","tip":"Ask a local barista for their top recommendation — locals always know the best-kept secrets.","time":"${activity.time}","timeSlot":"${activity.timeSlot}"}</edit>\n\n` +
      `Here's an off-the-beaten-path experience near ${activity.locationName} that most tourists miss!`
    );
  }

  // Generic enhancement
  return (
    `Here's an enhanced version of **${activity.activity}**:\n\n` +
    `<edit>{"activity":"${activity.activity} — Enhanced","locationName":"${activity.locationName}","description":"${activity.description} Consider booking in advance to skip queues. The experience is most rewarding with a certified local guide who can provide historical context and insider anecdotes.","cost":"${activity.cost}","tip":"${activity.tip} Pro tip: combine this with the neighbouring attraction to make a full half-day experience.","time":"${activity.time}","timeSlot":"${activity.timeSlot}"}</edit>\n\n` +
    `Enhanced with booking advice and local guide recommendations for a richer experience!`
  );
}
