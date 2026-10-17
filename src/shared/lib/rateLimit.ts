import { READ_RATE, WRITE_RATE } from '@/shared/constants/caps';

interface BucketOptions {
  tokens: number;
  intervalMs: number;
}

class TokenBucket {
  private tokens: number;
  private lastRefill = Date.now();

  constructor(private readonly options: BucketOptions) {
    this.tokens = options.tokens;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    if (elapsed <= 0) return;
    const rate = this.options.tokens / this.options.intervalMs;
    this.tokens = Math.min(this.options.tokens, this.tokens + elapsed * rate);
    this.lastRefill = now;
  }

  msUntilAvailable(): number {
    this.refill();
    if (this.tokens >= 1) return 0;
    const rate = this.options.tokens / this.options.intervalMs;
    return Math.ceil((1 - this.tokens) / rate);
  }

  tryConsume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  freeze(ms: number): void {
    this.tokens = 0;
    this.lastRefill = Date.now() + ms;
  }
}

const readBucket = new TokenBucket(READ_RATE);
const writeMinuteBucket = new TokenBucket(WRITE_RATE.minute);
const writeHourBucket = new TokenBucket(WRITE_RATE.hour);

export type RateClass = 'read' | 'write';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function claim(bucket: TokenBucket): Promise<void> {
  let guard = 0;
  while (!bucket.tryConsume()) {
    const wait = Math.max(16, bucket.msUntilAvailable());
    await delay(wait);
    guard += 1;
    if (guard > 600) return;
  }
}

export async function acquireRead(): Promise<void> {
  await claim(readBucket);
}

export async function acquireWrite(): Promise<void> {
  await claim(writeMinuteBucket);
  await claim(writeHourBucket);
}

export function freezeReads(ms: number): void {
  readBucket.freeze(ms);
}

export function freezeWrites(ms: number): void {
  writeMinuteBucket.freeze(ms);
  writeHourBucket.freeze(ms);
}

export function freezeAll(ms: number): void {
  freezeReads(ms);
  freezeWrites(ms);
}
