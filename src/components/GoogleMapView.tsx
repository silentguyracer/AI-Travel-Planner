'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { PlaceToVisit, RestaurantRecommendation, ItineraryDay } from '@/types/travel';
import { getUserSettings } from '@/lib/storage';
import {
  MapPin,
  Utensils,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Route,
  Globe,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import type { Map as LeafletMap, LayerGroup, Polyline } from 'leaflet';

interface GoogleMapViewProps {
  center: { lat: number; lng: number };
  destinationName: string;
  places: PlaceToVisit[];
  restaurants: RestaurantRecommendation[];
  itinerary: ItineraryDay[];
  selectedPlace?: { lat: number; lng: number; title: string } | null;
}

interface MapLocationItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  type: 'place' | 'restaurant' | 'activity' | 'center';
  day?: number;
  timeSlot?: string;
  time?: string;
  subtitle?: string;
  rating?: number;
  price?: string;
  address?: string;
  dishes?: string[];
  description?: string;
}

export default function GoogleMapView({
  center,
  destinationName,
  places,
  restaurants,
  itinerary,
  selectedPlace,
}: GoogleMapViewProps) {
  // Map Engine Mode: 'google-live' (Official Google Maps), 'google-js' (API key loader), 'leaflet-osm' (OpenStreetMap)
  const [engineMode, setEngineMode] = useState<'google-live' | 'leaflet-osm'>('google-live');
  const [googleMapType, setGoogleMapType] = useState<'m' | 'k' | 'h' | 'p'>('m'); // m: roadmap, k: satellite, h: hybrid, p: terrain
  const [googleZoom, setGoogleZoom] = useState<number>(15);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<MapLocationItem | null>(null);
  const [selectedDayRoute, setSelectedDayRoute] = useState<number>(1);
  const [googleApiKey, setGoogleApiKey] = useState<string>('');

  // Leaflet refs
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const leafletMarkersRef = useRef<LayerGroup | null>(null);
  const leafletRouteRef = useRef<Polyline | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  // Check for Google Maps API Key in localStorage or env
  useEffect(() => {
    const settings = getUserSettings();
    const key = settings.googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    setGoogleApiKey(key.trim());
  }, []);

  // Consolidate all locations
  const allLocations: MapLocationItem[] = useMemo(() => {
    const list: MapLocationItem[] = [];

    const isValidCoord = (lat?: number, lng?: number) =>
      typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng) && lat !== 0 && lng !== 0;

    // 1. Center pin
    if (isValidCoord(center?.lat, center?.lng)) {
      list.push({
        id: 'center-pin',
        title: `${destinationName} Overview`,
        lat: center.lat,
        lng: center.lng,
        type: 'center',
        subtitle: 'CITY CENTER',
        address: `Geographic center of ${destinationName}`,
        description: `Central orientation coordinates for ${destinationName}`,
      });
    }

    // 2. Attractions
    places.forEach((p, idx) => {
      if (isValidCoord(p.coordinates?.lat, p.coordinates?.lng)) {
        list.push({
          id: `place-${idx}`,
          title: p.name,
          lat: p.coordinates.lat,
          lng: p.coordinates.lng,
          type: 'place',
          subtitle: p.category ? p.category.toUpperCase() : 'ATTRACTION',
          rating: p.rating,
          price: p.price,
          address: p.address || p.description,
          description: p.description,
        });
      }
    });

    // 3. Restaurants
    restaurants.forEach((r, idx) => {
      if (isValidCoord(r.coordinates?.lat, r.coordinates?.lng)) {
        list.push({
          id: `rest-${idx}`,
          title: r.name,
          lat: r.coordinates.lat,
          lng: r.coordinates.lng,
          type: 'restaurant',
          subtitle: `${r.cuisine || 'Dining'} • ${r.priceTier || '$$'}`,
          rating: r.rating,
          dishes: r.mustTryDishes,
          address: r.address || r.description,
          description: r.description,
        });
      }
    });

    // 4. Daily Activities
    itinerary.forEach((day) => {
      day.schedule.forEach((act, actIdx) => {
        if (isValidCoord(act.coordinates?.lat, act.coordinates?.lng)) {
          list.push({
            id: `day-${day.day}-${actIdx}`,
            title: act.locationName || act.activity,
            lat: act.coordinates!.lat,
            lng: act.coordinates!.lng,
            type: 'activity',
            day: day.day,
            timeSlot: act.timeSlot,
            time: act.time,
            subtitle: `Day ${day.day} • Stop ${actIdx + 1} (${act.time})`,
            price: act.cost,
            address: act.description,
            description: act.description,
          });
        }
      });
    });

    return list;
  }, [center, destinationName, places, restaurants, itinerary]);

  // Set default selected location
  useEffect(() => {
    if (selectedPlace) {
      const match = allLocations.find((l) => l.title.toLowerCase() === selectedPlace.title.toLowerCase()) || {
        id: 'external-sel',
        title: selectedPlace.title,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        type: 'place',
        subtitle: 'SELECTED LOCATION',
      };
      setSelectedLocation(match);
      setGoogleZoom(16);
    } else if (!selectedLocation && allLocations.length > 0) {
      // Default to first attraction or city center
      const firstAttraction = allLocations.find((l) => l.type === 'place') || allLocations[0];
      setSelectedLocation(firstAttraction);
    }
  }, [selectedPlace, allLocations]);

  // Filtered locations for list
  const filteredLocations = useMemo(() => {
    if (activeCategory === 'all') return allLocations;
    if (activeCategory === 'places') return allLocations.filter((l) => l.type === 'place' || l.type === 'center');
    if (activeCategory === 'restaurants') return allLocations.filter((l) => l.type === 'restaurant');
    if (activeCategory.startsWith('day-')) {
      const dayNum = parseInt(activeCategory.replace('day-', ''), 10);
      return allLocations.filter((l) => l.day === dayNum);
    }
    return allLocations;
  }, [allLocations, activeCategory]);

  // Construct Google Maps Embed Query URL
  const googleEmbedUrl = useMemo(() => {
    const loc = selectedLocation || allLocations[0];
    if (!loc) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(destinationName)}&t=${googleMapType}&z=${googleZoom}&ie=UTF8&iwloc=&output=embed`;
    }
    // High-precision query using exact title and city or exact coordinates
    const query = `${loc.title}, ${destinationName}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${googleMapType}&z=${googleZoom}&ie=UTF8&iwloc=&output=embed`;
  }, [selectedLocation, destinationName, googleMapType, googleZoom, allLocations]);

  // Construct Multi-Stop Day Route on Google Maps
  const dayRouteUrl = useMemo(() => {
    const dayStops = allLocations.filter((l) => l.type === 'activity' && l.day === selectedDayRoute);
    if (dayStops.length === 0) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`;
    }
    const origin = encodeURIComponent(`${dayStops[0].title}, ${destinationName}`);
    const dest = encodeURIComponent(`${dayStops[dayStops.length - 1].title}, ${destinationName}`);
    const waypoints = dayStops
      .slice(1, -1)
      .map((s) => encodeURIComponent(`${s.title}, ${destinationName}`))
      .join('|');

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=walking`;
  }, [allLocations, destinationName, selectedDayRoute]);

  // Leaflet initialization when in leaflet-osm mode
  useEffect(() => {
    if (engineMode !== 'leaflet-osm') return;
    let isMounted = true;

    async function initLeaflet() {
      if (!leafletContainerRef.current || leafletMapRef.current) return;
      const L = await import('leaflet');
      if (!isMounted || !leafletContainerRef.current) return;

      const initLat = selectedLocation?.lat || center?.lat || 26.9124;
      const initLng = selectedLocation?.lng || center?.lng || 75.7873;

      const map = L.map(leafletContainerRef.current, {
        center: [initLat, initLng],
        zoom: 14,
        zoomControl: false,
      });

      // Free OpenStreetMap Standard Tiles (No API key, zero watermarks)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abc',
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      leafletMarkersRef.current = markersLayer;
      leafletMapRef.current = map;
      setLeafletLoaded(true);

      setTimeout(() => {
        if (leafletMapRef.current) leafletMapRef.current.invalidateSize();
      }, 200);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [engineMode]);

  // Update Leaflet markers
  useEffect(() => {
    if (engineMode !== 'leaflet-osm') return;
    const map = leafletMapRef.current;
    const markersLayer = leafletMarkersRef.current;
    if (!map || !markersLayer) return;

    import('leaflet').then((L) => {
      markersLayer.clearLayers();
      if (leafletRouteRef.current) {
        leafletRouteRef.current.remove();
        leafletRouteRef.current = null;
      }

      const bounds = L.latLngBounds([]);

      filteredLocations.forEach((loc, idx) => {
        const isSelected = selectedLocation?.id === loc.id;
        const color =
          loc.type === 'restaurant'
            ? '#e11d48'
            : loc.type === 'place'
            ? '#4f46e5'
            : loc.type === 'center'
            ? '#7c3aed'
            : '#059669';

        const iconHtml = `
          <div style="
            background: ${color};
            color: #ffffff;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            ${loc.type === 'activity' ? idx + 1 : loc.type === 'restaurant' ? '🍴' : loc.type === 'place' ? '🏛️' : '★'}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; min-width: 180px; max-width: 240px; padding: 2px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${loc.title}</div>
            <div style="color: ${color}; font-weight: 700; font-size: 10px; text-transform: uppercase;">${loc.subtitle || loc.type}</div>
            ${loc.rating ? `<div style="color: #d97706; font-weight: 700; margin-top: 2px;">★ ${loc.rating}</div>` : ''}
            <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${loc.title} ${destinationName}`
              )}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                Open in Google Maps →
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedLocation(loc);
        });

        markersLayer.addLayer(marker);
        bounds.extend([loc.lat, loc.lng]);
      });

      if (bounds.isValid() && filteredLocations.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    });
  }, [engineMode, filteredLocations, selectedLocation, destinationName]);

  const handleSelectLocation = useCallback((item: MapLocationItem) => {
    setSelectedLocation(item);
    setGoogleZoom(16);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col">
      {/* Top Header with Google Maps Branding */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {/* Google Maps Logo Badge */}
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="#4285F4"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              />
              <circle fill="#EA4335" cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>Google Maps Live</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Interactive
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Explore {destinationName} with genuine Google Maps streets, satellite, terrain, and directions
            </p>
          </div>
        </div>

        {/* Engine Mode Switcher & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Engine Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setEngineMode('google-live')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                engineMode === 'google-live'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => setEngineMode('leaflet-osm')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                engineMode === 'leaflet-osm'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Multi-Pin Canvas</span>
            </button>
          </div>

          {/* If in Google Maps Mode: Map Type Selectors */}
          {engineMode === 'google-live' && (
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setGoogleMapType('m')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  googleMapType === 'm' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Roadmap Street View"
              >
                🗺️ Streets
              </button>
              <button
                onClick={() => setGoogleMapType('k')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  googleMapType === 'k' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Satellite Aerial"
              >
                🛰️ Satellite
              </button>
              <button
                onClick={() => setGoogleMapType('p')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  googleMapType === 'p' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Topographic Terrain"
              >
                ⛰️ Terrain
              </button>
            </div>
          )}

          {/* Direct Google Maps External Launch */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              selectedLocation ? `${selectedLocation.title}, ${destinationName}` : destinationName
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            title="Open in Google Maps Application"
          >
            <span>Google Maps App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Category Pills & Quick Filter Bar */}
      <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Spots ({allLocations.length})
          </button>

          <button
            onClick={() => setActiveCategory('places')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'places'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>Attractions ({places.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('restaurants')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              activeCategory === 'restaurants'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-rose-500" />
            <span>Restaurants ({restaurants.length})</span>
          </button>

          {itinerary.map((d) => (
            <button
              key={d.day}
              onClick={() => {
                setActiveCategory(`day-${d.day}`);
                setSelectedDayRoute(d.day);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeCategory === `day-${d.day}`
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>

        {/* Multi-Stop Day Route Link */}
        <a
          href={dayRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all"
          title={`Open Day ${selectedDayRoute} complete walking route on Google Maps`}
        >
          <Route className="w-3.5 h-3.5 text-emerald-600" />
          <span>Day {selectedDayRoute} Route (Google Maps)</span>
          <ExternalLink className="w-3 h-3 text-emerald-600" />
        </a>
      </div>

      {/* Quick Location Switcher Drawer / Carousel */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Click to View:</span>
        {filteredLocations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectLocation(loc)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <span>{loc.type === 'restaurant' ? '🍴' : loc.type === 'place' ? '🏛️' : loc.type === 'activity' ? '📍' : '🏙️'}</span>
              <span className="max-w-[140px] truncate">{loc.title}</span>
              {loc.rating && <span className={isSelected ? 'text-amber-200' : 'text-amber-500'}>★{loc.rating}</span>}
            </button>
          );
        })}
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full h-[520px] sm:h-[620px] bg-slate-100 overflow-hidden">
        {/* MODE 1: Official Google Maps Live Embed */}
        {engineMode === 'google-live' && (
          <div className="w-full h-full relative">
            <iframe
              key={googleEmbedUrl}
              title={`Google Map of ${selectedLocation?.title || destinationName}`}
              src={googleEmbedUrl}
              className="w-full h-full border-0 select-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Floating Zoom & Controls Overlay */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 shadow-xl bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200">
              <button
                onClick={() => setGoogleZoom((z) => Math.min(z + 1, 19))}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Google Maps Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-200" />
              <button
                onClick={() => setGoogleZoom((z) => Math.max(z - 1, 10))}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Google Maps Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-200" />
              <button
                onClick={() => {
                  const centerItem = allLocations.find((l) => l.type === 'center') || allLocations[0];
                  if (centerItem) handleSelectLocation(centerItem);
                }}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Recenter to City Overview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: Multi-Pin Canvas (Leaflet OpenStreetMap) */}
        {engineMode === 'leaflet-osm' && (
          <div className="w-full h-full relative">
            <div ref={leafletContainerRef} className="w-full h-full z-0" />
          </div>
        )}

        {/* Active Location Info Card Floating at Bottom-Left */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/90 z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedLocation.type === 'restaurant'
                        ? 'bg-rose-100 text-rose-700'
                        : selectedLocation.type === 'place'
                        ? 'bg-indigo-100 text-indigo-700'
                        : selectedLocation.type === 'center'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedLocation.subtitle || selectedLocation.type}
                  </span>
                  {selectedLocation.rating && (
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                      ★ {selectedLocation.rating}
                    </span>
                  )}
                  {selectedLocation.price && (
                    <span className="text-slate-400 text-xs font-semibold">• {selectedLocation.price}</span>
                  )}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                  {selectedLocation.title}
                </h4>
                {selectedLocation.address && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {selectedLocation.address}
                  </p>
                )}
                {selectedLocation.dishes && selectedLocation.dishes.length > 0 && (
                  <div className="mt-1.5 text-xs text-slate-700 bg-rose-50 p-1.5 rounded-lg border border-rose-100 font-medium">
                    <span className="font-bold text-rose-800">Must Try:</span> {selectedLocation.dishes.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${selectedLocation.title}, ${destinationName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions & Navigation</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedLocation.title}, ${destinationName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Multi-Stop Waypoint Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Powered by Google Maps</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{allLocations.length} Geocoded Points of Interest</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Day route waypoints:</span>
          <div className="flex items-center gap-1">
            {itinerary.map((d) => (
              <a
                key={d.day}
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                  `${d.schedule[0]?.locationName || d.schedule[0]?.activity || destinationName}, ${destinationName}`
                )}&destination=${encodeURIComponent(
                  `${d.schedule[d.schedule.length - 1]?.locationName || d.schedule[d.schedule.length - 1]?.activity || destinationName}, ${destinationName}`
                )}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded font-semibold text-[11px] transition-all"
                title={`Open Day ${d.day} route on Google Maps`}
              >
                Day {d.day} Route ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
