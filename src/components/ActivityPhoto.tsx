import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink, Image as ImageIcon, Sparkles, Eye, Compass } from 'lucide-react';
import ImageLightboxModal, { LightboxData } from './ImageLightboxModal';

interface ActivityPhotoProps {
  locationName: string;
  activityName: string;
  destination: string;
  category?: string;
  coordinates?: { lat: number; lng: number };
  className?: string;
}

export default function ActivityPhoto({
  locationName,
  activityName,
  destination,
  category = 'landmark',
  coordinates,
  className = '',
}: ActivityPhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const query = locationName || activityName;
  const searchQuery = `${query}, ${destination}`.trim();
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    `${query} ${destination}`
  )}`;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    async function loadPhoto() {
      try {
        const res = await fetch(
          `/api/place-image?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.url) {
            setPhotoUrl(data.url);
            setPhotoSource(data.source || '');
          }
        }
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPhoto();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, category]);

  return (
    <>
      <div
        onClick={() => {
          if (photoUrl) setIsLightboxOpen(true);
        }}
        className={`relative rounded-2xl overflow-hidden group bg-slate-100 border border-slate-200/80 shadow-xs shrink-0 cursor-pointer ${className}`}
        title="Click to view full photo & Google Street View 360°"
      >
        {/* Skeleton Loading State */}
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 animate-pulse text-slate-400">
            <ImageIcon className="w-6 h-6 animate-pulse" />
          </div>
        )}

        {/* Actual Photo */}
        {photoUrl && !hasError && (
          <img
            src={photoUrl}
            alt={query}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => setHasError(true)}
            loading="lazy"
          />
        )}

        {/* Fallback if error */}
        {hasError && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-400 p-2 text-center">
            <Camera className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold text-slate-600 line-clamp-1">{query}</span>
          </div>
        )}

        {/* Center Hover Magnifier / 360 Badge */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
          <div className="px-3 py-1.5 bg-black/75 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>HD & 360° View</span>
          </div>
        </div>

        {/* Gradient Overlay & Google Images Deep Link */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
          <span className="text-[10px] text-white/90 font-bold truncate max-w-[120px]">
            {photoSource === 'google' ? 'Google Places' : photoSource === 'wikimedia' ? 'Real Photo' : 'Curated'}
          </span>
          <a
            href={googleImagesUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-0.5 bg-white/90 hover:bg-white text-slate-900 rounded-md text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition-colors"
            title="Search Google Images"
          >
            <Camera className="w-3 h-3 text-blue-600" />
            <span>Google Images ↗</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && photoUrl && (
        <ImageLightboxModal
          data={{
            imageUrl: photoUrl,
            title: query,
            location: locationName || destination,
            coordinates,
            destination,
            category,
          }}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
