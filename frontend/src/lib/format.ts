export function toAtto(s: string): bigint {
  const m = s.trim().match(/^(\d+)(?:\.(\d{0,18}))?$/)
  if (!m) return 0n
  return BigInt(m[1]) * 10n ** 18n + BigInt((m[2] ?? '').padEnd(18, '0') || '0')
}

export function fromAtto(v: string | bigint, maxFrac = 4): string {
  const n = typeof v === 'bigint' ? v : BigInt(v || '0')
  const whole = n / 10n ** 18n
  const frac = (n % 10n ** 18n).toString().padStart(18, '0').slice(0, maxFrac).replace(/0+$/, '')
  return frac ? `${whole}.${frac}` : whole.toString()
}

export function shortAddr(a: string): string {
  if (!a || a.length < 10) return a
  return `${a.slice(0, 6)}...${a.slice(-4)}`
}

export function shortHash(h: string): string {
  if (!h || h.length < 10) return h
  return `${h.slice(0, 10)}...${h.slice(-8)}`
}

export function formatDate(ts: number | string): string {
  const d = typeof ts === 'string' ? new Date(ts) : new Date(ts * 1000)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function timeAgo(ts: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - ts
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
