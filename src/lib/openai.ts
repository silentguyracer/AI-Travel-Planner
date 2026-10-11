import OpenAI from 'openai';
import { TripGenerationRequest, TripPlan } from '@/types/travel';
import { findSampleTrip } from './sampleTrips';

export async function generateTripWithAI(params: TripGenerationRequest): Promise<TripPlan> {
  const apiKey = params.customApiKey || process.env.OPENAI_API_KEY;

  // If no OpenAI API key is supplied, attempt smart fallback
  if (!apiKey) {
    return generateFallbackTrip(params);
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const travelStylesText = params.travelStyles && params.travelStyles.length > 0
      ? params.travelStyles.join(', ')
      : 'General sightseeing, culture, and culinary highlights';

    const companionText = params.companion ? params.companion : 'solo/general';
    const interestsText = params.specificInterests ? `Special traveler preferences/requests: "${params.specificInterests}"` : '';

    const systemPrompt = `You are a world-class luxury and budget travel curator and local guide.
Your goal is to generate a comprehensive, highly realistic, tailored travel plan in valid JSON format.

Strict requirements:
1. Return ONLY a single valid JSON object matching the requested schema. No markdown formatting, no code fence backticks, just raw JSON.
2. The coordinates (lat, lng) for the destination and all places and restaurants MUST BE ACCURATE real-world coordinates for Google Maps plotting.
3. Include realistic budget estimates for the specified budget level: "${params.budget}".
4. Create a day-by-day itinerary for exactly ${params.duration} day(s). Each day MUST have Morning, Afternoon, and Evening activities with realistic time slots, descriptive tips, and specific dining spots.
5. Provide at least 5 top places to visit and 4 top restaurants with must-try dishes.`;

    const userPrompt = `Generate a ${params.duration}-day travel plan for:
Destination: ${params.destination}
Budget Tier: ${params.budget}
Companion: ${companionText}
Travel Styles / Vibes: ${travelStylesText}
${interestsText}

The JSON MUST conform to this exact TypeScript structure:
{
  "id": "trip-${Date.now()}",
  "destination": "${params.destination}",
  "country": "string",
  "duration": ${params.duration},
  "budget": "${params.budget}",
  "companion": "${params.companion || 'solo'}",
  "travelStyles": ["string"],
  "createdAt": "${new Date().toISOString()}",
  "summary": "string (engaging 2-3 sentence overview)",
  "highlights": ["string (5 captivating highlights)"],
  "bestTimeToVisit": "string",
  "centerCoordinates": { "lat": number, "lng": number },
  "estimatedBudget": {
    "flightsOrTransport": "string",
    "accommodation": "string",
    "foodAndDrinks": "string",
    "activitiesAndSightseeing": "string",
    "totalEstimate": "string",
    "currency": "USD"
  },
  "placesToVisit": [
    {
      "name": "string",
      "description": "string",
      "category": "landmark" | "museum" | "nature" | "historical" | "shopping" | "entertainment",
      "rating": number (between 4.0 and 5.0),
      "price": "string",
      "bestTimeToVisit": "string",
      "coordinates": { "lat": number, "lng": number },
      "address": "string",
      "tags": ["string"]
    }
  ],
  "restaurants": [
    {
      "name": "string",
      "description": "string",
      "cuisine": "string",
      "priceTier": "$" | "$$" | "$$$" | "$$$$",
      "rating": number (between 4.0 and 5.0),
      "mustTryDishes": ["string"],
      "address": "string",
      "coordinates": { "lat": number, "lng": number }
    }
  ],
  "itinerary": [
    {
      "day": number,
      "title": "string",
      "theme": "string",
      "schedule": [
        {
          "timeSlot": "Morning" | "Afternoon" | "Evening",
          "time": "string (e.g. 09:00 AM)",
          "activity": "string",
          "locationName": "string",
          "description": "string",
          "cost": "string",
          "tip": "string",
          "coordinates": { "lat": number, "lng": number }
        }
      ],
      "diningRecommendation": {
        "lunch": "string",
        "dinner": "string"
      }
    }
  ],
  "practicalTips": {
    "transportation": "string",
    "packing": ["string"],
    "localEtiquette": ["string"],
    "currencyAndPayments": "string",
    "weatherOverview": "string"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('OpenAI returned an empty response.');
    }

    const trip = JSON.parse(responseText) as TripPlan;
    trip.id = `trip-${Date.now()}`;
    return trip;
  } catch (err: unknown) {
    console.error('Error generating trip with OpenAI:', err);
    // If OpenAI call fails due to invalid key, rate limits, or network, gracefully fallback
    return generateFallbackTrip(params);
  }
}

export function generateFallbackTrip(params: TripGenerationRequest): TripPlan {
  const existingSample = findSampleTrip(params.destination, params.duration);
  if (existingSample) {
    const customized = JSON.parse(JSON.stringify(existingSample)) as TripPlan;
    customized.id = `trip-${Date.now()}`;
    customized.budget = params.budget;
    customized.duration = params.duration;
    if (params.companion) customized.companion = params.companion;
    if (params.travelStyles) customized.travelStyles = params.travelStyles;
    return customized;
  }

  // Dynamic fallback for any other destination in the world
  const days: TripPlan['itinerary'] = [];
  const duration = Math.min(Math.max(params.duration, 1), 14);

  // Approximate default center (if unknown, default to a major landmark coordinate)
  const destLower = params.destination.toLowerCase();
  let defaultLat = 40.7128;
  let defaultLng = -74.0060;
  let country = 'Global';

  if (destLower.includes('rome') || destLower.includes('italy')) {
    defaultLat = 41.9028;
    defaultLng = 12.4964;
    country = 'Italy';
  } else if (destLower.includes('bali') || destLower.includes('indonesia')) {
    defaultLat = -8.4095;
    defaultLng = 115.1889;
    country = 'Indonesia';
  } else if (destLower.includes('london') || destLower.includes('uk')) {
    defaultLat = 51.5074;
    defaultLng = -0.1278;
    country = 'United Kingdom';
  } else if (destLower.includes('barcelona') || destLower.includes('spain')) {
    defaultLat = 41.3879;
    defaultLng = 2.1699;
    country = 'Spain';
  } else if (destLower.includes('dubai') || destLower.includes('uae')) {
    defaultLat = 25.2048;
    defaultLng = 55.2708;
    country = 'United Arab Emirates';
  } else if (destLower.includes('new york') || destLower.includes('nyc')) {
    defaultLat = 40.7128;
    defaultLng = -74.0060;
    country = 'United States';
  }

  for (let d = 1; d <= duration; d++) {
    days.push({
      day: d,
      title: `Day ${d}: Discovering ${params.destination}`,
      theme: d === 1 ? 'Arrival & Historic Landmarks' : d === 2 ? 'Cultural Gems & Culinary Delights' : `Hidden Treasures & Scenic Vistas`,
      schedule: [
        {
          timeSlot: 'Morning',
          time: '09:00 AM',
          activity: `Morning Exploration & Historic Quarter`,
          locationName: `${params.destination} City Center`,
          description: `Kick off your day enjoying a fresh local breakfast and taking in the iconic architecture of ${params.destination}.`,
          cost: '$15 - $25',
          tip: 'Start early to beat the tour groups and capture golden hour light.',
          coordinates: { lat: defaultLat + 0.005 * d, lng: defaultLng + 0.004 * d }
        },
        {
          timeSlot: 'Afternoon',
          time: '01:30 PM',
          activity: `Museums, Markets & Neighborhood Walk`,
          locationName: `${params.destination} Cultural District`,
          description: `Immerse yourself in authentic neighborhood artisan boutiques, museums, and scenic promenades.`,
          cost: '$20 admission',
          tip: 'Pre-book online tickets to skip long queues.',
          coordinates: { lat: defaultLat - 0.004 * d, lng: defaultLng + 0.006 * d }
        },
        {
          timeSlot: 'Evening',
          time: '06:30 PM',
          activity: `Sunset Scenic Point & Evening Gastronomy`,
          locationName: `${params.destination} Waterfront / Lookout`,
          description: `Experience the city lit up at dusk, followed by a cozy dinner featuring local regional specialties.`,
          cost: '$30 - $60',
          tip: 'Make a table reservation around sunset for the best ambience.',
          coordinates: { lat: defaultLat + 0.003 * d, lng: defaultLng - 0.005 * d }
        }
      ],
      diningRecommendation: {
        lunch: `Local bistro in the Old Quarter`,
        dinner: `Acclaimed regional dining near the central plaza`
      }
    });
  }

  const budgetMultiplier = params.budget === 'luxury' ? 2.5 : params.budget === 'economy' ? 0.6 : 1.0;
  const baseCost = duration * 180 * budgetMultiplier;

  return {
    id: `trip-${Date.now()}`,
    destination: params.destination,
    country: country,
    duration: duration,
    budget: params.budget,
    companion: params.companion || 'solo',
    travelStyles: params.travelStyles || ['cultural', 'foodie'],
    createdAt: new Date().toISOString(),
    summary: `A personalized ${duration}-day ${params.budget} adventure in ${params.destination}, balancing must-see landmarks, rich culinary traditions, and authentic local experiences.`,
    highlights: [
      `Immersive walking tour through the heart of ${params.destination}`,
      `Authentic regional dining at hand-picked local eateries`,
      `Panoramic viewpoints and iconic architectural highlights`,
      `Curated cultural museums and artisan districts`,
      `Relaxed evenings soaking in the authentic evening lifestyle`
    ],
    bestTimeToVisit: 'Spring (April-June) and Autumn (September-November)',
    centerCoordinates: {
      lat: defaultLat,
      lng: defaultLng
    },
    estimatedBudget: {
      flightsOrTransport: `$${Math.round(250 * budgetMultiplier)}`,
      accommodation: `$${Math.round(duration * 90 * budgetMultiplier)}`,
      foodAndDrinks: `$${Math.round(duration * 50 * budgetMultiplier)}`,
      activitiesAndSightseeing: `$${Math.round(duration * 35 * budgetMultiplier)}`,
      totalEstimate: `$${Math.round(baseCost)} USD`,
      currency: 'USD'
    },
    placesToVisit: [
      {
        name: `${params.destination} Historic Center`,
        description: `The beating historical heart of ${params.destination}, lined with venerable buildings, cafes, and open piazzas.`,
        category: 'landmark',
        rating: 4.8,
        price: 'Free to explore',
        bestTimeToVisit: 'Morning 9:00 AM',
        coordinates: { lat: defaultLat + 0.005, lng: defaultLng + 0.005 },
        address: `Central Plaza, ${params.destination}`,
        tags: ['Architecture', 'Historical', 'Walking']
      },
      {
        name: `${params.destination} National Museum & Art Gallery`,
        description: `World-renowned collections tracing centuries of heritage, archaeology, and contemporary art.`,
        category: 'museum',
        rating: 4.7,
        price: '$18',
        bestTimeToVisit: 'Afternoon 2:00 PM',
        coordinates: { lat: defaultLat - 0.006, lng: defaultLng + 0.007 },
        address: `Museum Boulevard, ${params.destination}`,
        tags: ['Art', 'Museum', 'Culture']
      },
      {
        name: `${params.destination} Panoramic Overlook`,
        description: `Breathtaking vantage point offering sweeping vistas across the skyline, especially stunning at sunset.`,
        category: 'landmark',
        rating: 4.9,
        price: 'Free / Minor cable car fee',
        bestTimeToVisit: 'Sunset (5:30 PM - 7:00 PM)',
        coordinates: { lat: defaultLat + 0.012, lng: defaultLng - 0.01 },
        address: `Hilltop Summit, ${params.destination}`,
        tags: ['Views', 'Sunset', 'Scenic']
      },
      {
        name: `${params.destination} Botanical & Royal Gardens`,
        description: `Peaceful green oasis featuring exotic flora, sculpted fountains, and shaded promenades.`,
        category: 'nature',
        rating: 4.6,
        price: '$8 or Free public access',
        bestTimeToVisit: 'Morning 10:00 AM',
        coordinates: { lat: defaultLat - 0.008, lng: defaultLng - 0.008 },
        address: `Garden Way, ${params.destination}`,
        tags: ['Nature', 'Relaxation', 'Photo']
      }
    ],
    restaurants: [
      {
        name: `Trattoria / Bistro ${params.destination}`,
        description: `Beloved local staple renowned for seasonal recipes, homemade pasta or local dishes, and warm hospitality.`,
        cuisine: 'Local Regional Specialties',
        priceTier: params.budget === 'luxury' ? '$$$' : '$$',
        rating: 4.8,
        mustTryDishes: ['Chef Special Tasting Platter', 'House Made Pastries', 'Local Artisan Wine'],
        address: `Old Town Street, ${params.destination}`,
        coordinates: { lat: defaultLat + 0.003, lng: defaultLng + 0.003 }
      },
      {
        name: `${params.destination} Street Food & Artisan Market`,
        description: `Lively bazaar with fresh gourmet snacks, grilled delicacies, and vibrant local buzz.`,
        cuisine: 'Street Food & Delicacies',
        priceTier: '$',
        rating: 4.6,
        mustTryDishes: ['Freshly baked hand pies / pastries', 'Local skewers', 'Artisan gelato'],
        address: `Market Hall, ${params.destination}`,
        coordinates: { lat: defaultLat - 0.004, lng: defaultLng + 0.002 }
      },
      {
        name: `Skyline Rooftop Lounge`,
        description: `Elegant terrace restaurant pairing fine dining with 360-degree views of the illuminated skyline.`,
        cuisine: 'Contemporary Fusion',
        priceTier: params.budget === 'economy' ? '$$' : '$$$',
        rating: 4.7,
        mustTryDishes: ['Tasting Menu with Wine Pairing', 'Signature Craft Cocktails'],
        address: `Sky Tower Level 24, ${params.destination}`,
        coordinates: { lat: defaultLat + 0.009, lng: defaultLng - 0.002 }
      }
    ],
    itinerary: days,
    practicalTips: {
      transportation: `Public transit (metro, trams, and buses) is typically the fastest and most cost-effective way to get around ${params.destination}. Taxis or ride-share apps are readily available for late-night journeys.`,
      packing: [
        'Comfortable pair of walking shoes for cobblestones and city exploring',
        'Universal power adapter and compact portable battery bank',
        'Reusable water bottle',
        'Weather-appropriate layers and a light rain jacket'
      ],
      localEtiquette: [
        'A friendly greeting in the local language when entering shops is universally appreciated.',
        'Check local tipping norms; typically 5-10% or rounding up is common for good service.',
        'Dress respectfully when visiting religious or sacred cultural sites.'
      ],
      currencyAndPayments: `Major credit/debit cards are widely accepted at most hotels, restaurants, and shops. It is recommended to carry a small amount of local cash for street vendors or small kiosks.`,
      weatherOverview: `Check the forecast right before departure; layering is recommended for shifting morning and evening temperatures.`
    }
  };
}
