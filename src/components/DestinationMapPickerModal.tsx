'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { WORLD_CITIES_DATABASE, WorldCity } from '@/lib/worldCities';
import {
  MapPin,
  Search,
  X,
  Compass,
  Check,
  Globe,
  Navigation,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Crosshair
} from 'lucide-react';
import type { Map as LeafletMap, LayerGroup, Marker as LeafletMarker } from 'leaflet';

export interface CustomPickedLocation {
  name: string;
  state?: string;
  country?: string;
  formatted: string;
  lat: number;
  lng: number;
}

interface DestinationMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (destinationString: string, city?: WorldCity) => void;
  initialDestination?: string;
}

const CONTINENTS = [
  { id: 'all', label: 'All Continents', flag: '🌍', center: [20, 15] as [number, number], zoom: 2 },
  { id: 'India', label: 'India', flag: '🇮🇳', center: [22, 79] as [number, number], zoom: 5 },
  { id: 'Europe', label: 'Europe', flag: '🇪🇺', center: [50, 10] as [number, number], zoom: 4 },
  { id: 'Asia', label: 'Asia & Japan', flag: '🇯🇵', center: [34, 100] as [number, number], zoom: 4 },
  { id: 'Americas', label: 'Americas', flag: '🌎', center: [38, -97] as [number, number], zoom: 3 },
  { id: 'Middle East & Africa', label: 'Middle East & Africa', flag: '🏜️', center: [15, 30] as [number, number], zoom: 3 },
  { id: 'Oceania', label: 'Oceania', flag: '🇦🇺', center: [-25, 135] as [number, number], zoom: 4 },
];

/**
 * Ultra-precise reverse geocoding engine:
 * 1. OpenStreetMap Nominatim with zoom=14 and addressdetails=1 (resolves city, town, village, district, municipality)
 * 2. BigDataCloud reverse geocode client (unlimited fallback with locality-level accuracy)
 * 3. Graceful GPS coordinate fallback
 */
