/**
 * Rate limiting with a swappable backend behind one stable interface
 * (`isRateLimited(key)`).
 *
 * DEVELOPMENT FALLBACK (always available, zero config):
 *   In-memory Map, keyed by client IP, capped at 5 submissions per 10
 *   minutes. This is fine for a single warm Node process, but it is NOT
 *   durable across serverless cold starts or multiple instances/regions —
 *   every instance has its own independent counter, so a distributed
 *   deployment (Vercel, most serverless hosts) effectively gets a much
 *   higher real-world limit than 5/10min per visitor.
 *
 * PRODUCTION-SAFE ADAPTER (Upstash Redis REST API):
 *   If RATE_LIMIT_REDIS_URL and RATE_LIMIT_REDIS_TOKEN are set (copy these
 *   from an Upstash Redis database's REST API credentials), rate limiting
 *   is enforced against that shared store instead, using a simple
 *   fixed-window counter (INCR + EXPIRE via the REST API — no redis client
 *   dependency required, just fetch()). This is what actually protects a
 *   distributed/serverless deployment: every instance shares the same
 *   counter.
 *
 * If neither variable is set, this file silently falls back to the
 * in-memory limiter and does NOT claim to protect a distributed deployment
 * — see the README / DEPLOYMENT.md for why that matters before launch.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const WINDOW_SECONDS = 10 * 60;
const MAX_HITS = 5; // 5 submissions per key per window

const memoryHits = new Map<string, number[]>();

function isRateLimitedInMemory(key: string): boolean {
  const now = Date.now();
  const existing = (memoryHits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  existing.push(now);
  memoryHits.set(key, existing);
  return existing.length > MAX_HITS;
}

function redisConfigured(): boolean {
  return Boolean(process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN);
}

async function isRateLimitedRedis(key: string): Promise<boolean> {
  const url = process.env.RATE_LIMIT_REDIS_URL;
  const token = process.env.RATE_LIMIT_REDIS_TOKEN;
  if (!url || !token) return isRateLimitedInMemory(key); // safety net, should be unreachable

  try {
    // Upstash REST pipeline: INCR the window-bucketed key, then set its
    // expiry so the window resets on its own. Fixed-window counting is
    // simple and sufficient for form-submission abuse, not a sliding log.
    const bucket = Math.floor(Date.now() / WINDOW_MS);
    const redisKey = `graphikosx:rl:${key}:${bucket}`;
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(WINDOW_SECONDS)],
      ]),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Redis REST responded ${res.status}`);
    const [incrResult] = (await res.json()) as { result: number }[];
    return incrResult.result > MAX_HITS;
  } catch (err) {
    // A rate-limit backend outage should never take the whole site's forms
    // down. Fail open to the in-memory limiter rather than blocking every
    // submission.
    console.error("[GraphikosX RateLimit] Redis backend failed, falling back to in-memory:", err);
    return isRateLimitedInMemory(key);
  }
}

export async function isRateLimited(key: string): Promise<boolean> {
  if (redisConfigured()) return isRateLimitedRedis(key);
  return isRateLimitedInMemory(key);
}

/** True when rate limiting is backed by a durable, shared store. Surfaced in the QA report, not user-facing. */
export function isRateLimitProductionSafe(): boolean {
  return redisConfigured();
}
