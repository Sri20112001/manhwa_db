import { apiRequest } from '../client';

export interface HealthDTO {
  status: string;
  version: string;
  timestamp: string;
  requestId: string;
}

export function getHealth() {
  return apiRequest<HealthDTO>({ url: '/health' });
}
