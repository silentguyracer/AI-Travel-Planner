import { ItineraryActivity } from '@/types/travel';

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates total route distance for a sequence of activities
 */
export function calculateTotalRouteDistance(activities: ItineraryActivity[]): number {
  let totalKm = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    const a1 = activities[i];
    const a2 = activities[i + 1];
    if (a1.coordinates && a2.coordinates) {
      totalKm += calculateHaversineDistance(
        a1.coordinates.lat,
        a1.coordinates.lng,
        a2.coordinates.lat,
        a2.coordinates.lng
      );
    }
  }
  return totalKm;
}

export interface OptimizationResult {
  originalOrder: ItineraryActivity[];
  optimizedOrder: ItineraryActivity[];
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  savedDistanceKm: number;
  savedMinutesEstimate: number;
}

/**
 * Optimizes the route of scheduled activities using nearest-neighbor heuristic
 * to minimize transit distance and backtracking
 */
export function optimizeDayActivities(activities: ItineraryActivity[]): OptimizationResult {
  if (activities.length <= 2) {
    const dist = calculateTotalRouteDistance(activities);
    return {
      originalOrder: [...activities],
      optimizedOrder: [...activities],
      originalDistanceKm: dist,
      optimizedDistanceKm: dist,
      savedDistanceKm: 0,
      savedMinutesEstimate: 0,
    };
  }

  const originalDistance = calculateTotalRouteDistance(activities);
  const unvisited = [...activities];
  const optimized: ItineraryActivity[] = [];

  // Start with the first morning activity
  let current = unvisited.shift()!;
  optimized.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidate = unvisited[i];
      if (current.coordinates && candidate.coordinates) {
        const d = calculateHaversineDistance(
          current.coordinates.lat,
          current.coordinates.lng,
          candidate.coordinates.lat,
          candidate.coordinates.lng
        );
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }
    }

    current = unvisited.splice(nearestIdx, 1)[0];
    optimized.push(current);
  }

  // Re-assign realistic time slots based on the new sequence
  const timeSlots: ItineraryActivity['timeSlot'][] = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const times = ['09:00 AM', '01:30 PM', '06:00 PM', '08:30 PM'];

  optimized.forEach((act, idx) => {
    act.timeSlot = timeSlots[Math.min(idx, timeSlots.length - 1)];
    act.time = times[Math.min(idx, times.length - 1)];
  });

  const optimizedDistance = calculateTotalRouteDistance(optimized);
  const savedKm = Math.max(0, originalDistance - optimizedDistance);
  // Average urban walking/transit: ~15 mins per saved km
  const savedMinutes = Math.round(savedKm * 15);

  return {
    originalOrder: activities,
    optimizedOrder: optimized,
    originalDistanceKm: Number(originalDistance.toFixed(2)),
    optimizedDistanceKm: Number(optimizedDistance.toFixed(2)),
    savedDistanceKm: Number(savedKm.toFixed(2)),
    savedMinutesEstimate: savedMinutes,
  };
}
