import { NextRequest, NextResponse } from 'next/server';
import { fetchAirQualityData } from '@/lib/aqiService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Delhi NCR';
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;

    const data = await fetchAirQualityData(city, lat, lon);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (error: any) {
    console.error('API /api/aqi error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch air quality data', message: error.message },
      { status: 500 }
    );
  }
}
