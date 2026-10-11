'use client';

import React, { useState } from 'react';
import { Phone, BookOpen, Volume2, ShieldAlert, Zap, Globe, Check, VolumeX } from 'lucide-react';

interface TravelGuidebookProps {
  destination: string;
  country: string;
}

interface Phrase {
  english: string;
  local: string;
  phonetic: string;
}

const PHRASES_BY_COUNTRY: Record<
  string,
  { language: string; langCode: string; phrases: Phrase[] }
> = {
  japan: {
    language: 'Japanese',
    langCode: 'ja-JP',
    phrases: [
      { english: 'Hello / Good afternoon', local: 'こんにちは', phonetic: 'Konnichiwa' },
      { english: 'Thank you very much', local: 'ありがとうございます', phonetic: 'Arigatou gozaimasu' },
      { english: 'Excuse me / Sorry', local: 'すみません', phonetic: 'Sumimasen' },
      { english: 'The bill, please', local: 'お会計をお願いします', phonetic: 'O-kaikei o onegaishimasu' },
      { english: 'Where is the restroom?', local: 'トイレはどこですか？', phonetic: 'Toire wa doko desu ka?' },
      { english: 'How much is this?', local: 'これはいくらですか？', phonetic: 'Kore wa ikura desu ka?' },
      { english: 'Delicious!', local: '美味しい！', phonetic: 'Oishii!' },
      { english: 'Do you speak English?', local: '英語を話せますか？', phonetic: 'Eigo o hanasemasu ka?' },
    ],
  },
  france: {
    language: 'French',
    langCode: 'fr-FR',
    phrases: [
      { english: 'Hello / Good day', local: 'Bonjour', phonetic: 'Bohn-zhoor' },
      { english: 'Thank you very much', local: 'Merci beaucoup', phonetic: 'Mair-see boh-koo' },
      { english: 'Please', local: "S'il vous plaît", phonetic: 'Seel voo play' },
      { english: 'The bill, please', local: "L'addition, s'il vous plaît", phonetic: 'Lah-dee-syohn seel voo play' },
      { english: 'Where is the restroom?', local: 'Où sont les toilettes ?', phonetic: 'Oo soh lay twah-let?' },
      { english: 'How much does it cost?', local: 'Combien ça coûte ?', phonetic: 'Kohm-byen sah koot?' },
      { english: 'Excuse me', local: 'Excusez-moi / Pardon', phonetic: 'Ex-kew-zay mwah' },
      { english: 'Do you speak English?', local: 'Parlez-vous anglais ?', phonetic: 'Par-lay voo ahn-glay?' },
    ],
  },
  italy: {
    language: 'Italian',
    langCode: 'it-IT',
    phrases: [
      { english: 'Hello', local: 'Ciao / Buongiorno', phonetic: 'Chow / Bwon-zhor-no' },
      { english: 'Thank you very much', local: 'Grazie mille', phonetic: 'Graht-zyeh meel-leh' },
      { english: 'Please', local: 'Per favore', phonetic: 'Pair fah-voh-reh' },
      { english: 'The bill, please', local: 'Il conto, per favore', phonetic: 'Eel kon-toh pair fah-voh-reh' },
      { english: 'Where is the bathroom?', local: "Dov'è il bagno?", phonetic: 'Doh-veh eel bahn-yoh?' },
      { english: 'How much is this?', local: 'Quanto costa?', phonetic: 'Kwan-toh koh-stah?' },
      { english: 'Delicious!', local: 'Delizioso!', phonetic: 'Deh-leetz-yoh-zoh!' },
      { english: 'Do you speak English?', local: 'Parla inglese?', phonetic: 'Par-lah een-gleh-zeh?' },
    ],
  },
  spain: {
    language: 'Spanish',
    langCode: 'es-ES',
    phrases: [
      { english: 'Hello / Good morning', local: 'Hola / Buenos días', phonetic: 'Oh-lah / Bway-nos dee-as' },
      { english: 'Thank you very much', local: 'Muchas gracias', phonetic: 'Moo-chas grah-syas' },
      { english: 'Please', local: 'Por favor', phonetic: 'Por fah-vor' },
      { english: 'The bill, please', local: 'La cuenta, por favor', phonetic: 'Lah kwen-tah por fah-vor' },
      { english: 'Where is the restroom?', local: '¿Dónde está el baño?', phonetic: 'Dohn-deh es-tah el bahn-yo?' },
      { english: 'How much is it?', local: '¿Cuánto cuesta?', phonetic: 'Kwan-toh kwes-tah?' },
      { english: 'Excuse me', local: 'Disculpe / Perdón', phonetic: 'Dees-kool-peh / Pair-dohn' },
      { english: 'Do you speak English?', local: '¿Habla inglés?', phonetic: 'Ah-blah een-gles?' },
    ],
  },
};

