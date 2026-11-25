import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized Logger preventing direct console calls and allowing easy telemetry redirection.
 */
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
};

/**
 * Extracts a safe string representation of any caught error without leaking memory traces.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected internal error occurred';
}

/**
 * Creates standardized JSON error responses with proper HTTP status codes.
 * Ensures internal operational details are logged server-side rather than exposed to clients.
 */
export function createErrorResponse(
  error: unknown,
  status: number = 500,
  userMessage: string = 'An error occurred while processing your request.'
) {
  const internalDetails = getErrorMessage(error);
  logger.error(`API Handler Exception (${status}):`, internalDetails);

  return NextResponse.json(
    {
      error: userMessage,
      ...(process.env.NODE_ENV === 'development' ? { debug: internalDetails } : {}),
    },
    { status }
  );
}
