import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type MemoryState = {
  count: number;
  timestamp: number;
};

const memoryStore = new Map<string, MemoryState>();
const upstashLimiters = new Map<string, Ratelimit>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function getUpstashLimiter(maxRequests: number, windowMs: number) {
  if (!redis) return null;
  const windowMinutes = Math.max(1, Math.ceil(windowMs / 60000));
  const key = `${maxRequests}:${windowMinutes}`;
  const existing = upstashLimiters.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowMinutes} m`),
    analytics: true,
  });
  upstashLimiters.set(key, limiter);
  return limiter;
}

export async function isRateLimited(
  key: string,
  config: { maxRequests: number; windowMs: number },
): Promise<boolean> {
  const upstash = getUpstashLimiter(config.maxRequests, config.windowMs);
  if (upstash) {
    const { success } = await upstash.limit(key);
    return !success;
  }

  const now = Date.now();
  const state = memoryStore.get(key);

  if (!state) {
    memoryStore.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (now - state.timestamp > config.windowMs) {
    memoryStore.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (state.count >= config.maxRequests) {
    return true;
  }

  state.count += 1;
  return false;
}
