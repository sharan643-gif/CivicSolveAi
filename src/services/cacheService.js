// CivicSolve AI — Ultra-Fast Client-Side Cache Layer
// Provides: TTL-based caching, request deduplication, stale-while-revalidate,
// optimistic update support, and automatic cache invalidation.

const cache = new Map();
const inflight = new Map(); // dedup in-flight requests
const listeners = new Map(); // subscription-based cache invalidation

// ─── Default TTLs (ms) ──────────────────────────────────────────────────────
const DEFAULT_TTL = 30_000;        // 30s — general data
const STATS_TTL = 15_000;          // 15s — stats change more often
const PROFILE_TTL = 60_000;        // 60s — profiles rarely change
const STALE_MULTIPLIER = 3;        // serve stale for 3x TTL while revalidating

// ─── Cache Entry Shape ──────────────────────────────────────────────────────
// { data, timestamp, ttl, subscribers: Set }

export function getCacheKey(prefix, params = {}) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${JSON.stringify(params[k])}`)
    .join('&');
  return sorted ? `${prefix}:${sorted}` : prefix;
}

/**
 * Get data from cache or fetch fresh.
 * If data is stale, serves stale immediately and revalidates in background.
 * If data is fresh, returns instantly with zero network cost.
 * If data is missing, fetches and caches.
 */
export async function cachedFetch(key, fetchFn, ttl = DEFAULT_TTL) {
  const now = Date.now();
  const entry = cache.get(key);

  // Fresh cache hit — instant return, zero network
  if (entry && (now - entry.timestamp) < entry.ttl) {
    return entry.data;
  }

  // Stale but available — serve stale, revalidate in background (SWR)
  if (entry && (now - entry.timestamp) < entry.ttl * STALE_MULTIPLIER) {
    // Don't await — fire and forget background revalidation
    revalidateInBackground(key, fetchFn, ttl);
    return entry.data;
  }

  // No cache or fully expired — deduplicate concurrent requests
  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = fetchFn()
    .then(data => {
      cache.set(key, { data, timestamp: Date.now(), ttl });
      inflight.delete(key);
      notifySubscribers(key, data);
      return data;
    })
    .catch(err => {
      inflight.delete(key);
      // If we have stale data, return it instead of failing
      if (entry) {
        return entry.data;
      }
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

async function revalidateInBackground(key, fetchFn, ttl) {
  if (inflight.has(key)) return; // already revalidating
  const promise = fetchFn()
    .then(data => {
      cache.set(key, { data, timestamp: Date.now(), ttl });
      inflight.delete(key);
      notifySubscribers(key, data);
    })
    .catch(() => {
      inflight.delete(key);
    });
  inflight.set(key, promise);
}

// ─── Optimistic Update ──────────────────────────────────────────────────────
// Update cache immediately before server confirms. Rolls back on failure.
export function optimisticUpdate(key, updater, rollbackData) {
  const entry = cache.get(key);
  if (!entry) return;

  const previousData = entry.data;
  const newData = typeof updater === 'function' ? updater(previousData) : updater;
  cache.set(key, { ...entry, data: newData, timestamp: Date.now() });
  notifySubscribers(key, newData);

  return {
    rollback: () => {
      cache.set(key, { ...entry, data: rollbackData ?? previousData, timestamp: entry.timestamp });
      notifySubscribers(key, rollbackData ?? previousData);
    }
  };
}

// ─── Cache Invalidation ─────────────────────────────────────────────────────
export function invalidateCache(key) {
  cache.delete(key);
  inflight.delete(key);
}

export function invalidatePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      inflight.delete(key);
    }
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(prefix)) {
      inflight.delete(key);
    }
  }
}

export function invalidateAll() {
  cache.clear();
  inflight.clear();
}

// ─── Subscription-Based Reactivity ──────────────────────────────────────────
export function subscribe(key, callback) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key).add(callback);
  return () => {
    const subs = listeners.get(key);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) listeners.delete(key);
    }
  };
}

function notifySubscribers(key, data) {
  const subs = listeners.get(key);
  if (subs) {
    for (const cb of subs) {
      try { cb(data); } catch (e) { /* ignore */ }
    }
  }
}

// ─── Pre-warming ────────────────────────────────────────────────────────────
// Fire off multiple cache fetches in parallel to warm the cache on app load.
export async function warmCache(entries) {
  return Promise.allSettled(
    entries.map(({ key, fetchFn, ttl }) => cachedFetch(key, fetchFn, ttl))
  );
}

// ─── Cache Stats (for debugging) ───────────────────────────────────────────
export function getCacheStats() {
  return {
    size: cache.size,
    inflight: inflight.size,
    subscribers: listeners.size,
    keys: Array.from(cache.keys()),
  };
}
