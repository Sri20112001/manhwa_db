import { apiRequest } from '../client';
import type { Paginated } from '../envelope';
import type { components } from '../schema';
import type { QueryParams } from './catalogue';

export type ActivityFeedItemDTO = components['schemas']['ActivityFeedItem'];

export interface ActivityParams extends QueryParams {
  page?: number;
  limit?: number;
  type?: string;
  uid?: string;
}

export function getActivityFeed(params: ActivityParams = {}) {
  return apiRequest<Paginated<ActivityFeedItemDTO>>({ url: '/activity', params });
}
