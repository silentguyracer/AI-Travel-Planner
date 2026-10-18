'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TripPlan, ItineraryDay } from '@/types/travel';
import {
  Bookmark,
  Share2,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Users,
  Compass,
  MapPin,
  Utensils,
  Sparkles,
  Check,
  CalendarPlus,
  Coins,
  Receipt,
  CloudSun,
  BookOpen,
  Bot,
  Plane,
  Train,
  Leaf,
  Camera,
  CheckSquare,
  Clock,
  Ticket,
  ShieldCheck,
  Calculator,
  ShieldAlert,
  Sun,
  Languages,
  BookMarked,
  Headphones,
  ShoppingBag,
  Radio,
  Search,
  Grid,
  X,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Home,
  ArrowLeft,
  Footprints,
  Globe,
  TrendingDown,
  Luggage,
  Laptop,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveTrip, isTripSaved, exportTripToJson } from '@/lib/storage';
import { CURRENCIES, SupportedCurrency, convertAmount, parseUsdAmount } from '@/lib/currency';
import { generateShareableUrl } from '@/lib/shareUrl';
import DayItinerary from './DayItinerary';
import TravelCalendarView from './TravelCalendarView';
import PlacesList from './PlacesList';
import RestaurantsList from './RestaurantsList';
import GoogleMapView from './GoogleMapView';
import BudgetBreakdown from './BudgetBreakdown';
import ExpenseTracker from './ExpenseTracker';
import WeatherWidget from './WeatherWidget';
import TravelGuidebook from './TravelGuidebook';
import AIConciergeModal from './AIConciergeModal';
import FlightHotelFinder from './FlightHotelFinder';
import DayTripSuggester from './DayTripSuggester';
import CarbonFootprint from './CarbonFootprint';
import DestinationGallery from './DestinationGallery';
import PackingCustomizer from './PackingCustomizer';
import JetLagAdvisor from './JetLagAdvisor';
import BoardingPassCard from './BoardingPassCard';
import VisaEntryRequirements from './VisaEntryRequirements';
import TipCalculator from './TipCalculator';
import SafetyShield from './SafetyShield';
import GoldenHourRadar from './GoldenHourRadar';
import LiveTranslator from './LiveTranslator';
import OfflinePassModal from './OfflinePassModal';
import FlightRadarSimulator from './FlightRadarSimulator';
import HighSpeedRailPlanner from './HighSpeedRailPlanner';
import VatRefundCalculator from './VatRefundCalculator';
import AmbientSoundscapePlayer from './AmbientSoundscapePlayer';
import CrowdRadar from './CrowdRadar';
import TravelJournalBook from './TravelJournalBook';
import ColumbusHeroShowcase from './ColumbusHeroShowcase';
import FloatingNavDock from './FloatingNavDock';
import TripProgressRing from './TripProgressRing';
import LiveCurrencyTicker from './LiveCurrencyTicker';
import TripScoreDashboard from './TripScoreDashboard';
import GlobeFlightPath3D from './GlobeFlightPath3D';
import TravelMissionControlHUD from './TravelMissionControlHUD';
import TrekElevationProfile from './TrekElevationProfile';
import AICopilotVoiceHUD from './AICopilotVoiceHUD';
import FlightPricePredictor from './FlightPricePredictor';
import SuitcaseTetrisVisualizer from './SuitcaseTetrisVisualizer';
import DigitalNomadWorkationHub from './DigitalNomadWorkationHub';
import { animateTabTransition, attachMagneticHover, animateSpringPop } from '@/lib/gsapAnimations';

interface TripViewProps {
  trip: TripPlan;
  onTripSavedChange?: () => void;
  onNewPlanClick: () => void;
}

export type TabType =
  | 'itinerary'
  | 'calendar'
  | 'crowd'
  | 'map'
  | 'places'
  | 'restaurants'
  | 'gallery'
  | 'trek'
  | 'packing'
  | 'jetlag'
  | 'pass'
  | 'radar'
  | 'globe'
  | 'trains'
  | 'vat'
  | 'soundscapes'
  | 'visa'
  | 'tip'
  | 'budget'
  | 'expenses'
  | 'weather'
  | 'guidebook'
  | 'translator'
  | 'safety'
  | 'mission'
  | 'golden'
  | 'journal'
  | 'booking'
  | 'excursions'
  | 'eco'
  | 'copilot'
  | 'hopper'
  | 'tetris'
  | 'nomad';

type TabCategory = 'schedule' | 'transit' | 'finance' | 'companion';

