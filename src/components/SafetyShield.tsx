'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Droplets,
  AlertTriangle,
  FileText,
  Hospital,
  Flame,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SafetyShieldProps {
  destination: string;
  country: string;
}

interface DestinationScam {
  title: string;
  threatLevel: 'High' | 'Medium' | 'Low';
  location: string;
  howItWorks: string;
  preventionTip: string;
}

interface SafetyProfile {
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    touristHotline?: string;
  };
  tapWaterDrinkable: boolean;
  tapWaterNote: string;
  generalSafetyRating: 'Very High' | 'High' | 'Moderate' | 'Exercise Caution';
  emergencyHospital: string;
  scams: DestinationScam[];
}

const SAFETY_PROFILES: Record<string, SafetyProfile> = {
  japan: {
    emergencyNumbers: {
      police: '110',
      ambulance: '119',
      fire: '119',
      touristHotline: '050-3816-2787 (Japan Visitor Hotline)',
    },
    tapWaterDrinkable: true,
    tapWaterNote: 'Tap water across Japan is strictly filtered, crystal clear, and completely safe to drink.',
    generalSafetyRating: 'Very High',
    emergencyHospital: 'St. Luke’s International Hospital (Tokyo) or local Red Cross Hospital (English assistance available).',
    scams: [
      {
        title: 'Kabukicho / Roppongi Nightlife Tout Scam',
        threatLevel: 'High',
        location: 'Tokyo (Shinjuku Kabukicho, Roppongi)',
        howItWorks: 'Friendly street touts invite you into an "all-you-can-drink" speakeasy for $20. Later, you are presented with extortionate "seating fees" and forced to pay thousands under intimidation.',
        preventionTip: 'Never follow street touts or bar promoters into establishments. Only visit bars with published menus or official reservations.',
      },
      {
        title: 'Fake Monk Blessing & Amulet Donation',
        threatLevel: 'Medium',
        location: 'Ueno Park, Senso-ji Temple grounds (Tokyo)',
        howItWorks: 'A person dressed in Buddhist robes approaches you, presses a gold amulet or bracelet into your palm, signs a peace book, then aggressively demands 5,000-10,000 JPY donation.',
        preventionTip: 'Real Buddhist monks in Japan never walk up to tourists offering trinkets for cash. Firmly shake your head and walk away without touching the item.',
      },
      {
        title: 'Shinkansen Luggage Storage Confusion',
        threatLevel: 'Low',
        location: 'Tokaido Shinkansen (Tokyo-Kyoto-Osaka)',
        howItWorks: 'Baggage over 160cm-250cm (total dimensions) requires an advance oversized baggage seat reservation. Failure to book incurs a 1,000 JPY penalty and relocation of bags.',
        preventionTip: 'Reserve the "Seats with an Oversized Baggage Area" in advance on SmartEX or at JR ticket machines.',
      },
    ],
  },
  france: {
    emergencyNumbers: {
      police: '17',
      ambulance: '15',
      fire: '18',
      touristHotline: '112 (Universal European Emergency Number)',
    },
    tapWaterDrinkable: true,
    tapWaterNote: 'Tap water ("eau de robinet") in France is safe and widely drinkable. Asking for "une carafe d’eau" in restaurants is free by law.',
    generalSafetyRating: 'High',
    emergencyHospital: 'Hôpital Européen Georges-Pompidou or Hôpital Cochin (Paris).',
    scams: [
      {
        title: 'The Friendship String / Friendship Bracelet Trap',
        threatLevel: 'High',
        location: 'Montmartre (Sacre-Cœur stairs, Paris)',
        howItWorks: 'Men grab your wrist to tie a colorful woven string bracelet, tighten it so you cannot remove it, and aggressively demand €10-€20 while accomplices surround you.',
        preventionTip: 'Keep your hands in your pockets or close to your body when walking up the Sacré-Cœur steps. Avoid eye contact and say a loud, firm "Non!".',
      },
      {
        title: 'Deaf Charity Petition Distraction',
        threatLevel: 'High',
        location: 'Eiffel Tower, Louvre Courtyard, Notre-Dame',
        howItWorks: 'Young people holding clipboards pretend to be deaf and ask you to sign a petition for children. While you hold the clipboard and sign, a partner unzips your backpack or pockets.',
        preventionTip: 'Legitimate charities never canvas tourists with clipboards near monuments. Wave them away and keep walking.',
      },
      {
        title: 'The Dropped Gold Ring',
        threatLevel: 'Medium',
        location: 'Pont des Arts, Seine walkways, Tuileries',
        howItWorks: 'Someone pretends to spot a heavy gold wedding band right by your feet, picks it up, insists you dropped it, and then offers to sell it to you for €50 because they "cannot keep it".',
        preventionTip: 'The ring is made of worthless brass. Completely ignore anyone claiming to have found jewelry beside you.',
      },
    ],
  },
  italy: {
    emergencyNumbers: {
      police: '113',
      ambulance: '118',
      fire: '115',
      touristHotline: '112 (Universal Emergency)',
    },
    tapWaterDrinkable: true,
    tapWaterNote: 'Tap water and outdoor "Nasoni" drinking fountains in Rome, Florence, and Milan are mountain-fed and deliciously safe.',
    generalSafetyRating: 'High',
    emergencyHospital: 'Policlinico Umberto I (Rome) or Ospedale Santa Maria Nuova (Florence).',
    scams: [
      {
        title: 'Gladiator Photo Ambush',
        threatLevel: 'High',
        location: 'Colosseum perimeter & Roman Forum (Rome)',
        howItWorks: 'Men dressed in Roman centurion armor invite you to take a "friendly" selfie with their helmet or sword. Once the photo is captured, they aggressively demand €20-€50 per person.',
        preventionTip: 'Gladiator costumes around the Colosseum are illegal under Rome municipal ordinances. Avoid photos with them entirely.',
      },
      {
        title: 'The "Unmarked Taxi" or Broken Meter Trick',
        threatLevel: 'Medium',
        location: 'Fiumicino/Ciampino Airports, Roma Termini train station',
        howItWorks: 'Drivers approach travelers inside arrival terminals offering taxi rides. Once at the destination, they charge €90-€150 instead of the official flat €50 city fee.',
        preventionTip: 'Only use the official white taxi queue outside the terminal. By law, airport-to-central Rome is a flat fixed €50 rate including luggage.',
      },
      {
        title: 'Unsolicited Rose or Rosemary Sprig',
        threatLevel: 'Medium',
        location: 'Piazza Navona, Spanish Steps, Florence Duomo',
        howItWorks: 'A stranger hands a woman a single rose or tucks a rosemary sprig into your collar as a "free gift for good luck", then demands money from the companion.',
        preventionTip: 'Keep your hands back; never take any flowers or charms placed toward your hands.',
      },
    ],
  },
  spain: {
    emergencyNumbers: {
      police: '091',
      ambulance: '061',
      fire: '080',
      touristHotline: '112 (Universal European Emergency Number)',
    },
    tapWaterDrinkable: true,
    tapWaterNote: 'Tap water in Madrid and throughout Spain meets strict EU standards and is 100% safe to drink.',
    generalSafetyRating: 'High',
    emergencyHospital: 'Hospital Clínic de Barcelona or Hospital Universitario La Paz (Madrid).',
    scams: [
      {
        title: 'The "Bird Dropping / Mustard" Stain Distraction',
        threatLevel: 'High',
        location: 'Las Ramblas, Gothic Quarter (Barcelona)',
        howItWorks: 'Someone subtly squirts mustard, chocolate, or fake bird poop on your shoulder. A polite passerby points it out and insists on helping you clean it with tissues while lifting your wallet.',
        preventionTip: 'If anyone points out a stain on your clothes in public, step away into an open shop to clean it yourself. Do not let strangers touch your clothes.',
      },
      {
        title: 'The Three-Cup / Trileros Shell Game',
        threatLevel: 'Medium',
        location: 'Las Ramblas (Barcelona), Plaza Mayor (Madrid)',
        howItWorks: 'Street operators play a sleight-of-hand ball-under-cup game with fake spectators making bets and "winning" easily. Once an innocent tourist places a €50 bet, you are guaranteed to lose.',
        preventionTip: 'These street games are organized crime syndicates with lookouts and pickpockets circling the crowd. Never stop to watch.',
      },
      {
        title: 'Rosemary Fortune Teller Blessing',
        threatLevel: 'Medium',
        location: 'Cathedral of Seville, Park Güell (Barcelona)',
        howItWorks: 'Women offer sprigs of rosemary for health and read your palm, then demand €10-€20 and curse you if you refuse.',
        preventionTip: 'Keep walking with a firm "No, gracias".',
      },
    ],
  },
};

