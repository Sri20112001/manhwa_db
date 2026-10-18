import { apiRequest } from '../client';
import type { Paginated, Single } from '../envelope';
import type { ReviewDto } from '../generated';
import type { QueryParams } from './catalogue';

export type ReviewDTO = ReviewDto;

export interface WriteReviewInput {
  pornhwaId: number;
  reviewText: string;
  rating?: number | null;
}

export interface UpdateReviewInput {
  id: number;
  reviewText: string;
  rating?: number | null;
}

export function listReviews(params: QueryParams = {}) {
  return apiRequest<Paginated<ReviewDTO>>({ url: '/reviews', params });
}

// The public v1.3.0 document exposes review and rating reads plus the
// library-rating write; these review write routes match the app's target
// contract and surface a clear error when the deployment does not expose them.
export function createReview(input: WriteReviewInput) {
  return apiRequest<Single<ReviewDTO>>({ url: '/reviews', method: 'POST', data: input });
}

export function updateReview(input: UpdateReviewInput) {
  return apiRequest<Single<ReviewDTO>>({ url: '/reviews', method: 'PATCH', data: input });
}

export function deleteReview(input: { id: number }) {
  return apiRequest<void>({ url: '/reviews', method: 'DELETE', data: input });
}

export function createRating(input: { pornhwaId: number; rating: number }) {
  return apiRequest<Single<{ rating: number }>>({
    url: '/ratings',
    method: 'POST',
    data: input,
  });
}

export function removeRating(input: { pornhwaId: number }) {
  return apiRequest<void>({ url: '/ratings', method: 'DELETE', data: input });
}
