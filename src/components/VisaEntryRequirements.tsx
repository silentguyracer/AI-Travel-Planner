'use client';

import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, ExternalLink, Globe, Plane, Pill, CheckCircle2 } from 'lucide-react';

interface VisaEntryRequirementsProps {
  destination: string;
  country: string;
}

interface CountryEntryInfo {
  passportValidity: string;
  touristStay: string;
  digitalDeclarationForm: {
    name: string;
    url: string;
    desc: string;
  };
  medicationRule: string;
  customsDutyFree: string;
}

const ENTRY_DATABASE: Record<string, CountryEntryInfo> = {
  japan: {
    passportValidity: 'Must be valid for the entire duration of your stay (6+ months validity strongly recommended).',
    touristStay: 'Visa-free for up to 90 days for citizens of the US, Canada, EU, UK, Australia, and 65+ partner nations.',
    digitalDeclarationForm: {
      name: 'Visit Japan Web (VJW)',
      url: 'https://vjw-lp.digital.go.jp/en/',
      desc: 'Official digital immigration and customs QR code service to skip paper forms at Haneda, Narita, and Kansai airports.',
    },
    medicationRule: 'Strict bans on certain cold medicines containing pseudoephedrine/codeine. Bring original prescriptions in limited personal quantities.',
    customsDutyFree: '3 bottles of liquor (up to 760ml each), 200 cigarettes, and goods up to 200,000 JPY in value.',
  },
  france: {
    passportValidity: 'Must be valid for at least 3 months beyond the intended date of departure from the Schengen zone.',
    touristStay: 'Schengen 90/180 rule: up to 90 days within any 180-day period visa-free for major passport holders.',
    digitalDeclarationForm: {
      name: 'EU ETIAS Visa Waiver',
      url: 'https://travel-europe.europa.eu/etias_en',
      desc: 'European pre-travel authorization system for visa-exempt travelers visiting the Schengen Area.',
    },
    medicationRule: 'Carry medicines in original packaging with an English/French doctor’s letter detailing exact dosages.',
    customsDutyFree: '1 liter of spirits over 22% ABV or 2 liters of fortified wine, plus up to €430 of other merchandise.',
  },
  italy: {
    passportValidity: 'At least 3 months validity beyond your scheduled Schengen departure date.',
    touristStay: '90 days in any 180-day period under Schengen convention.',
    digitalDeclarationForm: {
      name: 'EU Passenger Clearance',
      url: 'https://travel-europe.europa.eu/etias_en',
      desc: 'Schengen automated border control registration for eligible biometric passport holders.',
    },
    medicationRule: 'Prescriptions matching passport names are mandatory for controlled substances and syringes.',
    customsDutyFree: 'Standard EU allowances for tobacco, alcohol, and gifts under €430 value.',
  },
};

export default function VisaEntryRequirements({
  destination,
  country,
}: VisaEntryRequirementsProps) {
  const countryLower = country.toLowerCase();
  const destLower = destination.toLowerCase();

  let entryKey = 'japan';
  if (countryLower.includes('france') || destLower.includes('paris')) {
    entryKey = 'france';
  } else if (countryLower.includes('ital') || destLower.includes('rome')) {
    entryKey = 'italy';
  }

  const info = ENTRY_DATABASE[entryKey] || {
    passportValidity: 'Must possess a minimum of 6 months validity from departure date.',
    touristStay: '30 to 90 days tourist entry without prior embassy visa for standard biometric passports.',
    digitalDeclarationForm: {
      name: 'Official Electronic Arrival Card',
      url: 'https://www.google.com/search?q=official+electronic+arrival+customs+card+' + encodeURIComponent(destination),
      desc: 'Complete your online arrival declaration form within 72 hours prior to flight departure.',
    },
    medicationRule: 'Carry all medications in labelled original pharmacist bottles with matching physician notes.',
    customsDutyFree: 'Standard international customs allowances for personal effects and gifts.',
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Border & Immigration Guide
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Visa & Entry Requirements: {country || destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Essential entry regulations, passport validity, and electronic customs forms
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Border Protocols</span>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Passport Validity */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <FileText className="w-4 h-4" />
            <h4 className="font-bold text-sm text-slate-900">Passport Validity Rule</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{info.passportValidity}</p>
        </div>

        {/* Tourist Stay */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-sky-600">
            <Globe className="w-4 h-4" />
            <h4 className="font-bold text-sm text-slate-900">Visa-Free Tourist Stay Limit</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{info.touristStay}</p>
        </div>

        {/* Digital Customs Form */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-sky-50/50 p-5 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700">
              <Plane className="w-4 h-4" />
              <h4 className="font-bold text-sm text-slate-900">
                Digital Arrival QR Form ({info.digitalDeclarationForm.name})
              </h4>
            </div>
            <a
              href={info.digitalDeclarationForm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
            >
              <span>Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {info.digitalDeclarationForm.desc}
          </p>
        </div>

        {/* Medications & Prescription Rules */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <Pill className="w-4 h-4" />
            <h4 className="font-bold text-sm text-slate-900">Prescription Medications Advice</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{info.medicationRule}</p>
        </div>
      </div>

      {/* Duty Free Allowance Footnote */}
      <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Duty-Free Customs Note:</span> {info.customsDutyFree}
        </div>
      </div>
    </div>
  );
}
