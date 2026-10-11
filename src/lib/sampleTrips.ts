import { TripPlan } from '@/types/travel';

export const SAMPLE_TRIPS: TripPlan[] = [
  {
    id: 'sample-tokyo-5d',
    destination: 'Tokyo',
    country: 'Japan',
    duration: 5,
    budget: 'moderate',
    companion: 'couple',
    travelStyles: ['cultural', 'foodie', 'photography'],
    createdAt: new Date().toISOString(),
    summary:
      'Immerse yourselves in the vibrant blend of hyper-modern neon skylines, historic serene shrines, legendary gastronomy, and world-class train connections in Japan’s bustling capital.',
    highlights: [
      'Stroll through ancient Senso-ji Temple and Nakamise-dori in Asakusa',
      'Witness the iconic Shibuya Scramble crossing and panoramic sunset at Shibuya Sky',
      'Feast on world-renowned ramen in Shinjuku and fresh sushi in Tsukiji Outer Market',
      'Explore digital art wonder at teamLab Planets in Toyosu',
      'Wander through tranquil Meiji Shrine and vibrant Harajuku Takeshita Street'
    ],
    bestTimeToVisit: 'March to May (Cherry Blossom) or September to November (Autumn foliage)',
    centerCoordinates: {
      lat: 35.6762,
      lng: 139.6503
    },
    estimatedBudget: {
      flightsOrTransport: '$650 (incl. Suica / 72hr Tokyo Subway Pass)',
      accommodation: '$750 ($150/night for boutique hotel in Shinjuku/Ginza)',
      foodAndDrinks: '$450 ($90/day for ramen, izakaya, sushi)',
      activitiesAndSightseeing: '$220 (teamLab, Shibuya Sky, temple fees)',
      totalEstimate: '$2,070 for 2 travelers',
      currency: 'USD'
    },
    placesToVisit: [
      {
        name: 'Senso-ji Temple',
        description: 'Tokyo’s oldest and most famous Buddhist temple, distinguished by its giant red lantern at the Kaminarimon Gate.',
        category: 'landmark',
        rating: 4.8,
        price: 'Free admission',
        bestTimeToVisit: 'Early morning (around 8:00 AM) before crowds arrive',
        coordinates: { lat: 35.7148, lng: 139.7967 },
        address: '2-3-1 Asakusa, Taito City, Tokyo 111-0032',
        tags: ['Historic', 'Cultural', 'Photography']
      },
      {
        name: 'Meiji Jingu Shrine',
        description: 'Majestic Shinto shrine nestled inside a peaceful 170-acre forest in the heart of Tokyo.',
        category: 'landmark',
        rating: 4.7,
        price: 'Free (500 JPY for inner garden)',
        bestTimeToVisit: 'Morning 9:00 AM',
        coordinates: { lat: 35.6764, lng: 139.6993 },
        address: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557',
        tags: ['Spiritual', 'Nature', 'Peaceful']
      },
      {
        name: 'Shibuya Sky & Scramble',
        description: '360-degree open-air rooftop observation deck perched 229 meters over the world’s busiest pedestrian crossing.',
        category: 'entertainment',
        rating: 4.9,
        price: '~$16 (2,200 JPY online)',
        bestTimeToVisit: 'Golden hour sunset (5:00 PM - 6:30 PM)',
        coordinates: { lat: 35.6586, lng: 139.7013 },
        address: '2-24-12 Shibuya, Shibuya City, Tokyo 150-0002',
        tags: ['Views', 'Skyline', 'Modern']
      },
      {
        name: 'teamLab Planets TOKYO',
        description: 'Interactive body-immersive digital art museum where visitors walk through water and floating flower gardens.',
        category: 'museum',
        rating: 4.8,
        price: '~$26 (3,800 JPY)',
        bestTimeToVisit: 'Afternoon slots reserved in advance',
        coordinates: { lat: 35.6493, lng: 139.7898 },
        address: '6-1-16 Toyosu, Koto City, Tokyo 135-0061',
        tags: ['Digital Art', 'Sensory', 'Must-See']
      },
      {
        name: 'Tsukiji Outer Market',
        description: 'A bustling labyrinth of wholesale fish stalls, fresh wagyu skewers, tamagoyaki, and street seafood delicacies.',
        category: 'shopping',
        rating: 4.6,
        price: 'Free to explore, $2-$10 per food skewer',
        bestTimeToVisit: '8:30 AM - 11:30 AM',
        coordinates: { lat: 35.6655, lng: 139.7708 },
        address: '4 Chome Tsukiji, Chuo City, Tokyo 104-0045',
        tags: ['Food Market', 'Street Food', 'Breakfast']
      }
    ],
    restaurants: [
      {
        name: 'Ichiran Ramen Shibuya',
        description: 'Iconic tonkotsu ramen served in private solo-dining focus booths with customizable broth richness and noodle firmness.',
        cuisine: 'Japanese Ramen',
        priceTier: '$',
        rating: 4.7,
        mustTryDishes: ['Classic Tonkotsu Ramen with half-boiled salted egg', 'Extra spicy red sauce blend'],
        address: '1-22-7 Jinnan, Shibuya City, Tokyo',
        coordinates: { lat: 35.6618, lng: 139.7006 }
      },
      {
        name: 'Gonpachi Nishiazabu',
        description: 'Atmospheric multi-level izakaya famous as the inspiration for the tavern fight scene in Quentin Tarantino’s Kill Bill.',
        cuisine: 'Modern Izakaya & Soba',
        priceTier: '$$',
        rating: 4.6,
        mustTryDishes: ['Handmade buckwheat soba', 'Charcoal grilled yakitori skewers', 'Tempura platter'],
        address: '1-13-11 Nishiazabu, Minato City, Tokyo',
        coordinates: { lat: 35.6599, lng: 139.7238 }
      },
      {
        name: 'Daiwa Sushi (Toyosu)',
        description: 'Beloved sushi institution serving seasonal omakase featuring the freshest cuts straight from the Toyosu auction floor.',
        cuisine: 'Authentic Edomae Sushi',
        priceTier: '$$$',
        rating: 4.9,
        mustTryDishes: ['Fatty Tuna (Otoro)', 'Hokkaido Sea Urchin (Uni)', 'Flame-seared Anago eel'],
        address: '6-5-1 Toyosu, Koto City, Tokyo (Market Building 5)',
        coordinates: { lat: 35.6444, lng: 139.7842 }
      },
      {
        name: 'Afuri Harajuku',
        description: 'Light, citrus-infused yuzu shio ramen crafted with chicken broth and spring water from Mt. Afuri.',
        cuisine: 'Yuzu Shio Ramen',
        priceTier: '$',
        rating: 4.6,
        mustTryDishes: ['Yuzu Shio Ramen', 'Charcoal-grilled Chashu rice bowl', 'Vegan broth bowl'],
        address: '1-1-7 Ebisu, Shibuya City, Tokyo',
        coordinates: { lat: 35.6702, lng: 139.7042 }
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Historic Asakusa to Tokyo Skytree',
        theme: 'Tradition meets Future',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:00 AM',
            activity: 'Check-in & Senso-ji Exploration',
            locationName: 'Senso-ji Temple',
            description: 'Walk through the Thunder Gate (Kaminarimon) and browse sweet melonpan & souvenir stalls along Nakamise-dori.',
            cost: 'Free',
            tip: 'Draw an omikuji fortune stick at the main hall for 100 JPY.',
            coordinates: { lat: 35.7148, lng: 139.7967 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:30 PM',
            activity: 'Sumida River Walk to Skytree Town',
            locationName: 'Tokyo Skytree',
            description: 'Cross the Sumida River walk bridge and explore the modern shops and aquariums beneath Japan’s tallest structure.',
            cost: '$20 admission',
            tip: 'Book sunset deck tickets to see Mount Fuji on clear days.',
            coordinates: { lat: 35.7101, lng: 139.8107 }
          },
          {
            timeSlot: 'Evening',
            time: '07:00 PM',
            activity: 'Traditional Izakaya & Asakusa Hoppy Street',
            locationName: 'Hoppy Dori Asakusa',
            description: 'Experience casual retro open-air dining with stewed beef tendon (nikomi) and cold Japanese draft beer.',
            cost: '$25 - $35 per person',
            tip: 'Cash is preferred at the nostalgic outdoor stalls.',
            coordinates: { lat: 35.7135, lng: 139.7942 }
          }
        ],
        diningRecommendation: {
          lunch: 'Asakusa Imahan (Legendary sukiyaki & beef rice bowls since 1895)',
          dinner: 'Kura Sushi Flagship Asakusa or Hoppy Street retro stalls'
        }
      },
      {
        day: 2,
        title: 'Spiritual Serenity & Pop Culture Energy',
        theme: 'Meiji Jingu, Harajuku & Shibuya Scramble',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '08:30 AM',
            activity: 'Forest Walk at Meiji Shrine',
            locationName: 'Meiji Jingu',
            description: 'Walk under the towering cedar torii gates into the tranquil forested grounds of Emperor Meiji’s shrine.',
            cost: 'Free',
            tip: 'Write a wish on an Ema wooden votive tablet.',
            coordinates: { lat: 35.6764, lng: 139.6993 }
          },
          {
            timeSlot: 'Afternoon',
            time: '12:30 PM',
            activity: 'Harajuku & Cat Street Boutique Stroll',
            locationName: 'Takeshita & Cat Street',
            description: 'Explore trendy crepe cafes, indie fashion boutiques, and vintage shops between Harajuku and Omotesando.',
            cost: 'Free browsing, $5-$10 snacks',
            tip: 'Stop at Marion Crepes for an authentic Tokyo crepe.',
            coordinates: { lat: 35.6716, lng: 139.7032 }
          },
          {
            timeSlot: 'Evening',
            time: '05:30 PM',
            activity: 'Shibuya Crossing & Rooftop at Shibuya Sky',
            locationName: 'Shibuya Sky',
            description: 'Watch thousands cross the Shibuya intersection in sync, followed by breathtaking views from the 47th floor deck.',
            cost: '$16 ticket',
            tip: 'Hold onto your phone; hats and loose accessories must be put in lockers.',
            coordinates: { lat: 35.6586, lng: 139.7013 }
          }
        ],
        diningRecommendation: {
          lunch: 'Afuri Harajuku for Yuzu Shio Ramen',
          dinner: 'Ichiran Shibuya or Uobei Conveyor Belt Sushi'
        }
      },
      {
        day: 3,
        title: 'Culinary Mornings & Digital Art Illusions',
        theme: 'Tsukiji, Ginza & teamLab Planets',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '08:30 AM',
            activity: 'Street Food Safari at Tsukiji Outer Market',
            locationName: 'Tsukiji Outer Market',
            description: 'Sample freshly torched wagyu beef skewers, sweet tamagoyaki egg omelets, and premium sashimi bowls.',
            cost: '$20-$30 food tasting',
            tip: 'Stand near the vendor stalls while eating, as walking while eating is discouraged in Japan.',
            coordinates: { lat: 35.6655, lng: 139.7708 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:00 PM',
            activity: 'teamLab Planets Digital Wonder',
            locationName: 'teamLab Planets',
            description: 'Wade barefoot through illuminated water with digital koi fish and wander through the infinite Crystal Universe.',
            cost: '$26',
            tip: 'Wear pants that can be rolled up to your knees, as you will walk through knee-deep water.',
            coordinates: { lat: 35.6493, lng: 139.7898 }
          },
          {
            timeSlot: 'Evening',
            time: '07:00 PM',
            activity: 'Ginza Architecture & Cocktail Experience',
            locationName: 'Ginza Six & Bar High Five',
            description: 'Explore upscale department stores and indulge in Tokyo’s legendary bespoke craft cocktail artistry.',
            cost: '$40-$60',
            tip: 'Bar High Five offers custom tailored cocktails crafted to your flavor preferences.',
            coordinates: { lat: 35.6696, lng: 139.7645 }
          }
        ],
        diningRecommendation: {
          lunch: 'Daiwa Sushi at Toyosu Market',
          dinner: 'Ginza Kagari (Tori Paitan rich chicken ramen)'
        }
      },
      {
        day: 4,
        title: 'Shinjuku Skyscraper Vistas & Omoide Yokocho',
        theme: 'Cyberpunk Tokyo & Neon Alleys',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '10:00 AM',
            activity: 'Shinjuku Gyoen National Garden',
            locationName: 'Shinjuku Gyoen',
            description: 'Stroll through traditional Japanese landscape gardens, English lawns, and French formal rose gardens.',
            cost: '500 JPY (~$3.50)',
            tip: 'Very serene spot for peaceful morning photos.',
            coordinates: { lat: 35.6852, lng: 139.7101 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:30 PM',
            activity: 'Tokyo Metropolitan Gov Building & Akihabara',
            locationName: 'Akihabara Electric Town',
            description: 'Free panoramic Tokyo views from the 45th floor observatory followed by vintage gaming arcades in Akihabara.',
            cost: 'Free observatory / $10 arcade coins',
            tip: 'Visit GiGO and Mandarake Complex for retro collectors items.',
            coordinates: { lat: 35.6984, lng: 139.7731 }
          },
          {
            timeSlot: 'Evening',
            time: '06:30 PM',
            activity: 'Memory Lane (Omoide Yokocho) & Golden Gai',
            locationName: 'Omoide Yokocho',
            description: 'Squeeze into tiny 6-seater yakitori bars filled with lanterns and sizzling skewers right by Shinjuku station tracks.',
            cost: '$25-$40',
            tip: 'Be aware of small cover charges (Otoshi) in Golden Gai.',
            coordinates: { lat: 35.6929, lng: 139.7001 }
          }
        ],
        diningRecommendation: {
          lunch: 'Tatsunoya Tsukemen Shinjuku',
          dinner: 'Gonpachi Nishiazabu or Yakitori Alley'
        }
      },
      {
        day: 5,
        title: 'Artistic Daikanyama, Nakameguro & Souvenirs',
        theme: 'Relaxed Cafes & Canal Stroll',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:30 AM',
            activity: 'Daikanyama T-Site Book Lounge',
            locationName: 'Daikanyama T-Site',
            description: 'Explore one of the world’s most beautiful architectural bookstores, specialty cafes, and leafy design shops.',
            cost: 'Free browsing, $6 matcha latte',
            tip: 'Anjincafe upstairs has design magazines and comfortable lounges.',
            coordinates: { lat: 35.6492, lng: 139.7003 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:00 PM',
            activity: 'Nakameguro Canal & Starbucks Reserve Roastery',
            locationName: 'Starbucks Reserve Roastery Tokyo',
            description: 'Walk along the weeping willow canal and visit Kengo Kuma-designed 4-story flagship roastery.',
            cost: '$12-$18 for specialty brew',
            tip: 'Sit on the 3rd floor terrace overlooking the Meguro river.',
            coordinates: { lat: 35.6506, lng: 139.6926 }
          },
          {
            timeSlot: 'Evening',
            time: '05:30 PM',
            activity: 'Tokyo Station Souvenirs & Farewell Dinner',
            locationName: 'Tokyo Station Ramen Street',
            description: 'Pick up Tokyo Banana and matcha confections at Tokyo Character Street, followed by a celebratory farewell meal.',
            cost: '$30-$50',
            tip: 'Direct Narita Express or Haneda Monorail connection from here.',
            coordinates: { lat: 35.6812, lng: 139.7671 }
          }
        ],
        diningRecommendation: {
          lunch: 'Onibus Coffee & Nakameguro Trattoria',
          dinner: 'Rokurinsha Ramen (Rich dipping noodles at Tokyo Station)'
        }
      }
    ],
    practicalTips: {
      transportation:
        'Get a digital Welcome Suica / Pasmo IC card on your Apple/Google Wallet for seamless tap-and-go subway, buses, and vending machine payments. Google Maps transit directions in Tokyo are exceptionally accurate.',
      packing: [
        'Comfortable slip-on walking shoes (you will walk 15,000+ steps/day and take shoes off at temples/restaurants)',
        'Compact umbrella or light rain shell',
        'Portable power bank / battery pack for full days out',
        'Small coin pouch (Japan still uses coins frequently for vending machines and lockers)'
      ],
      localEtiquette: [
        'Keep voice down on trains and do not take voice phone calls.',
        'No tipping! Excellent service is standard and leaving tips can cause confusion.',
        'Carry trash with you; public trash cans are rare (use convenience store bins when purchasing).'
      ],
      currencyAndPayments:
        'Japanese Yen (JPY). Credit cards and contactless Apple Pay are accepted at 85% of places, but 7-Eleven ATMs are best for low-fee cash withdrawals for street food.',
      weatherOverview:
        'Pleasant springs (15-22°C), warm humid summers (28-34°C), crisp autumns (16-24°C), and chilly clear winters (5-12°C).'
    }
  },
  {
    id: 'sample-paris-4d',
    destination: 'Paris',
    country: 'France',
    duration: 4,
    budget: 'moderate',
    companion: 'couple',
    travelStyles: ['cultural', 'foodie', 'relaxed', 'photography'],
    createdAt: new Date().toISOString(),
    summary:
      'The ultimate romantic City of Light journey — from iconic monuments and world-class Louvre masterpieces to cobblestone Montmartre alleyways, flaky morning croissants, and sunset Seine river cruises.',
    highlights: [
      'Marvel at the sparkling Eiffel Tower from Trocadéro at twilight',
      'Discover the Mona Lisa and Venus de Milo in the historic Louvre Palace',
      'Climb the stairs to Sacré-Cœur for breathtaking panoramic views over Paris',
      'Savor warm pain au chocolat in Saint-Germain-des-Prés',
      'Cruise along the Seine river past Notre-Dame and historic bridges'
    ],
    bestTimeToVisit: 'April to June or September to October (crisp sunny days and manageable crowds)',
    centerCoordinates: {
      lat: 48.8566,
      lng: 2.3522
    },
    estimatedBudget: {
      flightsOrTransport: '$550 (incl. Metro Navigo pass & airport RER)',
      accommodation: '$700 ($175/night in charming 4th or 6th arrondissement boutique)',
      foodAndDrinks: '$480 ($120/day for bistros, wine, patisseries)',
      activitiesAndSightseeing: '$180 (Louvre, Musée d’Orsay, Seine cruise, Eiffel Tower)',
      totalEstimate: '$1,910 for 2 travelers',
      currency: 'USD'
    },
    placesToVisit: [
      {
        name: 'The Louvre Museum',
        description: 'The world’s largest art museum, home to Da Vinci’s Mona Lisa and the majestic Winged Victory of Samothrace.',
        category: 'museum',
        rating: 4.8,
        price: '€22 (timed reservation required)',
        bestTimeToVisit: 'Wednesday or Friday evening (fewer crowds)',
        coordinates: { lat: 48.8606, lng: 2.3376 },
        address: 'Rue de Rivoli, 75001 Paris',
        tags: ['Art', 'History', 'Iconic']
      },
      {
        name: 'Eiffel Tower & Champ de Mars',
        description: 'Gustave Eiffel’s iron masterpiece towering 330 meters above the Seine.',
        category: 'landmark',
        rating: 4.7,
        price: '€18 - €35 (lift to summit)',
        bestTimeToVisit: 'One hour before sunset to see day and sparkling night lights',
        coordinates: { lat: 48.8584, lng: 2.2945 },
        address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
        tags: ['Must-Visit', 'Skyline', 'Romantic']
      },
      {
        name: 'Musée d’Orsay',
        description: 'Housed in a grand Beaux-Arts railway station, showcasing the world’s greatest collection of Impressionist masterpieces by Monet, Van Gogh, and Renoir.',
        category: 'museum',
        rating: 4.9,
        price: '€16',
        bestTimeToVisit: 'Morning 9:30 AM',
        coordinates: { lat: 48.8599, lng: 2.3265 },
        address: '1 Rue de la Légion d’Honneur, 75007 Paris',
        tags: ['Impressionism', 'Architecture', 'Culture']
      },
      {
        name: 'Sacré-Cœur Basilica & Montmartre',
        description: 'Snow-white travertine basilica crowning the bohemian hilltop with street portrait artists in Place du Tertre.',
        category: 'historical',
        rating: 4.7,
        price: 'Free basilica entry (€7 for dome climb)',
        bestTimeToVisit: 'Late afternoon sunset',
        coordinates: { lat: 48.8867, lng: 2.3431 },
        address: '35 Rue du Chevalier de la Barre, 75018 Paris',
        tags: ['Views', 'Bohemian', 'Charming']
      },
      {
        name: 'Sainte-Chapelle & Notre-Dame',
        description: 'Gothic royal chapel on Île de la Cité renowned for its 1,113 mesmerizing 13th-century stained-glass panels.',
        category: 'historical',
        rating: 4.8,
        price: '€13',
        bestTimeToVisit: 'Midday when bright sunlight pours through the glass',
        coordinates: { lat: 48.8554, lng: 2.345 },
        address: '10 Bd du Palais, 75001 Paris',
        tags: ['Gothic', 'Stained Glass', 'Historic']
      }
    ],
    restaurants: [
      {
        name: 'Le Comptoir du Relais',
        description: 'Acclaimed Saint-Germain bistro by chef Yves Camdeborde serving quintessential French comfort gastronomy.',
        cuisine: 'Classic French Bistro',
        priceTier: '$$',
        rating: 4.6,
        mustTryDishes: ['Duck confit with garlic potatoes', 'Foie gras terrine', 'Profiteroles with hot chocolate'],
        address: '9 Carrefour de l’Odéon, 75006 Paris',
        coordinates: { lat: 48.8524, lng: 2.3387 }
      },
      {
        name: 'Bouillon Chartier',
        description: 'Legendary 1896 Belle Époque dining hall offering hearty French classics at astonishingly modest prices.',
        cuisine: 'Traditional French Bouillon',
        priceTier: '$',
        rating: 4.5,
        mustTryDishes: ['Escargots de Bourgogne', 'Steak frites with pepper sauce', 'Chocolate mousse'],
        address: '7 Rue du Faubourg Montmartre, 75009 Paris',
        coordinates: { lat: 48.8719, lng: 2.3429 }
      },
      {
        name: 'L’As du Fallafel',
        description: 'World-famous falafel counter in the heart of the historic Jewish quarter of Le Marais.',
        cuisine: 'Middle Eastern Street Food',
        priceTier: '$',
        rating: 4.7,
        mustTryDishes: ['Special pita falafel with fried eggplant and tahini', 'Grilled shawarma'],
        address: '34 Rue des Rosiers, 75004 Paris',
        coordinates: { lat: 48.8573, lng: 2.3592 }
      },
      {
        name: 'Café de Flore',
        description: 'Iconic literary café frequented by Sartre, Simone de Beauvoir, and Picasso on Boulevard Saint-Germain.',
        cuisine: 'Historic French Café',
        priceTier: '$$$',
        rating: 4.4,
        mustTryDishes: ['Thick Parisian hot chocolate', 'Croque Monsieur', 'Fresh tarte tatin'],
        address: '172 Bd Saint-Germain, 75006 Paris',
        coordinates: { lat: 48.854, lng: 2.3327 }
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Historic Heart: Île de la Cité & The Louvre',
        theme: 'Origins of Paris & Masterpieces',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:00 AM',
            activity: 'Croissant breakfast & Sainte-Chapelle',
            locationName: 'Sainte-Chapelle & Notre-Dame',
            description: 'Grab a fresh butter croissant at a nearby boulangerie then gaze at the kaleidoscope of stained glass inside Sainte-Chapelle.',
            cost: '€13 entry',
            tip: 'Book the first morning slot to avoid security queues.',
            coordinates: { lat: 48.8554, lng: 2.345 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:00 PM',
            activity: 'Louvre Museum Expedition',
            locationName: 'The Louvre',
            description: 'Enter through the iconic I.M. Pei glass pyramid to see the Mona Lisa, Venus de Milo, and French Crown Jewels.',
            cost: '€22',
            tip: 'Use the Carrousel du Louvre underground mall entrance for shorter lines.',
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          {
            timeSlot: 'Evening',
            time: '06:30 PM',
            activity: 'Tuileries Gardens & Seine River Walk',
            locationName: 'Jardin des Tuileries',
            description: 'Stroll past classical statues and green park chairs, crossing Pont des Arts bridge to the Left Bank.',
            cost: 'Free',
            tip: 'Grab a gelato at Amorino near Saint-Germain.',
            coordinates: { lat: 48.8634, lng: 2.3275 }
          }
        ],
        diningRecommendation: {
          lunch: 'Café Marly overlooking Louvre glass pyramid',
          dinner: 'Le Comptoir du Relais in Saint-Germain'
        }
      },
      {
        day: 2,
        title: 'Impressionist Magic & Eiffel Tower Sunset',
        theme: 'Romantic Icons & Seine Vistas',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:30 AM',
            activity: 'Musée d’Orsay Masterpieces',
            locationName: 'Musée d’Orsay',
            description: 'Admire Van Gogh’s Starry Night over the Rhone and Monet’s water lilies under the huge clock face.',
            cost: '€16',
            tip: 'The giant clock on the 5th floor makes a sensational silhouette photo backdrop.',
            coordinates: { lat: 48.8599, lng: 2.3265 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:30 PM',
            activity: 'Champ de Mars Picnic & Trocadéro',
            locationName: 'Champ de Mars',
            description: 'Gather baguette, brie cheese, and macaron box for an idyllic lawn picnic facing the Eiffel Tower.',
            cost: '€15 for bakery treats',
            tip: 'Rue Cler market street nearby has the finest specialty cheese and wine shops.',
            coordinates: { lat: 48.8556, lng: 2.2986 }
          },
          {
            timeSlot: 'Evening',
            time: '07:30 PM',
            activity: 'Eiffel Tower Sparkle & Vedettes de Paris Cruise',
            locationName: 'Eiffel Tower',
            description: 'Watch the tower burst into 20,000 sparkling gold lights on the hour, followed by a romantic 1-hour Seine boat ride.',
            cost: '€17 for boat cruise',
            tip: 'The 5-minute hourly sparkle begins at sunset and repeats on every hour until 1 AM.',
            coordinates: { lat: 48.8584, lng: 2.2945 }
          }
        ],
        diningRecommendation: {
          lunch: 'Rue Cler market bistros (Café du Marché)',
          dinner: 'Les Cocottes by Christian Constant'
        }
      },
      {
        day: 3,
        title: 'Bohemian Montmartre & Le Marais Chic',
        theme: 'Artistic Heritage & Trendsetting Streets',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:00 AM',
            activity: 'Montmartre Steps & Sacré-Cœur',
            locationName: 'Sacré-Cœur Basilica',
            description: 'Wander the cobbled alleys of Rue de l’Abreuvoir and Place du Tertre before stepping inside the basilica.',
            cost: 'Free',
            tip: 'Stop at La Maison Rose for iconic Parisian pastel photography.',
            coordinates: { lat: 48.8867, lng: 2.3431 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:00 PM',
            activity: 'Le Marais Mansions & Place des Vosges',
            locationName: 'Place des Vosges',
            description: 'Explore the red-brick arcades of Paris’s oldest planned square, home to Victor Hugo, and browse independent perfumeries.',
            cost: 'Free',
            tip: 'Carette under the arcades serves legendary whipped cream hot chocolate.',
            coordinates: { lat: 48.8555, lng: 2.3656 }
          },
          {
            timeSlot: 'Evening',
            time: '07:00 PM',
            activity: 'Traditional Dinner at Bouillon Chartier',
            locationName: 'Bouillon Chartier',
            description: 'Waiters in black waistcoats write your order directly onto the white paper tablecloth in this 19th-century jewel.',
            cost: '€18-€25 per person',
            tip: 'Arrive by 6:45 PM to beat the queue or go after 9:00 PM.',
            coordinates: { lat: 48.8719, lng: 2.3429 }
          }
        ],
        diningRecommendation: {
          lunch: 'L’As du Fallafel on Rue des Rosiers',
          dinner: 'Bouillon Chartier or Chez Janou for chocolate mousse'
        }
      },
      {
        day: 4,
        title: 'Latin Quarter, Luxembourg Gardens & Farewell',
        theme: 'Literary Cafes & Regal Gardens',
        schedule: [
          {
            timeSlot: 'Morning',
            time: '09:30 AM',
            activity: 'Shakespeare and Company & Panthéon',
            locationName: 'Shakespeare and Company',
            description: 'Browse poetry and classic paperbacks in the world’s most celebrated English bookstore facing the Seine.',
            cost: 'Free',
            tip: 'Get your book stamped with the signature Shakespeare & Co embossment at the register.',
            coordinates: { lat: 48.8525, lng: 2.3471 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:30 PM',
            activity: 'Luxembourg Gardens (Jardin du Luxembourg)',
            locationName: 'Jardin du Luxembourg',
            description: 'Relax in iconic green metal lounge chairs by the Medici Fountain watching vintage wooden toy boats sail the pond.',
            cost: 'Free',
            tip: 'Buy Pierre Hermé macarons nearby on Rue Bonaparte to enjoy in the park.',
            coordinates: { lat: 48.8462, lng: 2.3371 }
          },
          {
            timeSlot: 'Evening',
            time: '06:00 PM',
            activity: 'Farewell Aperitif at Café de Flore',
            locationName: 'Café de Flore',
            description: 'Toast to an unforgettable Parisian voyage with Champagne and cheese on the vibrant sidewalk terrace.',
            cost: '€25-€40',
            tip: 'Watch the stylish Parisian evening promenade on Boulevard Saint-Germain.',
            coordinates: { lat: 48.854, lng: 2.3327 }
          }
        ],
        diningRecommendation: {
          lunch: 'Treize Bakery Paris in Luxembourg gardens',
          dinner: 'Café de Flore or Brasserie Lipp'
        }
      }
    ],
    practicalTips: {
      transportation:
        'The Paris Métro and RER are fast and inexpensive. Use the Île-de-France Mobilités app or buy contactless Navigo Easy tickets at any station.',
      packing: [
        'Stylish comfortable walking sneakers (cobblestones are everywhere)',
        'Crossbody bag with secure zip (watch out for pickpockets in crowded tourist spots)',
        'Layered outfits and a chic scarf or trench coat',
        'EU Type C / E plug adapter'
      ],
      localEtiquette: [
        'Always greet shopkeepers and waiters with a polite "Bonjour, Madame/Monsieur" upon entering — it is essential French courtesy.',
        'Speak in quiet, moderate tones inside restaurants and public transport.',
        'Service is included ("service compris") by law on restaurant bills, but leaving €1-€2 per person for good service is appreciated.'
      ],
      currencyAndPayments:
        'Euro (EUR). Contactless Visa and Mastercard are accepted virtually everywhere, even for €1.50 baguettes.',
      weatherOverview:
        'Spring & Autumn are mild (14-20°C) with occasional showers; Summer is warm (24-30°C); Winter is cool (3-8°C).'
    }
  }
];

export function findSampleTrip(destination: string, duration?: number): TripPlan | undefined {
  const norm = destination.trim().toLowerCase();
  const found = SAMPLE_TRIPS.find((t) =>
    t.destination.toLowerCase().includes(norm) || norm.includes(t.destination.toLowerCase())
  );
  if (!found) return undefined;
  // If duration differs, return a copy sliced or cloned to that duration
  if (duration && duration !== found.duration) {
    const copy = JSON.parse(JSON.stringify(found)) as TripPlan;
    copy.id = `trip-${Date.now()}`;
    copy.duration = duration;
    if (duration < copy.itinerary.length) {
      copy.itinerary = copy.itinerary.slice(0, duration);
    }
    return copy;
  }
  return found;
}
