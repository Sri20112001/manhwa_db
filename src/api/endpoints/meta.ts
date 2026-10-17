import { apiRequest } from '../client';
import type { Single } from '../envelope';

export interface ApiInfoDTO {
  version: string;
  docs: string;
  openapi: string;
  health: string;
}

export function getApiInfo() {
  return apiRequest<Single<ApiInfoDTO>>({ url: '/' });
}
