import { FilterOption } from '../../shared/components/filter-row/filter-row';
import { TimeRange } from '../../shared/models/enums';

export const TIME_RANGE_OPTIONS: FilterOption[] = [
  { label: 'All time',      value: TimeRange.All },
  { label: 'Last 3 months', value: TimeRange.M3  },
  { label: 'Last 6 months', value: TimeRange.M6  },
  { label: 'Last year',     value: TimeRange.Y1  },
];
