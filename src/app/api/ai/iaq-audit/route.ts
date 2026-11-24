import { NextRequest, NextResponse } from 'next/server';
import { generateIAQAudit } from '@/lib/gemini';
import { AQIData, HouseholdProfile } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aqiData, profile } = body as { aqiData: AQIData; profile: HouseholdProfile };

    if (!aqiData || !profile) {
      return NextResponse.json(
        { error: 'Missing aqiData or profile in request body' },
        { status: 400 }
      );
    }

    const audit = await generateIAQAudit(aqiData, profile);
    return NextResponse.json(audit, { status: 200 });
  } catch (error: any) {
    console.error('API /api/ai/iaq-audit error:', error);
    return NextResponse.json(
      { error: 'Failed to generate IAQ audit', message: error.message },
      { status: 500 }
    );
  }
}
