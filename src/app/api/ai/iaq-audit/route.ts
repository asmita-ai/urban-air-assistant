import { NextRequest, NextResponse } from 'next/server';
import { generateIAQAudit } from '@/lib/gemini';
import { IAQAuditRequestSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rateLimit';
import { createErrorResponse } from '@/lib/apiHelper';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before requesting another audit.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const rawBody = await request.json();
    const parseResult = IAQAuditRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload for indoor air audit.',
          issues: parseResult.error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const { aqiData, profile } = parseResult.data;
    const audit = await generateIAQAudit(aqiData, profile);

    return NextResponse.json(audit, { status: 200 });
  } catch (error: unknown) {
    return createErrorResponse(
      error,
      500,
      'Failed to generate indoor air audit. Please try again.'
    );
  }
}
