import { TimeRange } from '../models/enums';

const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function filterMonthlyByRange<T extends { month: string }>(items: T[], range: TimeRange): T[] {
  if (range === TimeRange.All || range === TimeRange.Y1) return items;
  const n = range === TimeRange.M3 ? 3 : 6;
  const currentIdx = new Date().getMonth();
  const included = new Set<string>();
  for (let i = n - 1; i >= 0; i--) {
    included.add(MONTH_ORDER[(currentIdx - i + 12) % 12]);
  }
  return items.filter(m => included.has(m.month));
}

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
