const MINUTE = 60_000;

export const STALE = {
  meta: 30 * MINUTE,
  health: 5 * MINUTE,
  discover: 5 * MINUTE,
  catalogue: 5 * MINUTE,
  series: 10 * MINUTE,
  chapters: 10 * MINUTE,
  characters: 10 * MINUTE,
  tags: 60 * MINUTE,
  search: MINUTE,
  lists: 5 * MINUTE,
  list: 5 * MINUTE,
  activity: MINUTE,
  stats: 10 * MINUTE,
  profile: 5 * MINUTE,
  tracking: 30_000,
  ratings: 5 * MINUTE,
  reviews: 5 * MINUTE,
} as const;

export const GC = 7 * 24 * 60 * MINUTE;

export const QUERY_STORAGE_KEY = 'phdb.query-cache.v1';
export const QUERY_MAX_AGE = 24 * 60 * 60 * 1000;
