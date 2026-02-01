import { NextRequest, NextResponse } from 'next/server';
import { appendRegistration } from '@/lib/google-sheets';
import { getPostHogClient } from '@/lib/posthog-server';

/**
 * Validate email format using a simple regex.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  // Get PostHog distinct ID from client-side header for event correlation
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID') || 'anonymous';
  const posthog = getPostHogClient();

  try {
    const body = await request.json();
    const { email, utmCampaign } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Extract country from Vercel geo headers
    // Falls back to 'Unknown' if not available (e.g., local development)
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

    // Generate timestamp in ISO format
    const timestamp = new Date().toISOString();

    // Append to Google Sheet
    await appendRegistration({
      email: email.trim().toLowerCase(),
      timestamp,
      utmCampaign: utmCampaign || null,
      country,
    });

    // Capture successful registration event server-side
    posthog.capture({
      distinctId,
      event: 'registration_submitted',
      properties: {
        email_domain: email.split('@')[1]?.toLowerCase(),
        utm_campaign: utmCampaign || null,
        country,
        source: 'api',
      },
    });

    // Identify the user by email for future event correlation
    posthog.identify({
      distinctId,
      properties: {
        email: email.trim().toLowerCase(),
        registration_date: timestamp,
        country,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Registration successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Capture failed registration event server-side
    posthog.capture({
      distinctId,
      event: 'registration_failed',
      properties: {
        error_message: error instanceof Error ? error.message : 'Unknown error',
        source: 'api',
      },
    });

    // Capture exception for error tracking
    if (error instanceof Error) {
      posthog.capture({
        distinctId,
        event: '$exception',
        properties: {
          $exception_message: error.message,
          $exception_type: error.name,
          $exception_source: 'api/register',
        },
      });
    }

    return NextResponse.json(
      { error: 'Failed to register. Please try again.' },
      { status: 500 }
    );
  }
}
