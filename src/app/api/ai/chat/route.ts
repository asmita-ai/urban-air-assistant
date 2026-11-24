import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/gemini';
import { AQIData, HouseholdProfile } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, aqiData, profile } = body as {
      message: string;
      history: Array<{ role: 'user' | 'assistant'; content: string }>;
      aqiData: AQIData;
      profile: HouseholdProfile;
    };

    if (!message || !aqiData || !profile) {
      return NextResponse.json(
        { error: 'Missing required fields in request body' },
        { status: 400 }
      );
    }

    const reply = await getChatResponse(message, history || [], aqiData, profile);
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', message: error.message },
      { status: 500 }
    );
  }
}
