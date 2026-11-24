import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
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
    const results = (data.results || []).map((item: any) => ({
      name: item.name,
      state: item.admin1 || '',
      country: item.country || 'India',
      lat: item.latitude,
      lon: item.longitude,
    }));

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Geocode search failed:', err);
    return NextResponse.json({ results: [] });
  }
}
