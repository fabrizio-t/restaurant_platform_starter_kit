// ============================================
// MENUOF Starter Project - Configuration
// ============================================

/**
 * API Base URL - The MENUOF backend API endpoint
 * Default: http://localhost:3001/
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/';

export const API_ORIGIN = API_BASE_URL.replace(/\/$/, '');

/**
 * Store Slug - The unique identifier for your store
 * This is used to fetch store data from the MENUOF API
 */
export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || 'demo';

/**
 * MENUOF Platform URL - Where users are redirected for checkout
 * This should be your store's subdomain on the MENUOF platform
 * Example: https://your-store.ordina.online
 */
export const MENUOF_PLATFORM_URL = process.env.NEXT_PUBLIC_MENUOF_PLATFORM_URL || 'http://localhost:3000';

/**
 * Image bucket URL - Where images are hosted (Cloudflare R2)
 */
export const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL || 'https://3d1da5272d71dd829c0b3d13a993b10a.eu.r2.cloudflarestorage.com';

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

/**
 * Cart session key for localStorage
 */
export const CART_SESSION_KEY = 'menuof_cart_session_id';

/**
 * Helper function to get localized text from multi-language content
 */
export function getLocalizedText(
  content: string | Record<string, string | undefined> | undefined | null,
  language: string = DEFAULT_LANGUAGE,
  fallbackLanguage: string = 'en'
): string {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  // Try requested language first
  if (content[language]) {
    return content[language] as string;
  }
  
  // Try fallback language
  if (content[fallbackLanguage]) {
    return content[fallbackLanguage] as string;
  }
  
  // Return first available value
  const values = Object.values(content).filter((v): v is string => typeof v === 'string' && !!v);
  return values[0] || '';
}

/**
 * Get the full image URL
 * Handles relative paths from the API by prepending the bucket URL
 */
export function getImageUrl(imageUrl: string | undefined | null): string | null {
  if (!imageUrl) return null;
  
  // Already a full URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Already starts with slash (relative to domain)
  if (imageUrl.startsWith('/')) {
    return `${BUCKET_URL.replace(/\/$/, '')}${imageUrl}`;
  }
  
  // Relative path - prepend bucket URL
  return `${BUCKET_URL.replace(/\/$/, '')}/${imageUrl}`;
}

export function getProductImageUrl(
  image:
    | string
    | {
        small?: string;
        medium?: string;
        large?: string;
        original?: string;
        thumbnail?: string;
      }
    | undefined
    | null,
  preferredSize: 'small' | 'medium' | 'large' | 'original' = 'medium'
): string | null {
  if (!image) return null;
  if (typeof image === 'string') return getImageUrl(image);

  return getImageUrl(
    image[preferredSize] ||
      image.medium ||
      image.large ||
      image.original ||
      image.small ||
      image.thumbnail
  );
}

/**
 * Format currency value
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Generate checkout redirect URL
 */
export function getCheckoutUrl(sessionId: string): string {
  return `${MENUOF_PLATFORM_URL}/checkout?sessionId=${sessionId}`;
}