export default function SafetyShield({ destination, country }: SafetyShieldProps) {
  const [expandedScamIdx, setExpandedScamIdx] = useState<number | null>(null);

  const countryLower = country.toLowerCase();
  const destLower = destination.toLowerCase();

  let profileKey = 'japan';
  if (countryLower.includes('france') || destLower.includes('paris') || destLower.includes('nice')) {
    profileKey = 'france';
  } else if (countryLower.includes('ital') || destLower.includes('rome') || destLower.includes('florence') || destLower.includes('venice')) {
    profileKey = 'italy';
  } else if (countryLower.includes('spain') || destLower.includes('barcelona') || destLower.includes('madrid')) {
    profileKey = 'spain';
  }

  const profile = SAFETY_PROFILES[profileKey] || SAFETY_PROFILES.japan;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Safety & Scam Defense Shield</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Safety Rating: {profile.generalSafetyRating}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Emergency Contacts & Tourist Scam Radar
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            One-tap emergency dialing, local scam countermeasures, tap water safety, and hospital emergency protocol for {destination}.
          </p>
        </div>
      </div>

      {/* EMERGENCY NUMBERS GRID */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-indigo-600" />
          <span>Instant Emergency Dialing (Tap to Call)</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Police */}
          <a
            href={`tel:${profile.emergencyNumbers.police}`}
            className="p-4 bg-blue-50/70 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold uppercase text-blue-700 bg-white px-2 py-0.5 rounded-full">
                Police
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-blue-950 font-mono">
                {profile.emergencyNumbers.police}
              </div>
              <div className="text-[11px] text-blue-700 font-semibold group-hover:underline mt-0.5">
                Tap to dial police
              </div>
            </div>
          </a>

          {/* Ambulance / Medical */}
          <a
            href={`tel:${profile.emergencyNumbers.ambulance}`}
            className="p-4 bg-rose-50/70 hover:bg-rose-100 rounded-2xl border border-rose-200 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Hospital className="w-5 h-5 text-rose-600" />
              <span className="text-[10px] font-bold uppercase text-rose-700 bg-white px-2 py-0.5 rounded-full">
                Ambulance
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-rose-950 font-mono">
                {profile.emergencyNumbers.ambulance}
              </div>
              <div className="text-[11px] text-rose-700 font-semibold group-hover:underline mt-0.5">
                Tap to dial medical
              </div>
            </div>
          </a>

          {/* Fire */}
          <a
            href={`tel:${profile.emergencyNumbers.fire}`}
            className="p-4 bg-amber-50/70 hover:bg-amber-100 rounded-2xl border border-amber-200 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-bold uppercase text-amber-700 bg-white px-2 py-0.5 rounded-full">
                Fire Dept
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-950 font-mono">
                {profile.emergencyNumbers.fire}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold group-hover:underline mt-0.5">
                Tap to dial fire
              </div>
            </div>
          </a>

          {/* Universal Tourist Hotline */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <ShieldAlert className="w-5 h-5 text-slate-600" />
              <span className="text-[10px] font-bold uppercase text-slate-700 bg-white px-2 py-0.5 rounded-full">
                Helpline
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {profile.emergencyNumbers.touristHotline || 'Dial 112 from any mobile'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Universal GSM emergency access</div>
            </div>
          </div>
        </div>
      </div>

      {/* HEALTH & WATER SAFETY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tap Water drinkability */}
        <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-600" />
            <h5 className="font-bold text-sm text-sky-950">Tap Water Drinkability</h5>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Safe to Drink
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile.tapWaterNote}
          </p>
        </div>

        {/* English Medical Facility */}
        <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-indigo-600" />
            <h5 className="font-bold text-sm text-indigo-950">Recommended Hospital for Travelers</h5>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {profile.emergencyHospital}
          </p>
        </div>
      </div>

      {/* KNOWN TOURIST SCAMS RADAR */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-extrabold text-base text-slate-900">
              Active Tourist Scams Radar for {destination}
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            Real incident reports & field defenses
          </span>
        </div>

        <div className="space-y-3">
          {profile.scams.map((scam, idx) => {
            const isExpanded = expandedScamIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => setExpandedScamIdx(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        scam.threatLevel === 'High'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : scam.threatLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {scam.threatLevel} Threat
                    </span>
                    <span className="font-bold text-sm text-slate-900">{scam.title}</span>
                    <span className="text-xs text-slate-400">({scam.location})</span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs animate-in fade-in">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">How it Works:</span>
                      <p className="text-slate-600 leading-relaxed">{scam.howItWorks}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-0.5">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Actionable Field Defense:</span>
                      </span>
                      <p className="text-emerald-900 leading-relaxed">{scam.preventionTip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EMERGENCY PROTOCOLS CHECKLIST */}
      <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-base text-white">Emergency Loss of Passport & Insurance Action Plan</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300">1. File Local Police Report</span>
            <p className="text-slate-300 leading-relaxed">
              Visit nearest police station (Koban in Japan / Commissariat in France). Request a written lost-item certificate number needed for insurance claims.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-amber-300">2. Emergency Embassy Passport</span>
            <p className="text-slate-300 leading-relaxed">
              Embassy can issue an Emergency Photo Travel Document within 24-48 hours. Keep digital photos of your passport info page in cloud storage.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">3. Insurance Claim File</span>
            <p className="text-slate-300 leading-relaxed">
              Retain all medical receipts, doctor diagnosis notes, taxi receipts, and police complaint numbers to file with your travel insurer immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
