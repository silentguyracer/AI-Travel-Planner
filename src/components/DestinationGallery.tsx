'use client';

import React, { useState } from 'react';
import { Camera, Eye, X, Sparkles, MapPin, Image as ImageIcon } from 'lucide-react';

interface DestinationGalleryProps {
  destination: string;
}

interface PhotoItem {
  url: string;
  title: string;
  category: 'landmark' | 'food' | 'street' | 'nature';
  location: string;
}

const DESTINATION_PHOTOS: Record<string, PhotoItem[]> = {
  tokyo: [
    {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      title: 'Tokyo Tower & Modern Skyline at Dusk',
      category: 'landmark',
      location: 'Minato City, Tokyo',
    },
    {
      url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      title: 'Shibuya Crossing Illuminated in Neon',
      category: 'street',
      location: 'Shibuya, Tokyo',
    },
    {
      url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
      title: 'Artisan Nigiri Sushi & Fresh Sashimi',
      category: 'food',
      location: 'Toyosu & Tsukiji, Tokyo',
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      title: 'Senso-ji Temple & Historic Asakusa Lanterns',
      category: 'landmark',
      location: 'Asakusa, Tokyo',
    },
    {
      url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
      title: 'Steaming Bowl of Tonkotsu Ramen',
      category: 'food',
      location: 'Shinjuku, Tokyo',
    },
    {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      title: 'Cherry Blossoms (Sakura) at Shinjuku Gyoen',
      category: 'nature',
      location: 'Shinjuku Gyoen National Garden',
    },
  ],
  paris: [
    {
      url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
      title: 'Eiffel Tower Sunset over Champ de Mars',
      category: 'landmark',
      location: '7th Arrondissement, Paris',
    },
    {
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      title: 'The Louvre Glass Pyramid at Twilight',
      category: 'landmark',
      location: 'Rue de Rivoli, Paris',
    },
    {
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      title: 'Fresh Flaky French Croissants & Café au Lait',
      category: 'food',
      location: 'Saint-Germain-des-Prés, Paris',
    },
    {
      url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      title: 'Cobblestone Alleys of Bohemian Montmartre',
      category: 'street',
      location: '18th Arrondissement, Paris',
    },
    {
      url: 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&w=1200&q=80',
      title: 'Seine River Cruise past Pont Alexandre III',
      category: 'nature',
      location: 'River Seine, Paris',
    },
    {
      url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80',
      title: 'Delicate Parisian Macarons',
      category: 'food',
      location: 'Le Marais, Paris',
    },
  ],
};

export default function DestinationGallery({ destination }: DestinationGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const destLower = destination.toLowerCase();
  let key = 'tokyo';
  if (destLower.includes('paris') || destLower.includes('france')) {
    key = 'paris';
  }

  const photos = DESTINATION_PHOTOS[key] || [
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      title: `Iconic Vistas & Architecture of ${destination}`,
      category: 'landmark',
      location: `${destination} City Center`,
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      title: 'Authentic Local Gastronomy & Market Delicacies',
      category: 'food',
      location: `${destination} Dining Quarter`,
    },
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      title: `Scenic Landscapes & Strolls in ${destination}`,
      category: 'nature',
      location: `${destination} Promenade`,
    },
    {
      url: 'https://images.unsplash.com/photo-1517840905900-31f3e0c11ce9?auto=format&fit=crop&w=1200&q=80',
      title: 'Vibrant Alleys & Evening Ambiance',
      category: 'street',
      location: `${destination} Historic District`,
    },
  ];

  const filtered = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Visual Inspiration
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Curated Photo Gallery: {destination}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Glimpse iconic sights, neighborhood alleys, and culinary dishes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {['all', 'landmark', 'food', 'street', 'nature'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200"
          >
            {/* Image */}
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Category Badge */}
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-0.5 rounded-full shadow-xs capitalize">
              {photo.category}
            </span>

            {/* Hover Eye Icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
              <h4 className="font-bold text-sm leading-snug drop-shadow-sm">{photo.title}</h4>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>{photo.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full max-h-[70vh] object-cover"
            />

            <div className="p-5 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30 capitalize">
                  {selectedPhoto.category}
                </span>
                <h3 className="font-bold text-lg mt-1">{selectedPhoto.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{selectedPhoto.location}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
