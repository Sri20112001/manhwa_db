import type { PublicationStatus } from '@/shared/constants/status';

export type { PublicationStatus };
export type SeriesStatus = PublicationStatus;

export interface RangeValue {
  min: number;
  max: number;
}

export interface BrowseFilters {
  status: PublicationStatus[];
  orientation: 'any' | 'yaoi' | 'yuri' | 'none';
  tags: string[];
  tagMode: 'any' | 'all';
  characterTags: string[];
  rating: RangeValue;
  year: RangeValue;
  chapters: RangeValue;
  sort: CatalogueSort;
  order: 'asc' | 'desc';
}

export type CatalogueSort =
  | 'title'
  | 'release_year'
  | 'created_at'
  | 'updated_at'
  | 'average_rating'
  | 'total_ratings'
  | 'chapter_count';

export const CATALOGUE_SORT_LABEL: Record<CatalogueSort, string> = {
  title: 'Title',
  release_year: 'Release year',
  created_at: 'Added',
  updated_at: 'Updated',
  average_rating: 'Rating',
  total_ratings: 'Ratings count',
  chapter_count: 'Chapters',
};

export const RATING_BOUNDS: RangeValue = { min: 0, max: 5 };
export const YEAR_BOUNDS: RangeValue = { min: 1995, max: 2026 };
export const CHAPTER_BOUNDS: RangeValue = { min: 0, max: 300 };

export const DEFAULT_FILTERS: BrowseFilters = {
  status: [],
  orientation: 'any',
  tags: [],
  tagMode: 'any',
  characterTags: [],
  rating: { ...RATING_BOUNDS },
  year: { ...YEAR_BOUNDS },
  chapters: { ...CHAPTER_BOUNDS },
  sort: 'title',
  order: 'asc',
};

export interface SearchQueryState {
  query: string;
  segment: 'series' | 'characters';
  recentSearches: string[];
}

export type LibraryStatusTab = 'reading' | 'plan_to_read' | 'completed' | 'on_hold' | 'dropped' | 're_reading';
export type LibrarySort = 'updated' | 'title' | 'priority' | 'rating';
export type ViewMode = 'grid' | 'list';

export interface ListEditorDraft {
  id?: number;
  title: string;
  description: string;
  isPublic: boolean;
  isCollaborative: boolean;
  itemIds: number[];
}

export interface ReviewEditorDraft {
  identifier: string;
  text: string;
  rating: number | null;
}

export interface ReaderPrefs {
  view: 'list' | 'grid';
  lastChapter: Record<string, number>;
}

export type ThemeMode = 'dark' | 'amoled' | 'light';
export type TextSize = 'compact' | 'default' | 'large';
export type AccentColor = 'rose' | 'violet' | 'sapphire' | 'emerald' | 'amber' | 'crimson';

export interface ToastMessage {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'error';
}
