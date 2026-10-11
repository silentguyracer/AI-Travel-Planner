import { NextRequest, NextResponse } from 'next/server';
import { WORLD_CITIES_DATABASE } from '@/lib/worldCities';

function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '📍';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const region = searchParams.get('region')?.trim() || '';

  // If no search query or short, return the curated database (optionally filtered by region)
  if (!q || q.length < 2) {
    let list = WORLD_CITIES_DATABASE;
    if (region && region !== 'All') {
      list = list.filter((c) => c.continent.toLowerCase() === region.toLowerCase());
    }
    return NextResponse.json({
      cities: list.map((c) => ({
        ...c,
        displayName: `${c.name}, ${c.admin1 ? c.admin1 + ', ' : ''}${c.country}`,
      })),
      source: 'curated-250plus',
      total: list.length,
    });
  }

  try {
    // Query worldwide Open-Meteo Geocoding database (> 1,000,000 cities, towns, and villages worldwide)
    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q
    )}&count=15&language=en&format=json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WanderAI-Travel-Planner/1.0' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        interface GeocodeResult {
          id: number;
          name: string;
          country?: string;
          country_code?: string;
          admin1?: string;
          latitude: number;
          longitude: number;
          population?: number;
        }

        const cities = data.results.map((r: GeocodeResult) => {
          const flag = getCountryFlag(r.country_code);
          const adminStr = r.admin1 ? `${r.admin1}, ` : '';
          const countryStr = r.country || '';
          return {
            id: r.id,
            name: r.name,
            country: r.country || '',
            countryCode: r.country_code || '',
            admin1: r.admin1 || '',
            flag,
            lat: r.latitude,
            lng: r.longitude,
            population: r.population,
            displayName: `${r.name}, ${adminStr}${countryStr}`,
          };
        });

        return NextResponse.json({
          cities,
          source: 'global-geocoding',
          total: cities.length,
        });
      }
    }
  } catch (err) {
    console.warn('Live geocoding error or timeout, falling back to local search:', err);
  }

  // Fallback to local catalog filtering (250+ world cities)
  const qLower = q.toLowerCase();
  const localMatches = WORLD_CITIES_DATABASE.filter(
    (c) =>
      c.name.toLowerCase().includes(qLower) ||
      c.country.toLowerCase().includes(qLower) ||
      (c.admin1 && c.admin1.toLowerCase().includes(qLower)) ||
      (c.highlight && c.highlight.toLowerCase().includes(qLower))
  ).map((c) => ({
    ...c,
    displayName: `${c.name}, ${c.admin1 ? c.admin1 + ', ' : ''}${c.country}`,
  }));

  // If no match found in top cities, return the query itself as a custom worldwide location
  if (localMatches.length === 0) {
    localMatches.push({
      name: q,
      country: 'Global Destination',
      admin1: '',
      continent: 'Asia',
      highlight: 'Custom World Destination',
      flag: '📍',
      lat: 0,
      lng: 0,
      displayName: `${q} (Custom World Destination)`,
    });
  }

  return NextResponse.json({
    cities: localMatches,
    source: 'fallback',
  });
}
