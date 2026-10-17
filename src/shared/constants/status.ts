export type PublicationStatus = 'On Going' | 'Completed' | 'Hiatus';

export type TrackingStatus =
  | 'reading'
  | 'completed'
  | 'dropped'
  | 'plan_to_read'
  | 'on_hold'
  | 're_reading';

export const TRACKING_STATUSES: readonly TrackingStatus[] = [
  'reading',
  'plan_to_read',
  'completed',
  'on_hold',
  'dropped',
  're_reading',
];

export const TRACKING_STATUS_LABEL: Record<TrackingStatus, string> = {
  reading: 'Reading',
  plan_to_read: 'Plan to read',
  completed: 'Completed',
  on_hold: 'On hold',
  dropped: 'Dropped',
  re_reading: 'Re-reading',
};

export const PUBLICATION_STATUSES: readonly PublicationStatus[] = [
  'On Going',
  'Completed',
  'Hiatus',
];

export const PUBLICATION_STATUS_LABEL: Record<PublicationStatus, string> = {
  'On Going': 'Ongoing',
  Completed: 'Completed',
  Hiatus: 'Hiatus',
};

export const PRIORITY_LABEL: Record<number, string> = {
  1: 'Low',
  2: 'Medium-low',
  3: 'Medium',
  4: 'Medium-high',
  5: 'High',
};
