import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { components } from '../schema';
import type { QueryParams } from './catalogue';

export type PublicUserProfileDTO = components['schemas']['PublicUserProfile'];
export type UserContributionStatsDTO = components['schemas']['UserContributionStats'];
export type UserRatingDTO = components['schemas']['MyRating'];
export type UserReviewDTO = components['schemas']['UserReview'];
export type UserCharacterRatingDTO = components['schemas']['UserCharacterRating'];
export type UserCharacterReviewDTO = components['schemas']['UserCharacterReview'];
export type UserTrackingDTO = components['schemas']['UserTrackingEntry'];
export type UserListDTO = components['schemas']['UserList'];
export type UserContributionDTO = components['schemas']['UserContribution'];
export type FollowUserDTO = components['schemas']['UserFollowUser'];

export interface MeDTO {
  uid: string;
  username: string;
  scopes: string[];
  limits: { requestsPerMinute: number; mutationsPerMinute: number; mutationsPerHour: number };
}

export interface FavoriteDTO {
  id: number;
  type: 'pornhwa' | 'character' | 'chapter';
  resourceId: number;
  createdAt: string;
}

export interface PublicProfileDTO {
  profile: PublicUserProfileDTO;
  stats: UserContributionStatsDTO;
}

export function getMe() {
  return apiRequest<Single<MeDTO>>({ url: '/me' });
}

export function getMyRatings(params: QueryParams = {}) {
  return apiRequest<Paginated<UserRatingDTO>>({ url: '/me/ratings', params });
}

export function getMyFavorites(params: QueryParams = {}) {
  return apiRequest<Paginated<FavoriteDTO>>({ url: '/me/favorites', params });
}

export function getPublicProfile(uid: string) {
  return apiRequest<Single<PublicProfileDTO>>({
    url: `/u/${encodeURIComponent(uid)}/profile`,
  });
}

export function getUserRatings(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserRatingDTO>>({
    url: `/u/${encodeURIComponent(uid)}/ratings`,
    params,
  });
}

export function getUserReviews(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserReviewDTO>>({
    url: `/u/${encodeURIComponent(uid)}/reviews`,
    params,
  });
}

export function getUserCharacterRatings(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserCharacterRatingDTO>>({
    url: `/u/${encodeURIComponent(uid)}/character-ratings`,
    params,
  });
}

export function getUserCharacterReviews(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserCharacterReviewDTO>>({
    url: `/u/${encodeURIComponent(uid)}/character-reviews`,
    params,
  });
}

export function getUserTracking(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserTrackingDTO>>({
    url: `/u/${encodeURIComponent(uid)}/tracking`,
    params,
  });
}

export function getUserLists(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserListDTO>>({
    url: `/u/${encodeURIComponent(uid)}/lists`,
    params,
  });
}

export function getUserContributions(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<UserContributionDTO>>({
    url: `/u/${encodeURIComponent(uid)}/contributions`,
    params,
  });
}

export function getUserFollowers(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<FollowUserDTO>>({
    url: `/u/${encodeURIComponent(uid)}/followers`,
    params,
  });
}

export function getUserFollowing(uid: string, params: QueryParams = {}) {
  return apiRequest<Paginated<FollowUserDTO>>({
    url: `/u/${encodeURIComponent(uid)}/following`,
    params,
  });
}
