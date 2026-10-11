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
            time: '07:45 AM',
            activity: 'Early Morning Kaminarimon & Peaceful Asakusa Stroll',
            locationName: 'Kaminarimon Gate',
            description: 'Witness the iconic giant red lantern and quiet traditional alleyways before the shops and tour buses arrive.',
            cost: 'Free',
            tip: 'Best lighting for photos right as the morning sun hits the temple entrance.',
            coordinates: { lat: 35.7111, lng: 139.7963 }
          },
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
            time: '11:45 AM',
            activity: 'Asakusa Imahan Historic Sukiyaki Lunch',
            locationName: 'Asakusa Imahan',
            description: 'Savor legendary thinly sliced Kuroge Wagyu beef simmered in sweet soy warishita sauce, serving diners since 1895.',
            cost: '$30 - $45',
            tip: 'Order the limited lunchtime sukiyaki gozen set for exceptional value.',
            coordinates: { lat: 35.7138, lng: 139.7925 }
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
            timeSlot: 'Afternoon',
            time: '03:45 PM',
            activity: 'Tokyo Mizumachi Artisan Promenade & Craft Coffee',
            locationName: 'Tokyo Mizumachi',
            description: 'Stroll along the riverside community hub featuring local design boutiques, artisanal bakeries, and craft cafes.',
            cost: '$6 - $12',
            tip: 'Try the fresh seasonal melonpan and cold brew coffee.',
            coordinates: { lat: 35.7115, lng: 139.8055 }
          },
          {
            timeSlot: 'Evening',
            time: '05:30 PM',
            activity: 'Sunset Observation from Skytree Tembo Deck',
            locationName: 'Tokyo Skytree Observation Deck',
            description: 'Watch twilight spread over the endless Tokyo skyline as Mount Fuji is silhouetted in the distance.',
            cost: 'Included in ticket',
            tip: 'The glass floor section on level 340 offers thrilling downward views.',
            coordinates: { lat: 35.7101, lng: 139.8107 }
          },
          {
            timeSlot: 'Evening',
            time: '07:30 PM',
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
            time: '08:00 AM',
            activity: 'Forest Walk at Meiji Shrine',
            locationName: 'Meiji Jingu',
            description: 'Walk under the towering cedar torii gates into the tranquil forested grounds of Emperor Meiji’s shrine.',
            cost: 'Free',
            tip: 'Write a wish on an Ema wooden votive tablet.',
            coordinates: { lat: 35.6764, lng: 139.6993 }
          },
          {
            timeSlot: 'Morning',
            time: '10:00 AM',
            activity: 'Yoyogi Park & Japanese Tea Garden Stroll',
            locationName: 'Yoyogi Park',
            description: 'Enjoy a peaceful nature stroll through expansive lawns, ginkgo trees, and tranquil ponds.',
            cost: 'Free',
            tip: 'Great spot for morning people-watching and street performers.',
            coordinates: { lat: 35.6717, lng: 139.6949 }
          },
          {
            timeSlot: 'Afternoon',
            time: '11:45 AM',
            activity: 'Afuri Harajuku Yuzu Shio Ramen Lunch',
            locationName: 'Afuri Harajuku',
            description: 'Savor light, citrus-infused chicken broth ramen with charcoal-grilled chashu and spring water from Mt. Afuri.',
            cost: '$12 - $18',
            tip: 'Select your ramen from the ticket vending machine at the entrance.',
            coordinates: { lat: 35.6702, lng: 139.7042 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:15 PM',
            activity: 'Harajuku & Cat Street Boutique Stroll',
            locationName: 'Takeshita & Cat Street',
            description: 'Explore trendy crepe cafes, indie fashion boutiques, and vintage shops between Harajuku and Omotesando.',
            cost: 'Free browsing, $5-$10 snacks',
            tip: 'Stop at Marion Crepes for an authentic Tokyo crepe.',
            coordinates: { lat: 35.6716, lng: 139.7032 }
          },
          {
            timeSlot: 'Afternoon',
            time: '03:45 PM',
            activity: 'Miyashita Park Elevated Rooftop Garden',
            locationName: 'Miyashita Park Shibuya',
            description: 'Relax on the lush rooftop deck featuring skate parks, coffee lounges, and skyline vistas.',
            cost: 'Free',
            tip: 'Grab a matcha latte at the rooftop cafe pavilion.',
            coordinates: { lat: 35.6621, lng: 139.7022 }
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
          },
          {
            timeSlot: 'Night',
            time: '08:00 PM',
            activity: 'Nonbei Yokocho Lantern-Lit Yakitori Alley',
            locationName: 'Nonbei Yokocho',
            description: 'Step into Shibuya’s nostalgic post-war drinking alleyway for sizzling charcoal skewers and local craft beers.',
            cost: '$20 - $35',
            tip: 'Tucked right beside Shibuya Station under the Yamanote train line.',
            coordinates: { lat: 35.6596, lng: 139.7021 }
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
            time: '07:30 AM',
            activity: 'Street Food Safari at Tsukiji Outer Market',
            locationName: 'Tsukiji Outer Market',
            description: 'Sample freshly torched wagyu beef skewers, sweet tamagoyaki egg omelets, and premium sashimi bowls.',
            cost: '$20-$30 food tasting',
            tip: 'Stand near the vendor stalls while eating, as walking while eating is discouraged in Japan.',
            coordinates: { lat: 35.6655, lng: 139.7708 }
          },
          {
            timeSlot: 'Morning',
            time: '09:30 AM',
            activity: 'Hamarikyu Gardens Tea House over Tidal Pond',
            locationName: 'Hamarikyu Gardens',
            description: 'Stroll through a tranquil Edo-period feudal lord garden surrounded by modern skyscrapers and enjoy matcha in a floating teahouse.',
            cost: '300 JPY entrance + 500 JPY tea',
            tip: 'The 300-year-old pine tree near the entrance is one of Tokyo’s grandest bonsai specimens.',
            coordinates: { lat: 35.6596, lng: 139.7634 }
          },
          {
            timeSlot: 'Afternoon',
            time: '11:45 AM',
            activity: 'Fresh Omakase Sushi at Toyosu Market',
            locationName: 'Daiwa Sushi Toyosu',
            description: 'Feast on fresh morning auction tuna, Hokkaido sea urchin, and flame-seared anago eel straight from the market floor.',
            cost: '$40 - $65',
            tip: 'Arrive before noon to beat the market lunch crowd.',
            coordinates: { lat: 35.6444, lng: 139.7842 }
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
            time: '04:30 PM',
            activity: 'Ginza Six Rooftop Garden & Luxury Promenade',
            locationName: 'Ginza Six',
            description: 'Explore Tokyo’s premier luxury fashion and arts complex, culminating at the serene 4,000-square-meter rooftop garden.',
            cost: 'Free rooftop access',
            tip: 'The basement food hall (Depachika) has exquisite Japanese confection gifts.',
            coordinates: { lat: 35.6696, lng: 139.7645 }
          },
          {
            timeSlot: 'Evening',
            time: '06:30 PM',
            activity: 'Ginza Kagari Rich Tori Paitan Ramen Dinner',
            locationName: 'Ginza Kagari',
            description: 'Dine on Michelin-recommended creamy chicken potage ramen served with seasonal root vegetables.',
            cost: '$15 - $20',
            tip: 'Add a soft-boiled seasoned ajitama egg and black truffle paste for unmatched flavor.',
            coordinates: { lat: 35.6714, lng: 139.7654 }
          },
          {
            timeSlot: 'Night',
            time: '08:30 PM',
            activity: 'Bespoke Craft Cocktails at Bar High Five',
            locationName: 'Bar High Five Ginza',
            description: 'Experience legendary cocktail master Hidetsugu Ueno’s bespoke drinks tailored to your flavor palate.',
            cost: '$35 - $50',
            tip: 'There is no written menu; tell the bartender what spirits and flavor notes you enjoy.',
            coordinates: { lat: 35.6698, lng: 139.7638 }
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
            time: '08:30 AM',
            activity: 'Shinjuku Gyoen National Garden Morning Walk',
            locationName: 'Shinjuku Gyoen',
            description: 'Stroll through traditional Japanese landscape gardens, English lawns, and French formal rose gardens.',
            cost: '500 JPY (~$3.50)',
            tip: 'Very serene spot for peaceful morning photos before the afternoon heat.',
            coordinates: { lat: 35.6852, lng: 139.7101 }
          },
          {
            timeSlot: 'Morning',
            time: '10:45 AM',
            activity: 'Tokyo Metropolitan Government Building 45th Floor Deck',
            locationName: 'Tokyo Metropolitan Government Observatory',
            description: 'Take the high-speed elevator for stunning free panoramic Tokyo views from the 45th floor observatory.',
            cost: 'Free observatory',
            tip: 'The South Tower observation deck has a grand piano painted by Yayoi Kusama.',
            coordinates: { lat: 35.6896, lng: 139.6917 }
          },
          {
            timeSlot: 'Afternoon',
            time: '12:30 PM',
            activity: 'Tatsunoya Tsukemen Rich Broth Ramen Lunch',
            locationName: 'Tatsunoya Shinjuku',
            description: 'Enjoy rich dipping noodles served with tender pork belly, bamboo shoots, and hot stone broth.',
            cost: '$10 - $15',
            tip: 'Request wari-soup (broth refresher) at the end to drink the remaining soup base.',
            coordinates: { lat: 35.6948, lng: 139.6985 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:15 PM',
            activity: 'Akihabara Electric Town & Retro Gaming',
            locationName: 'Akihabara Electric Town',
            description: 'Explore multi-story retro game stores like Super Potato, arcade claw halls, and futuristic gadget shops.',
            cost: 'Free browsing / $10 arcade coins',
            tip: 'Visit GiGO and Mandarake Complex for retro collectors items.',
            coordinates: { lat: 35.6984, lng: 139.7731 }
          },
          {
            timeSlot: 'Evening',
            time: '04:45 PM',
            activity: 'Kanda Myojin Historic Shrine & Anime Charms',
            locationName: 'Kanda Myojin Shrine',
            description: 'Visit a 1,300-year-old Shinto shrine famous as the spiritual guardian of Tokyo and tech workers.',
            cost: 'Free',
            tip: 'Look for the unique IT computer safety amulets (omamori).',
            coordinates: { lat: 35.7020, lng: 139.7679 }
          },
          {
            timeSlot: 'Evening',
            time: '06:30 PM',
            activity: 'Memory Lane (Omoide Yokocho) Yakitori Stalls',
            locationName: 'Omoide Yokocho',
            description: 'Squeeze into tiny 6-seater yakitori bars filled with lanterns and sizzling skewers right by Shinjuku station tracks.',
            cost: '$25-$40',
            tip: 'Be aware of small cover charges (Otoshi) in Golden Gai.',
            coordinates: { lat: 35.6929, lng: 139.7001 }
          },
          {
            timeSlot: 'Night',
            time: '08:45 PM',
            activity: 'Shinjuku Golden Gai Night Owls & Micro-Bars',
            locationName: 'Golden Gai Shinjuku',
            description: 'Wander six narrow alleyways packed with over 200 character-filled miniature bars, each seating just 5-8 patrons.',
            cost: '$10 - $25 per drink',
            tip: 'Check door signs: bars with English menus outside welcome international travelers.',
            coordinates: { lat: 35.6941, lng: 139.7047 }
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
            time: '08:30 AM',
            activity: 'Nakameguro Weeping Willow Canal Morning Walk',
            locationName: 'Meguro River Walkway',
            description: 'Enjoy a peaceful morning walk along the tree-lined riverbanks under weeping cherry trees.',
            cost: 'Free',
            tip: 'Quiet and scenic morning ambiance with minimal bicycle traffic.',
            coordinates: { lat: 35.6457, lng: 139.6988 }
          },
          {
            timeSlot: 'Morning',
            time: '09:45 AM',
            activity: 'Starbucks Reserve Roastery Tokyo Architectural Coffee',
            locationName: 'Starbucks Reserve Roastery Tokyo',
            description: 'Visit Kengo Kuma-designed 4-story flagship roastery with a 17-meter copper cask and bespoke tea & coffee flights.',
            cost: '$12-$18 for specialty brew',
            tip: 'Sit on the 3rd floor terrace overlooking the Meguro river.',
            coordinates: { lat: 35.6506, lng: 139.6926 }
          },
          {
            timeSlot: 'Afternoon',
            time: '11:30 AM',
            activity: 'Daikanyama T-Site Book Lounge & Design Boutiques',
            locationName: 'Daikanyama T-Site',
            description: 'Explore one of the world’s most beautiful architectural bookstores, specialty cafes, and leafy design shops.',
            cost: 'Free browsing, $6 matcha latte',
            tip: 'Anjincafe upstairs has design magazines and comfortable lounges.',
            coordinates: { lat: 35.6492, lng: 139.7003 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:15 PM',
            activity: 'Artisan Handmade Soba Lunch in Meguro',
            locationName: 'Matsugen Meguro',
            description: 'Delight in cold dipping buckwheat noodles served with crisp tempura prawns and fresh wasabi.',
            cost: '$18 - $28',
            tip: 'Drink the sobayu (hot buckwheat broth) mixed with your leftover dipping sauce at the end.',
            coordinates: { lat: 35.6421, lng: 139.6981 }
          },
          {
            timeSlot: 'Afternoon',
            time: '03:15 PM',
            activity: 'Roppongi Hills Mori Art Museum & Sky View',
            locationName: 'Mori Art Museum',
            description: 'Peruse cutting-edge contemporary art exhibitions high on the 53rd floor with panoramic city views.',
            cost: '$18',
            tip: 'Ticket includes admission to the indoor Tokyo City View observation lounge.',
            coordinates: { lat: 35.6605, lng: 139.7292 }
          },
          {
            timeSlot: 'Evening',
            time: '05:45 PM',
            activity: 'Tokyo Station Character Street & Omiyage Souvenirs',
            locationName: 'Tokyo Station Character Street',
            description: 'Pick up Tokyo Banana, matcha confections, and Studio Ghibli souvenirs at the underground mall.',
            cost: 'Free browsing, $15 - $30 gifts',
            tip: 'Direct Narita Express or Haneda Monorail connection right from here.',
            coordinates: { lat: 35.6812, lng: 139.7671 }
          },
          {
            timeSlot: 'Night',
            time: '07:45 PM',
            activity: 'Celebratory Farewell Dinner at Gonpachi Nishiazabu',
            locationName: 'Gonpachi Nishiazabu',
            description: 'Toast your trip inside the iconic multi-level Edo-style tavern that inspired Kill Bill, feasting on yakitori and soba.',
            cost: '$40 - $70',
            tip: 'Book 1-2 days ahead to request a seat on the dramatic second-floor wooden balcony.',
            coordinates: { lat: 35.6599, lng: 139.7238 }
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
            time: '07:45 AM',
            activity: 'Fresh Croissant & Île Saint-Louis Sunrise Walk',
            locationName: 'Île Saint-Louis',
            description: 'Begin with a warm butter croissant from an artisan boulangerie and take in quiet morning river views over the Seine.',
            cost: '€4 - €8',
            tip: 'The eastern tip of the island (Square Barye) has sublime sunrise reflections.',
            coordinates: { lat: 48.8519, lng: 2.3575 }
          },
          {
            timeSlot: 'Morning',
            time: '09:00 AM',
            activity: 'Sainte-Chapelle Stained Glass & Notre-Dame Parvis',
            locationName: 'Sainte-Chapelle & Notre-Dame',
            description: 'Gaze at the kaleidoscopic 13th-century stained glass windows rising 15 meters high inside the royal medieval chapel.',
            cost: '€13 entry',
            tip: 'Book the first morning slot to avoid security queues.',
            coordinates: { lat: 48.8554, lng: 2.345 }
          },
          {
            timeSlot: 'Afternoon',
            time: '11:45 AM',
            activity: 'Pont Neuf Crossing & Classic Parisian Bistro Lunch',
            locationName: 'Place Dauphine',
            description: 'Stroll across Paris’s oldest standing bridge into the charming chestnut-tree square of Place Dauphine for lunch.',
            cost: '€20 - €35',
            tip: 'Dine outdoors under the awnings at Restaurant Paul for authentic coq au vin.',
            coordinates: { lat: 48.8566, lng: 2.3427 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:30 PM',
            activity: 'Louvre Museum Grand Expedition',
            locationName: 'The Louvre',
            description: 'Enter through the iconic I.M. Pei glass pyramid to see the Mona Lisa, Winged Victory of Samothrace, and French Crown Jewels.',
            cost: '€22',
            tip: 'Use the Carrousel du Louvre underground mall entrance for shorter lines.',
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          {
            timeSlot: 'Afternoon',
            time: '04:15 PM',
            activity: 'Palais-Royal Arcades & Buren Columns',
            locationName: 'Domaine National du Palais-Royal',
            description: 'Wander the tranquil neoclassical courtyard filled with black-and-white striped striped columns and hidden antique shops.',
            cost: 'Free',
            tip: 'Grab a specialty espresso at Café Kitsuné under the gardens arcades.',
            coordinates: { lat: 48.8637, lng: 2.3371 }
          },
          {
            timeSlot: 'Evening',
            time: '06:00 PM',
            activity: 'Tuileries Gardens & Seine River Promenade',
            locationName: 'Jardin des Tuileries',
            description: 'Stroll past classical statues and green park chairs, crossing Pont des Arts bridge to the Left Bank.',
            cost: 'Free',
            tip: 'Grab a gelato at Amorino near Saint-Germain.',
            coordinates: { lat: 48.8634, lng: 2.3275 }
          },
          {
            timeSlot: 'Night',
            time: '08:00 PM',
            activity: 'Saint-Germain Atmospheric Candlelit Dinner',
            locationName: 'Le Comptoir du Relais',
            description: 'Indulge in classic Parisian bistro cooking with duck confit, cheese courses, and chilled red Burgundy wine.',
            cost: '€35 - €60',
            tip: 'Arrive slightly before 08:00 PM to secure a cozy sidewalk table.',
            coordinates: { lat: 48.8522, lng: 2.3387 }
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
            time: '08:00 AM',
            activity: 'Seine River Embankment Morning Jog or Stroll',
            locationName: 'Quai d’Orsay',
            description: 'Take in the crisp morning air along the paved lower riverbank quays watching morning river barges glide past.',
            cost: 'Free',
            tip: 'The view of the Pont Alexandre III bridge golden statues is spectacular in morning light.',
            coordinates: { lat: 48.8624, lng: 2.3134 }
          },
          {
            timeSlot: 'Morning',
            time: '09:30 AM',
            activity: 'Musée d’Orsay Masterpieces',
            locationName: 'Musée d’Orsay',
            description: 'Admire Van Gogh’s Starry Night over the Rhone and Monet’s water lilies under the grand Beaux-Arts railway clock face.',
            cost: '€16',
            tip: 'The giant clock on the 5th floor makes a sensational silhouette photo backdrop.',
            coordinates: { lat: 48.8599, lng: 2.3265 }
          },
          {
            timeSlot: 'Afternoon',
            time: '12:00 PM',
            activity: 'Rue Cler Market Street Food Tasting',
            locationName: 'Rue Cler Market',
            description: 'Venture through Paris’s quintessential pedestrian market street, gathering aged Comté cheese, charcuterie, and pastries.',
            cost: '€15 - €25',
            tip: 'Stop at Fromagerie Cler for expert cheese pairing advice.',
            coordinates: { lat: 48.8568, lng: 2.3056 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:45 PM',
            activity: 'Rodin Museum Sculpture Gardens',
            locationName: 'Musée Rodin',
            description: 'Wander through manicured rose gardens displaying The Thinker and The Gates of Hell against the backdrop of Hotel Biron.',
            cost: '€14',
            tip: 'The garden-only ticket is a cheaper, peaceful alternative on sunny afternoons.',
            coordinates: { lat: 48.8552, lng: 2.3158 }
          },
          {
            timeSlot: 'Afternoon',
            time: '03:45 PM',
            activity: 'Champ de Mars Lawn Picnic facing Eiffel Tower',
            locationName: 'Champ de Mars',
            description: 'Lay out on the green lawns facing the Iron Lady, savoring fresh macarons and chilled champagne.',
            cost: 'Free park access',
            tip: 'Great spot for playful perspective photos with the tower.',
            coordinates: { lat: 48.8556, lng: 2.2986 }
          },
          {
            timeSlot: 'Evening',
            time: '06:00 PM',
            activity: 'Trocadéro Esplanade Golden Hour Sunset Lookout',
            locationName: 'Place du Trocadéro',
            description: 'Ascend the marble terrace for Paris’s most panoramic sunset view overlooking the Eiffel Tower fountains and Seine valley.',
            cost: 'Free',
            tip: 'Best angle for wide panoramic photos right as the twilight sky turns lavender.',
            coordinates: { lat: 48.8624, lng: 2.2882 }
          },
          {
            timeSlot: 'Night',
            time: '08:00 PM',
            activity: 'Eiffel Tower Sparkle & Vedettes de Paris Night Cruise',
            locationName: 'Eiffel Tower & Seine Cruise',
            description: 'Watch the tower burst into 20,000 sparkling gold lights on the hour, followed by a romantic 1-hour Seine boat ride.',
            cost: '€17 for boat cruise',
            tip: 'The 5-minute hourly sparkle begins at dusk and repeats every hour on the hour.',
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
            time: '08:00 AM',
            activity: 'Montmartre Hidden Cobblestones & La Maison Rose',
            locationName: 'Rue de l’Abreuvoir',
            description: 'Walk Paris’s prettiest street in early morning serenity, passing the iconic pink facade of La Maison Rose.',
            cost: 'Free',
            tip: 'Zero crowds before 08:30 AM allows for fairytale-like cobblestone photography.',
            coordinates: { lat: 48.8879, lng: 2.3398 }
          },
          {
            timeSlot: 'Morning',
            time: '09:15 AM',
            activity: 'Sacré-Cœur Basilica & Dome Panorama',
            locationName: 'Sacré-Cœur Basilica',
            description: 'Climb the steps to Paris’s highest hilltop and marvel at the grand white domes and panoramic urban expanse.',
            cost: 'Free (Dome climb €7)',
            tip: 'Climbing the 300 steps to the dome awards the highest outdoor viewpoint in Paris.',
            coordinates: { lat: 48.8867, lng: 2.3431 }
          },
          {
            timeSlot: 'Morning',
            time: '11:00 AM',
            activity: 'Place du Tertre Open-Air Portrait Artists',
            locationName: 'Place du Tertre',
            description: 'Watch local painters, caricaturists, and watercolor artists at work in the historic bohemian village square.',
            cost: 'Free browsing',
            tip: 'Tucked behind the square is the Dalí Paris museum with rare surrealist sculptures.',
            coordinates: { lat: 48.8865, lng: 2.3408 }
          },
          {
            timeSlot: 'Afternoon',
            time: '12:45 PM',
            activity: 'L’As du Fallafel Feast in Jewish Quarter',
            locationName: 'Rue des Rosiers',
            description: 'Feast on the world’s most celebrated pita falafel loaded with fried eggplant, cucumber salad, and creamy tahini.',
            cost: '€9 - €14',
            tip: 'Join the takeout queue on the left for the fastest service.',
            coordinates: { lat: 48.8573, lng: 2.3592 }
          },
          {
            timeSlot: 'Afternoon',
            time: '02:30 PM',
            activity: 'Place des Vosges & Victor Hugo’s Apartment',
            locationName: 'Place des Vosges',
            description: 'Explore the red-brick arcades of Paris’s oldest planned square, home to Victor Hugo, and browse independent perfumeries.',
            cost: 'Free',
            tip: 'Carette under the arcades serves legendary whipped cream hot chocolate.',
            coordinates: { lat: 48.8555, lng: 2.3656 }
          },
          {
            timeSlot: 'Evening',
            time: '05:00 PM',
            activity: 'Hôtel de Sully Hidden Renaissance Courtyard Stroll',
            locationName: 'Hôtel de Sully',
            description: 'Walk through the secret arched doorway connecting Place des Vosges to the quiet 17th-century private mansion gardens.',
            cost: 'Free',
            tip: 'A serene hidden oasis with fragrant linden trees and stone sculptures.',
            coordinates: { lat: 48.8548, lng: 2.3638 }
          },
          {
            timeSlot: 'Night',
            time: '07:30 PM',
            activity: 'Traditional Belle Époque Dinner at Bouillon Chartier',
            locationName: 'Bouillon Chartier',
            description: 'Waiters in black waistcoats write your order directly onto the white paper tablecloth in this 1896 dining palace.',
            cost: '€18-€28 per person',
            tip: 'Try the escargots with garlic butter followed by their house chocolate mousse.',
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
            time: '08:30 AM',
            activity: 'Shakespeare and Company & Notre-Dame Riverside',
            locationName: 'Shakespeare and Company',
            description: 'Browse poetry and classic paperbacks in the world’s most celebrated English bookstore facing the Seine.',
            cost: 'Free',
            tip: 'Get your book stamped with the signature Shakespeare & Co embossment at the register.',
            coordinates: { lat: 48.8525, lng: 2.3471 }
          },
          {
            timeSlot: 'Morning',
            time: '10:15 AM',
            activity: 'Panthéon Neoclassical Dome & Crypt Tour',
            locationName: 'The Panthéon',
            description: 'Stand beneath the soaring neoclassical dome where Foucault’s pendulum swings, and visit the tombs of Marie Curie and Voltaire.',
            cost: '€11.50',
            tip: 'The colonnade platform offers breathtaking 360-degree views across Paris.',
            coordinates: { lat: 48.8462, lng: 2.3464 }
          },
          {
            timeSlot: 'Afternoon',
            time: '12:00 PM',
            activity: 'Rue Mouffetard Market Street Bistro Lunch',
            locationName: 'Rue Mouffetard',
            description: 'Dine along Hemingway’s favorite historic market street lined with charcuteries, cheese shops, and creperies.',
            cost: '€15 - €25',
            tip: 'Order a savory galette and artisanal Breton cider.',
            coordinates: { lat: 48.8415, lng: 2.3498 }
          },
          {
            timeSlot: 'Afternoon',
            time: '01:45 PM',
            activity: 'Luxembourg Gardens (Jardin du Luxembourg)',
            locationName: 'Jardin du Luxembourg',
            description: 'Relax in iconic green metal lounge chairs by the Medici Fountain watching vintage wooden toy boats sail the pond.',
            cost: 'Free',
            tip: 'Buy Pierre Hermé macarons nearby on Rue Bonaparte to enjoy in the park.',
            coordinates: { lat: 48.8462, lng: 2.3371 }
          },
          {
            timeSlot: 'Afternoon',
            time: '04:00 PM',
            activity: 'Saint-Sulpice Church & Delacroix Murals',
            locationName: 'Church of Saint-Sulpice',
            description: 'Admire the monumental baroque church, its brass astronomical gnomon line, and dramatic murals by Eugène Delacroix.',
            cost: 'Free',
            tip: 'Sit by the grand fountain in Place Saint-Sulpice for a peaceful coffee break.',
            coordinates: { lat: 48.8509, lng: 2.3344 }
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
          },
          {
            timeSlot: 'Night',
            time: '08:00 PM',
            activity: 'Romantic Illumination Nightwalk across Pont Neuf',
            locationName: 'Pont Neuf & Square du Vert-Galant',
            description: 'Walk out to the western tip of the island where willow trees weep into the Seine, watching illuminated tour boats drift past.',
            cost: 'Free',
            tip: 'The perfect romantic closing memory of Paris before departing.',
            coordinates: { lat: 48.8571, lng: 2.3397 }
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
