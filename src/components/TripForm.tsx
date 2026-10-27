'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BudgetTier,
  CompanionType,
  TravelStyle,
  TripGenerationRequest
} from '@/types/travel';
import {
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Loader2,
  Flame,
  Search,
  Check,
  Globe,
  Clock,
  ChevronRight,
  ArrowRight,
  X,
  Info,
  Dices,
  Shuffle
} from 'lucide-react';
import { getUserSettings } from '@/lib/storage';
import { WORLD_CITIES_DATABASE, WorldCity } from '@/lib/worldCities';
import DestinationMapPickerModal from '@/components/DestinationMapPickerModal';
import TravelVibeQuizModal, { VibeQuizResult } from '@/components/TravelVibeQuizModal';
import { playPop, playChime, playWhoosh, toggleAudioMute, isMuted } from '@/lib/interactiveAudio';
import { getDestinationSnapshot, DestinationSnapshot } from '@/lib/destinationSnapshots';
import { Volume2, VolumeX, TrendingUp, HelpCircle, ChevronDown, ChevronUp, Sliders } from 'lucide-react';

import { animateStaggerCards, animateSpringPop, attachMagneticHover } from '@/lib/gsapAnimations';

interface TripFormProps {
  onGenerate: (data: TripGenerationRequest) => Promise<void>;
  isLoading: boolean;
  onSelectSampleTrip: (sampleId: string) => void;
  prefillDestination?: { destination: string; duration?: number } | null;
}

interface CitySuggestion {
  id?: number;
  name: string;
  country: string;
  admin1?: string;
  flag: string;
  lat?: number;
  lng?: number;
  population?: number;
  displayName: string;
}

