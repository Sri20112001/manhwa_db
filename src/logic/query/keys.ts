export type QueryParamsRecord = Record<string, unknown> | undefined;

const normalize = (params: QueryParamsRecord): string => {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([key, value]) => `${key}:${String(value)}`).join(',');
};

export const queryKeys = {
  meta: ['meta'] as const,
  health: ['health'] as const,

  discover: (section: string, params?: QueryParamsRecord) =>
    ['discover', section, normalize(params)] as const,

  catalogue: (params?: QueryParamsRecord) => ['catalogue', normalize(params)] as const,
  series: (slug: string) => ['series', slug] as const,
  seriesChapters: (slug: string, params?: QueryParamsRecord) =>
    ['series', slug, 'chapters', normalize(params)] as const,
  seriesCharacters: (slug: string, params?: QueryParamsRecord) =>
    ['series', slug, 'characters', normalize(params)] as const,
  seriesRatings: (slug: string) => ['series', slug, 'ratings'] as const,
  seriesReviews: (slug: string, params?: QueryParamsRecord) =>
    ['series', slug, 'reviews', normalize(params)] as const,
  similar: (slug: string, params?: QueryParamsRecord) =>
    ['series', slug, 'similar', normalize(params)] as const,

  character: (id: number) => ['character', id] as const,
  characterRatings: (id: number, params?: QueryParamsRecord) =>
    ['character', id, 'ratings', normalize(params)] as const,
  characterReviews: (id: number, params?: QueryParamsRecord) =>
    ['character', id, 'reviews', normalize(params)] as const,
  chapter: (id: number) => ['chapter', id] as const,

  tags: ['tags'] as const,
  tagsByType: (type: string) => ['tags', type] as const,
  availableTags: (params?: QueryParamsRecord) => ['tags', 'available', normalize(params)] as const,

  search: (params?: QueryParamsRecord) => ['search', normalize(params)] as const,
  chapterSearch: (params?: QueryParamsRecord) => ['chapter-search', normalize(params)] as const,

  lists: (params?: QueryParamsRecord) => ['lists', normalize(params)] as const,
  list: (username: string, slug: string) => ['lists', username, slug] as const,

  activity: (params?: QueryParamsRecord) => ['activity', normalize(params)] as const,

  stats: ['stats'] as const,
  leaderboard: (params?: QueryParamsRecord) => ['leaderboard', normalize(params)] as const,

  profile: (uid: string) => ['profile', uid] as const,
  userRatings: (uid: string, params?: QueryParamsRecord) =>
    ['profile', uid, 'ratings', normalize(params)] as const,
  userReviews: (uid: string, params?: QueryParamsRecord) =>
    ['profile', uid, 'reviews', normalize(params)] as const,
  userTracking: (uid: string, params?: QueryParamsRecord) =>
    ['profile', uid, 'tracking', normalize(params)] as const,
  userLists: (uid: string, params?: QueryParamsRecord) =>
    ['profile', uid, 'lists', normalize(params)] as const,
  userContributions: (uid: string, params?: QueryParamsRecord) =>
    ['profile', uid, 'contributions', normalize(params)] as const,

  me: ['me'] as const,
  myRatings: (params?: QueryParamsRecord) => ['me', 'ratings', normalize(params)] as const,
  myFavorites: (params?: QueryParamsRecord) => ['me', 'favorites', normalize(params)] as const,

  tracking: (params?: QueryParamsRecord) => ['tracking', normalize(params)] as const,
  trackingEntry: (identifier: string) => ['tracking', 'entry', identifier] as const,
} as const;