interface TabItem {
  id: TabType;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: TabCategory;
  badge?: string;
  badgeColor?: string;
  description: string;
}

const TAB_CATEGORIES: { id: TabCategory; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
  { id: 'schedule', label: 'Plan & Schedule', icon: Calendar, count: 8 },
  { id: 'transit', label: 'Transit & Flight', icon: Plane, count: 7 },
  { id: 'finance', label: 'Budget & Finance', icon: DollarSign, count: 8 },
  { id: 'companion', label: 'Smart Companion', icon: ShieldAlert, count: 11 },
];

const ALL_TABS: TabItem[] = [
  // Schedule
  { id: 'itinerary', label: 'Day Itinerary', icon: Calendar, category: 'schedule', description: 'Detailed day-by-day curated activity plan' },
  { id: 'calendar', label: 'Travel Calendar', icon: CalendarPlus, category: 'schedule', badge: 'NEW', badgeColor: 'bg-indigo-500 text-white', description: 'Month matrix, hourly timeline & Google Calendar sync' },
  { id: 'trek', label: 'Trek & Elevation', icon: Footprints, category: 'schedule', badge: 'STAMINA', badgeColor: 'bg-emerald-500 text-white', description: 'Pedestrian steps, calorie burn & elevation fatigue profile' },
  { id: 'crowd', label: 'Crowd Radar', icon: Users, category: 'schedule', badge: 'HEATMAP', badgeColor: 'bg-emerald-500 text-white', description: 'Hourly foot-traffic heatmaps & optimal entry windows' },
  { id: 'map', label: 'Interactive Map', icon: Compass, category: 'schedule', description: 'Geocoded attractions & dining routes' },
  { id: 'places', label: 'Top Attractions', icon: MapPin, category: 'schedule', description: 'Curated sightseeing hotspots' },
  { id: 'restaurants', label: 'Dining Guide', icon: Utensils, category: 'schedule', description: 'Must-visit local authentic restaurants' },
  { id: 'gallery', label: 'Photo Gallery', icon: Camera, category: 'schedule', description: 'High-res destination photography' },

  // Transit
  { id: 'globe', label: '3D Globe & Flight Arc', icon: Globe, category: 'transit', badge: '3D', badgeColor: 'bg-amber-500 text-white', description: '3D Orthographic globe & Great Circle flight trajectory' },
  { id: 'hopper', label: 'Flight Fare Predictor', icon: TrendingDown, category: 'transit', badge: 'ML PREDICT', badgeColor: 'bg-emerald-500 text-white', description: 'Hopper-grade 30-day airfare curve, confidence bands & wait-vs-buy verdict' },
  { id: 'radar', label: 'Flight Radar HUD', icon: Radio, category: 'transit', badge: 'LIVE', badgeColor: 'bg-sky-500 text-white', description: 'Cockpit telemetry HUD & 5-step terminal wayfinder' },
  { id: 'trains', label: 'Bullet Trains', icon: Train, category: 'transit', description: 'High-speed rail routes, passes & bookings' },
  { id: 'booking', label: 'Flights & Hotels', icon: Plane, category: 'transit', description: 'Live price aggregators & bookings' },
  { id: 'excursions', label: 'Day Trips', icon: Compass, category: 'transit', description: 'Regional day excursions' },
  { id: 'pass', label: 'Digital Pass', icon: Ticket, category: 'transit', description: 'Fast mobile boarding pass card' },

  // Finance & Logistics
  { id: 'budget', label: 'Budget Blueprint', icon: DollarSign, category: 'finance', description: 'Cost tiers & expenditure breakdowns' },
  { id: 'expenses', label: 'Group Expense Splitter', icon: Receipt, category: 'finance', badge: 'SPLIT', badgeColor: 'bg-emerald-500 text-white', description: 'Debt minimization & WhatsApp settlements' },
  { id: 'tetris', label: 'Suitcase Tetris', icon: Luggage, category: 'finance', badge: '3D PACK', badgeColor: 'bg-purple-500 text-white', description: 'Luggage compartment packing, weight balance center & TSA scanner' },
  { id: 'vat', label: 'Tax-Free VAT Refund', icon: ShoppingBag, category: 'finance', badge: 'REFUND', badgeColor: 'bg-purple-500 text-white', description: 'Airport kiosk tax refund calculator' },
  { id: 'packing', label: 'Luggage & Weight', icon: CheckSquare, category: 'finance', description: 'Scale physics & airline baggage limits' },
  { id: 'jetlag', label: 'Jet Lag Advisor', icon: Clock, category: 'finance', description: 'Circadian melatonin & sunlight protocols' },
  { id: 'visa', label: 'Visa & Entry', icon: ShieldCheck, category: 'finance', description: 'Consular passport & entry prerequisites' },
  { id: 'tip', label: 'Tipping Guide', icon: Calculator, category: 'finance', description: 'Local gratuity customs & tipping calculator' },

  // Smart Companion
  { id: 'copilot', label: 'AI Voice Copilot', icon: Bot, category: 'companion', badge: 'VOICE AI', badgeColor: 'bg-indigo-600 text-white', description: 'Autonomous voice-guided flight & ground copilot with live waveforms' },
  { id: 'nomad', label: 'Digital Nomad Hub', icon: Laptop, category: 'companion', badge: 'REMOTE', badgeColor: 'bg-sky-500 text-white', description: 'Verified Wi-Fi speed benchmarks, coworking spots & timezone overlap' },
  { id: 'mission', label: 'Mission Control HUD', icon: ShieldCheck, category: 'companion', badge: 'HUD', badgeColor: 'bg-emerald-500 text-white', description: 'Pre-flight launch readiness & electrical utility intelligence' },
  { id: 'translator', label: 'Voice & Allergy Cards', icon: Languages, category: 'companion', badge: 'VOICE', badgeColor: 'bg-rose-500 text-white', description: 'Audio speech synthesizer & dietary flashcards' },
  { id: 'safety', label: 'Safety & Scam Radar', icon: ShieldAlert, category: 'companion', badge: 'RADAR', badgeColor: 'bg-red-500 text-white', description: '1-tap emergency dialer & tourist scam alerts' },
  { id: 'soundscapes', label: 'Audio Ambience', icon: Headphones, category: 'companion', description: 'Procedural Web Audio soundscapes & stories' },
  { id: 'weather', label: 'Hyperlocal Weather', icon: CloudSun, category: 'companion', description: 'Seasonal forecast & climate packing tips' },
  { id: 'golden', label: 'Golden Hour Radar', icon: Sun, category: 'companion', description: 'Solar ephemeris & camera spot guide' },
  { id: 'journal', label: 'Postcards & Journal', icon: BookOpen, category: 'companion', badge: 'STAMPS', badgeColor: 'bg-amber-500 text-white', description: 'Design vintage postcards & daily travel memory book' },
  { id: 'guidebook', label: 'Cultural Guide', icon: BookOpen, category: 'companion', description: 'Local customs, history & conversational phrases' },
  { id: 'eco', label: 'Carbon Footprint', icon: Leaf, category: 'companion', description: 'Eco-footprint metric & green offsets' },
];

