'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PlaceToVisit, RestaurantRecommendation, ItineraryDay } from '@/types/travel';
import { MapPin, Utensils, Compass, ExternalLink, Layers, ZoomIn, ZoomOut, AlertCircle, Navigation } from 'lucide-react';
import { getUserSettings } from '@/lib/storage';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

interface GoogleMapViewProps {
  center: { lat: number; lng: number };
  destinationName: string;
  places: PlaceToVisit[];
  restaurants: RestaurantRecommendation[];
  itinerary: ItineraryDay[];
  selectedPlace?: { lat: number; lng: number; title: string } | null;
}

interface MapMarkerItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  type: 'place' | 'restaurant' | 'activity';
  day?: number;
  subtitle?: string;
  rating?: number;
  price?: string;
  address?: string;
  dishes?: string[];
}

export default function GoogleMapView({
  center,
  destinationName,
  places,
  restaurants,
  itinerary,
  selectedPlace,
}: GoogleMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<MapMarkerItem | null>(null);
  const [showRoute, setShowRoute] = useState<boolean>(true);

  // Simulated map zoom & pan state for fallback mode
  const [simZoom, setSimZoom] = useState<number>(1);
  const [simPan, setSimPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load API Key from env or user settings
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const settings = getUserSettings();
    const effectiveKey = settings.googleMapsApiKey || envKey || '';
    setApiKey(effectiveKey);
  }, []);

  // Consolidate markers
  const allMarkers: MapMarkerItem[] = useMemo(() => {
    const list: MapMarkerItem[] = [];

    places.forEach((p, idx) => {
      list.push({
        id: `place-${idx}`,
        title: p.name,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        type: 'place',
        subtitle: p.category.toUpperCase(),
        rating: p.rating,
        price: p.price,
        address: p.address,
      });
    });

    restaurants.forEach((r, idx) => {
      list.push({
        id: `rest-${idx}`,
        title: r.name,
        lat: r.coordinates.lat,
        lng: r.coordinates.lng,
        type: 'restaurant',
        subtitle: `${r.cuisine} • ${r.priceTier}`,
        rating: r.rating,
        dishes: r.mustTryDishes,
        address: r.address,
      });
    });

    itinerary.forEach((day) => {
      day.schedule.forEach((act, actIdx) => {
        if (act.coordinates) {
          list.push({
            id: `day-${day.day}-${actIdx}`,
            title: act.locationName || act.activity,
            lat: act.coordinates.lat,
            lng: act.coordinates.lng,
            type: 'activity',
            day: day.day,
            subtitle: `Day ${day.day} • ${act.timeSlot}`,
            price: act.cost,
            address: act.description,
          });
        }
      });
    });

    return list;
  }, [places, restaurants, itinerary]);

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    if (filterType === 'all') return allMarkers;
    if (filterType === 'places') return allMarkers.filter((m) => m.type === 'place');
    if (filterType === 'restaurants') return allMarkers.filter((m) => m.type === 'restaurant');
    if (filterType.startsWith('day-')) {
      const dayNum = parseInt(filterType.replace('day-', ''), 10);
      return allMarkers.filter((m) => m.day === dayNum);
    }
    return allMarkers;
  }, [allMarkers, filterType]);

  // If a place was selected externally (e.g. from itinerary card click), highlight it
  useEffect(() => {
    if (selectedPlace) {
      const match = allMarkers.find(
        (m) =>
          Math.abs(m.lat - selectedPlace.lat) < 0.001 &&
          Math.abs(m.lng - selectedPlace.lng) < 0.001
      );
      if (match) {
        setActiveItem(match);
      }
    }
  }, [selectedPlace, allMarkers]);

  // Try loading real Google Maps if API key is provided
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      script.onerror = () => setLoadError('Could not load Google Maps API. Check API key validity or restrictions.');
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setGoogleMapsLoaded(true));
    }
  }, [apiKey]);

  // Initialize real Google Maps instance if loaded
  useEffect(() => {
    if (!googleMapsLoaded || !mapContainerRef.current || !window.google?.maps) return;

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: center,
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: true,
        styles: [
          { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'simplified' }] },
        ],
      });

      const infoWindow = new window.google.maps.InfoWindow();

      filteredMarkers.forEach((item) => {
        const marker = new window.google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map,
          title: item.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: item.type === 'restaurant' ? 8 : item.type === 'place' ? 9 : 7,
            fillColor: item.type === 'restaurant' ? '#f43f5e' : item.type === 'place' ? '#6366f1' : '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          setActiveItem(item);
          infoWindow.setContent(`
            <div style="padding: 6px; font-family: sans-serif; max-width: 240px;">
              <span style="font-size: 10px; font-weight: bold; color: ${
                item.type === 'restaurant' ? '#f43f5e' : '#6366f1'
              }; text-transform: uppercase;">${item.subtitle || item.type}</span>
              <h4 style="margin: 4px 0; font-size: 14px; font-weight: 600;">${item.title}</h4>
              ${item.rating ? `<p style="margin: 2px 0; font-size: 12px; color: #4b5563;">★ ${item.rating}</p>` : ''}
              ${item.address ? `<p style="margin: 2px 0; font-size: 11px; color: #6b7280;">${item.address}</p>` : ''}
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                item.title + ' ' + (item.address || destinationName)
              )}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; font-size: 11px; text-decoration: underline; display: inline-block; margin-top: 4px;">
                Open in Google Maps →
              </a>
            </div>
          `);
          infoWindow.open(map, marker);
        });
      });

      // Draw polyline route if enabled
      if (showRoute) {
        const routePoints = filteredMarkers
          .filter((m) => m.type === 'activity')
          .map((m) => ({ lat: m.lat, lng: m.lng }));

        if (routePoints.length > 1) {
          new window.google.maps.Polyline({
            path: routePoints,
            geodesic: true,
            strokeColor: '#6366f1',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map,
          });
        }
      }
    } catch (err) {
      console.error('Google Maps init error:', err);
    }
  }, [googleMapsLoaded, filteredMarkers, center, destinationName, showRoute]);

  // Coordinate normalizer for fallback interactive canvas
  const bounds = useMemo(() => {
    if (allMarkers.length === 0)
      return {
        minLat: center.lat - 0.05,
        maxLat: center.lat + 0.05,
        minLng: center.lng - 0.05,
        maxLng: center.lng + 0.05,
      };
    const lats = allMarkers.map((m) => m.lat);
    const lngs = allMarkers.map((m) => m.lng);
    return {
      minLat: Math.min(...lats, center.lat) - 0.015,
      maxLat: Math.max(...lats, center.lat) + 0.015,
      minLng: Math.min(...lngs, center.lng) - 0.015,
      maxLng: Math.max(...lngs, center.lng) + 0.015,
    };
  }, [allMarkers, center]);

  const getMarkerPositionPercent = (lat: number, lng: number) => {
    const latSpan = bounds.maxLat - bounds.minLat || 0.01;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.01;
    const y = 100 - ((lat - bounds.minLat) / latSpan) * 100;
    const x = ((lng - bounds.minLng) / lngSpan) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  // Mouse drag handlers for fallback canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - simPan.x, y: e.clientY - simPan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setSimPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Build SVG path points for route line in fallback mode
  const routePoints = useMemo(() => {
    return filteredMarkers
      .filter((m) => m.type === 'activity')
      .map((m) => getMarkerPositionPercent(m.lat, m.lng));
  }, [filteredMarkers]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              Route & Map: {destinationName}
              {apiKey && googleMapsLoaded && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Google Maps Live
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {filteredMarkers.length} locations plotted • Coords: {center.lat.toFixed(3)}, {center.lng.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Filter Pills & Route Toggle */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors whitespace-nowrap font-medium flex items-center gap-1 border ${
              showRoute
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle route path connecting day activities"
          >
            <Navigation className="w-3 h-3" />
            <span>Path</span>
          </button>

          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors whitespace-nowrap font-medium ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Pins ({allMarkers.length})
          </button>
          <button
            onClick={() => setFilterType('places')}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors whitespace-nowrap font-medium flex items-center gap-1 ${
              filterType === 'places'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3 h-3 text-indigo-400" />
            Attractions ({places.length})
          </button>
          <button
            onClick={() => setFilterType('restaurants')}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors whitespace-nowrap font-medium flex items-center gap-1 ${
              filterType === 'restaurants'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Utensils className="w-3 h-3 text-rose-400" />
            Dining ({restaurants.length})
          </button>
          {itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => setFilterType(`day-${day.day}`)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors whitespace-nowrap font-medium ${
                filterType === `day-${day.day}`
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[450px] sm:h-[520px] bg-slate-100 overflow-hidden select-none">
        {/* If live Google Maps script is loaded, mount it here */}
        {apiKey && googleMapsLoaded && !loadError ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          /* High-Fidelity Fallback Interactive Vector Map with Real Plotted Pins */
          <div
            className="w-full h-full relative cursor-grab active:cursor-grabbing bg-[#0f172a] overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Map Background Grid & Topographic Visual Styling */}
            <div
              className="absolute inset-0 transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${simPan.x}px, ${simPan.y}px) scale(${simZoom})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Radial gradient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-950/40 rounded-full blur-3xl pointer-events-none" />

              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* SVG Connecting Path Line */}
              {showRoute && routePoints.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <polyline
                    points={routePoints.map((p) => `${p.x}%,${p.y}%`).join(' ')}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeOpacity="0.8"
                  />
                </svg>
              )}

              {/* Destination Center Indicator */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                style={{ top: '50%', left: '50%' }}
              >
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 animate-ping absolute" />
                <div className="w-4 h-4 bg-indigo-400 rounded-full border-2 border-white shadow-lg z-10" />
                <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-indigo-200 text-[10px] font-semibold rounded-md border border-slate-700 shadow-md">
                  {destinationName} Center
                </span>
              </div>

              {/* Interactive Plotted Pins */}
              {filteredMarkers.map((item) => {
                const pos = getMarkerPositionPercent(item.lat, item.lng);
                const isSelected = activeItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItem(item);
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-20 group"
                    style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                  >
                    <div
                      className={`relative flex items-center justify-center rounded-full p-2 border-2 shadow-xl transition-all ${
                        item.type === 'restaurant'
                          ? isSelected
                            ? 'bg-rose-500 border-white ring-4 ring-rose-500/50 scale-125 text-white'
                            : 'bg-rose-600 border-white text-white shadow-rose-900/50'
                          : item.type === 'place'
                          ? isSelected
                            ? 'bg-indigo-500 border-white ring-4 ring-indigo-500/50 scale-125 text-white'
                            : 'bg-indigo-600 border-white text-white shadow-indigo-900/50'
                          : isSelected
                          ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/50 scale-125 text-white'
                          : 'bg-emerald-600 border-white text-white shadow-emerald-900/50'
                      }`}
                    >
                      {item.type === 'restaurant' ? (
                        <Utensils className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Pin Label Hover Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                      <div className="bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg border border-slate-700 flex items-center gap-1.5">
                        <span className="font-medium">{item.title}</span>
                        {item.rating && <span className="text-amber-400">★{item.rating}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Canvas Zoom & Reset Controls */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
              <button
                onClick={() => setSimZoom((prev) => Math.min(prev + 0.25, 2.5))}
                title="Zoom in"
                className="p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSimZoom((prev) => Math.max(prev - 0.25, 0.75))}
                title="Zoom out"
                className="p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSimZoom(1);
                  setSimPan({ x: 0, y: 0 });
                }}
                title="Reset view"
                className="p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Info Badge for Fallback Mode */}
            <div className="absolute top-4 left-4 max-w-xs sm:max-w-sm bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 shadow-xl z-30">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-200">Interactive Route Visualizer</p>
                  <p className="text-slate-400 leading-relaxed">
                    Showing real geographic coordinates & route paths. Add a Google Maps API Key in Settings to enable live Google Satellite tiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Marker Detail Card Drawer */}
        {activeItem && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-200 z-40 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    activeItem.type === 'restaurant'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {activeItem.subtitle || activeItem.type}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-1.5">{activeItem.title}</h4>
                {activeItem.rating && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                    <span>★ {activeItem.rating}</span>
                    {activeItem.price && <span className="text-slate-400">• {activeItem.price}</span>}
                  </div>
                )}
                {activeItem.address && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{activeItem.address}</p>
                )}
                {activeItem.dishes && activeItem.dishes.length > 0 && (
                  <div className="mt-2 text-xs text-slate-700 bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                    <span className="font-semibold text-rose-800">Must try:</span>{' '}
                    {activeItem.dishes.join(', ')}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${activeItem.title} ${activeItem.address || destinationName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeItem.lat.toFixed(3)}, {activeItem.lng.toFixed(3)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
            <span>Places to Visit ({places.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            <span>Restaurants & Dining ({restaurants.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span>Daily Stops</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">Click any pin to inspect details or open directions</p>
      </div>
    </div>
  );
}
