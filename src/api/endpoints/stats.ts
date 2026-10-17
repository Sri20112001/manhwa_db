import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { QueryParams } from './catalogue';

export interface ApiStatsDTO {
  totalPornhwa: number;
  totalCharacters: number;
  totalChapters: number;
  totalReviews: number;
  totalRatings: number;
  totalTags: { genre: number; character: number; chapter: number };
}

export interface LeaderboardRowDTO {
  rank: number;
  userId: string;
  username: string;
  avatarImage: string | null;
  total: number;
  seriesCount: number;
  editsCount: number;
  galleryCount: number;
  reviewsCount: number;
  isEditor: boolean;
}

export interface LeaderboardParams extends QueryParams {
  period?: 'week' | 'month' | 'year' | 'all';
  sort?: 'contributions' | 'gallery';
  page?: number;
  limit?: number;
}

export function getStats() {
  return apiRequest<Single<ApiStatsDTO>>({ url: '/stats' });
}

export function getLeaderboard(params: LeaderboardParams = {}) {
  return apiRequest<Paginated<LeaderboardRowDTO>>({ url: '/stats/leaderboard', params });
}
