import type { PornhwaDTO, PornhwaDetailDTO } from '@/api/endpoints/catalogue';
import type { TrackingEntryDTO, TrackingStatusValue } from '@/api/endpoints/tracking';
import type { TrackingStatus } from '@/shared/constants/status';
import type { Creator, Listing, Orientation, Series, SeriesDetail, TrackingEntry } from '@/shared/types/models';

function asStatus(value: string | null | undefined): Series['status'] {
  if (value === 'On Going' || value === 'Completed' || value === 'Hiatus') return value;
  return null;
}

function asOrientation(value: string | null | undefined): Orientation {
  if (value === 'yaoi' || value === 'yuri') return value;
  return null;
}

function asListing(value: string | null | undefined): Listing {
  return value === 'reader_only' ? 'reader_only' : 'public';
}

function toCreator(dto: PornhwaDTO['creators'] extends (infer T)[] | undefined ? T : never): Creator {
  return {
    id: dto.id ?? 0,
    canonicalName: dto.canonicalName ?? '',
    aliases: dto.aliases ?? [],
    role: dto.role === 'author' ? 'author' : 'artist',
  };
}

export function toSeries(dto: PornhwaDTO): Series {
  return {
    id: dto.id ?? 0,
    title: dto.title ?? 'Untitled',
    slug: dto.slug ?? '',
    coverImage: dto.coverImage ?? null,
    status: asStatus(dto.status),
    orientation: asOrientation(dto.orientation),
    description: dto.description ?? '',
    artists: dto.artists ?? [],
    authors: dto.authors ?? [],
    releaseYear: dto.releaseYear ?? null,
    endYear: dto.endYear ?? null,
    genreTags: dto.genreTags ?? [],
    averageRating: dto.averageRating ?? null,
    totalRatings: dto.totalRatings ?? 0,
    chapterCount: dto.chapterCount ?? 0,
    totalChapters: dto.totalChapters ?? null,
    listing: asListing(undefined),
    updatedAt: dto.updatedAt ?? null,
  };
}

export function toSeriesFromHit(hit: {
  id?: number;
  title?: string;
  slug?: string;
  coverImage?: string | null;
  status?: string | null;
  orientation?: string | null;
}): Series {
  return toSeries(hit as unknown as PornhwaDTO);
}

export function toSeriesDetail(dto: PornhwaDetailDTO): SeriesDetail {
  return {
    ...toSeries(dto),
    dataStatus: dto.dataStatus ?? null,
    alternativeTitles: dto.alternativeTitles ?? [],
    externalLinks: (dto.externalLinks ?? [])
      .filter((link) => link.url != null)
      .map((link) => ({ siteName: link.siteName ?? '', url: link.url ?? '' })),
    creators: (dto.creators ?? []).map(toCreator),
  };
}

export function toTrackingStatus(value: TrackingStatusValue | string | null | undefined): TrackingStatus {
  const statuses: TrackingStatus[] = [
    'reading',
    'completed',
    'dropped',
    'plan_to_read',
    'on_hold',
    're_reading',
  ];
  const found = statuses.find((candidate) => candidate === value);
  return found ?? 'reading';
}

export function toTrackingEntry(dto: TrackingEntryDTO): TrackingEntry {
  const series = dto.pornhwa;
  return {
    id: dto.id ?? 0,
    series: {
      id: series?.id ?? 0,
      title: series?.title ?? 'Untitled',
      slug: series?.slug ?? '',
      coverImage: series?.coverImage ?? null,
      status: asStatus(series?.status),
      totalChapters: series?.totalChapters ?? null,
      genreTags: series?.genreTags ?? [],
      listing: asListing(series?.listing),
    },
    status: toTrackingStatus(dto.status),
    currentChapter: dto.currentChapter ?? null,
    startedAt: dto.startedAt ?? null,
    finishedAt: dto.finishedAt ?? null,
    notes: dto.notes ?? null,
    timesCompleted: dto.timesCompleted ?? 0,
    priority: dto.priority ?? null,
    isPrivate: dto.isPrivate ?? false,
    hasReview: dto.hasReview ?? false,
    updatedAt: dto.updatedAt ?? '',
  };
}
