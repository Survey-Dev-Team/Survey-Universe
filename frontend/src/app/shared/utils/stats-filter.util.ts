import { TimeRange } from '../models/enums';

export function calcCutoff(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case TimeRange.M3: { const d = new Date(now); d.setMonth(d.getMonth() - 3);      return d; }
    case TimeRange.M6: { const d = new Date(now); d.setMonth(d.getMonth() - 6);      return d; }
    case TimeRange.Y1: { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
    default: return null;
  }
}

export function filterByRange<T extends { createdAt: string }>(items: T[], range: TimeRange): T[] {
  const cutoff = calcCutoff(range);
  return cutoff ? items.filter(item => new Date(item.createdAt) >= cutoff) : items;
}
