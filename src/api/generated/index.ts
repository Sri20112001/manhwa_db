import type { components, operations, paths } from './schema';

export type { components, operations, paths, webhooks } from './schema';

export type Components = components;
export type Operations = operations;
export type Paths = paths;

export type Schemas = components['schemas'];
export type Responses = components['responses'];
export type Parameters = components['parameters'];
export type Headers = components['headers'];

export type Schema<K extends keyof Schemas> = Schemas[K];
export type ResponseDef<K extends keyof Responses> = Responses[K];

export type Operation<K extends keyof Operations> = Operations[K];
export type OperationRequestBody<K extends keyof Operations> =
  Operations[K]['requestBody'];
export type OperationResponses<K extends keyof Operations> =
  Operations[K]['responses'];
export type OperationResponse<
  K extends keyof Operations,
  S extends keyof Operations[K]['responses'],
> = Operations[K]['responses'][S] extends {
  content: { 'application/json': infer Body };
}
  ? Body
  : never;

export type CreatorDto = Schema<'Creator'>;
export type PornhwaDto = Schema<'Pornhwa'>;
export type PornhwaDetailDto = Schema<'PornhwaDetail'>;
export type SeriesReferenceDto = Schema<'SeriesReference'>;
export type ChapterSearchChapterDto = Schema<'ChapterSearchChapter'>;
export type CharacterDto = Schema<'Character'>;
export type ChapterDto = Schema<'Chapter'>;
export type RatingAggregateDto = Schema<'RatingAggregate'>;
export type ReviewDto = Schema<'Review'>;
export type CharacterRatingDto = Schema<'CharacterRating'>;
export type PaginationDto = Schema<'Pagination'>;
export type ListSummaryDto = Schema<'ListSummary'>;
export type ListCollaboratorDto = Schema<'ListCollaborator'>;
export type ListItemDto = Schema<'ListItem'>;
export type ListDetailDto = Schema<'ListDetail'>;
export type ActivityFeedItemDto = Schema<'ActivityFeedItem'>;
export type ApiStatsDto = Schema<'ApiStats'>;
export type ErrorDto = Schema<'Error'>;
export type TrackingStatusDto = Schema<'TrackingStatus'>;
export type PornhwaListingDto = Schema<'PornhwaListing'>;
export type TrackingEntryPornhwaDto = Schema<'TrackingEntryPornhwa'>;
export type TrackingEntryDto = Schema<'TrackingEntry'>;
export type TrackingUpsertInputDto = Schema<'TrackingUpsertInput'>;
export type CharacterReviewDto = Schema<'CharacterReview'>;
export type PublicUserProfileDto = Schema<'PublicUserProfile'>;
export type UserContributionStatsDto = Schema<'UserContributionStats'>;
export type UserRatingDto = Schema<'UserRating'>;
export type MyRatingDto = Schema<'MyRating'>;
export type UserReviewDto = Schema<'UserReview'>;
export type UserCharacterRatingDto = Schema<'UserCharacterRating'>;
export type UserCharacterReviewDto = Schema<'UserCharacterReview'>;
export type UserTrackingEntryDto = Schema<'UserTrackingEntry'>;
export type UserListDto = Schema<'UserList'>;
export type UserContributionDto = Schema<'UserContribution'>;
export type UserFollowUserDto = Schema<'UserFollowUser'>;
export type ActivityActorDto = Schema<'ActivityActor'>;
export type ActivitySeriesTargetDto = Schema<'ActivitySeriesTarget'>;
export type ActivityCharacterTargetDto = Schema<'ActivityCharacterTarget'>;
export type ActivityListTargetDto = Schema<'ActivityListTarget'>;
export type ListSceneCharacterDto = Schema<'ListSceneCharacter'>;