const TRENDING_DESTINATIONS = [
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Paris', country: 'France', flag: '🇫🇷' },
  { name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { name: 'Udaipur', country: 'India', flag: '🇮🇳' },
  { name: 'Jaipur', country: 'India', flag: '🇮🇳' },
  { name: 'Goa', country: 'India', flag: '🇮🇳' },
  { name: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { name: 'Barcelona', country: 'Spain', flag: '🇪🇸' },
  { name: 'New York City', country: 'United States', flag: '🇺🇸' },
  { name: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪' },
  { name: 'Zurich', country: 'Switzerland', flag: '🇨🇭' },
  { name: 'Interlaken', country: 'Switzerland', flag: '🇨🇭' },
  { name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { name: 'Queenstown', country: 'New Zealand', flag: '🇳🇿' },
  { name: 'Cape Town', country: 'South Africa', flag: '🇿🇦' },
];

const TRAVEL_STYLES: { id: TravelStyle; label: string; icon: string }[] = [
  { id: 'cultural', label: 'Cultural & Heritage', icon: '🏛️' },
  { id: 'foodie', label: 'Foodie & Dining', icon: '🍜' },
  { id: 'adventure', label: 'Adventure & Outdoors', icon: '🧗' },
  { id: 'relaxed', label: 'Relaxed & Wellness', icon: '🌿' },
  { id: 'nature', label: 'Nature & Scenery', icon: '🏔️' },
  { id: 'shopping', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'nightlife', label: 'Nightlife & Bars', icon: '🍸' },
];

const BUDGET_OPTIONS: { id: BudgetTier; label: string; desc: string; icon: string; range: string }[] = [
  {
    id: 'economy',
    label: 'Economy',
    desc: 'Hostels, public transit, street eats',
    icon: '🎒',
    range: '$40 - $90 / day'
  },
  {
    id: 'moderate',
    label: 'Moderate',
    desc: 'Boutique hotels, cozy bistros, top sights',
    icon: '✨',
    range: '$120 - $250 / day'
  },
  {
    id: 'luxury',
    label: 'Luxury',
    desc: '5-star resorts, private tours, fine dining',
    icon: '💎',
    range: '$350+ / day'
  }
];

const COMPANIONS: { id: CompanionType; label: string; icon: string }[] = [
  { id: 'solo', label: 'Solo Traveler', icon: '🚶' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧' },
  { id: 'friends', label: 'Friends Group', icon: '👥' },
];

export interface VacationTemplate {
  id: string;
  name: string;
  destination: string;
  duration: number;
  budget: BudgetTier;
  companion: CompanionType;
  styles: TravelStyle[];
  interests: string;
  flag: string;
  tagline: string;
}

export const STARTER_VACATION_TEMPLATES: VacationTemplate[] = [
  {
    id: 'tokyo-cultural',
    name: 'Tokyo Neon & Temples',
    destination: 'Tokyo, Japan',
    duration: 5,
    budget: 'moderate',
    companion: 'couple',
    styles: ['cultural', 'foodie', 'photography'],
    interests: 'Shibuya crossing, teamLab, authentic ramen, Tsukiji market',
    flag: '🇯🇵',
    tagline: '5 Days • Couple • Foodie',
  },
  {
    id: 'paris-romantic',
    name: 'Paris Romance & Art',
    destination: 'Paris, France',
    duration: 4,
    budget: 'luxury',
    companion: 'couple',
    styles: ['cultural', 'foodie', 'relaxed'],
    interests: 'Louvre, Eiffel Tower champagne, Montmartre bistros, Seine river cruise',
    flag: '🇫🇷',
    tagline: '4 Days • Couple • Luxury',
  },
  {
    id: 'udaipur-heritage',
    name: 'Udaipur City of Lakes',
    destination: 'Udaipur, India',
    duration: 3,
    budget: 'moderate',
    companion: 'family',
    styles: ['cultural', 'photography', 'relaxed'],
    interests: 'City Palace, Lake Pichola boat ride, Saheliyon ki Bari, Rajasthani thali',
    flag: '🇮🇳',
    tagline: '3 Days • Family • Heritage',
  },
  {
    id: 'bali-retreat',
    name: 'Bali Tropical Escape',
    destination: 'Bali, Indonesia',
    duration: 5,
    budget: 'economy',
    companion: 'solo',
    styles: ['nature', 'relaxed', 'adventure'],
    interests: 'Ubud waterfalls, rice terraces, surfing in Canggu, sunset temples',
    flag: '🇮🇩',
    tagline: '5 Days • Solo • Backpacker',
  },
  {
    id: 'swiss-alps',
    name: 'Interlaken Swiss Alps',
    destination: 'Interlaken, Switzerland',
    duration: 4,
    budget: 'moderate',
    companion: 'friends',
    styles: ['adventure', 'nature', 'photography'],
    interests: 'Jungfraujoch, Lauterbrunnen waterfalls, Lake Brienz, panoramic trains',
    flag: '🇨🇭',
    tagline: '4 Days • Friends • Adventure',
  },
];


export interface TravelExperienceMode {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  budget: BudgetTier;
  companion: CompanionType;
  styles: TravelStyle[];
  notice: string;
}

export const TRAVEL_EXPERIENCE_MODES: TravelExperienceMode[] = [
  {
    id: 'holiday',
    name: 'Complete Holiday',
    icon: '🏖️',
    tagline: 'Best sights & leisurely meals',
    budget: 'moderate',
    companion: 'couple',
    styles: ['cultural', 'foodie', 'relaxed'],
    notice: 'Classic balanced getaway curated with iconic landmarks, authentic dining, and relaxed evenings.',
  },
  {
    id: 'backpacker',
    name: 'Solo Backpacker',
    icon: '🎒',
    tagline: 'Hostels, transit & street eats',
    budget: 'economy',
    companion: 'solo',
    styles: ['adventure', 'nature', 'cultural'],
    notice: 'Optimized for smart budgets, local metro transit, vibrant street markets, and spontaneous exploration.',
  },
  {
    id: 'honeymoon',
    name: 'Couples & Romance',
    icon: '💑',
    tagline: 'Boutique stays & sunsets',
    budget: 'luxury',
    companion: 'couple',
    styles: ['relaxed', 'foodie', 'photography'],
    notice: 'Curated with intimate candlelight dinners, golden hour view terraces, scenic walks, and romantic charm.',
  },
  {
    id: 'family',
    name: 'Family & Kids',
    icon: '👨‍👩‍👧',
    tagline: 'Fun parks & spacious pace',
    budget: 'moderate',
    companion: 'family',
    styles: ['cultural', 'nature', 'relaxed'],
    notice: 'Child-friendly pacing with stroller-friendly routes, amusement spots, and comfortable rest breaks.',
  },
  {
    id: 'luxury',
    name: 'Luxury & VIP',
    icon: '💎',
    tagline: '5-star suites & fine dining',
    budget: 'luxury',
    companion: 'couple',
    styles: ['shopping', 'foodie', 'relaxed'],
    notice: 'Premium luxury experience: 5-star hospitality, private transfers, and Michelin-starred dining recommendations.',
  },
  {
    id: 'scenic-rail',
    name: 'Scenic Rail & Nature',
    icon: '🚆',
    tagline: 'Panoramic trains & trails',
    budget: 'moderate',
    companion: 'friends',
    styles: ['nature', 'adventure', 'photography'],
    notice: 'Focuses on alpine trains, scenic high-speed lines, viewpoint terraces, and scenic nature day-trips.',
  },
];

export const CURRENCY_LIST = [
  { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', rate: 86.0, flag: '🇮🇳', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED ', rate: 3.67, flag: '🇦🇪', label: 'AED (د.إ)' },
  { code: 'JPY', symbol: '¥', rate: 152.0, flag: '🇯🇵', label: 'JPY (¥)' },
];

export default function TripForm({ onGenerate, isLoading, onSelectSampleTrip, prefillDestination }: TripFormProps) {
  const [destination, setDestination] = useState('Tokyo');
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [companion, setCompanion] = useState<CompanionType>('couple');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(['cultural', 'foodie', 'photography']);
  const [specificInterests, setSpecificInterests] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isVibeQuizOpen, setIsVibeQuizOpen] = useState(false);
  const [activeModeId, setActiveModeId] = useState<string>('holiday');
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_LIST[0]);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(!isMuted());

  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // GSAP Animation Refs
  const templatesContainerRef = useRef<HTMLDivElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (templatesContainerRef.current) {
      const templateItems = templatesContainerRef.current.children;
      animateStaggerCards(templateItems as unknown as HTMLElement[], {
        yOffset: 16,
        stagger: 0.05,
        duration: 0.45,
      });
    }

    if (submitBtnRef.current) {
      return attachMagneticHover(submitBtnRef.current, 0.2);
    }
  }, []);

  // Apply starter template
  const applyStarterTemplate = (tpl: VacationTemplate, element?: HTMLElement | null) => {
    if (element) {
      animateSpringPop(element, { scale: 1.1, rotation: 3 });
    }
    setActiveTemplateId(tpl.id);
    setDestination(tpl.destination);
    setDuration(tpl.duration);
    setBudget(tpl.budget);
    setCompanion(tpl.companion);
    setSelectedStyles(tpl.styles);
    setSpecificInterests(tpl.interests);

    if (startDate) {
      const [y, m, d] = startDate.split('-').map(Number);
      const end = new Date(y, m - 1, d + tpl.duration - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
    setShowAutocomplete(false);
  };

  // Surprise Me: random destination generator
  const handleSurpriseMe = () => {
    if (!WORLD_CITIES_DATABASE.length) return;
    const randomIndex = Math.floor(Math.random() * WORLD_CITIES_DATABASE.length);
    const chosen = WORLD_CITIES_DATABASE[randomIndex];
    setDestination(`${chosen.name}, ${chosen.country}`);
    setShowAutocomplete(false);
  };

  // Date selection mode: 'calendar' (exact dates) or 'duration' (days count)
  const [dateMode, setDateMode] = useState<'calendar' | 'duration'>('calendar');

  // Compute default start date (next Monday)
  const defaultStartDateStr = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay();
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    d.setDate(d.getDate() + (daysUntilNextMonday === 0 ? 7 : daysUntilNextMonday));
    return d.toISOString().split('T')[0];
  }, []);

  // Compute default end date (5 days later)
  const defaultEndDateStr = useMemo(() => {
    const [y, m, d] = defaultStartDateStr.split('-').map(Number);
    const end = new Date(y, m - 1, d + 4);
    return end.toISOString().split('T')[0];
  }, [defaultStartDateStr]);

  const [startDate, setStartDate] = useState<string>(defaultStartDateStr);
  const [endDate, setEndDate] = useState<string>(defaultEndDateStr);
  const [duration, setDuration] = useState<number>(5);

  // Calculate actual duration in days between startDate and endDate
  const calculatedDuration = useMemo(() => {
    if (!startDate || !endDate) return 5;
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const startObj = new Date(sy, sm - 1, sd);
    const endObj = new Date(ey, em - 1, ed);
    const diffTime = endObj.getTime() - startObj.getTime();
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(days, 1);
  }, [startDate, endDate]);

  // Listen to external prefill (e.g. from hero destination cards)
  useEffect(() => {
    if (prefillDestination && prefillDestination.destination) {
      setDestination(prefillDestination.destination);
      if (prefillDestination.duration) {
        setDuration(prefillDestination.duration);
        if (startDate) {
          const [y, m, d] = startDate.split('-').map(Number);
          const end = new Date(y, m - 1, d + prefillDestination.duration - 1);
          setEndDate(end.toISOString().split('T')[0]);
        }
      }
      playChime();
      setShowAutocomplete(false);
    }
  }, [prefillDestination, startDate]);

  // Handle MakeMyTrip-Style Mode selection
  const handleSelectTravelMode = (mode: TravelExperienceMode) => {
    playWhoosh();
    setActiveModeId(mode.id);
    setBudget(mode.budget);
    setCompanion(mode.companion);
    setSelectedStyles(mode.styles);
  };

  // Handle Vibe Quiz apply
  const handleApplyVibeQuiz = (res: VibeQuizResult) => {
    setDestination(res.destination);
    setDuration(res.duration);
    setBudget(res.budget);
    setCompanion(res.companion);
    setSelectedStyles(res.styles);
    setSpecificInterests(res.interests);
    if (startDate) {
      const [y, m, d] = startDate.split('-').map(Number);
      const end = new Date(y, m - 1, d + res.duration - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
    playChime();
  };

  // Query destination intelligence snapshot
  const destinationSnapshot = useMemo(() => getDestinationSnapshot(destination), [destination]);

  // Real-time Dynamic Trip Cost Calculation
  const activeDays = dateMode === 'calendar' ? calculatedDuration : duration;
  const estimatedCosts = useMemo(() => {
    const basePerNightStay = budget === 'economy' ? 65 : budget === 'moderate' ? 140 : 360;
    const baseDailyFoodSightseeing = budget === 'economy' ? 35 : budget === 'moderate' ? 75 : 190;
    const baseFlightTransport = budget === 'economy' ? 360 : budget === 'moderate' ? 580 : 1150;

    const companionMultiplier =
      companion === 'solo' ? 1.0 : companion === 'couple' ? 1.7 : companion === 'family' ? 2.8 : 2.3;

    const stayTotalUsd = Math.round(
      basePerNightStay * Math.max(activeDays - 1, 1) * (companion === 'solo' ? 1 : companion === 'couple' ? 1.1 : 1.8)
    );
    const foodTotalUsd = Math.round(baseDailyFoodSightseeing * activeDays * companionMultiplier);
    const flightTotalUsd = Math.round(baseFlightTransport * companionMultiplier);
    const totalUsd = stayTotalUsd + foodTotalUsd + flightTotalUsd;

    const rate = selectedCurrency.rate;
    const formatVal = (val: number) => {
      const converted = Math.round(val * rate);
      return `${selectedCurrency.symbol}${converted.toLocaleString()}`;
    };

    return {
      flight: formatVal(flightTotalUsd),
      stay: formatVal(stayTotalUsd),
      food: formatVal(foodTotalUsd),
      total: formatVal(totalUsd),
      perDay: formatVal(Math.round(totalUsd / Math.max(activeDays, 1))),
    };
  }, [budget, companion, activeDays, selectedCurrency]);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (endDate && val > endDate) {
      // push endDate forward to maintain at least 5 days
      const [y, m, d] = val.split('-').map(Number);
      const newEnd = new Date(y, m - 1, d + 4);
      setEndDate(newEnd.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val < startDate) {
      setStartDate(val);
    }
  };

  // Quick date presets: calculated directly from the active startDate
  const applyDatePreset = (preset: 'weekend' | '7days' | '14days' | '30days') => {
    let base = new Date();
    base.setHours(0, 0, 0, 0);
    if (startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      base = new Date(sy, sm - 1, sd);
    }

    if (preset === 'weekend') {
      const end = new Date(base);
      end.setDate(base.getDate() + 2); // 3 days
      setEndDate(end.toISOString().split('T')[0]);
      setDuration(3);
    } else if (preset === '7days') {
      const end = new Date(base);
      end.setDate(base.getDate() + 6); // 7 days
      setEndDate(end.toISOString().split('T')[0]);
      setDuration(7);
    } else if (preset === '14days') {
      const end = new Date(base);
      end.setDate(base.getDate() + 13); // 14 days
      setEndDate(end.toISOString().split('T')[0]);
      setDuration(14);
    } else if (preset === '30days') {
      const end = new Date(base);
      end.setDate(base.getDate() + 29); // 30 days
      setEndDate(end.toISOString().split('T')[0]);
      setDuration(30);
    }
  };

  // Days until trip starts
  const daysUntilTrip = useMemo(() => {
    if (!startDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = startDate.split('-').map(Number);
    const start = new Date(y, m - 1, d);
    return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate]);

  // Autocomplete / Worldwide 250+ City Search State
  type RegionFilter = 'All' | 'India' | 'Europe' | 'Asia' | 'Americas' | 'Middle East & Africa' | 'Oceania';
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [activeRegionFilter, setActiveRegionFilter] = useState<RegionFilter>('All');
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const REGION_TABS: { id: RegionFilter; label: string; icon: string; count: number }[] = useMemo(() => [
    { id: 'All', label: 'All (248)', icon: '🌍', count: WORLD_CITIES_DATABASE.length },
    { id: 'India', label: 'India', icon: '🇮🇳', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'India').length },
    { id: 'Europe', label: 'Europe', icon: '🇪🇺', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'Europe').length },
    { id: 'Asia', label: 'Asia', icon: '🌏', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'Asia').length },
    { id: 'Americas', label: 'Americas', icon: '🌎', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'Americas').length },
    { id: 'Middle East & Africa', label: 'Mid East & Africa', icon: '🕌', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'Middle East & Africa').length },
    { id: 'Oceania', label: 'Oceania', icon: '🦘', count: WORLD_CITIES_DATABASE.filter((c) => c.continent === 'Oceania').length },
  ], []);

  // Instant 0ms filtering from curated 250+ database
  const filteredCuratedCities = useMemo(() => {
    const query = destination?.trim().toLowerCase() || '';

    return WORLD_CITIES_DATABASE.filter((city) => {
      // 1. Check region filter
      if (activeRegionFilter !== 'All') {
        if (city.continent !== activeRegionFilter) return false;
        // If a region filter is active, check if query matches this continent
        if (query.length > 0) {
          const queryMatchesThisContinent = WORLD_CITIES_DATABASE.some(
            (c) =>
              c.continent === activeRegionFilter &&
              (c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query))
          );
          if (!queryMatchesThisContinent) {
            return true; // Let user browse all cities in the clicked continent!
          }
          const matchName = city.name.toLowerCase().includes(query);
          const matchCountry = city.country.toLowerCase().includes(query);
          const matchAdmin = city.admin1 ? city.admin1.toLowerCase().includes(query) : false;
          const matchHighlight = city.highlight ? city.highlight.toLowerCase().includes(query) : false;
          return matchName || matchCountry || matchAdmin || matchHighlight;
        }
        return true;
      }

      // When 'All' is selected:
      if (query.length > 0) {
        const matchName = city.name.toLowerCase().includes(query);
        const matchCountry = city.country.toLowerCase().includes(query);
        const matchAdmin = city.admin1 ? city.admin1.toLowerCase().includes(query) : false;
        const matchHighlight = city.highlight ? city.highlight.toLowerCase().includes(query) : false;
        return matchName || matchCountry || matchAdmin || matchHighlight;
      }
      return true;
    });
  }, [destination, activeRegionFilter]);

  // Debounced search for 1,000,000+ cities worldwide via /api/cities
  useEffect(() => {
    if (!destination || destination.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCities(true);
      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(destination.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.cities && Array.isArray(data.cities)) {
            setCitySuggestions(data.cities);
          }
        }
      } catch (err) {
        console.warn('Cities API fetch error:', err);
      } finally {
        setIsSearchingCities(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [destination]);

  // Click outside to dismiss autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStyle = (style: TravelStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isLoading) return;
    setShowAutocomplete(false);

    const userSettings = getUserSettings();
    const finalDuration = Math.min(dateMode === 'calendar' ? calculatedDuration : duration, 30);

    // Loading step simulation
    setLoadingStep(1);
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      await onGenerate({
        destination: destination.trim(),
        duration: finalDuration,
        startDate: dateMode === 'calendar' ? startDate : undefined,
        endDate: dateMode === 'calendar' ? endDate : undefined,
        budget,
        companion,
        travelStyles: selectedStyles,
        specificInterests: specificInterests.trim() || undefined,
        customApiKey: userSettings.openaiApiKey,
      });
    } finally {
      clearInterval(stepInterval);
      setLoadingStep(0);
    }
  };

  return (
    <div className="bg-transparent p-6 sm:p-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Heading */}
      <div className="relative mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation AI Travel Curator • 100,000+ Global Cities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Where would you like to travel?
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
          Search literally <strong className="text-slate-200">any city, town, or village on Earth</strong>. Set your travel dates on the visual calendar, customize your vibe, and let AI build a comprehensive commercial itinerary.
        </p>

        {/* Quick Sample Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Quick load popular:</span>
          <button
            type="button"
            onClick={() => onSelectSampleTrip('sample-tokyo-5d')}
            className="text-xs bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 font-semibold text-slate-300 px-3 py-1 rounded-full border border-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🗼 Tokyo (5 Days)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectSampleTrip('sample-paris-4d')}
            className="text-xs bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 font-semibold text-slate-300 px-3 py-1 rounded-full border border-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            <span>🥐 Paris (4 Days)</span>
          </button>
        </div>

        {/* User-Friendly 3-Step Flow Pills */}
        <div className="mt-5 grid grid-cols-3 gap-2 max-w-md mx-auto text-[11px] font-bold">
          <div className="bg-indigo-500/20 text-indigo-300 py-1.5 px-2 rounded-xl border border-indigo-500/30 flex items-center justify-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-black">1</span>
            <span>Pick City</span>
          </div>
          <div className="bg-white/5 text-slate-400 py-1.5 px-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-600 text-slate-300 text-[9px] flex items-center justify-center font-black">2</span>
            <span>Dates & Style</span>
          </div>
          <div className="bg-white/5 text-slate-400 py-1.5 px-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-600 text-slate-300 text-[9px] flex items-center justify-center font-black">3</span>
            <span>1-Click Plan</span>
          </div>
        </div>

        {/* Instant 1-Click Vacation Starters */}
        <div className="mt-5 pt-4 border-t border-white/10 text-left">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Instant 1-Click Vacation Starters:
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Click to pre-fill complete vacation recipe</span>
          </div>
          <div ref={templatesContainerRef} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STARTER_VACATION_TEMPLATES.map((tpl) => {
              const isSelected = activeTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={(e) => applyStarterTemplate(tpl, e.currentTarget)}
                  className={`px-3 py-2 rounded-2xl border text-left transition-all shrink-0 cursor-pointer flex items-center gap-2.5 shadow-2xs hover:scale-102 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/40'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl shrink-0">{tpl.flag}</span>
                  <div>
                    <div className={`font-bold text-xs leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {tpl.name}
                    </div>
                    <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {tpl.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MakeMyTrip-Style 6 Category Mode Navigation Tabs */}
      <div className="mb-8 pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Curated Travel Experiences</span>
          </span>
          {/* Sound FX Toggle Pill */}
          <button
            type="button"
            onClick={() => {
              const muted = toggleAudioMute();
              setIsAudioOn(!muted);
              if (!muted) playPop();
            }}
            className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAudioOn
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle interactive sound effects"
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioOn ? 'Sound: ON' : 'Sound: OFF'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {TRAVEL_EXPERIENCE_MODES.map((mode) => {
            const isSelected = activeModeId === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSelectTravelMode(mode)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600/30 to-violet-600/20 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/50'
                    : 'bg-white/5 hover:bg-white/[0.08] border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{mode.icon}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <div className="mt-2">
                  <div className={`font-black text-xs leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {mode.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{mode.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Mode Notice Banner */}
        {activeModeId && (
          <div className="mt-3 px-3.5 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{TRAVEL_EXPERIENCE_MODES.find(m => m.id === activeModeId)?.notice}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-7">
        {/* 1. Worldwide Destination Search Input (100,000+ Global Cities) */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Worldwide Destination (1 Lakh+ Cities, Towns & Islands)</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMapPickerOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-indigo-400/30"
                title="Open interactive World Map to choose any city"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>🗺️ Choose from Map</span>
              </button>
              <span className="text-[11px] font-semibold text-indigo-400 hidden sm:flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Global Geocoded
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              required
              value={destination}
              onFocus={() => setShowAutocomplete(true)}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowAutocomplete(true);
              }}
              placeholder="Search ANY city in the world: e.g. Udaipur, Kyoto, Interlaken, Rome, Barcelona, Bali, Queenstown..."
              className="w-full pl-11 pr-32 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-base font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            />
            <Compass className="w-5 h-5 text-indigo-500 absolute left-3.5 top-4" />

            {/* Quick Pick on Map Button inside input */}
            <button
              type="button"
              onClick={() => setIsMapPickerOpen(true)}
              className="absolute right-10 top-2.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 hover:text-indigo-300 border border-blue-400/20 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Pick directly on interactive World Map"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-bold">Pick on Map</span>
            </button>

            {/* Spinner or Clear */}
            <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
              {isSearchingCities ? (
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              ) : destination ? (
                <button
                  type="button"
                  onClick={() => {
                    setDestination('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* 250+ World Cities Directory & Live Geocoding Dropdown */}
          {showAutocomplete && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden divide-y divide-white/5 animate-in fade-in"
            >
              {/* Region Tabs Header */}
              <div className="p-3 bg-slate-800/80 border-b border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      250+ World Cities Directory
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      Instant 0ms
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAutocomplete(false);
                      setIsMapPickerOpen(true);
                    }}
                    className="text-xs px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>🗺️ Choose on World Map</span>
                  </button>
                </div>

                {/* Region Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {REGION_TABS.map((tab) => {
                    const isActive = activeRegionFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveRegionFilter(tab.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cities List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {/* 1. Curated 250+ Database Cities */}
                {filteredCuratedCities.map((item, idx) => (
                  <div
                    key={`curated-${item.name}-${item.country}-${idx}`}
                    onClick={() => {
                      setDestination(`${item.name}, ${item.country}`);
                      setShowAutocomplete(false);
                    }}
                    className="p-3 hover:bg-indigo-500/15 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{item.flag || '📍'}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                            {item.name}
                          </span>
                          {item.admin1 && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                              {item.admin1}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.country}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-white/5 text-slate-400">
                            {item.continent}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5 truncate flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{item.highlight}</span>
                        </p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                ))}

                {/* 2. Live Global Geocoded Results (Open-Meteo 1,000,000+ worldwide) */}
                {citySuggestions.length > 0 && (
                  <>
                    <div className="p-2 bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-indigo-600" />
                        Worldwide Geocoded Results (1,000,000+ Global Database)
                      </span>
                      <span className="text-indigo-400 font-bold">{citySuggestions.length} found</span>
                    </div>
                    {citySuggestions.map((item, idx) => (
                      <div
                        key={`live-${item.name}-${item.country}-${idx}`}
                        onClick={() => {
                          setDestination(item.displayName || `${item.name}, ${item.country}`);
                          setShowAutocomplete(false);
                        }}
                        className="p-3 hover:bg-indigo-500/15 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{item.flag || '📍'}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                                {item.name}
                              </span>
                              {item.admin1 && (
                                <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                                  {item.admin1}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {item.country} {item.population ? `• Pop: ${item.population.toLocaleString()}` : ''}
                            </p>
                          </div>
                        </div>
                        <Check className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </>
                )}

                {/* Fallback if no matching city in current filter */}
                {filteredCuratedCities.length === 0 && citySuggestions.length === 0 && (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-sm font-semibold text-slate-700">
                      No exact match found in <span className="text-indigo-400">{activeRegionFilter}</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveRegionFilter('All');
                          setDestination('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 font-bold text-xs"
                      >
                        Browse all 248 world cities
                      </button>
                      {destination && (
                        <button
                          type="button"
                          onClick={() => setShowAutocomplete(false)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs"
                        >
                          Use &ldquo;{destination}&rdquo; as destination
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Live Destination Intelligence Snapshot */}
          {destinationSnapshot && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-violet-950/60 border border-indigo-500/30 text-xs text-slate-300 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{destinationSnapshot.city}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {destinationSnapshot.bestMonths}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setDuration(destinationSnapshot.idealDuration);
                    if (startDate) {
                      const [y, m, d] = startDate.split('-').map(Number);
                      const end = new Date(y, m - 1, d + destinationSnapshot.idealDuration - 1);
                      setEndDate(end.toISOString().split('T')[0]);
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>⚡ Snap to Ideal {destinationSnapshot.idealDuration} Days</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <strong className="text-slate-200">Weather & Season:</strong> {destinationSnapshot.weather}
                </div>
                <div>
                  <strong className="text-slate-200">Currency & Transit:</strong> {destinationSnapshot.currency}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-amber-200/90 flex items-start gap-1">
                <span className="shrink-0">💡</span>
                <span><strong>Pro Tip:</strong> {destinationSnapshot.proTip}</span>
              </p>
            </div>
          )}

          {/* Trending Global Cities Chips & Map Quick-Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setIsMapPickerOpen(true)}
              className="text-xs px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>🗺️</span>
              <span>Open World Map</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setIsVibeQuizOpen(true);
              }}
              className="text-xs px-3.5 py-1 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95 ring-1 ring-violet-400/30"
              title="Take a 3-question quiz to find your dream vacation!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>🎯 Match My Vibe</span>
            </button>
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="text-xs px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer hover:scale-105 active:scale-95"
              title="Pick a random world destination!"
            >
              <Dices className="w-3.5 h-3.5 text-white" />
              <span>🎲 Surprise Me!</span>
            </button>
            <span className="text-[11px] text-slate-500 font-bold shrink-0 flex items-center gap-1 ml-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Trending:
            </span>
            {TRENDING_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => {
                  setDestination(`${dest.name}, ${dest.country}`);
                  setShowAutocomplete(false);
                }}
                className={`text-xs px-2.5 py-1 rounded-xl border transition-all shrink-0 font-semibold flex items-center gap-1.5 ${
                  destination.toLowerCase().includes(dest.name.toLowerCase())
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{dest.flag}</span>
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Travel Dates Calendar & Duration Engine */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>Travel Dates & Trip Calendar</span>
            </label>

            {/* Mode Switcher */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDateMode('calendar')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  dateMode === 'calendar'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Exact Dates (Calendar)</span>
              </button>
              <button
                type="button"
                onClick={() => setDateMode('duration')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  dateMode === 'duration'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Flexible Days Slider</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Exact Travel Dates with Start / End Date pickers & Live Calendar metrics */}
          {dateMode === 'calendar' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Departure Date */}
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Departure Date (Start)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full text-sm font-bold text-white outline-none bg-transparent cursor-pointer [color-scheme:dark]"
                  />
                </div>

                {/* Return Date */}
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Return Date (End)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full text-sm font-bold text-white outline-none bg-transparent cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Calculated Travel Span Banner */}
              <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-indigo-200">
                    Total Duration: {calculatedDuration} {calculatedDuration === 1 ? 'Day' : 'Days'}
                  </span>
                  <span className="text-indigo-600">•</span>
                  <span className="font-semibold text-slate-400">
                    {daysUntilTrip > 0
                      ? `Departs in ${daysUntilTrip} days`
                      : daysUntilTrip === 0
                      ? 'Departs Today!'
                      : 'Past dates'}
                  </span>
                </div>

                {/* Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyDatePreset('weekend')}
                    className="px-2 py-0.5 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded font-bold text-[10px] border border-white/10 transition-colors"
                  >
                    Weekend (3D)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset('7days')}
                    className="px-2 py-0.5 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded font-bold text-[10px] border border-white/10 transition-colors"
                  >
                    1 Week (7D)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset('14days')}
                    className="px-2 py-0.5 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded font-bold text-[10px] border border-white/10 transition-colors"
                  >
                    2 Weeks (14D)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset('30days')}
                    className="px-2 py-0.5 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded font-bold text-[10px] border border-white/10 transition-colors"
                  >
                    1 Month (30D)
                  </button>
                </div>
              </div>

              {/* Informative notice if duration exceeds 30 days */}
              {calculatedDuration > 30 && (
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      You selected <strong>{calculatedDuration} days</strong>. AI curates detailed daily schedules for up to 30 days per itinerary segment.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyDatePreset('30days')}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] shrink-0 transition-colors shadow-xs"
                  >
                    Snap to 30 Days (1 Month)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Duration Slider */
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Select Days Count</span>
                <span className="text-sm font-extrabold text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30">
                  {duration} {duration === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>1 Day</span>
                <span>7 Days (1 Wk)</span>
                <span>14 Days (2 Wks)</span>
                <span>30 Days (1 Mo)</span>
              </div>
            </div>
          )}
        </div>


        {/* Dynamic Real-Time Fare & Trip Cost Estimator */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/40 to-slate-900/60 border border-indigo-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-white text-xs uppercase tracking-wider">
                  Real-Time Estimated Trip Budget
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Live AI Index
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dynamic estimation for {activeDays} days ({companion} traveler{companion === 'solo' ? '' : 's'}) at {budget} tier
              </p>
            </div>

            {/* Currency Switcher Pills */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-none">
              {CURRENCY_LIST.map((cur) => {
                const isCur = selectedCurrency.code === cur.code;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => {
                      playPop();
                      setSelectedCurrency(cur);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isCur
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{cur.flag}</span>
                    <span>{cur.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cost Highlights Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {estimatedCosts.total}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                (≈ {estimatedCosts.perDay} / day)
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playPop();
                setShowCostBreakdown(!showCostBreakdown);
              }}
              className="text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showCostBreakdown ? 'Hide Breakdown' : 'View Fare Breakdown'}</span>
              {showCostBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Breakdown */}
          {showCostBreakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs animate-in fade-in duration-200">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">✈️ Flights & Transit</span>
                <span className="font-bold text-white text-sm">{estimatedCosts.flight}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">🏨 Stays ({Math.max(activeDays - 1, 1)} Nights)</span>
                <span className="font-bold text-white text-sm">{estimatedCosts.stay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">🍽️ Dining & Sightseeing</span>
                <span className="font-bold text-white text-sm">{estimatedCosts.food}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Budget Tier */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Budget Tier</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BUDGET_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setBudget(opt.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  budget === opt.id
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-xs ring-1 ring-indigo-500/30'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-bold text-slate-400">{opt.range}</span>
                </div>
                <div className="font-bold text-white text-sm">{opt.label}</div>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Travel Companion */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-600" />
            <span>Who is traveling?</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COMPANIONS.map((c) => (
              <div
                key={c.id}
                onClick={() => setCompanion(c.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                  companion === c.id
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 font-bold shadow-xs ring-1 ring-indigo-500/30'
                    : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-300'
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <span className="text-xs font-bold">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Travel Styles & Vibes */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Travel Styles & Vibes (Select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => toggleStyle(style.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs ring-1 ring-indigo-400/30'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Specific Interests or Requirements */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Special Interests or Custom Requests (Optional)
          </label>
          <textarea
            value={specificInterests}
            onChange={(e) => setSpecificInterests(e.target.value)}
            rows={2}
            placeholder="e.g. Vegetarian food options, anime shopping in Akihabara, avoiding stairs, early morning photography, rooftop bars..."
            className="w-full p-3 rounded-2xl border border-white/10 bg-white/5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all resize-none"
          />
        </div>

        {/* 7. Submit Button */}
        <div className="pt-2">
          <button
            ref={submitBtnRef}
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 hover:from-indigo-700 hover:via-indigo-800 hover:to-sky-700 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {loadingStep === 1
                    ? 'Exploring 1 Lakh+ city landmarks...'
                    : loadingStep === 2
                    ? 'Curating day-by-day calendar schedule...'
                    : 'Finalizing GPS coordinates and tips...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  Generate {dateMode === 'calendar' ? `${calculatedDuration}-Day` : `${duration}-Day`} Plan for{' '}
                  {destination.split(',')[0] || 'Destination'}
                </span>
                <ArrowRight className="w-5 h-5 text-white/80" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive World Map Destination Picker Modal */}
      <DestinationMapPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onSelectDestination={(dest) => {
          setDestination(dest);
          setShowAutocomplete(false);
        }}
        initialDestination={destination}
      />

      {/* Interactive 3-Question Travel Vibe Matcher Modal */}
      <TravelVibeQuizModal
        isOpen={isVibeQuizOpen}
        onClose={() => setIsVibeQuizOpen(false)}
        onApplyResult={handleApplyVibeQuiz}
      />
    </div>
  );
}