async function reverseGeocodeExactLocation(lat: number, lng: number): Promise<CustomPickedLocation> {
  // 1. Try OpenStreetMap Nominatim with high-precision zoom
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'User-Agent': 'AITravelPlanner/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      // Check all high-precision local names (city, town, village, city_district, municipality, suburb, etc.)
      const exactPlace =
        data.name ||
        addr.city ||
        addr.town ||
        addr.village ||
        addr.city_district ||
        addr.municipality ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.hamlet ||
        addr.county ||
        addr.state_district ||
        (data.display_name ? data.display_name.split(',')[0].trim() : '');

      const state = addr.state || addr.province || addr.region || '';
      const country = addr.country || '';

      if (exactPlace && exactPlace !== state) {
        const parts = [
          exactPlace,
          state && state !== exactPlace ? state : '',
          country,
        ].filter(Boolean);

        return {
          name: exactPlace,
          state,
          country,
          formatted: parts.join(', '),
          lat,
          lng,
        };
      }
    }
  } catch (err) {
    console.warn('OSM Nominatim reverse geocode error:', err);
  }

  // 2. High-speed BigDataCloud reverse geocoding client
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const d = await res.json();
      const exactPlace = d.locality || d.city || d.principalSubdivision || '';
      const state = d.principalSubdivision || '';
      const country = d.countryName || '';

      if (exactPlace) {
        const parts = [
          exactPlace,
          state && state !== exactPlace ? state : '',
          country,
        ].filter(Boolean);

        return {
          name: exactPlace,
          state,
          country,
          formatted: parts.join(', '),
          lat,
          lng,
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode error:', err);
  }

  // 3. Coordinate fallback
  return {
    name: `Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`,
    state: '',
    country: '',
    formatted: `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
    lat,
    lng,
  };
}

export default function DestinationMapPickerModal({
  isOpen,
  onClose,
  onSelectDestination,
  initialDestination,
}: DestinationMapPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersGroupRef = useRef<LayerGroup | null>(null);
  const clickedMarkerRef = useRef<LeafletMarker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [selectedCity, setSelectedCity] = useState<WorldCity | null>(null);
  const [customLocation, setCustomLocation] = useState<CustomPickedLocation | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Live Geocoding suggestions from /api/cities when typing in search
  const [liveSearchResults, setLiveSearchResults] = useState<
    Array<{
      id: number;
      name: string;
      country: string;
      admin1?: string;
      flag?: string;
      lat: number;
      lng: number;
      displayName?: string;
    }>
  >([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Set initial city if passed
  useEffect(() => {
    if (initialDestination) {
      const match = WORLD_CITIES_DATABASE.find(
        (c) =>
          c.name.toLowerCase() === initialDestination.toLowerCase() ||
          `${c.name}, ${c.country}`.toLowerCase() === initialDestination.toLowerCase()
      );
      if (match) {
        setSelectedCity(match);
      }
    }
  }, [initialDestination]);

  // Debounced live search across 1,000,000+ cities & towns
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setLiveSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLive(true);
      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.cities && Array.isArray(data.cities)) {
            setLiveSearchResults(data.cities.slice(0, 8));
            setShowSearchDropdown(true);
          }
        }
      } catch (err) {
        console.warn('Cities search fetch error:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter curated cities by continent and search query
  const visibleCities = useMemo(() => {
    return WORLD_CITIES_DATABASE.filter((city) => {
      const matchesContinent =
        selectedContinent === 'all' || city.continent === selectedContinent;
      const matchesSearch =
        !searchQuery.trim() ||
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.highlight.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesContinent && matchesSearch;
    });
  }, [selectedContinent, searchQuery]);

  // Helper: drop or update animated custom pin on the map
  const dropCustomPin = async (
    lat: number,
    lng: number,
    initialTitle = 'Resolving exact town...'
  ) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = await import('leaflet');

    const customPinHtml = `
      <div style="position: relative; width: 38px; height: 38px; cursor: pointer;">
        <div style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.4);
          animation: mapPinPulse 1.6s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 4px;
          left: 4px;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: customPinHtml,
      className: 'exact-pin-marker',
      iconSize: [38, 38],
      iconAnchor: [19, 34],
      popupAnchor: [0, -34],
    });

    if (clickedMarkerRef.current) {
      clickedMarkerRef.current.setLatLng([lat, lng]);
      clickedMarkerRef.current.setIcon(customIcon);
    } else {
      clickedMarkerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }

    clickedMarkerRef.current
      .bindPopup(
        `
        <div style="font-family: sans-serif; min-width: 160px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
            📍 Dropped Pin
          </div>
          <div style="font-weight: 800; font-size: 14px; color: #0f172a; margin-top: 2px;">
            ${initialTitle}
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #2563eb; font-weight: 700; background: #eff6ff; padding: 2px 6px; border-radius: 6px; display: inline-block;">
            GPS: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°
          </div>
        </div>
        `
      )
      .openPopup();
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;

      const initialLat = selectedCity?.lat || 22;
      const initialLng = selectedCity?.lng || 79;
      const initialZoom = selectedCity ? 6 : 4;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
      });

      // Free, high-speed OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abc',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
      setMapReady(true);

      // Handle click anywhere on the globe to pick exact coordinates
      map.on('click', async (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        setShowSearchDropdown(false);
        setSelectedCity(null);
        setIsReverseGeocoding(true);

        // Instantly place animated pin marker at exact clicked location
        await dropCustomPin(lat, lng, 'Locating exact town / district...');

        // Perform multi-source high-precision reverse geocoding
        const loc = await reverseGeocodeExactLocation(lat, lng);
        setCustomLocation(loc);
        setIsReverseGeocoding(false);

        // Update popup on map with exact place name, state, country, and GPS
        if (clickedMarkerRef.current) {
          clickedMarkerRef.current
            .setPopupContent(
              `
              <div style="font-family: sans-serif; min-width: 170px; padding: 4px;">
                <div style="font-size: 10px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">
                  📍 Exact Pinpoint Location
                </div>
                <div style="font-weight: 800; font-size: 15px; color: #0f172a; margin-top: 2px;">
                  ${loc.name}
                </div>
                <div style="font-size: 12px; color: #475569; font-weight: 600; margin-top: 2px;">
                  ${loc.state ? loc.state + ', ' : ''}${loc.country || ''}
                </div>
                <div style="margin-top: 6px; font-size: 10px; color: #2563eb; font-weight: 700; background: #eff6ff; padding: 3px 8px; border-radius: 6px; display: inline-block;">
                  GPS: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°
                </div>
              </div>
              `
            )
            .openPopup();
        }
      });

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    initMap();

    return () => {
      isMounted = false;
      if (clickedMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(clickedMarkerRef.current);
        clickedMarkerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
        setMapReady(false);
      }
    };
  }, [isOpen]);

  // Update Markers on visibleCities or selectedCity changes
  useEffect(() => {
    if (!mapReady || !markersGroupRef.current || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const markersGroup = markersGroupRef.current;
      const map = mapInstanceRef.current;
      if (!markersGroup || !map) return;

      markersGroup.clearLayers();

      visibleCities.forEach((city) => {
        const isSelected = selectedCity?.name === city.name;

        const iconHtml = `
          <div style="
            background: ${isSelected ? '#2563eb' : '#0f172a'};
            color: #ffffff;
            width: ${isSelected ? '32px' : '22px'};
            height: ${isSelected ? '32px' : '22px'};
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '14px' : '11px'};
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${city.flag}
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'city-picker-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([city.lat, city.lng], { icon });

        marker.on('click', () => {
          setSelectedCity(city);
          setCustomLocation(null);
          // Remove clicked pinpoint marker if active
          if (clickedMarkerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(clickedMarkerRef.current);
            clickedMarkerRef.current = null;
          }
          map.flyTo([city.lat, city.lng], Math.max(map.getZoom(), 6), { duration: 0.8 });
        });

        markersGroup.addLayer(marker);
      });
    });
  }, [visibleCities, selectedCity, mapReady]);

  // Handle Continent Selection
  const handleSelectContinent = (cont: (typeof CONTINENTS)[0]) => {
    setSelectedContinent(cont.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(cont.center, cont.zoom, { duration: 1 });
    }
  };

  // Fly to specific curated city from quick bar
  const handleFlyToCity = (city: WorldCity) => {
    setSelectedCity(city);
    setCustomLocation(null);
    if (clickedMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(clickedMarkerRef.current);
      clickedMarkerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], 7, { duration: 0.8 });
    }
  };

  // Fly to specific live searched location (e.g., Betul, Madhya Pradesh, India)
  const handleSelectLiveLocation = async (item: (typeof liveSearchResults)[0]) => {
    setShowSearchDropdown(false);
    setSelectedCity(null);

    const loc: CustomPickedLocation = {
      name: item.name,
      state: item.admin1,
      country: item.country,
      formatted:
        item.displayName ||
        `${item.name}, ${item.admin1 ? item.admin1 + ', ' : ''}${item.country}`,
      lat: item.lat,
      lng: item.lng,
    };

    setCustomLocation(loc);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 10, { duration: 1 });
    }

    await dropCustomPin(item.lat, item.lng, loc.formatted);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedCity) {
      const formatted = `${selectedCity.name}, ${selectedCity.country}`;
      onSelectDestination(formatted, selectedCity);
      onClose();
    } else if (customLocation) {
      onSelectDestination(customLocation.formatted);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentSelectionLabel = selectedCity
    ? `${selectedCity.flag} ${selectedCity.name}, ${selectedCity.country}`
    : customLocation
    ? `📍 ${customLocation.formatted}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <style>{`
        @keyframes mapPinPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[820px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Choose Destination from Map
                </h3>
                <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                  Interactive Pin Drop
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Click anywhere on the map to drop an exact pinpoint, or search any town, city, or district worldwide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 relative z-20">
          {/* Continent Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {CONTINENTS.map((cont) => (
              <button
                key={cont.id}
                onClick={() => handleSelectContinent(cont)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedContinent === cont.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cont.flag}</span>
                <span>{cont.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Search with Live 1,000,000+ Town Geocoder Dropdown */}
          <div className="relative min-w-[220px] sm:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => liveSearchResults.length > 0 && setShowSearchDropdown(true)}
                placeholder="Search any town, city, district (e.g. Betul)..."
                className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {isSearchingLive ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-2.5 top-2.5" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLiveSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Live Search Autocomplete Results Dropdown */}
            {showSearchDropdown && liveSearchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 max-h-64 overflow-y-auto">
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Worldwide Exact Locations</span>
                  <span className="text-blue-600 font-bold">{liveSearchResults.length} found</span>
                </div>
                {liveSearchResults.map((item, idx) => (
                  <button
                    key={`${item.id}-${idx}`}
                    type="button"
                    onClick={() => handleSelectLiveLocation(item)}
                    className="w-full text-left p-2.5 hover:bg-blue-50/80 cursor-pointer flex items-center justify-between text-xs border-b border-slate-50 last:border-none transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">{item.flag || '📍'}</span>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      Fly & Pin
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Map Viewport */}
        <div className="relative flex-1 bg-slate-200 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Zoom Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 shadow-xl bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200" />
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200" />
            <button
              onClick={() => mapInstanceRef.current?.flyTo([22, 79], 4.5)}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Center India & Region"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200" />
            <button
              onClick={() => mapInstanceRef.current?.flyTo([20, 15], 2.5)}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset World View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Instructions banner badge floating over map */}
          <div className="absolute top-4 left-4 z-10 hidden sm:block pointer-events-none">
            <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 text-white text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-[11px]">
                Click anywhere on the map to drop a pin on any exact town or district
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Confirmation Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                customLocation
                  ? 'bg-red-50 border-red-200 text-red-600 shadow-sm'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isReverseGeocoding ? (
                  <span className="text-blue-600 flex items-center gap-1.5 animate-pulse font-extrabold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Resolving exact town & district...
                  </span>
                ) : customLocation ? (
                  <span className="text-emerald-600 font-extrabold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Exact Location Pinpoint (GPS: {customLocation.lat.toFixed(4)}°, {customLocation.lng.toFixed(4)}°)
                  </span>
                ) : (
                  'Currently Selected Destination:'
                )}
              </p>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                {currentSelectionLabel || (
                  <span className="text-slate-400 italic">Click anywhere on the map to pin exact location...</span>
                )}
              </h4>
              {selectedCity && (
                <p className="text-xs text-slate-500">{selectedCity.highlight}</p>
              )}
              {customLocation && (
                <p className="text-xs text-slate-600 font-medium">
                  Exact Place: <span className="font-bold text-slate-900">{customLocation.name}</span>
                  {customLocation.state ? ` • State: ${customLocation.state}` : ''}
                  {customLocation.country ? ` • Country: ${customLocation.country}` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!currentSelectionLabel || isReverseGeocoding}
              onClick={handleConfirm}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                currentSelectionLabel && !isReverseGeocoding
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer scale-100'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Select Destination & Plan Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
