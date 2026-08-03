const CACHE_PREFIX = 'readvault_cache_'
const DEFAULT_TTL = 5 * 60 * 1000

interface CacheEntry<T> {
  data: T
  expiry: number
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  try {
    const entry: CacheEntry<T> = { data, expiry: Date.now() + ttl }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
  }
}

export function removeCache(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key)
}

export function clearAllCache(): void {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(CACHE_PREFIX)) keys.push(k)
  }
  keys.forEach(k => localStorage.removeItem(k))
}

export function getCacheSize(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(CACHE_PREFIX)) {
      const v = localStorage.getItem(k)
      if (v) total += v.length
    }
  }
  return total
}