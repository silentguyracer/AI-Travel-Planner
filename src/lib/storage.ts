import { TripPlan } from '@/types/travel';

const SAVED_TRIPS_KEY = 'wanderai_saved_trips';
const USER_SETTINGS_KEY = 'wanderai_user_settings';

export interface UserSettings {
  openaiApiKey?: string;
  googleMapsApiKey?: string;
  preferredCurrency?: string;
}

export function getSavedTrips(): TripPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load saved trips from localStorage', error);
    return [];
  }
}

export function saveTrip(trip: TripPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const trips = getSavedTrips();
    const existingIndex = trips.findIndex((t) => t.id === trip.id);
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Failed to save trip to localStorage', error);
  }
}

export function deleteSavedTrip(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const trips = getSavedTrips().filter((t) => t.id !== id);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error('Failed to delete trip from localStorage', error);
  }
}

export function isTripSaved(id: string): boolean {
  if (typeof window === 'undefined') return false;
  return getSavedTrips().some((t) => t.id === id);
}

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Failed to load user settings', error);
    return {};
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save user settings', error);
  }
}

export function exportTripToJson(trip: TripPlan): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_trip_plan.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
