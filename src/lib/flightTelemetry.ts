export interface FlightTelemetry {
  distanceKm: number;
  distanceMiles: number;
  flightTimeFormatted: string;
  airlines: string[];
  routeType: 'Non-stop Direct' | '1-Stop Fast Connecting';
  economyFareUsd: number;
  businessFareUsd: number;
  timeDifferenceHours: number;
  jetlagRisk: 'Minimal' | 'Mild' | 'Moderate' | 'High';
  visaSummary: string;
  powerPlug: string;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; tz: number; country: string }> = {
  delhi: { lat: 28.5562, lng: 77.1000, tz: 5.5, country: 'India' },
  mumbai: { lat: 19.0896, lng: 72.8656, tz: 5.5, country: 'India' },
  bengaluru: { lat: 13.1986, lng: 77.7066, tz: 5.5, country: 'India' },
  'new york': { lat: 40.6413, lng: -73.7781, tz: -5, country: 'USA' },
  london: { lat: 51.4700, lng: -0.4543, tz: 0, country: 'UK' },
  dubai: { lat: 25.2532, lng: 55.3657, tz: 4, country: 'UAE' },
  singapore: { lat: 1.3644, lng: 103.9915, tz: 8, country: 'Singapore' },
  'san francisco': { lat: 37.6213, lng: -122.3790, tz: -8, country: 'USA' },
  tokyo: { lat: 35.5494, lng: 139.7798, tz: 9, country: 'Japan' },
  paris: { lat: 49.0097, lng: 2.5479, tz: 1, country: 'France' },
  bali: { lat: -8.7482, lng: 115.1672, tz: 8, country: 'Indonesia' },
  santorini: { lat: 36.3992, lng: 25.4793, tz: 2, country: 'Greece' },
  rome: { lat: 41.8003, lng: 12.2389, tz: 1, country: 'Italy' },
  udaipur: { lat: 24.6177, lng: 73.8961, tz: 5.5, country: 'India' },
  interlaken: { lat: 46.6863, lng: 7.8632, tz: 1, country: 'Switzerland' },
  barcelona: { lat: 41.2974, lng: 2.0833, tz: 1, country: 'Spain' },
  sydney: { lat: -33.9399, lng: 151.1753, tz: 11, country: 'Australia' },
  amsterdam: { lat: 52.3105, lng: 4.7683, tz: 1, country: 'Netherlands' },
  bangkok: { lat: 13.6900, lng: 100.7501, tz: 7, country: 'Thailand' },
};

function getCoords(name: string) {
  const n = name.toLowerCase();
  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (n.includes(key)) return val;
  }
  return { lat: 35.6762, lng: 139.6503, tz: 9, country: 'Global' };
}

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function computeFlightTelemetry(originCity: string, destCity: string): FlightTelemetry {
  const origin = getCoords(originCity || 'Delhi');
  const dest = getCoords(destCity || 'Tokyo');

  const distanceKm = Math.max(calculateHaversineKm(origin.lat, origin.lng, dest.lat, dest.lng), 600);
  const distanceMiles = Math.round(distanceKm * 0.621371);

  // Cruise speed ~800 km/h + 40 mins takeoff/landing
  const flightHoursExact = distanceKm / 820 + 0.65;
  const h = Math.floor(flightHoursExact);
  const m = Math.round((flightHoursExact - h) * 60);
  const flightTimeFormatted = `${h}h ${m < 10 ? '0' : ''}${m}m`;

  // Time difference in hours
  const tzDiff = Math.abs(dest.tz - origin.tz);
  const jetlagRisk =
    tzDiff <= 2 ? 'Minimal' : tzDiff <= 4 ? 'Mild' : tzDiff <= 7 ? 'Moderate' : 'High';

  // Airlines based on destination
  let airlines = ['Emirates', 'Qatar Airways', 'Lufthansa'];
  let visaSummary = 'Visa-Free (Up to 90 Days)';
  let powerPlug = 'Type C / E (230V)';

  const dLower = destCity.toLowerCase();
  if (dLower.includes('tokyo') || dLower.includes('japan')) {
    airlines = ['All Nippon Airways (ANA)', 'Japan Airlines (JAL)', 'Air India'];
    visaSummary = 'eVisa / 90-Day Visa Waiver (Visit Japan Web QR)';
    powerPlug = 'Type A & B (100V)';
  } else if (dLower.includes('paris') || dLower.includes('france') || dLower.includes('europe') || dLower.includes('rome') || dLower.includes('interlaken')) {
    airlines = ['Air France', 'Lufthansa', 'Swiss International Air Lines'];
    visaSummary = 'Schengen Visa / EU ETIAS Waiver (90/180 Days)';
    powerPlug = 'Type C & E/F (230V)';
  } else if (dLower.includes('bali') || dLower.includes('indonesia')) {
    airlines = ['Singapore Airlines', 'Garuda Indonesia', 'AirAsia'];
    visaSummary = 'Electronic Visa on Arrival (e-VoA 30 Days)';
    powerPlug = 'Type C & F (230V)';
  } else if (dLower.includes('dubai') || dLower.includes('uae')) {
    airlines = ['Emirates', 'Flydubai', 'Etihad Airways'];
    visaSummary = 'Visa on Arrival / 30-Day Free Entry';
    powerPlug = 'Type G UK standard (230V)';
  } else if (dLower.includes('new york') || dLower.includes('usa')) {
    airlines = ['United Airlines', 'Delta Air Lines', 'American Airlines'];
    visaSummary = 'ESTA Visa Waiver / B1/B2 Tourist Visa';
    powerPlug = 'Type A & B (120V)';
  }

  // Base fare estimates based on distance
  const economyFareUsd = Math.round(180 + distanceKm * 0.065);
  const businessFareUsd = Math.round(economyFareUsd * 2.85);

  return {
    distanceKm,
    distanceMiles,
    flightTimeFormatted,
    airlines,
    routeType: distanceKm < 9000 ? 'Non-stop Direct' : '1-Stop Fast Connecting',
    economyFareUsd,
    businessFareUsd,
    timeDifferenceHours: tzDiff,
    jetlagRisk,
    visaSummary,
    powerPlug,
  };
}
