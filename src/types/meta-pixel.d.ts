/**
 * Type declarations for the Meta (Facebook) Pixel.
 * 
 * @see https://developers.facebook.com/docs/meta-pixel/reference
 */

interface MetaPixelEventOptions {
  eventID?: string;
}

interface MetaPixelStandardEventData {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  currency?: string;
  value?: number;
  num_items?: number;
  predicted_ltv?: number;
  search_string?: string;
  status?: string;
}

type MetaPixelStandardEvent =
  | 'AddPaymentInfo'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'InitiateCheckout'
  | 'Lead'
  | 'PageView'
  | 'Purchase'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent';

interface MetaPixel {
  (
    command: 'init',
    pixelId: string,
    advancedMatching?: { em?: string; fn?: string; ln?: string; ph?: string }
  ): void;
  (command: 'track', event: MetaPixelStandardEvent, data?: MetaPixelStandardEventData, options?: MetaPixelEventOptions): void;
  (command: 'trackCustom', event: string, data?: Record<string, unknown>, options?: MetaPixelEventOptions): void;
  (command: 'trackSingle', pixelId: string, event: MetaPixelStandardEvent, data?: MetaPixelStandardEventData, options?: MetaPixelEventOptions): void;
  (command: 'trackSingleCustom', pixelId: string, event: string, data?: Record<string, unknown>, options?: MetaPixelEventOptions): void;
}

declare global {
  interface Window {
    fbq: MetaPixel;
  }
}

export {};
