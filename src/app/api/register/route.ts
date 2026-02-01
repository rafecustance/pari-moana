import { NextRequest, NextResponse } from 'next/server';
import { appendRegistration } from '@/lib/google-sheets';

/**
 * Validate email format using a simple regex.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
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

    return NextResponse.json(
      { success: true, message: 'Registration successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'Failed to register. Please try again.' },
      { status: 500 }
    );
  }
}
