import type {
  FollowUserDTO,
  UserContributionDTO,
  UserRatingDTO,
  UserReviewDTO,
} from '@/api/endpoints/users';
import type {
  ContributionStats,
  FollowUser,
  Profile,
  UserContribution,
  UserRating,
  UserReview,
} from '@/shared/types/models';

export function toProfile(dto: {
  uid?: string;
  username?: string;
  avatarImage?: string | null;
  createdAt?: string;
  bio?: string | null;
  trackingPublic?: boolean;
  followerCount?: number;
  followingCount?: number;
  isEditor?: boolean;
}): Profile {
  return {
    uid: dto.uid ?? '',
    username: dto.username ?? 'Unknown',
    avatarImage: dto.avatarImage ?? null,
    createdAt: dto.createdAt ?? '',
    bio: dto.bio ?? null,
    trackingPublic: dto.trackingPublic ?? false,
    followerCount: dto.followerCount ?? 0,
    followingCount: dto.followingCount ?? 0,
    isEditor: dto.isEditor ?? false,
  };
}

export function toContributionStats(dto: {
  seriesAdded?: number;
  editsApproved?: number;
  reviewsWritten?: number;
  ratingsGiven?: number;
  galleryUploads?: number;
  publicLists?: number;
  characterRatingsGiven?: number;
  characterReviewsWritten?: number;
}): ContributionStats {
  return {
    seriesAdded: dto.seriesAdded ?? 0,
    editsApproved: dto.editsApproved ?? 0,
    reviewsWritten: dto.reviewsWritten ?? 0,
    ratingsGiven: dto.ratingsGiven ?? 0,
    publicLists: dto.publicLists ?? 0,
    characterRatingsGiven: dto.characterRatingsGiven ?? 0,
    characterReviewsWritten: dto.characterReviewsWritten ?? 0,
  };
}

export function toUserRating(dto: UserRatingDTO): UserRating {
  return {
    pornhwaId: dto.pornhwaId ?? 0,
    title: dto.pornhwaTitle ?? 'Untitled',
    slug: dto.pornhwaSlug ?? '',
    coverImage: dto.pornhwaCover ?? null,
    rating: dto.rating ?? 0,
    pendingRating: dto.pendingRating ?? null,
    createdAt: dto.createdAt ?? '',
  };
}

export function toUserReview(dto: UserReviewDTO): UserReview {
  return {
    id: dto.id ?? 0,
    pornhwaId: dto.pornhwaId ?? 0,
    title: dto.pornhwaTitle ?? 'Untitled',
    slug: dto.pornhwaSlug ?? '',
    coverImage: dto.pornhwaCover ?? null,
    reviewText: dto.reviewText ?? '',
    rating: dto.rating ?? null,
    isEdited: dto.isEdited ?? false,
    createdAt: dto.createdAt ?? '',
    updatedAt: dto.updatedAt ?? '',
  };
}

export function toUserContribution(dto: UserContributionDTO): UserContribution {
  return {
    eventId: dto.eventId ?? String(dto.id ?? ''),
    type: dto.type === 'edit' ? 'edit' : 'series',
    pornhwaId: dto.pornhwaId ?? 0,
    title: dto.pornhwaTitle ?? 'Untitled',
    slug: dto.pornhwaSlug ?? '',
    coverImage: dto.pornhwaCover ?? null,
    createdAt: dto.createdAt ?? '',
  };
}

export function toFollowUser(dto: FollowUserDTO): FollowUser {
  return {
    uid: dto.uid ?? '',
    username: dto.username ?? 'Unknown',
    avatarImage: dto.avatarImage ?? null,
    bio: dto.bio ?? null,
    followedAt: dto.followedAt ?? '',
  };
}
