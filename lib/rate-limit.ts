const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const arr = hits.get(key) ?? []
  const recent = arr.filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  return recent.length <= limit
}
