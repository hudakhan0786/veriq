/**
 * High-performance In-Memory API Response Cache with TTL & Mutation Invalidation.
 * Fulfills statutory and responsiveness SLA by eliminating duplicate network calls
 * across page transitions while guaranteeing data freshness.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ApiCache {
  private static cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Retrieves a cached value if present and not expired.
   */
  public static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Stores a response in the cache with a specified TTL in milliseconds.
   */
  public static set<T>(key: string, data: T, ttlMs: number = 30000): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidates a specific key or all keys starting with a prefix.
   * Call this on any mutation (create/update/delete/adjudicate).
   */
  public static invalidate(prefix?: string): void {
    if (!prefix) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears the entire API cache.
   */
  public static clear(): void {
    this.cache.clear();
  }

  /**
   * Transparent cache wrapper for async fetch operations.
   */
  public static async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 30000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set<T>(key, data, ttlMs);
    return data;
  }
}

export default ApiCache;
