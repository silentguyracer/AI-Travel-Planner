'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Camera,
  MapPin,
  Compass,
  Maximize2,
  Navigation,
  Globe,
  Eye,
  Sparkles,
  Layers
} from 'lucide-react';

export interface LightboxData {
  imageUrl: string;
  title: string;
  subtitle?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  destination: string;
  category?: string;
}

interface ImageLightboxModalProps {
  data: LightboxData | null;
  onClose: () => void;
}

export default function ImageLightboxModal({ data, onClose }: ImageLightboxModalProps) {
  const [viewMode, setViewMode] = useState<'photo' | 'streetview'>('photo');

  if (!data) return null;

  const lat = data.coordinates?.lat;
  const lng = data.coordinates?.lng;
  const hasCoordinates = typeof lat === 'number' && typeof lng === 'number' && lat !== 0 && lng !== 0;

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    `${data.title} ${data.destination} photography hd`
  )}`;

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${data.title} ${data.destination}`
      )}`;

  const googleEarthUrl = hasCoordinates
    ? `https://earth.google.com/web/search/${lat},${lng}`
    : `https://earth.google.com/web/search/${encodeURIComponent(`${data.title} ${data.destination}`)}`;

  const streetViewEmbedUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&output=svembed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(`${data.title}, ${data.destination}`)}&layer=c&output=svembed`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] animate-in zoom-in-95"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
              {data.category ? data.category.toUpperCase() : 'VISUAL INTELLIGENCE'}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[240px] sm:max-w-md">
              {data.destination}
            </span>
          </div>

          {/* Mode Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'photo'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>HD Photo</span>
              </button>
              <button
                onClick={() => setViewMode('streetview')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'streetview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive 360 Google Street View"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Google Street View 360°</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[500px]">
          {viewMode === 'photo' ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={data.imageUrl}
                alt={data.title}
                className="max-w-full max-h-[65vh] object-contain rounded-xl select-none"
              />
            </div>
          ) : (
            <div className="w-full h-full min-h-[500px] relative">
              <iframe
                title={`Street View of ${data.title}`}
                src={streetViewEmbedUrl}
                className="w-full h-full min-h-[500px] border-0 select-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Bottom Details & Deep-Link Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 text-white">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base sm:text-xl text-white tracking-tight flex items-center gap-2">
              <span>{data.title}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            {data.location && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{data.location}</span>
              </p>
            )}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={googleImagesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>100+ More Photos on Google Images ↗</span>
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Maps</span>
            </a>

            <a
              href={googleEarthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors hidden sm:flex"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Earth 3D</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
