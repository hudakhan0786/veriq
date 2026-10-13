"""Resilient In-Memory & Redis Cache/Queue Layer (SIH26034 - Nirikshak)

Provides high-throughput caching and job status queuing to minimize database lock contention
and disk I/O when multiple officers conduct simultaneous multi-facet package inspections.

Architecture & Mode Resilience (ADL-13):
- Cloud / Production (Mode A): Connects to Redis via REDIS_URL when configured.
- Field Laptop Offline (Mode B): Transparently falls back to a thread-safe in-memory LRU cache.
Zero external Redis daemon required for offline mobile inspections.
"""

from collections import OrderedDict
import json
import logging
import os
import threading
import time
from typing import Any, Dict, List, Optional, Union

logger = logging.getLogger(__name__)

# Optional Redis import
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    redis = None  # type: ignore
    REDIS_AVAILABLE = False


class InMemoryLRUCache:
    """Thread-safe in-memory LRU cache for Mode B offline resilience."""

    def __init__(self, capacity: int = 512, default_ttl_seconds: int = 3600):
        self.capacity = capacity
        self.default_ttl = default_ttl_seconds
        self._cache: OrderedDict[str, Tuple[Any, float]] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key not in self._cache:
                return None
            val, expiry = self._cache[key]
            if time.time() > expiry:
                del self._cache[key]
                return None
            self._cache.move_to_end(key)
            return val

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        expiry = time.time() + ttl
        with self._lock:
            if key in self._cache:
                del self._cache[key]
            elif len(self._cache) >= self.capacity:
                self._cache.popitem(last=False)
            self._cache[key] = (value, expiry)

    def delete(self, key: str) -> bool:
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

    def size(self) -> int:
        with self._lock:
            return len(self._cache)


class CacheQueueAdapter:
    """Unified cache & queue interface supporting Redis (Mode A) and InMemory (Mode B)."""

    _instance: Optional["CacheQueueAdapter"] = None
    _lock = threading.Lock()

    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or os.getenv("REDIS_URL")
        self.redis_client: Optional[Any] = None
        self.is_redis_active = False
        self.in_memory = InMemoryLRUCache(capacity=1024, default_ttl_seconds=3600)

        self._init_backend()

    def _init_backend(self) -> None:
        """Attempts connection to Redis if URL provided; falls back to in-memory."""
        if self.redis_url and REDIS_AVAILABLE:
            try:
                client = redis.Redis.from_url(
                    self.redis_url,
                    socket_connect_timeout=2.0,
                    socket_timeout=2.0,
                    decode_responses=True,
                )
                client.ping()
                self.redis_client = client
                self.is_redis_active = True
                logger.info(f"[CacheQueueAdapter] Successfully connected to Redis backend at {self.redis_url}")
            except Exception as e:
                logger.warning(
                    f"[CacheQueueAdapter] Redis connection failed ({e}). "
                    f"Operating in Mode B Local Resilient In-Memory Mode."
                )
                self.redis_client = None
                self.is_redis_active = False
        else:
            logger.info("[CacheQueueAdapter] Operating in Mode B Local Resilient In-Memory Mode.")
            self.redis_client = None
            self.is_redis_active = False

    @classmethod
    def get_instance(cls) -> "CacheQueueAdapter":
        """Singleton accessor."""
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance

    # 1. OCR Token Caching
    def get_tokens(self, image_id: str) -> Optional[List[Dict[str, Any]]]:
        """Retrieves cached OCR tokens for a given image sub-element."""
        key = f"tokens:{image_id}"
        if self.is_redis_active and self.redis_client:
            try:
                val = self.redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis get_tokens failed ({e}); falling back to memory.")
        return self.in_memory.get(key)

    def set_tokens(self, image_id: str, tokens: List[Dict[str, Any]], ttl_seconds: int = 7200) -> None:
        """Caches OCR tokens for a given image sub-element."""
        key = f"tokens:{image_id}"
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.setex(key, ttl_seconds, json.dumps(tokens))
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis set_tokens failed ({e}); writing to memory.")
        self.in_memory.set(key, tokens, ttl_seconds)

    # 2. Extracted Fields & Fused Facts Caching
    def get_fused_facts(self, inspection_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves cached synthesized commodity facts for an inspection."""
        key = f"fused_facts:{inspection_id}"
        if self.is_redis_active and self.redis_client:
            try:
                val = self.redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis get_fused_facts failed ({e}); falling back to memory.")
        return self.in_memory.get(key)

    def set_fused_facts(self, inspection_id: str, facts: Dict[str, Any], ttl_seconds: int = 7200) -> None:
        """Caches synthesized commodity facts for an inspection."""
        key = f"fused_facts:{inspection_id}"
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.setex(key, ttl_seconds, json.dumps(facts))
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis set_fused_facts failed ({e}); writing to memory.")
        self.in_memory.set(key, facts, ttl_seconds)

    # 3. Pipeline Job Status Tracking
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves real-time processing status of a parallel batch inspection job."""
        key = f"job:{job_id}"
        if self.is_redis_active and self.redis_client:
            try:
                val = self.redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis get_job_status failed ({e}); falling back to memory.")
        return self.in_memory.get(key)

    def set_job_status(self, job_id: str, status: Dict[str, Any], ttl_seconds: int = 3600) -> None:
        """Updates real-time processing status of a parallel batch inspection job."""
        key = f"job:{job_id}"
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.setex(key, ttl_seconds, json.dumps(status))
            except Exception as e:
                logger.warning(f"[CacheQueueAdapter] Redis set_job_status failed ({e}); writing to memory.")
        self.in_memory.set(key, status, ttl_seconds)

    # 4. Invalidation & Maintenance
    def invalidate(self, key: str) -> None:
        """Invalidates a cache entry across Redis and in-memory stores."""
        if self.is_redis_active and self.redis_client:
            try:
                self.redis_client.delete(key)
            except Exception:
                pass
        self.in_memory.delete(key)

    def clear_all(self) -> None:
        """Clears in-memory cache (does not flush Redis entire DB for safety)."""
        self.in_memory.clear()
