export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://pornhwadb.com/api/v1';

/**
 * Website origin. Used only by read-only site features (e.g. Gallery) that are
 * not part of the versioned API v1 contract.
 */
export const SITE_BASE_URL =
  process.env.EXPO_PUBLIC_SITE_BASE_URL || 'https://pornhwadb.com';

/**
 * Reader website origin. Used for fetching reader chapter pages and deep-linking.
 */
export const READER_BASE_URL =
  process.env.EXPO_PUBLIC_READER_BASE_URL || 'https://pornhwareader.com';

export const APP_NAME = 'Pornhwa DB';
export const APP_SCHEME = 'pornhwadb';
export const APP_VERSION = '1.0.0';

export const API_KEY_HEADER = 'X-API-Key';

export const SCOPES = ['catalogue:read', 'library:read', 'library:write'] as const;
export type Scope = (typeof SCOPES)[number];

export const REQUEST_TIMEOUT_MS = 15_000;
