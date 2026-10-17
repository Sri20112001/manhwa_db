export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?';
}

export function compactNumber(value: number | null | undefined): string {
  if (value == null) return '0';
  if (value < 1_000) return String(value);
  if (value < 1_000_000) return `${(value / 1_000).toFixed(value < 10_000 ? 1 : 0)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export function chapterRange(start: number, end: number | null | undefined): string {
  if (end == null || end === start) return String(start);
  return `${start} – ${end}`;
}

export function progressLabel(current: number | null, total: number | null): string {
  const totalLabel = total == null ? '?' : String(total);
  return `Ch ${current ?? 0} / ${totalLabel}`;
}

export function progressRatio(current: number | null, total: number | null): number {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(1, (current ?? 0) / total));
}

export function formatRating(value: number | null | undefined): string {
  if (value == null) return '—';
  return value.toFixed(1);
}

export function formatYear(value: number | null | undefined): string {
  return value == null ? '—' : String(value);
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const size = bytes / 1024 ** index;
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index] ?? 'B'}`;
}
