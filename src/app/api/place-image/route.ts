import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for fast lookups
const imageCache = new Map<string, string>();

const CATEGORY_FALLBACKS: Record<string, string> = {
  landmark: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  museum: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  nightlife: 'https://images.unsplash.com/photo-1517840905900-31f3e0c11ce9?auto=format&fit=crop&w=1200&q=80',
  street: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
};

async function fetchWikiThumbnail(searchQuery: string): Promise<string | null> {
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      searchQuery
    )}&gsrlimit=2&prop=pageimages&pithumbsize=1000&format=json`;

    const wRes = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'AITravelPlanner/1.0 (contact@smartai-travel.com)' },
      next: { revalidate: 86400 }, // Cache on edge for 24h
    });

    if (wRes.ok) {
      const wData = await wRes.json();
      const pages = wData.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId] as { thumbnail?: { source: string } };
          if (page.thumbnail?.source) {
            return page.thumbnail.source;
          }
        }
      }
    }
  } catch {
    // Ignore and proceed
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery = searchParams.get('query')?.trim() || '';
  const category = searchParams.get('category')?.toLowerCase() || 'default';
  const apiKey =
    searchParams.get('googleKey') ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const wantsRedirect =
    searchParams.get('redirect') === 'true' ||
    searchParams.get('redirect') === '1' ||
    searchParams.get('format') === 'image' ||
    (request.headers.get('accept')?.includes('image/') &&
      !request.headers.get('accept')?.includes('application/json'));

  const defaultFallback = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;

  if (!rawQuery) {
    if (wantsRedirect) {
      return NextResponse.redirect(defaultFallback, 307);
    }
    return NextResponse.json({ url: defaultFallback });
  }

  // Clean query: remove noise words like 'undefined', excess punctuation
  const query = rawQuery
    .replace(/\bundefined\b/gi, '')
    .replace(/\bnull\b/gi, '')
    .trim();

  const cacheKey = `${query.toLowerCase()}_${category}`;
  if (imageCache.has(cacheKey)) {
    const cachedUrl = imageCache.get(cacheKey)!;
    if (wantsRedirect) {
      return NextResponse.redirect(cachedUrl, 307);
    }
    return NextResponse.json({ url: cachedUrl, source: 'cached' });
  }

  // 1. Google Places API Photo (if API key configured)
  if (apiKey) {
    try {
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        query
      )}&inputtype=textquery&fields=photos&key=${apiKey}`;
      const gRes = await fetch(findUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        const photoRef = gData.candidates?.[0]?.photos?.[0]?.photo_reference;
        if (photoRef) {
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoRef}&key=${apiKey}`;
          imageCache.set(cacheKey, photoUrl);
          if (wantsRedirect) {
            return NextResponse.redirect(photoUrl, 307);
          }
          return NextResponse.json({ url: photoUrl, source: 'google' });
        }
      }
    } catch {
      // Fallback to Wikipedia
    }
  }

  // 2. Fetch real landmark/city photo from Wikipedia / Wikimedia Commons API
  // Primary attempt: full search query
  let wikiPhoto = await fetchWikiThumbnail(query);

  // Secondary attempt: if query contains comma or dash, try with just the primary place name
  if (!wikiPhoto && (query.includes(',') || query.includes('-') || query.includes('•'))) {
    const primaryPart = query.split(/[,•-]/)[0].trim();
    if (primaryPart.length >= 3) {
      wikiPhoto = await fetchWikiThumbnail(primaryPart);
    }
  }

  // Tertiary attempt: try destination keyword if composite query was "Day 1 ... in Tokyo"
  if (!wikiPhoto && query.toLowerCase().includes('day ')) {
    const cleaned = query.replace(/day \d+/gi, '').trim();
    if (cleaned.length >= 3) {
      wikiPhoto = await fetchWikiThumbnail(cleaned);
    }
  }

  if (wikiPhoto) {
    imageCache.set(cacheKey, wikiPhoto);
    if (wantsRedirect) {
      return NextResponse.redirect(wikiPhoto, 307);
    }
    return NextResponse.json({ url: wikiPhoto, source: 'wikimedia' });
  }

  // 3. High quality fallback based on category
  const fallbackUrl = defaultFallback;
  imageCache.set(cacheKey, fallbackUrl);
  if (wantsRedirect) {
    return NextResponse.redirect(fallbackUrl, 307);
  }
  return NextResponse.json({ url: fallbackUrl, source: 'curated' });
}
