import { TripGenerationRequest, TripPlan } from '@/types/travel';
import { findSampleTrip } from './sampleTrips';
import { getAIConfig, createChatCompletionWithFallback, extractJsonFromResponse } from './aiClient';
import { WORLD_CITIES_DATABASE } from './worldCities';

export async function generateTripWithAI(params: TripGenerationRequest): Promise<TripPlan> {
  const aiConfig = getAIConfig(params.customApiKey);

  // If no AI key (Groq or OpenAI) is configured, fallback cleanly
  if (!aiConfig) {
    return generateFallbackTrip(params);
  }

  try {
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
4. CRITICAL REQUIREMENT - AS MANY PACKED EVENTS AS POSSIBLE:
   Do NOT limit days to only 3 events. The traveler wants an action-packed, vibrant full-day itinerary!
   Each day MUST contain AT LEAST 6 to 8 distinct events chronologically spanning the whole day (07:30 AM to 11:00 PM):
   - Event 1 (07:30 AM - 09:00 AM): Early morning sunrise vantage / neighborhood stroll & local artisan bakery/breakfast
   - Event 2 (09:15 AM - 11:30 AM): Major iconic monument / landmark / sacred shrine exploration before crowds
   - Event 3 (11:45 AM - 01:15 PM): Bustling local food market / street gastronomy crawl & lunch
   - Event 4 (01:30 PM - 03:30 PM): World-class museum / cultural palace / gallery immersion
   - Event 5 (03:45 PM - 05:00 PM): Hidden courtyard / scenic canal or historic alleyway stroll / artisan tea or coffee pause
   - Event 6 (05:15 PM - 06:45 PM): Golden hour panoramic viewpoint / rooftop lookout / sunset vantage
   - Event 7 (07:00 PM - 09:00 PM): Celebrated dinner feast featuring signature local specialties
   - Event 8 (09:15 PM - 11:00 PM): Night illumination walk / lively night market / historic jazz lounge / speakeasy
5. Provide at least 5 top places to visit and 4 top restaurants with must-try dishes.`;

    const userPrompt = `Generate a ${params.duration}-day travel plan for:
Destination: ${params.destination}
Budget Tier: ${params.budget}
Companion: ${companionText}
Travel Styles / Vibes: ${travelStylesText}
${interestsText}

IMPORTANT: PACK AS MANY EVENTS AS POSSIBLE PER DAY! Every single day must have at least 6 to 8 detailed, chronological events from 07:30 AM to 11:00 PM. Do NOT stop at 3 events!

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
      "durationRecommended": "string (e.g. 2 - 3 hours)",
      "openingHours": "string (e.g. 09:00 AM - 05:30 PM)",
      "insiderSecret": "string (pro tip for secret views or beating crowds)",
      "nearestTransit": "string (nearest subway line or station)",
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
      "averageMealCost": "string (e.g. $25 - $40 / person)",
      "vibe": "string",
      "reservationAdvice": "string (e.g. walk-in before 6pm or reserve 1 week ahead)",
      "signatureSpecialty": "string",
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
      "energyLevel": "Relaxed" | "Moderate" | "High-Energy",
      "walkingDistance": "string (e.g. 4.2 km • ~6,500 steps)",
      "estimatedDayBudget": "string",
      "dailyProTip": "string",
      "schedule": [
        {
          "timeSlot": "Morning" | "Afternoon" | "Evening" | "Night",
          "time": "string (e.g. 09:00 AM)",
          "activity": "string",
          "locationName": "string",
          "description": "string",
          "cost": "string",
          "durationMin": number (e.g. 90),
          "transitInfo": "string (subway line, station exit, walk minutes)",
          "insiderTip": "string (pro actionable tip)",
          "photoSpot": "string (best photo angle/location)",
          "dressCode": "string (clothing advice/restrictions)",
          "bookingStatus": "string (e.g. Free Entry / Book online ahead / Walk-in)",
          "crowdLevel": "Low" | "Moderate" | "High",
          "audioTrivia": "string (fascinating local history or trivia)",
          "tip": "string",
          "coordinates": { "lat": number, "lng": number }
        }
      ],
      "diningRecommendation": {
        "breakfast": "string",
        "lunch": "string",
        "dinner": "string",
        "snack": "string"
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

    const { content } = await createChatCompletionWithFallback(aiConfig, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      responseFormatJson: true,
      temperature: 0.7,
      maxTokens: 4096,
    });

    const trip = extractJsonFromResponse<TripPlan>(content);
    trip.id = `trip-${Date.now()}`;
    if (params.startDate) trip.startDate = params.startDate;
    if (params.endDate) trip.endDate = params.endDate;

    // Defensive fallback checks to ensure 100% complete itinerary schema
    if (!trip.itinerary || !Array.isArray(trip.itinerary) || trip.itinerary.length === 0) {
      const fallback = generateFallbackTrip(params);
      if (trip.centerCoordinates?.lat && trip.centerCoordinates?.lng) {
        const cLat = trip.centerCoordinates.lat;
        const cLng = trip.centerCoordinates.lng;
        fallback.itinerary.forEach((d, dIdx) => {
          d.schedule.forEach((s, sIdx) => {
            s.coordinates = {
              lat: cLat + (Math.sin(dIdx * 3 + sIdx) * 0.015),
              lng: cLng + (Math.cos(dIdx * 3 + sIdx) * 0.015),
            };
          });
        });
      }
      trip.itinerary = fallback.itinerary;
    } else if (trip.itinerary.length < params.duration) {
      // If AI returned fewer days than requested (e.g. 1 or 3 days instead of 14), pad missing days!
      const fallback = generateFallbackTrip(params);
      const existingCount = trip.itinerary.length;
      for (let d = existingCount + 1; d <= params.duration; d++) {
        const template =
          fallback.itinerary.find((fd) => fd.day === d) ||
          fallback.itinerary[(d - 1) % fallback.itinerary.length];
        if (template) {
          const paddedDay = JSON.parse(JSON.stringify(template));
          paddedDay.day = d;
          paddedDay.title = `Day ${d}: Deep Exploration of ${params.destination}`;
          trip.itinerary.push(paddedDay);
        }
      }
    }
    trip.duration = trip.itinerary.length;

    if (!trip.placesToVisit || !Array.isArray(trip.placesToVisit) || trip.placesToVisit.length === 0) {
      const fallback = generateFallbackTrip(params);
      trip.placesToVisit = fallback.placesToVisit;
    }
    if (!trip.restaurants || !Array.isArray(trip.restaurants) || trip.restaurants.length === 0) {
      const fallback = generateFallbackTrip(params);
      trip.restaurants = fallback.restaurants;
    }

    return trip;
  } catch (err: unknown) {
    console.error('Error generating trip with AI:', err);
    // If AI call fails due to invalid key, rate limits, or network, gracefully fallback
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
    if (params.startDate) customized.startDate = params.startDate;
    if (params.endDate) customized.endDate = params.endDate;
    if (params.companion) customized.companion = params.companion;
    if (params.travelStyles) customized.travelStyles = params.travelStyles;
    return customized;
  }

  // Dynamic fallback for any other destination in the world
  const days: TripPlan['itinerary'] = [];
  const duration = Math.min(Math.max(params.duration, 1), 30);

  // Match against our comprehensive world cities database
  const destLower = params.destination.toLowerCase();
  const matchedCity = WORLD_CITIES_DATABASE.find(
    (c) => destLower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(destLower)
  );

  let defaultLat = matchedCity ? matchedCity.lat : 26.9124;
  let defaultLng = matchedCity ? matchedCity.lng : 75.7873;
  let country = matchedCity ? matchedCity.country : 'Global';

  if (!matchedCity) {
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
    } else if (destLower.includes('jaipur')) {
      defaultLat = 26.9124;
      defaultLng = 75.7873;
      country = 'India';
    }
  }

  for (let d = 1; d <= duration; d++) {
    days.push({
      day: d,
      title: `Day ${d}: Discovering ${params.destination}`,
      theme: d === 1 ? 'Arrival & Historic Landmarks' : d === 2 ? 'Cultural Gems & Culinary Delights' : `Hidden Treasures & Scenic Vistas`,
      energyLevel: d % 3 === 1 ? 'Moderate' : d % 3 === 2 ? 'High-Energy' : 'Relaxed',
      walkingDistance: `${(3.5 + (d * 0.4)).toFixed(1)} km • ~${Math.round(5500 + d * 600)} steps`,
      estimatedDayBudget: `$${Math.round(45 * (params.budget === 'luxury' ? 2.2 : params.budget === 'economy' ? 0.6 : 1.0))} / person`,
      dailyProTip: `Wear comfortable walking footwear and carry a portable battery pack for navigation and photography throughout Day ${d}.`,
      schedule: [
        {
          timeSlot: 'Morning',
          time: '07:30 AM',
          activity: `Morning Awakening & Artisan Bakery Breakfast`,
          locationName: `${params.destination} Historic Promenade`,
          description: `Begin your morning with fresh local pastries, espresso, and a peaceful stroll as the city wakes up before the tour groups arrive.`,
          cost: '$8 - $15',
          durationMin: 60,
          transitInfo: `Walking distance from main central accommodations • 5 min stroll`,
          insiderTip: 'Sit at an outdoor terrace to soak in the morning atmosphere and golden early light.',
          photoSpot: 'Quaint café facade framed with historic morning sunbeams',
          dressCode: 'Casual morning wear and walking shoes',
          bookingStatus: 'Walk-ins welcome',
          crowdLevel: 'Low',
          audioTrivia: 'Local morning bakeries here follow centuries-old fermentation techniques preserved by family guilds.',
          tip: 'Arrive before 08:00 AM for the freshest oven-baked treats.',
          coordinates: { lat: defaultLat + 0.002 * d, lng: defaultLng + 0.003 * d }
        },
        {
          timeSlot: 'Morning',
          time: '09:00 AM',
          activity: `Major Monument & Historic Landmark Exploration`,
          locationName: `${params.destination} Iconic Landmark`,
          description: `Marvel at the magnificent architecture and deep cultural heritage of ${params.destination}’s most celebrated centerpiece.`,
          cost: '$15 - $25',
          durationMin: 120,
          transitInfo: `Central Metro Line to ${params.destination} Central Station, Exit 2 • 6 min walk`,
          insiderTip: 'Start early right at opening to beat tour bus crowds and capture clean photos without people in the frame.',
          photoSpot: 'Main grand courtyard framing the towering archway from the eastern colonnade',
          dressCode: 'Comfortable smart casual; respectful attire recommended for historic halls',
          bookingStatus: 'Free admission or skip-the-line ticket recommended',
          crowdLevel: 'Moderate',
          audioTrivia: 'The historic facades date back over 300 years and were painstakingly preserved through generations.',
          tip: 'Start early to beat the tour groups and capture golden hour light.',
          coordinates: { lat: defaultLat + 0.005 * d, lng: defaultLng + 0.004 * d }
        },
        {
          timeSlot: 'Afternoon',
          time: '11:45 AM',
          activity: `Bustling Local Market & Street Food Tasting Lunch`,
          locationName: `${params.destination} Central Market Hall`,
          description: `Venture through vibrant rows of seasonal fruits, artisan cheeses, cured meats, and sizzling hot food stalls.`,
          cost: '$12 - $20',
          durationMin: 75,
          transitInfo: 'Direct 8-min stroll through the pedestrian merchant corridor',
          insiderTip: 'Look for stalls with long queues of local residents—that is where the most authentic dishes are cooked fresh to order.',
          photoSpot: 'Center market mezzanine looking over colorful spice and produce displays',
          dressCode: 'Casual comfortable clothes',
          bookingStatus: 'Open public market',
          crowdLevel: 'Moderate',
          audioTrivia: 'This market has been the culinary heartbeat of the city since the 19th century.',
          tip: 'Carry small cash notes for rapid stall transactions.',
          coordinates: { lat: defaultLat + 0.001 * d, lng: defaultLng + 0.006 * d }
        },
        {
          timeSlot: 'Afternoon',
          time: '01:30 PM',
          activity: `Iconic Museum, Art Gallery & Cultural Palace`,
          locationName: `${params.destination} National Cultural Gallery`,
          description: `Immerse yourself in world-class masterpieces, royal artifacts, and curated historical exhibitions.`,
          cost: '$20 admission',
          durationMin: 120,
          transitInfo: 'Metro Line 2 or scenic 10-min boulevard walk',
          insiderTip: 'Download the museum digital audio tour on your smartphone for curator commentaries on top highlight halls.',
          photoSpot: 'Level 2 atrium balcony looking down at the sculpture court',
          dressCode: 'Casual; light sweater recommended for air-conditioned gallery wings',
          bookingStatus: 'Advance timed-entry voucher recommended',
          crowdLevel: 'Moderate',
          audioTrivia: 'Houses one of the region’s premier collections of classical craftsmanship and legendary masters.',
          tip: 'Pre-book online tickets to skip long queues.',
          coordinates: { lat: defaultLat - 0.004 * d, lng: defaultLng + 0.006 * d }
        },
        {
          timeSlot: 'Afternoon',
          time: '03:45 PM',
          activity: `Artisanal Coffee & Hidden Courtyard Stroll`,
          locationName: `${params.destination} Old Artisan Quarter`,
          description: `Unwind with specialty pour-over coffee or tea in a secluded garden courtyard tucked away behind cobblestone streets.`,
          cost: '$5 - $10',
          durationMin: 60,
          transitInfo: '5-min walk from museum along the canal bank',
          insiderTip: 'Step through the iron gate at the back of the alley to discover the quiet cloistered herb garden.',
          photoSpot: 'Wrought-iron bistro chairs surrounded by climbing ivy and antique lanterns',
          dressCode: 'Casual comfortable',
          bookingStatus: 'Walk-ins welcome',
          crowdLevel: 'Low',
          audioTrivia: 'Once inhabited by 18th-century writers and painters who gathered for literary salons.',
          tip: 'Try the house pastry pairing with single-origin beans.',
          coordinates: { lat: defaultLat - 0.002 * d, lng: defaultLng + 0.008 * d }
        },
        {
          timeSlot: 'Evening',
          time: '05:30 PM',
          activity: `Golden Hour Lookout & Sunset Panorama Point`,
          locationName: `${params.destination} Scenic Heights Lookout`,
          description: `Ascend to the premier panoramic vantage point to watch the sun dip below the horizon as the city skyline lights turn on.`,
          cost: 'Free ($5 optional funicular/elevator)',
          durationMin: 75,
          transitInfo: 'Funicular / tram or scenic 15-min uphill stairway walk',
          insiderTip: 'Arrive 45 minutes before official sunset to secure a front-rail vantage spot for timelapse video.',
          photoSpot: 'Eastern terrace railing capturing the sunset gradient over historic rooftops',
          dressCode: 'Light windbreaker or layer (hilltops get breezy at twilight)',
          bookingStatus: 'Free public terrace',
          crowdLevel: 'Moderate',
          audioTrivia: 'A historic fortress bastion originally positioned here protected the valley approaches for centuries.',
          tip: 'Check sunset time on your weather app and arrive early.',
          coordinates: { lat: defaultLat + 0.007 * d, lng: defaultLng - 0.004 * d }
        },
        {
          timeSlot: 'Evening',
          time: '07:30 PM',
          activity: `Gourmet Dinner Feast & Atmospheric Nightwalk`,
          locationName: `${params.destination} Lantern-Lit Quarter`,
          description: `Savor an exceptional candlelit sit-down dinner with paired local wines, followed by a romantic stroll past illuminated monuments.`,
          cost: '$35 - $70',
          durationMin: 120,
          transitInfo: 'Tram Line 1 to Promenade Stop • 4-min walk along the lighted boardwalk',
          insiderTip: 'Reserve a table by the window or outdoor terrace for prime evening people-watching.',
          photoSpot: 'Illuminated bridge arches reflecting across dark waters with evening city lights',
          dressCode: 'Smart casual; collared shirt or dress recommended for evening dining',
          bookingStatus: 'Dinner table reservation advised',
          crowdLevel: 'Moderate',
          audioTrivia: 'The historic district’s evening illumination project was designed by award-winning architectural lighting artists.',
          tip: 'Make a table reservation around 07:30 PM for the best ambience.',
          coordinates: { lat: defaultLat + 0.003 * d, lng: defaultLng - 0.005 * d }
        }
      ],
      diningRecommendation: {
        breakfast: `Artisan Café & Bakery in the Old Quarter`,
        lunch: `Local bistro with seasonal lunch tasting sets`,
        dinner: `Acclaimed regional dining near the central plaza`,
        snack: `Traditional street bakery serving warm local pastries`
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
    startDate: params.startDate,
    endDate: params.endDate,
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
        durationRecommended: '2 - 3 hours',
        openingHours: 'Open 24 hours (Boutiques 10:00 AM - 07:00 PM)',
        insiderSecret: 'Take the narrow cobblestone alley behind the clock tower to discover a peaceful courtyard and fountain.',
        nearestTransit: 'Central Metro Station (Exit 1)',
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
        durationRecommended: '2.5 hours',
        openingHours: '09:30 AM - 05:30 PM (Closed Mondays)',
        insiderSecret: 'The 4th-floor glass gallery provides complimentary panoramic city views and quiet reading salons.',
        nearestTransit: 'Museum District Station (Line 2)',
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
        durationRecommended: '1 - 1.5 hours',
        openingHours: '10:00 AM - 10:00 PM',
        insiderSecret: 'Book twilight slot tickets online to catch both daylight city contours and illuminated evening nightscapes.',
        nearestTransit: 'Lookout Tower Express Bus Stop',
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
        durationRecommended: '1.5 - 2 hours',
        openingHours: '08:00 AM - 06:30 PM',
        insiderSecret: 'Rent a wooden rowboat on the central pond or visit the Japanese tea house pavilion near the north exit.',
        nearestTransit: 'Botanical Gardens Tram Stop',
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
        averageMealCost: '$30 - $55 / person',
        vibe: 'Cozy, rustic charm with open brick arches and acoustic jazz',
        reservationAdvice: 'Book 3 to 5 days ahead online or arrive at 05:45 PM for walk-in bar counter seating',
        signatureSpecialty: 'Slow-braised ragù with handmade ribbons and aged parmesan',
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
        averageMealCost: '$12 - $22 / person',
        vibe: 'Vibrant, casual street energy with communal benches and sizzling aromas',
        reservationAdvice: 'Walk-ins only; peak wait time 07:00 PM – 08:30 PM (arrive early)',
        signatureSpecialty: 'Charcoal grilled skewers with sweet savory glaze & house dumplings',
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
        averageMealCost: '$65 - $110 / person',
        vibe: 'Glamorous rooftop lounge with ambient lighting and skyline vistas',
        reservationAdvice: 'Advance reservation required 1 to 2 weeks ahead for terrace tables',
        signatureSpecialty: 'Pan-seared sea bass with saffron emulsion and citrus herb salad',
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
