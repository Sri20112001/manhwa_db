import type { ApiStatsDTO, LeaderboardRowDTO } from '@/api/endpoints/stats';
import type { CatalogueStats, LeaderboardRow } from '@/shared/types/models';

export function toCatalogueStats(dto: ApiStatsDTO): CatalogueStats {
  return {
    totalPornhwa: dto.totalPornhwa ?? 0,
    totalCharacters: dto.totalCharacters ?? 0,
    totalChapters: dto.totalChapters ?? 0,
    totalReviews: dto.totalReviews ?? 0,
    totalRatings: dto.totalRatings ?? 0,
    totalTags: {
      genre: dto.totalTags?.genre ?? 0,
      character: dto.totalTags?.character ?? 0,
      chapter: dto.totalTags?.chapter ?? 0,
    },
  };
}

export function toLeaderboardRow(dto: LeaderboardRowDTO): LeaderboardRow {
  const contributions =
    (dto.seriesCount ?? 0) + (dto.editsCount ?? 0) + (dto.reviewsCount ?? 0) + (dto.galleryCount ?? 0);
  return {
    rank: dto.rank ?? 0,
    uid: dto.userId ?? '',
    username: dto.username ?? 'Unknown',
    avatarImage: dto.avatarImage ?? null,
    contributions,
    value: dto.total ?? contributions,
  };
}
