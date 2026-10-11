import { ItineraryActivity } from '@/types/travel';
import { calculateHaversineDistance } from './routeOptimizer';

export interface TransitStep {
  fromActivity: string;
  toActivity: string;
  distanceKm: number;
  mode: 'walk' | 'metro' | 'transit' | 'taxi';
  estimatedMinutes: number;
  summary: string;
  navigationUrl: string;
}

export function computeTransitBetweenStops(
  a1: ItineraryActivity,
  a2: ItineraryActivity,
  destination: string
): TransitStep {
  let distanceKm = 1.2;
  if (a1.coordinates && a2.coordinates) {
    distanceKm = calculateHaversineDistance(
      a1.coordinates.lat,
      a1.coordinates.lng,
      a2.coordinates.lat,
      a2.coordinates.lng
    );
  }

  // Determine transit mode based on distance
  let mode: TransitStep['mode'] = 'walk';
  let estimatedMinutes = Math.round(distanceKm * 14); // ~14 mins/km walking speed
  let summary = `Scenic ${Math.round(distanceKm * 1000)}m walk through urban neighborhood`;

  if (distanceKm > 2.5 && distanceKm <= 12) {
    mode = 'metro';
    estimatedMinutes = Math.round(8 + distanceKm * 2.5);
    summary = `Direct urban subway / train connection (~${estimatedMinutes} mins)`;
  } else if (distanceKm > 12) {
    mode = 'transit';
    estimatedMinutes = Math.round(15 + distanceKm * 2);
    summary = `Express regional train or express shuttle`;
  } else if (distanceKm > 1.5 && distanceKm <= 2.5) {
    mode = 'walk';
    summary = `Pleasant walk or quick 5-min taxi / bus`;
  }

  const originQuery = encodeURIComponent(`${a1.locationName || a1.activity} ${destination}`);
  const destQuery = encodeURIComponent(`${a2.locationName || a2.activity} ${destination}`);
  const travelMode = mode === 'walk' ? 'walking' : 'transit';
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}&travelmode=${travelMode}`;

  return {
    fromActivity: a1.locationName || a1.activity,
    toActivity: a2.locationName || a2.activity,
    distanceKm: Number(distanceKm.toFixed(2)),
    mode,
    estimatedMinutes,
    summary,
    navigationUrl,
  };
}
