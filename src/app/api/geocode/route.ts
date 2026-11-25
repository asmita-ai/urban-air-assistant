import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/apiHelper';

export const runtime = 'nodejs';

interface GeocodeApiItem {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before querying geocoding.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;

    const res = await fetch(geoUrl, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const rawResults: GeocodeApiItem[] = data.results || [];
    const results = rawResults.map((item) => ({
      name: item.name,
      state: item.admin1 || '',
      country: item.country || 'India',
      lat: item.latitude,
      lon: item.longitude,
    }));

    return NextResponse.json({ results });
  } catch (err: unknown) {
    return createErrorResponse(err, 500, 'Geocoding service unavailable.');
  }
}