export default function TripView({ trip: initialTrip, onTripSavedChange, onNewPlanClick }: TripViewProps) {
  const [trip, setTrip] = useState<TripPlan>(initialTrip);
  const [prevTripId, setPrevTripId] = useState<string>(initialTrip.id);

  if (initialTrip.id !== prevTripId) {
    setPrevTripId(initialTrip.id);
    setTrip(initialTrip);
  }

  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [activeCategory, setActiveCategory] = useState<TabCategory>('schedule');
  const [isAllToolsModalOpen, setIsAllToolsModalOpen] = useState<boolean>(false);
  const [toolsSearchQuery, setToolsSearchQuery] = useState<string>('');

  const [isSaved, setIsSaved] = useState<boolean>(() => isTripSaved(initialTrip.id));
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isPricePredictorOpen, setIsPricePredictorOpen] = useState<boolean>(false);
  const [isSuitcaseTetrisOpen, setIsSuitcaseTetrisOpen] = useState<boolean>(false);
  const [isNomadHubOpen, setIsNomadHubOpen] = useState<boolean>(false);
  const [isOfflinePassOpen, setIsOfflinePassOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);

  // Derive visited activity keys from localStorage (same key format as DayItinerary)
  const visitedStorageKey = `wanderai_visited_${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const [visitedKeys, setVisitedKeys] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(visitedStorageKey);
        if (stored) {
          const obj = JSON.parse(stored) as Record<string, boolean>;
          // DayItinerary keys format: 'day-${day.day}-act-${idx}'
          // TripProgressRing expects: '${destination}-${day.day}-${activity.activity}'
          // We'll rebuild from trip data
          const keys = new Set<string>();
          trip.itinerary.forEach((day) => {
            day.schedule.forEach((act, idx) => {
              if (obj[`day-${day.day}-act-${idx}`]) {
                keys.add(`${trip.destination}-${day.day}-${act.activity}`);
              }
            });
          });
          return keys;
        }
      } catch {
        // ignore
      }
    }
    return new Set<string>();
  });

  // Re-sync visited keys when storage changes (cross-component sync)
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(visitedStorageKey);
        if (stored) {
          const obj = JSON.parse(stored) as Record<string, boolean>;
          const keys = new Set<string>();
          trip.itinerary.forEach((day) => {
            day.schedule.forEach((act, idx) => {
              if (obj[`day-${day.day}-act-${idx}`]) {
                keys.add(`${trip.destination}-${day.day}-${act.activity}`);
              }
            });
          });
          setVisitedKeys(keys);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handleStorage);
    // Poll every 3s for same-tab changes from DayItinerary
    const pollInterval = setInterval(handleStorage, 3000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, [visitedStorageKey, trip]);

  // GSAP Animation Refs
  const tabContentRef = useRef<HTMLDivElement | null>(null);
  const saveBtnRef = useRef<HTMLButtonElement | null>(null);
  const conciergeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (tabContentRef.current) {
      animateTabTransition(tabContentRef.current, 'fade');
    }
  }, [activeTab]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    if (saveBtnRef.current) {
      cleanups.push(attachMagneticHover(saveBtnRef.current, 0.2));
    }
    if (conciergeBtnRef.current) {
      cleanups.push(attachMagneticHover(conciergeBtnRef.current, 0.2));
    }
    return () => cleanups.forEach((c) => c());
  }, []);

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    const found = ALL_TABS.find((t) => t.id === tabId);
    if (found) {
      setActiveCategory(found.category);
    }
  };

  const handleToggleSave = () => {
    if (saveBtnRef.current) {
      animateSpringPop(saveBtnRef.current, { scale: 1.15, rotation: 5 });
    }
    saveTrip(trip);
    setIsSaved(true);
    if (onTripSavedChange) onTripSavedChange();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleUpdateItinerary = (updatedSchedule: ItineraryDay[]) => {
    const updatedTrip: TripPlan = {
      ...trip,
      itinerary: updatedSchedule,
    };
    setTrip(updatedTrip);
    if (isSaved) {
      saveTrip(updatedTrip);
      if (onTripSavedChange) onTripSavedChange();
    }
  };

  const handleAddDayTrip = (newDay: ItineraryDay) => {
    const updatedTrip: TripPlan = {
      ...trip,
      duration: trip.duration + 1,
      itinerary: [...trip.itinerary, newDay],
    };
    setTrip(updatedTrip);
    if (isSaved) {
      saveTrip(updatedTrip);
      if (onTripSavedChange) onTripSavedChange();
    }
    handleSelectTab('itinerary');
  };

  const handleShare = () => {
    const shareUrl = generateShareableUrl(trip);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectMapPoint = (point: { lat: number; lng: number; title: string }) => {
    setSelectedMapLocation(point);
    handleSelectTab('map');
    const mapSection = document.getElementById('map-container-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Convert estimate to selected currency
  const rawTotalEstimateUsd = parseUsdAmount(trip.estimatedBudget?.totalEstimate || '$1500');
  const convertedTotalEstimate = convertAmount(rawTotalEstimateUsd, currency);

  // Filter tabs for the active category
  const currentCategoryTabs = useMemo(() => {
    return ALL_TABS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Search filtered tabs for modal
  const filteredSearchTabs = useMemo(() => {
    if (!toolsSearchQuery.trim()) return ALL_TABS;
    const q = toolsSearchQuery.toLowerCase();
    return ALL_TABS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [toolsSearchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Top Navigation & Breadcrumb Bar with Home and Back Buttons */}
      <nav aria-label="Trip Breadcrumbs" className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3 sm:p-3.5 px-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={onNewPlanClick}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            title="Go back to city selection & trip parameters"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back</span>
          </button>

          {/* Home Button */}
          <button
            type="button"
            onClick={onNewPlanClick}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            title="Return to Homepage"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>Home</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Breadcrumb Path */}
          <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
            <span className="text-slate-400">WanderAI</span>
            <span>/</span>
            <span className="font-bold text-slate-900">{trip.destination}</span>
            {activeTab !== 'itinerary' && (
              <>
                <span>/</span>
                <span className="font-bold text-indigo-600 capitalize">
                  {ALL_TABS.find((t) => t.id === activeTab)?.label || activeTab}
                </span>
              </>
            )}
          </div>
        </div>

        {/* If user is exploring a deep module, show a dedicated 'Back to Itinerary' button */}
        {activeTab !== 'itinerary' && (
          <button
            type="button"
            onClick={() => handleSelectTab('itinerary')}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95 ml-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-700" />
            <span>Back to Itinerary</span>
          </button>
        )}
      </nav>

      {/* 1. Trip Hero Header Banner with Luxury Glassmorphic Styling */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-900/40 animate-scale-in-fade">
        {/* Real Destination Cover Background Image */}
        <img
          src={`/api/place-image?query=${encodeURIComponent(`${trip.destination} ${trip.country || ''}`)}&category=landmark&redirect=true`}
          alt={trip.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 hover:scale-105 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/50 pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 flex-1">
            {/* Country & Meta Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-3.5 py-1.5 rounded-full border border-indigo-400/30 backdrop-blur-md shadow-xs">
                {trip.country || 'Destination'}
              </span>
              <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {trip.bestTimeToVisit}
              </span>

              {/* Currency Selector */}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                >
                  {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c} ({CURRENCIES[c as SupportedCurrency].symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Concierge Button in Hero */}
              <button
                ref={conciergeBtnRef}
                onClick={() => setIsConciergeOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/20 text-xs transition-all animate-subtle-bounce"
              >
                <Bot className="w-3.5 h-3.5 text-slate-950" />
                <span>Ask AI Concierge</span>
              </button>

              {/* Voice Copilot Button in Hero */}
              <button
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black px-3.5 py-1.5 rounded-full shadow-lg shadow-indigo-500/20 text-xs transition-all"
              >
                <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>AI Voice Copilot</span>
              </button>
            </div>

            {/* Destination Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {trip.destination}
            </h1>

            {/* Key Trip Parameters Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-medium bg-white/5 px-3 py-1 rounded-xl border border-white/5 shadow-xs">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{trip.duration} Days</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium capitalize bg-white/5 px-3 py-1 rounded-xl border border-white/5 shadow-xs">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>
                  {trip.budget} Budget (~{convertedTotalEstimate})
                </span>
              </div>
              {trip.companion && (
                <div className="flex items-center gap-1.5 font-medium capitalize bg-white/5 px-3 py-1 rounded-xl border border-white/5 shadow-xs">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{trip.companion}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
              {trip.summary}
            </p>
          </div>

          {/* Action Buttons Column */}
          <div className="flex flex-wrap lg:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Primary Save Trip Button */}
            <button
              ref={saveBtnRef}
              onClick={handleToggleSave}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved in My Trips</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Trip Plan</span>
                </>
              )}
            </button>

            {/* Calendar & Offline Pass Shortcuts */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => handleSelectTab('calendar')}
                className="p-2.5 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 rounded-xl text-sky-200 border border-sky-400/30 backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-sky-300" />
                <span>Visual Calendar</span>
              </button>

              <button
                onClick={() => setIsOfflinePassOpen(true)}
                className="p-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 rounded-xl text-amber-200 border border-amber-400/30 backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-300" />
                <span>Offline Pass</span>
              </button>
            </div>

            {/* Utility Sub-actions Row */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                onClick={handleShare}
                title="Share Compressed URL"
                className={`p-2 rounded-xl backdrop-blur-md transition-colors flex items-center justify-center gap-1 text-xs font-semibold ${
                  copiedLink ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={() => exportTripToJson(trip)}
                title="Download JSON"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                onClick={handlePrint}
                title="Print Itinerary"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white backdrop-blur-md transition-colors flex items-center justify-center gap-1 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>

            {/* Plan Another Button */}
            <button
              onClick={onNewPlanClick}
              className="text-xs text-indigo-300 hover:text-white underline font-semibold mt-1"
            >
              ← Plan Another Journey
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trip Highlights</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-200">
              {trip.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Columbus Travel Signature Kinetic Marquee & Experience Matrix */}
      <ColumbusHeroShowcase
        trip={trip}
        convertedTotalEstimate={convertedTotalEstimate}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenCalendar={() => handleSelectTab('calendar')}
        onOpenMap={() => handleSelectTab('map')}
      />

      {/* 🆕 Advanced Dashboard Row: Progress Ring + Score + Currency Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trip Progress Ring — gamified activity completion tracker */}
        <div className="lg:col-span-1">
          <TripProgressRing trip={trip} visitedKeys={visitedKeys} />
        </div>

        {/* Trip Intelligence Score Dashboard */}
        <div className="lg:col-span-1">
          <TripScoreDashboard trip={trip} />
        </div>

        {/* Live Currency Ticker */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <LiveCurrencyTicker baseCurrency="USD" baseAmount={1} />

          {/* Quick destination facts card */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-4 border border-indigo-800/40 shadow-xl text-white flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Quick Facts</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 rounded-xl p-2.5">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Duration</p>
                <p className="font-black text-white text-base mt-0.5">{trip.duration}d</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Tier</p>
                <p className="font-black text-white text-base capitalize mt-0.5">{trip.budget}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Places</p>
                <p className="font-black text-white text-base mt-0.5">{trip.placesToVisit?.length ?? 0}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Restaurants</p>
                <p className="font-black text-white text-base mt-0.5">{trip.restaurants?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Elevated Modern Categorized Navigation Dock */}
      <div className="sticky top-16 z-30 space-y-2">
        {/* Tier 1: Quick Jump Bar & Suite Category Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Quick Access Popular Shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick:</span>
            </span>

            <button
              onClick={() => handleSelectTab('itinerary')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'itinerary'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Itinerary</span>
            </button>

            <button
              onClick={() => handleSelectTab('calendar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalendarPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Calendar</span>
              <span className="px-1 py-0.2 bg-gradient-to-r from-indigo-500 to-sky-400 text-white text-[9px] font-black rounded uppercase">
                New
              </span>
            </button>

            <button
              onClick={() => handleSelectTab('map')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'map'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>

            <button
              onClick={() => handleSelectTab('radar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'radar'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Flight Radar</span>
            </button>

            <button
              onClick={() => handleSelectTab('expenses')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'expenses'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Splitter</span>
            </button>

            <button
              onClick={() => handleSelectTab('globe')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'globe'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>3D Globe</span>
              <span className="px-1 py-0.2 bg-amber-500 text-slate-950 text-[9px] font-black rounded uppercase">
                3D
              </span>
            </button>

            <button
              onClick={() => handleSelectTab('mission')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'mission'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mission HUD</span>
            </button>

            <button
              onClick={() => handleSelectTab('safety')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'safety'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety</span>
            </button>
          </div>

          {/* Browse All 30 Tools Button */}
          <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <button
              onClick={() => setIsAllToolsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Grid className="w-3.5 h-3.5 text-indigo-400" />
              <span>All 30 Modules</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Category Suite Selector + Current Suite Tabs */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          {/* Category Suite Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TAB_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isCatActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isCatActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Sub-Tabs Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            {currentCategoryTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  title={tab.description}
                  className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        tab.badgeColor || 'bg-indigo-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Tab Contents Section */}
      <div key={activeTab} ref={tabContentRef} className="animate-slide-up-fade">
        {/* Day Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8">
            <DayItinerary
              itinerary={trip.itinerary}
              onSelectActivityLocation={handleSelectMapPoint}
              onUpdateItinerary={handleUpdateItinerary}
              destination={trip.destination}
              onOpenCalendar={() => handleSelectTab('calendar')}
            />
          </div>
        )}

        {/* Visual Travel Calendar (New!) */}
        {activeTab === 'calendar' && (
          <TravelCalendarView trip={trip} />
        )}

        {/* Trek Elevation Profile & Pedestrian Stamina */}
        {activeTab === 'trek' && (
          <TrekElevationProfile trip={trip} />
        )}

        {/* Avoid-the-Crowds & Foot-Traffic Heatmap Radar */}
        {activeTab === 'crowd' && (
          <CrowdRadar
            destination={trip.destination}
            places={trip.placesToVisit || []}
          />
        )}

        {/* Interactive Map */}
        {activeTab === 'map' && (
          <div id="map-container-section" className="space-y-6">
            <GoogleMapView
              center={trip.centerCoordinates}
              destinationName={trip.destination}
              places={trip.placesToVisit || []}
              restaurants={trip.restaurants || []}
              itinerary={trip.itinerary || []}
              selectedPlace={selectedMapLocation}
            />
          </div>
        )}

        {/* Places */}
        {activeTab === 'places' && (
          <PlacesList
            places={trip.placesToVisit || []}
            destinationName={trip.destination}
            onSelectPlace={handleSelectMapPoint}
          />
        )}

        {/* Restaurants */}
        {activeTab === 'restaurants' && (
          <RestaurantsList
            restaurants={trip.restaurants || []}
            destinationName={trip.destination}
            onSelectRestaurant={handleSelectMapPoint}
          />
        )}

        {/* Photo Gallery */}
        {activeTab === 'gallery' && (
          <DestinationGallery destination={trip.destination} />
        )}

        {/* Packing & Luggage */}
        {activeTab === 'packing' && (
          <PackingCustomizer
            tripId={trip.id}
            destination={trip.destination}
            defaultPackingList={trip.practicalTips.packing || []}
          />
        )}

        {/* Jet Lag Advisor */}
        {activeTab === 'jetlag' && (
          <JetLagAdvisor destination={trip.destination} />
        )}

        {/* Digital Boarding Pass */}
        {activeTab === 'pass' && (
          <BoardingPassCard trip={trip} />
        )}

        {/* In-Flight Cockpit Radar */}
        {activeTab === 'radar' && (
          <FlightRadarSimulator destination={trip.destination} />
        )}

        {/* 3D Orthographic Globe & Great Circle Flight Path */}
        {activeTab === 'globe' && (
          <GlobeFlightPath3D trip={trip} />
        )}

        {/* High-Speed Bullet Trains */}
        {activeTab === 'trains' && (
          <HighSpeedRailPlanner
            destination={trip.destination}
            onAppendCityLeg={handleAddDayTrip}
            currentDayCount={trip.duration}
          />
        )}

        {/* Tax-Free Shopping / VAT Refund */}
        {activeTab === 'vat' && (
          <VatRefundCalculator
            destination={trip.destination}
            country={trip.country}
          />
        )}

        {/* Procedural Audio Ambience & Soundscapes */}
        {activeTab === 'soundscapes' && (
          <AmbientSoundscapePlayer destination={trip.destination} />
        )}

        {/* Visa & Entry Requirements */}
        {activeTab === 'visa' && (
          <VisaEntryRequirements
            destination={trip.destination}
            country={trip.country}
          />
        )}

        {/* Tip & Gratuity Calculator */}
        {activeTab === 'tip' && (
          <TipCalculator destination={trip.destination} />
        )}

        {/* Regional Day Trips */}
        {activeTab === 'excursions' && (
          <DayTripSuggester
            destination={trip.destination}
            onAddDayTrip={handleAddDayTrip}
            currentDayCount={trip.duration}
          />
        )}

        {/* Flights & Hotels Aggregator */}
        {activeTab === 'booking' && (
          <FlightHotelFinder
            destination={trip.destination}
            duration={trip.duration}
            budget={trip.budget}
          />
        )}

        {/* Budget Blueprint */}
        {activeTab === 'budget' && (
          <BudgetBreakdown
            budget={trip.estimatedBudget}
            practicalTips={trip.practicalTips}
            budgetTier={trip.budget}
          />
        )}

        {/* Expense Tracker & Group Splitter */}
        {activeTab === 'expenses' && (
          <ExpenseTracker
            tripId={trip.id}
            destination={trip.destination}
            totalEstimatedBudgetStr={trip.estimatedBudget?.totalEstimate || '$1500'}
          />
        )}

        {/* Hyperlocal Weather */}
        {activeTab === 'weather' && (
          <WeatherWidget
            destination={trip.destination}
            duration={trip.duration}
          />
        )}

        {/* Voice Translator & Dietary Allergy Flashcards */}
        {activeTab === 'translator' && (
          <LiveTranslator
            destination={trip.destination}
            country={trip.country}
          />
        )}

        {/* Safety Shield & Scam Radar */}
        {activeTab === 'safety' && (
          <SafetyShield
            destination={trip.destination}
            country={trip.country}
          />
        )}

        {/* Pre-Flight Mission Control & Traveler Readiness HUD */}
        {activeTab === 'mission' && (
          <TravelMissionControlHUD trip={trip} />
        )}

        {/* Golden Hour & Photography Radar */}
        {activeTab === 'golden' && (
          <GoldenHourRadar
            destination={trip.destination}
            centerCoordinates={trip.centerCoordinates}
          />
        )}

        {/* Vintage Postcards & Travel Memory Journal */}
        {activeTab === 'journal' && (
          <TravelJournalBook trip={trip} />
        )}

        {/* Comprehensive Cultural Guidebook */}
        {activeTab === 'guidebook' && (
          <TravelGuidebook
            destination={trip.destination}
            country={trip.country}
          />
        )}

        {/* Carbon Footprint & Eco Travel */}
        {activeTab === 'eco' && (
          <CarbonFootprint
            destination={trip.destination}
            duration={trip.duration}
            budget={trip.budget}
          />
        )}

        {/* Autonomous Voice Copilot */}
        {activeTab === 'copilot' && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 text-white text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-inner">
              <Bot className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Autonomous Voice & Ground Copilot</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
              Real-time voice telemetry, destination weather outfit advice, crowd-avoidance recommendations, and local ordering phrases.
            </p>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="w-4 h-4 animate-pulse" /> Launch Holographic Voice HUD
            </button>
          </div>
        )}

        {/* Hopper-Grade Flight Price Predictor */}
        {activeTab === 'hopper' && (
          <FlightPricePredictor
            trip={trip}
            isOpen={true}
            onClose={() => handleSelectTab('itinerary')}
          />
        )}

        {/* 3D Suitcase Tetris & TSA Rule Compliance */}
        {activeTab === 'tetris' && (
          <SuitcaseTetrisVisualizer
            trip={trip}
            isOpen={true}
            onClose={() => handleSelectTab('itinerary')}
          />
        )}

        {/* Digital Nomad & Remote Workation Hub */}
        {activeTab === 'nomad' && (
          <DigitalNomadWorkationHub
            trip={trip}
            isOpen={true}
            onClose={() => handleSelectTab('itinerary')}
          />
        )}
      </div>

      {/* 4. "All 25 Travel Modules" Directory Modal */}
      {isAllToolsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Grid className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-black">All 30 Travel Modules & Tools</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Search or jump directly into any travel intelligence system
                </p>
              </div>
              <button
                onClick={() => setIsAllToolsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={toolsSearchQuery}
                onChange={(e) => setToolsSearchQuery(e.target.value)}
                placeholder="Search tools (e.g., radar, translator, vat, calendar, shinkansen)..."
                className="bg-transparent text-sm text-slate-900 outline-none w-full font-medium placeholder-slate-400"
                autoFocus
              />
              {toolsSearchQuery && (
                <button
                  onClick={() => setToolsSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Grid of Tools */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSearchTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleSelectTab(tab.id);
                      setIsAllToolsModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                        : 'bg-white hover:bg-indigo-50/50 text-slate-800 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {tab.badge && (
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              tab.badgeColor || 'bg-indigo-500 text-white'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-bold leading-tight ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </h4>
                      <p
                        className={`text-xs mt-1 line-clamp-2 ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500'
                        }`}
                      >
                        {tab.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className={isSelected ? 'text-indigo-200' : 'text-slate-400 capitalize'}>
                        {tab.category}
                      </span>
                      <span
                        className={`flex items-center gap-0.5 ${
                          isSelected ? 'text-white' : 'text-indigo-600 group-hover:translate-x-1 transition-transform'
                        }`}
                      >
                        Launch <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick-Action Dock */}
      <FloatingNavDock
        trip={trip}
        onNewPlanClick={onNewPlanClick}
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab as TabType)}
      />

      {/* Floating Concierge FAB Button */}
      <button
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-bold text-xs sm:text-sm border-2 border-white/20"
      >
        <Bot className="w-5 h-5 text-amber-300" />
        <span className="hidden sm:inline">Ask AI Concierge</span>
      </button>

      {/* AI Concierge Drawer */}
      <AIConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        trip={trip}
      />

      {/* Offline Pocket Booklet Modal */}
      <OfflinePassModal
        isOpen={isOfflinePassOpen}
        onClose={() => setIsOfflinePassOpen(false)}
        trip={trip}
      />

      {/* Autonomous Voice Copilot HUD */}
      <AICopilotVoiceHUD
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        trip={trip}
      />

      {/* Hopper-Grade Flight Price Predictor Modal */}
      {isPricePredictorOpen && (
        <FlightPricePredictor
          isOpen={isPricePredictorOpen}
          onClose={() => setIsPricePredictorOpen(false)}
          trip={trip}
        />
      )}

      {/* 3D Suitcase Tetris Modal */}
      {isSuitcaseTetrisOpen && (
        <SuitcaseTetrisVisualizer
          isOpen={isSuitcaseTetrisOpen}
          onClose={() => setIsSuitcaseTetrisOpen(false)}
          trip={trip}
        />
      )}

      {/* Digital Nomad Workation Hub Modal */}
      {isNomadHubOpen && (
        <DigitalNomadWorkationHub
          isOpen={isNomadHubOpen}
          onClose={() => setIsNomadHubOpen(false)}
          trip={trip}
        />
      )}
    </div>
  );
}
