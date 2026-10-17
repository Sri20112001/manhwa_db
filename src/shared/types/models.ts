import type { PublicationStatus, TrackingStatus } from '@/shared/constants/status';

export type Listing = 'public' | 'reader_only';
export type Orientation = 'yaoi' | 'yuri' | null;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  nextUrl: string | null;
  prevUrl: string | null;
  firstUrl: string;
  lastUrl: string;
  truncated: boolean;
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

export interface Creator {
  id: number;
  canonicalName: string;
  aliases: string[];
  role: 'artist' | 'author';
}

export interface ExternalLink {
  siteName: string;
  url: string;
}

export interface Series {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  status: PublicationStatus | null;
  orientation: Orientation;
  description: string;
  artists: string[];
  authors: string[];
  releaseYear: number | null;
  endYear: number | null;
  genreTags: string[];
  averageRating: number | null;
  totalRatings: number;
  chapterCount: number;
  totalChapters: number | null;
  listing: Listing;
  updatedAt: string | null;
}

export interface SeriesDetail extends Series {
  dataStatus: 'complete' | 'processing' | null;
  alternativeTitles: string[];
  externalLinks: ExternalLink[];
  creators: Creator[];
}

export interface SeriesReference {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  status?: PublicationStatus | null;
  totalChapters?: number | null;
  genreTags?: string[];
  listing?: Listing;
}

export interface Character {
  id: number;
  name: string;
  image: string | null;
  role: 'Main' | 'Supporting' | null;
  tags: string[];
  alternativeNames: string[];
  description: string | null;
  series: SeriesReference | null;
}

export interface Chapter {
  id: number;
  pornhwaId: number;
  chapterStart: number;
  chapterEnd: number | null;
  description: string | null;
  tags: string[];
  characters: Character[];
}

export interface RatingAggregate {
  averageRating: number | null;
  totalRatings: number;
  ratingDistribution: Record<string, number>;
}

export interface Review {
  id: number;
  reviewText: string;
  isEdited: boolean;
  userDisplayName: string;
  uid: string | null;
  userRating: number | null;
  avatarImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListSummary {
  slug: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  likeCount: number;
  itemCount: number;
  coverImages: string[];
  uid: string;
  username: string | null;
  avatarImage: string | null;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCollaborator {
  uid: string;
  username: string;
  avatarImage: string | null;
  addedAt: string;
}

export interface ListItem {
  id: number;
  pornhwaId: number;
  position: number;
  title: string | null;
  slug: string | null;
  coverImage: string | null;
  status: string | null;
  notes: string | null;
  addedByUsername: string | null;
}

export interface ListDetail extends ListSummary {
  items: ListItem[];
  collaborators: ListCollaborator[];
}

export type ActivityEventType =
  | 'review_posted'
  | 'rating_set'
  | 'character_rating_set'
  | 'tracking_status_changed'
  | 'list_created'
  | 'list_item_added';

export type ActivityTarget =
  | { kind: 'pornhwa'; id: number; title: string; slug: string; coverImage: string | null }
  | { kind: 'character'; id: number; name: string; image: string | null }
  | { kind: 'list'; id: number; title: string; slug: string; username: string };

export interface ActivityItem {
  id: string;
  eventType: ActivityEventType;
  occurredAt: string;
  actor: { uid: string; username: string; avatarImage: string | null };
  target: ActivityTarget;
  rating: number | null;
  reviewText: string | null;
  trackingStatus: TrackingStatus | null;
}

export interface Profile {
  uid: string;
  username: string;
  avatarImage: string | null;
  createdAt: string;
  bio: string | null;
  trackingPublic: boolean;
  followerCount: number;
  followingCount: number;
  isEditor: boolean;
  contributionsCount?: number;
}

export interface ContributionStats {
  seriesAdded: number;
  editsApproved: number;
  reviewsWritten: number;
  ratingsGiven: number;
  publicLists: number;
  characterRatingsGiven: number;
  characterReviewsWritten: number;
}

export interface TrackingEntry {
  id: number;
  series: {
    id: number;
    title: string;
    slug: string;
    coverImage: string | null;
    status: PublicationStatus | null;
    totalChapters: number | null;
    genreTags: string[];
    listing: Listing;
  };
  status: TrackingStatus;
  currentChapter: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  notes: string | null;
  timesCompleted: number;
  priority: number | null;
  isPrivate: boolean;
  hasReview: boolean;
  updatedAt: string;
}

export interface UserRating {
  pornhwaId: number;
  title: string;
  slug: string;
  coverImage: string | null;
  rating: number;
  pendingRating: number | null;
  createdAt: string;
}

export interface UserReview {
  id: number;
  pornhwaId: number;
  title: string;
  slug: string;
  coverImage: string | null;
  reviewText: string;
  rating: number | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserList extends ListSummary {
  id: number;
}

export interface UserContribution {
  eventId: string;
  type: 'series' | 'edit';
  pornhwaId: number;
  title: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
}

export interface FollowUser {
  uid: string;
  username: string;
  avatarImage: string | null;
  bio: string | null;
  followedAt: string;
}

export interface CatalogueStats {
  totalPornhwa: number;
  totalCharacters: number;
  totalChapters: number;
  totalReviews: number;
  totalRatings: number;
  totalTags: { genre: number; character: number; chapter: number };
}

export interface LeaderboardRow {
  rank: number;
  uid: string;
  username: string;
  avatarImage: string | null;
  contributions: number;
  value: number;
}

export interface CatalogueInfo {
  version: string;
  docsUrl: string;
  openapiUrl: string;
  healthUrl: string;
}

export interface HealthStatus {
  status: string;
  version?: string;
  time?: string;
  [key: string]: unknown;
}
