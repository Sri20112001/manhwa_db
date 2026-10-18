import { apiRequest } from '../client';
import type { Paginated } from '../envelope';
import type { ActivityFeedItemDto } from '../generated';
import type { QueryParams } from './catalogue';

export type ActivityFeedItemDTO = ActivityFeedItemDto;

export interface ActivityParams extends QueryParams {
  page?: number;
  limit?: number;
  type?: string;
  uid?: string;
}

export function getActivityFeed(params: ActivityParams = {}) {
  return apiRequest<Paginated<ActivityFeedItemDTO>>({ url: '/activity', params });
}
