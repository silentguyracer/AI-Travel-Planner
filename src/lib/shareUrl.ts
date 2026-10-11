import { TripPlan } from '@/types/travel';

/**
 * Encodes a TripPlan into a URL-safe base64 string
 */
export function encodeTripToUrl(trip: TripPlan): string {
  try {
    const jsonStr = JSON.stringify(trip);
    // Use encodeURIComponent to handle non-ASCII UTF-8 characters cleanly
    const utf8Bytes = encodeURIComponent(jsonStr).replace(
      /%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8Bytes);
  } catch (err) {
    console.error('Failed to encode trip to URL:', err);
    return '';
  }
}

/**
 * Decodes a TripPlan from a URL-safe base64 string
 */
export function decodeTripFromUrl(encoded: string): TripPlan | null {
  try {
    const raw = atob(encoded);
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(raw, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonStr) as TripPlan;
  } catch (err) {
    console.error('Failed to decode trip from URL:', err);
    return null;
  }
}

export function generateShareableUrl(trip: TripPlan): string {
  if (typeof window === 'undefined') return '';
  const hash = encodeTripToUrl(trip);
  return `${window.location.origin}${window.location.pathname}#trip=${hash}`;
}
