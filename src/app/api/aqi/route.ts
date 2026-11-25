import { NextRequest, NextResponse } from 'next/server';
import { fetchAirQualityData } from '@/lib/aqiService';
import { checkRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/apiHelper';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city')?.trim() || 'Delhi NCR';

    let lat: number | undefined = undefined;
    let lon: number | undefined = undefined;

    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    if (latParam !== null && lonParam !== null) {
      const parsedLat = parseFloat(latParam);
      const parsedLon = parseFloat(lonParam);

      if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLon)) {
        if (parsedLat >= -90 && parsedLat <= 90 && parsedLon >= -180 && parsedLon <= 180) {
          lat = parsedLat;
          lon = parsedLon;
        }
      }
    }

    const data = await fetchAirQualityData(city, lat, lon);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        'X-RateLimit-Remaining': rateCheck.remaining.toString(),
      },
    });
  } catch (error: unknown) {
    return createErrorResponse(error, 500, 'Unable to fetch air quality data. Please try again.');
  }
}
