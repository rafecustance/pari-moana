/**
 * Asset URL helper for R2-hosted assets.
 * 
 * Uses NEXT_PUBLIC_ASSET_URL environment variable.
 * When ready for production, simply update the env var.
 */

const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_URL ?? '';

/**
 * Constructs a full URL for an R2-hosted asset.
 * 
 * @param path - Asset path starting with / (e.g., '/assets/hero/hero.jpg')
 * @returns Full URL to the asset
 */
export function assetUrl(path: string): string {
  return `${ASSET_BASE_URL}${path}`;
}
