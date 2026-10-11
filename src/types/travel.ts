export type BudgetTier = 'economy' | 'moderate' | 'luxury';

export type CompanionType = 'solo' | 'couple' | 'family' | 'friends';

export type TravelStyle =
  | 'cultural'
  | 'foodie'
  | 'adventure'
  | 'relaxed'
  | 'nature'
  | 'shopping'
  | 'nightlife'
  | 'photography';

export interface PlaceToVisit {
  name: string;
  description: string;
  category: 'landmark' | 'museum' | 'nature' | 'historical' | 'shopping' | 'entertainment';
  rating: number;
  price: string;
  bestTimeToVisit: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  tags: string[];
  durationRecommended?: string;
  openingHours?: string;
  insiderSecret?: string;
  nearestTransit?: string;
}

export interface RestaurantRecommendation {
  name: string;
  description: string;
  cuisine: string;
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  mustTryDishes: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  averageMealCost?: string;
  vibe?: string;
  reservationAdvice?: string;
  signatureSpecialty?: string;
}

export interface ItineraryActivity {
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  activity: string;
  locationName: string;
  description: string;
  cost: string;
  tip: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  durationMin?: number;
  transitInfo?: string;
  insiderTip?: string;
  photoSpot?: string;
  dressCode?: string;
  bookingStatus?: string;
  crowdLevel?: 'Low' | 'Moderate' | 'High';
  audioTrivia?: string;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  theme: string;
  energyLevel?: 'Relaxed' | 'Moderate' | 'High-Energy';
  walkingDistance?: string;
  estimatedDayBudget?: string;
  schedule: ItineraryActivity[];
  diningRecommendation: {
    lunch: string;
    dinner: string;
    breakfast?: string;
    snack?: string;
  };
  dailyProTip?: string;
}

export interface BudgetBreakdown {
  flightsOrTransport: string;
  accommodation: string;
  foodAndDrinks: string;
  activitiesAndSightseeing: string;
  totalEstimate: string;
  currency: string;
}

export interface PracticalTips {
  transportation: string;
  packing: string[];
  localEtiquette: string[];
  currencyAndPayments: string;
  weatherOverview: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  country: string;
  duration: number; // in days
  startDate?: string;
  endDate?: string;
  budget: BudgetTier;
  companion?: CompanionType;
  travelStyles?: TravelStyle[];
  createdAt: string;
  summary: string;
  highlights: string[];
  bestTimeToVisit: string;
  centerCoordinates: {
    lat: number;
    lng: number;
  };
  estimatedBudget: BudgetBreakdown;
  placesToVisit: PlaceToVisit[];
  restaurants: RestaurantRecommendation[];
  itinerary: ItineraryDay[];
  practicalTips: PracticalTips;
}

export interface TripGenerationRequest {
  destination: string;
  duration: number;
  startDate?: string;
  endDate?: string;
  budget: BudgetTier;
  companion?: CompanionType;
  travelStyles?: TravelStyle[];
  specificInterests?: string;
  customApiKey?: string;
}
