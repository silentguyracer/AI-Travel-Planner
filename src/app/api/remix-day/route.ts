import { NextRequest, NextResponse } from 'next/server';
import { ItineraryDay } from '@/types/travel';
import { getAIConfig, createChatCompletionWithFallback, extractJsonFromResponse } from '@/lib/aiClient';

export interface DayRemixRequest {
  destination: string;
  country?: string;
  day: ItineraryDay;
  remixMode: 'rainy' | 'foodie' | 'relaxed' | 'adventure' | 'nightlife' | 'custom';
  customInstruction?: string;
  customApiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DayRemixRequest;
    const { destination, day, remixMode, customInstruction, customApiKey } = body;

    if (!destination || !day) {
      return NextResponse.json(
        { error: 'Destination and day data are required.' },
        { status: 400 }
      );
    }

    const aiConfig = getAIConfig(customApiKey);

    if (aiConfig) {
      try {

        let promptGuidance = '';
        switch (remixMode) {
          case 'rainy':
            promptGuidance = 'Rainy Day Rescue: Swap all outdoor parks, walking tours, and open-air activities with top indoor museums, covered arcades, aquariums, art galleries, subterranean shopping, and cozy tea/coffee tastings.';
            break;
          case 'foodie':
            promptGuidance = 'Foodie Deep Dive: Re-center the schedule around iconic food markets, hidden alleyway street food stalls, artisan bakeries, culinary workshops, wine/tea tastings, and renowned local eateries.';
            break;
          case 'relaxed':
            promptGuidance = 'Slow Travel & Wellness: Relaxed pace starting later (10:00 AM or 10:30 AM), peaceful scenic vistas, thermal baths/onsen/spas, slow dining, and zero rushing.';
            break;
          case 'adventure':
            promptGuidance = 'High Energy & Adventure: Action-packed schedule with thrilling scenic viewpoints, bike or kayak rentals, hidden staircases, panoramic towers, and active urban exploration.';
            break;
          case 'nightlife':
            promptGuidance = 'Night Owl & Speakeasies: Focus afternoon and evening on illuminated landmarks, rooftop lounges, jazz clubs, street night markets, and authentic speakeasies.';
            break;
          case 'custom':
            promptGuidance = `Custom Traveler Request: ${customInstruction || 'Tailor the day creatively'}`;
            break;
        }

        const systemPrompt = `You are an elite travel concierge. Regenerate the schedule for Day ${day.day} of a trip to ${destination}.
Strict requirements:
1. Return ONLY a single valid JSON object representing the ItineraryDay.
2. Must match the exact structure:
{
  "day": ${day.day},
  "title": "string (creative day title reflecting the new theme)",
  "theme": "string (e.g. Rainy Day Cultural Haven)",
  "schedule": [
    {
      "timeSlot": "Morning" | "Afternoon" | "Evening" | "Night",
      "time": "string (e.g. 10:00 AM)",
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
3. Supply real, accurate GPS coordinates for ${destination}.
4. CRITICAL: Pack as many events as possible throughout the day (at least 6-8 cohesive, action-packed activities from early morning 07:30 AM to late night 11:00 PM). Do NOT provide only 3 events.`;

        const userPrompt = `Existing Day Plan for Day ${day.day}:
Title: ${day.title}
Theme: ${day.theme}
Current Activities: ${day.schedule.map(s => s.activity).join(' -> ')}

Desired Transformation:
${promptGuidance}
${customInstruction ? `Additional notes: "${customInstruction}"` : ''}

IMPORTANT: PACK AS MANY EVENTS AS POSSIBLE! Generate an action-packed 6-8 event schedule covering early morning, mid-morning, lunch, afternoon highlights, golden hour, dinner, and evening entertainment.

Generate the updated ItineraryDay JSON.`;

        const { content } = await createChatCompletionWithFallback(aiConfig, {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormatJson: true,
          temperature: 0.7,
        });

        const parsed = extractJsonFromResponse<ItineraryDay>(content);
        return NextResponse.json(parsed);
      } catch (aiErr) {
        console.warn('AI Day remix failed, falling back to smart heuristic:', aiErr);
      }
    }

