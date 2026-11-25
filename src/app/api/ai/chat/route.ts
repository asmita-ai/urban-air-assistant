import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/gemini';
import { ChatRequestSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/apiHelper';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before sending another message.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const rawBody = await request.json();
    const parseResult = ChatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid message payload.',
          issues: parseResult.error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { message, history, aqiData, profile } = parseResult.data;
    const reply = await getChatResponse(message, history, aqiData, profile);

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: unknown) {
    return createErrorResponse(error, 500, 'Failed to process chat response. Please try again.');
  }
}