export default function TravelGuidebook({ destination, country }: TravelGuidebookProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  const countryLower = country.toLowerCase();
  const destLower = destination.toLowerCase();

  let countryKey = 'japan';
  if (countryLower.includes('france') || destLower.includes('paris') || destLower.includes('nice')) {
    countryKey = 'france';
  } else if (countryLower.includes('ital') || destLower.includes('rome') || destLower.includes('florence') || destLower.includes('venice')) {
    countryKey = 'italy';
  } else if (countryLower.includes('spain') || destLower.includes('barcelona') || destLower.includes('madrid')) {
    countryKey = 'spain';
  }

  const phrasebook = PHRASES_BY_COUNTRY[countryKey] || PHRASES_BY_COUNTRY.japan;

  // Emergency Numbers
  const emergencyInfo = countryKey === 'japan'
    ? { police: '110', ambulance: '119', general: '110 / 119', plugs: 'Type A & B (100V, 50/60Hz)' }
    : countryKey === 'france' || countryKey === 'italy' || countryKey === 'spain'
    ? { police: '112', ambulance: '112 / 15', general: '112 (EU Universal)', plugs: 'Type C & E/F (230V, 50Hz)' }
    : { police: '911 / 112', ambulance: '911 / 112', general: '112 (Global GSM)', plugs: 'Universal standard' };

  const handleCopyPhrase = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    }
  };

  const handleSpeakPhrase = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = phrasebook.langCode;
    utterance.rate = 0.85;

    setSpeakingIdx(idx);
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Pocket Travel Guide
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Language, Voice Audio & Safety for {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any phrase to hear authentic native speech pronunciation and view emergency contacts
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-700">Language: {phrasebook.language}</span>
        </div>
      </div>

      {/* Grid: Phrasebook & Emergency Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phrasebook Column (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-base text-slate-900">
                Handy {phrasebook.language} Phrases
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Click 🔊 for audio pronunciation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {phrasebook.phrases.map((phrase, idx) => (
              <div
                key={idx}
                onClick={(e) => handleSpeakPhrase(phrase.local, idx, e)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  speakingIdx === idx
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200/80 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{phrase.english}</span>
                    <p className="font-bold text-slate-900 text-base mt-0.5 group-hover:text-indigo-600 transition-colors">
                      {phrase.local}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleSpeakPhrase(phrase.local, idx, e)}
                    title="Hear native pronunciation"
                    className={`p-2 rounded-xl border transition-colors ${
                      speakingIdx === idx
                        ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                        : 'bg-white text-slate-600 hover:text-indigo-600 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 font-semibold italic">
                    &ldquo;{phrase.phonetic}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyPhrase(phrase.local, idx, e)}
                    className="text-[10px] text-slate-400 hover:text-indigo-600 font-medium flex items-center gap-1"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency & Electrical Info Column (1/3 width) */}
        <div className="space-y-6">
          {/* Emergency Card */}
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-3xl p-6 shadow-md shadow-rose-500/20 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-200" />
              <h4 className="font-bold text-base">Emergency Hotlines</h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md flex items-center justify-between">
                <span>Police Helpline:</span>
                <span className="font-black text-sm">{emergencyInfo.police}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md flex items-center justify-between">
                <span>Ambulance & Fire:</span>
                <span className="font-black text-sm">{emergencyInfo.ambulance}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md flex items-center justify-between">
                <span>Universal GSM Emergency:</span>
                <span className="font-black text-sm">{emergencyInfo.general}</span>
              </div>
            </div>

            <p className="text-[11px] text-rose-100 leading-snug">
              Dialable from any unlocked mobile phone without a local SIM card.
            </p>
          </div>

          {/* Electrical & Voltage Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-base text-slate-900">Power & Plugs</h4>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <span className="text-slate-500 font-medium block">Standard Sockets:</span>
              <p className="font-bold text-slate-800 text-sm">{emergencyInfo.plugs}</p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              We suggest packing a multi-region universal travel adapter for your phone and laptops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