    // Heuristic Smart Fallback if no OpenAI Key or API fails
    const fallbackDay = generateHeuristicRemix(destination, day, remixMode, customInstruction);
    return NextResponse.json(fallbackDay);

  } catch (error: unknown) {
    console.error('Error in /api/remix-day:', error);
    const message = error instanceof Error ? error.message : 'Failed to remix day';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateHeuristicRemix(
  destination: string,
  currentDay: ItineraryDay,
  mode: DayRemixRequest['remixMode'],
  customNotes?: string
): ItineraryDay {
  const baseLat = currentDay.schedule[0]?.coordinates?.lat || 35.6762;
  const baseLng = currentDay.schedule[0]?.coordinates?.lng || 139.6503;

  if (mode === 'rainy') {
    return {
      day: currentDay.day,
      title: `Indoor Culture & Covered Arcades in ${destination}`,
      theme: '☔ Rainy Day Sanctuary: World-Class Galleries & Cafes',
      schedule: [
        {
          timeSlot: 'Morning',
          time: '10:00 AM',
          activity: `Renowned Art Gallery & Museum Pavilion`,
          locationName: `${destination} Central Museum of Art`,
          description: `Stay dry while exploring expansive collections of fine art, historic tapestries, and temporary exhibitions with cozy museum cafe seating.`,
          cost: '$18',
          tip: 'Use the underground pedestrian passageway connected to the metro station to stay completely dry.',
          coordinates: { lat: baseLat + 0.003, lng: baseLng - 0.002 }
        },
        {
          timeSlot: 'Afternoon',
          time: '01:30 PM',
          activity: `Covered Shopping Arcade & Artisan Market`,
          locationName: `${destination} Historic Covered Arcade`,
          description: `Stroll along glass-vaulted 19th-century passages packed with independent bookshops, vintage boutiques, and hot chocolate salons.`,
          cost: 'Free to browse',
          tip: 'Sample fresh pastries under the warm skylights while rain patters on the glass above.',
          coordinates: { lat: baseLat - 0.002, lng: baseLng + 0.004 }
        },
        {
          timeSlot: 'Evening',
          time: '06:00 PM',
          activity: `Indoor Gastronomy Market & Culinary Hall`,
          locationName: `${destination} Covered Food Hall`,
          description: `Indulge in a sheltered gourmet feast hopping between artisan cheese makers, freshly grilled skewers, and local craft breweries.`,
          cost: '$25 - $45',
          tip: 'Arrive slightly before 7:00 PM to claim communal seating near the live acoustic band.',
          coordinates: { lat: baseLat + 0.001, lng: baseLng - 0.003 }
        }
      ],
      diningRecommendation: {
        lunch: `Cozy bistro inside the museum courtyard`,
        dinner: `Warm candlelit brasserie with traditional comfort food`
      }
    };
  }

  if (mode === 'foodie') {
    return {
      day: currentDay.day,
      title: `Epicurean Odyssey: Markets & Secret Flavors of ${destination}`,
      theme: '🍜 Culinary Immersion: Farm-to-Table & Street Bites',
      schedule: [
        {
          timeSlot: 'Morning',
          time: '09:00 AM',
          activity: `Morning Farmers Market & Bakery Stroll`,
          locationName: `${destination} Central Food Market`,
          description: `Kick off with fresh oven-baked sourdough, artisanal local coffee, and samples of regional honeys and cheeses directly from producers.`,
          cost: '$15',
          tip: 'Ask vendors for seasonal recommendations and seasonal fruit tasting.',
          coordinates: { lat: baseLat + 0.004, lng: baseLng + 0.002 }
        },
        {
          timeSlot: 'Afternoon',
          time: '01:00 PM',
          activity: `Guided Street Food Safari & Specialty Tastings`,
          locationName: `${destination} Historic Culinary Quarter`,
          description: `Weave through atmospheric back-alleys visiting legendary family-run stalls and sampling signature local comfort foods.`,
          cost: '$30',
          tip: 'Come with an empty stomach; portion sizes add up quickly over 4 tasting stops!',
          coordinates: { lat: baseLat - 0.003, lng: baseLng - 0.001 }
        },
        {
          timeSlot: 'Evening',
          time: '07:30 PM',
          activity: `Michelin Bib Gourmand Tasting & Wine Pairing`,
          locationName: `Osteria / Bistro Gourmet in ${destination}`,
          description: `Savor an inventive multi-course seasonal tasting menu celebrating regional gastronomy paired with indigenous regional wines.`,
          cost: '$60 - $90',
          tip: 'Request counter seating if available to watch the kitchen team prepare dishes in real time.',
          coordinates: { lat: baseLat + 0.002, lng: baseLng - 0.004 }
        }
      ],
      diningRecommendation: {
        lunch: `Artisan noodle or sandwich bar in the market square`,
        dinner: `Acclaimed farm-to-table kitchen specializing in seasonal terroir`
      }
    };
  }

  if (mode === 'relaxed') {
    return {
      day: currentDay.day,
      title: `Serene Leisure & Slow Travel in ${destination}`,
      theme: '🧘 Mindful Wellness & Scenic Strolls',
      schedule: [
        {
          timeSlot: 'Morning',
          time: '10:30 AM',
          activity: `Late Morning Brunch & Tranquil Botanical Garden`,
          locationName: `${destination} Royal Botanical Park`,
          description: `Sleep in and start gently with an unhurried terrace brunch followed by shaded walks under ancient trees and beside ornamental lakes.`,
          cost: '$20',
          tip: 'Bring a book or journal to enjoy on the lakeside park benches.',
          coordinates: { lat: baseLat - 0.005, lng: baseLng - 0.003 }
        },
        {
          timeSlot: 'Afternoon',
          time: '02:30 PM',
          activity: `Thermal Spa, Onsen, or Rooftop Pool Relaxation`,
          locationName: `${destination} Wellness Baths & Spa`,
          description: `Unwind with soothing mineral pools, steam saunas, and herbal aromatherapy lounges designed to dissolve travel fatigue.`,
          cost: '$35',
          tip: 'Reserve your thermal bath slot in advance to avoid weekend capacity limits.',
          coordinates: { lat: baseLat + 0.002, lng: baseLng + 0.005 }
        },
        {
          timeSlot: 'Evening',
          time: '06:30 PM',
          activity: `Sunset Golden Hour Stroll & Waterfront Aperitivo`,
          locationName: `${destination} Riverside Promenade`,
          description: `Casual sunset walk along scenic pedestrian quays with chilled drinks and light antipasti as the evening lights turn on.`,
          cost: '$25',
          tip: 'Sit outdoors facing west for the best twilight reflection photos.',
          coordinates: { lat: baseLat + 0.004, lng: baseLng - 0.002 }
        }
      ],
      diningRecommendation: {
        lunch: `Sunlit greenhouse garden cafe`,
        dinner: `Relaxed waterside trattoria with acoustic background music`
      }
    };
  }

  if (mode === 'adventure') {
    return {
      day: currentDay.day,
      title: `High-Energy Expedition & Viewpoints in ${destination}`,
      theme: '⚡ Urban Adventure & Panoramic Heights',
      schedule: [
        {
          timeSlot: 'Morning',
          time: '08:30 AM',
          activity: `Panoramic Summit Hike & Morning Overlook`,
          locationName: `${destination} High Peak Lookout`,
          description: `Climb historic fortress stairs or a scenic ridge trail to catch dramatic 360-degree vistas of the awakening city and horizon.`,
          cost: 'Free',
          tip: 'Wear sturdy trainers; the stone steps can be smooth and steep in sections.',
          coordinates: { lat: baseLat + 0.008, lng: baseLng + 0.006 }
        },
        {
          timeSlot: 'Afternoon',
          time: '01:00 PM',
          activity: `E-Bike or Kayak Urban Exploration Tour`,
          locationName: `${destination} Adventure Outpost`,
          description: `Cover double the ground cycling through historic districts, waterfront trails, and lesser-known architectural gems.`,
          cost: '$35',
          tip: 'Download offline route maps on your phone before departing the depot.',
          coordinates: { lat: baseLat - 0.003, lng: baseLng + 0.004 }
        },
        {
          timeSlot: 'Evening',
          time: '06:00 PM',
          activity: `Rooftop Skywalk & Open-Air Sunset Lounge`,
          locationName: `${destination} Observation Tower Deck`,
          description: `Elevate above the skyline on an open-air observation platform as the city lights illuminate the dusk sky.`,
          cost: '$22',
          tip: 'Book timed-entry 30 minutes before official sunset to capture both daytime and illuminated night views.',
          coordinates: { lat: baseLat + 0.005, lng: baseLng - 0.004 }
        }
      ],
      diningRecommendation: {
        lunch: `Hearty local trail-side grill or smokehouse`,
        dinner: `High-energy street-style izakaya or tapas bar`
      }
    };
  }

  // Nightlife / Custom Default
  return {
    day: currentDay.day,
    title: customNotes ? `Custom Tailored Day: ${customNotes.slice(0, 30)}...` : `Twilight Vibrance & Night Owl Tour in ${destination}`,
    theme: customNotes ? '🪄 Personalized Traveler Curation' : '🍸 Speakeasies, Jazz & Evening Landmarks',
    schedule: [
      {
        timeSlot: 'Afternoon',
        time: '02:00 PM',
        activity: `Artisan Coffee Roastery & Vinyl Record Quarter`,
        locationName: `${destination} Creative District`,
        description: `Start leisurely in the hipster quarter exploring vintage vinyl boutiques, graphic design galleries, and third-wave espresso bars.`,
        cost: '$12',
        tip: 'Check out local live event bulletin boards in the cafe lobbies.',
        coordinates: { lat: baseLat - 0.002, lng: baseLng + 0.003 }
      },
      {
        timeSlot: 'Evening',
        time: '06:30 PM',
        activity: `Sunset Tapas & Craft Cocktail Bar Crawl`,
        locationName: `${destination} Entertainment District`,
        description: `Experience the city transition into vibrant nightlife hopping through hidden doorways into discreet speakeasies.`,
        cost: '$40',
        tip: 'Look for discreet doorways behind bookcases or unmarked alley lanterns.',
        coordinates: { lat: baseLat + 0.003, lng: baseLng - 0.002 }
      },
      {
        timeSlot: 'Night',
        time: '09:30 PM',
        activity: `Live Jazz Lounge or Late-Night Street Food Bazaar`,
        locationName: `${destination} Night Quarter`,
        description: `End the night listening to authentic local musicians or snacking on midnight noodles and dessert crepes under festive string lights.`,
        cost: '$20 - $35',
        tip: 'Carry some local cash for late-night food stalls.',
        coordinates: { lat: baseLat + 0.004, lng: baseLng + 0.001 }
      }
    ],
    diningRecommendation: {
      lunch: `Casual taco or ramen bar`,
      dinner: `Buzzing gastro-pub with local draft beers and artisanal sharing plates`
    }
  };
}
