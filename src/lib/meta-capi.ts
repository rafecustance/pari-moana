import { createHash } from 'crypto';

const META_PIXEL_ID = process.env.META_PIXEL_ID || '1171566535058180';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const META_API_VERSION = 'v21.0';

/**
 * Hash a value using SHA-256 as required by Meta's Conversion API.
 * Values must be lowercase and trimmed before hashing.
 */
function hashValue(value: string): string {
  return createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

interface MetaConversionEventParams {
  eventName: string;
  eventId: string;
  userEmail: string;
  userAgent?: string;
  ipAddress?: string;
  countryCode?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
}

interface MetaEventData {
  event_name: string;
  event_time: number;
  event_id: string;
  action_source: 'website';
  event_source_url?: string;
  user_data: {
    em?: string;
    client_ip_address?: string;
    client_user_agent?: string;
    country?: string;
  };
  custom_data?: Record<string, unknown>;
}

/**
 * Send a conversion event to Meta's Conversion API.
 * 
 * This complements client-side pixel tracking with server-side events
 * for improved attribution accuracy and resilience against ad blockers.
 * 
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api
 */
export async function sendMetaConversionEvent({
  eventName,
  eventId,
  userEmail,
  userAgent,
  ipAddress,
  countryCode,
  eventSourceUrl,
  customData,
}: MetaConversionEventParams): Promise<void> {
  if (!META_ACCESS_TOKEN) {
    console.warn('Meta CAPI: META_ACCESS_TOKEN not configured, skipping event');
    return;
  }

  const eventData: MetaEventData = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    user_data: {
      em: hashValue(userEmail),
    },
  };

  // Add optional user data
  if (ipAddress) {
    eventData.user_data.client_ip_address = ipAddress;
  }
  if (userAgent) {
    eventData.user_data.client_user_agent = userAgent;
  }
  if (countryCode && countryCode !== 'Unknown') {
    // Meta expects lowercase 2-letter ISO country code
    eventData.user_data.country = countryCode.toLowerCase();
  }
  if (eventSourceUrl) {
    eventData.event_source_url = eventSourceUrl;
  }
  if (customData) {
    eventData.custom_data = customData;
  }

  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

  try {
    const requestBody: Record<string, unknown> = {
      data: [eventData],
      access_token: META_ACCESS_TOKEN,
    };

    // Include test event code for debugging in Meta Events Manager
    if (META_TEST_EVENT_CODE) {
      requestBody.test_event_code = META_TEST_EVENT_CODE;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Meta CAPI error:', {
        status: response.status,
        error: errorData,
      });
      return;
    }

    const result = await response.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Meta CAPI event sent:', {
        eventName,
        eventId,
        eventsReceived: result.events_received,
      });
    }
  } catch (error) {
    console.error('Meta CAPI request failed:', error);
  }
}
