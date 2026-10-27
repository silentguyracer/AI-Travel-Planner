export interface DestinationSnapshot {
  city: string;
  bestMonths: string;
  weather: string;
  currency: string;
  language: string;
  idealDuration: number;
  proTip: string;
  vibe: string;
}

export const DESTINATION_SNAPSHOTS: Record<string, DestinationSnapshot> = {
  tokyo: {
    city: 'Tokyo, Japan',
    bestMonths: 'March – May & Oct – Nov',
    weather: '🌸 Cherry blossoms in spring, crisp colorful autumns',
    currency: 'Japanese Yen (¥ JPY) • Cash & Suica/Pasmo IC cards',
    language: 'Japanese (English signage in all transit & stations)',
    idealDuration: 5,
    proTip: 'Load a digital Suica card in Apple/Google Wallet for 1-tap transit and vending machines!',
    vibe: 'High-tech neon, shrines & 100,000+ Michelin-star spots',
  },
  paris: {
    city: 'Paris, France',
    bestMonths: 'April – June & Sept – Oct',
    weather: '☀️ Mild and picturesque café terrace weather (18–24°C)',
    currency: 'Euro (€ EUR) • Contactless card universally accepted',
    language: 'French (Always begin any interaction with "Bonjour")',
    idealDuration: 4,
    proTip: 'Book the Louvre and Eiffel Tower summit at least 3 weeks ahead to skip 2-hour lines.',
    vibe: 'Iconic art, romantic bistros & Seine sunsets',
  },
  bali: {
    city: 'Bali, Indonesia',
    bestMonths: 'April – October (Dry season)',
    weather: '🌴 Warm 28°C sunny days, cool ocean evening breezes',
    currency: 'Indonesian Rupiah (IDR Rp) • Cash handy for beach warungs',
    language: 'Indonesian & Balinese (English widely spoken)',
    idealDuration: 6,
    proTip: 'Download the Grab or Gojek app for on-demand scooter taxis and food delivery.',
    vibe: 'Tropical serenity, surfing, sacred temples & waterfalls',
  },
  dubai: {
    city: 'Dubai, UAE',
    bestMonths: 'November – March',
    weather: '🏙️ Perfect 25°C beach days, pleasant breezy desert nights',
    currency: 'UAE Dirham (AED د.إ) • Card accepted everywhere',
    language: 'Arabic & English (English is standard lingua franca)',
    idealDuration: 5,
    proTip: 'Ride the Driverless Dubai Metro Gold Class for spectacular elevated skyline views.',
    vibe: 'Futuristic architecture, desert dunes & luxury waterfronts',
  },
  santorini: {
    city: 'Santorini, Greece',
    bestMonths: 'May – June & Sept – Oct',
    weather: '⛵ Sunny Aegean sea breezes with minimal crowds',
    currency: 'Euro (€ EUR) • Cards widely accepted',
    language: 'Greek (English widely spoken in all tourist spots)',
    idealDuration: 4,
    proTip: 'Watch the sunset from Imerovigli rather than Oia for identical caldera views with zero crowd crush.',
    vibe: 'Clifftop white-washed villas & volcanic sunsets',
  },
  'new york': {
    city: 'New York, USA',
    bestMonths: 'May – June & Sept – Nov',
    weather: '🗽 Golden autumn foliage in Central Park (16–22°C)',
    currency: 'US Dollar ($ USD) • 1-tap OMNY for all subways',
    language: 'English',
    idealDuration: 5,
    proTip: 'Tap your credit card directly at subway turnstiles with OMNY — no MetroCard needed!',
    vibe: 'Broadway, world-class museums & 24/7 urban energy',
  },
  rome: {
    city: 'Rome, Italy',
    bestMonths: 'April – May & Sept – Oct',
    weather: '🏛️ Warm Mediterranean sunshine, pleasant walking temps',
    currency: 'Euro (€ EUR)',
    language: 'Italian',
    idealDuration: 4,
    proTip: 'Carry a refillable water bottle — Rome has 2,500+ free flowing fresh drinking fountains (Nasoni).',
    vibe: 'Ancient Colosseum, cobblestones & authentic carbonara',
  },
  udaipur: {
    city: 'Udaipur, India',
    bestMonths: 'October – March',
    weather: '👑 Mild pleasant sunny days (20–26°C), crisp evenings',
    currency: 'Indian Rupee (₹ INR) • UPI digital payments & Cash',
    language: 'Hindi, Rajasthani & English',
    idealDuration: 3,
    proTip: 'Take a sunset boat ride from City Palace jetty to Jag Mandir island for majestic reflections.',
    vibe: 'City of Lakes, royal palaces & rich Rajputana heritage',
  },
  interlaken: {
    city: 'Interlaken, Switzerland',
    bestMonths: 'June – Sept & Dec – March',
    weather: '🏔️ Alpine breeze, emerald lakes in summer, snow in winter',
    currency: 'Swiss Franc (CHF) • Contactless card standard',
    language: 'German & English',
    idealDuration: 4,
    proTip: 'Buy a Swiss Travel Pass if traveling across multiple panoramic trains like GoldenPass Express.',
    vibe: 'Glacier peaks, Lauterbrunnen waterfalls & cable cars',
  },
};

export function getDestinationSnapshot(query: string): DestinationSnapshot | null {
  if (!query) return null;
  const q = query.toLowerCase();
  for (const [key, snap] of Object.entries(DESTINATION_SNAPSHOTS)) {
    if (q.includes(key)) return snap;
  }
  return null;
}
