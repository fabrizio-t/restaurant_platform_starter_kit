// ============================================
// MENUOF Starter Project - Configuration
// ============================================

type LocalTheme = 'light' | 'dark';

/**
 * Versioned fallback config.
 *
 * This keeps the starter deployable on Vercel even when no environment
 * variables have been added yet. Environment variables still override these
 * values, so production projects can configure everything from the host.
 */
export const LOCAL_CONFIG = {
  apiBaseUrl: 'https://api.ordina.online/',
  storeSlug: 'pizzaplace',
  menuofPlatformUrl: 'https://ordina.online',
  bucketUrl: 'https://3d1da5272d71dd829c0b3d13a993b10a.eu.r2.cloudflarestorage.com',
  defaultLanguage: 'it',
  localTheme: 'light' as LocalTheme,
};

function envOrLocal(value: string | undefined, localValue: string): string {
  return value && value.trim() ? value : localValue;
}

function resolveLocalTheme(value: string): LocalTheme {
  return value === 'dark' ? 'dark' : 'light';
}

/**
 * API Base URL - The MENUOF backend API endpoint
 * Environment variable overrides LOCAL_CONFIG.apiBaseUrl.
 */
export const API_BASE_URL = envOrLocal(process.env.NEXT_PUBLIC_API_BASE_URL, LOCAL_CONFIG.apiBaseUrl);

export const API_ORIGIN = API_BASE_URL.replace(/\/$/, '');

/**
 * Store Slug - The unique identifier for your store
 * Environment variable overrides LOCAL_CONFIG.storeSlug.
 */
export const STORE_SLUG = envOrLocal(process.env.NEXT_PUBLIC_STORE_SLUG, LOCAL_CONFIG.storeSlug);

/**
 * MENUOF Platform URL - Where users are redirected for checkout
 * This should be your store's subdomain on the MENUOF platform
 * Environment variable overrides LOCAL_CONFIG.menuofPlatformUrl.
 */
export const MENUOF_PLATFORM_URL = envOrLocal(
  process.env.NEXT_PUBLIC_MENUOF_PLATFORM_URL,
  LOCAL_CONFIG.menuofPlatformUrl
);

/**
 * Image bucket URL - Where images are hosted (Cloudflare R2)
 * Environment variable overrides LOCAL_CONFIG.bucketUrl.
 */
export const BUCKET_URL = envOrLocal(process.env.NEXT_PUBLIC_BUCKET_URL, LOCAL_CONFIG.bucketUrl);

/**
 * Default language for the application
 * Environment variable overrides LOCAL_CONFIG.defaultLanguage.
 */
export const DEFAULT_LANGUAGE = envOrLocal(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  LOCAL_CONFIG.defaultLanguage
);

/**
 * Local fallback theme used by the starter when the API does not return
 * a complete branded theme. Customize the light/dark variables in globals.css.
 */
export const LOCAL_THEME = resolveLocalTheme(
  envOrLocal(process.env.NEXT_PUBLIC_LOCAL_THEME, LOCAL_CONFIG.localTheme)
);

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
