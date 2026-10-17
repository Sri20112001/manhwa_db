export const LIMITS = {
  pageMax: 1000,
  searchPageMax: 100,
  limitMax: 100,
  limitDefault: 20,
  batchMax: 50,
  randomMax: 10,
  tagsPerRequest: 100,
} as const;

export const READ_RATE = {
  tokens: 100,
  intervalMs: 60_000,
} as const;

export const WRITE_RATE = {
  minute: { tokens: 30, intervalMs: 60_000 },
  hour: { tokens: 500, intervalMs: 3_600_000 },
} as const;

export const RETRY = {
  queueMaxAttempts: 8,
  baseBackoffMs: 1_000,
  maxBackoffMs: 5 * 60_000,
} as const;
