import { TestStat } from './test-stats.model';
import { StatStatus } from '../../../../shared/models/enums';

export const TESTS_MOCK: TestStat[] = [
  { id: 'survey:019de9f4-0001-7001-b004-c3d4e5f60104', title: 'Myths & Facts: The Human Brain',        category: 'science',    participants: 1648, completionRate: 76, avgScore: 72, passRate: 64, avgTimeMin:  9, status: StatStatus.Active, createdAt: '2026-04-12' },
  { id: 'survey:019ded10-b3a3-7bc1-a0bc-7a31ff091616', title: 'The Human Body: Fact or Fiction?',      category: 'science',    participants: 1523, completionRate: 82, avgScore: 68, passRate: 58, avgTimeMin: 11, status: StatStatus.Active, createdAt: '2026-04-25' },
  { id: 'survey:019ded26-cabe-71af-bc58-ac1b804617c0', title: 'Great Thinkers: Know Your Philosophy?', category: 'philosophy', participants: 3126, completionRate: 71, avgScore: 61, passRate: 54, avgTimeMin: 17, status: StatStatus.Active, createdAt: '2026-04-29' },
  { id: 'survey:019ded10-74bd-7a6e-8cc1-50de7ba23977', title: 'Our Planet: Environmental Basics',      category: 'science',    participants:    0, completionRate:  0, avgScore:  0, passRate:  0, avgTimeMin:  0, status: StatStatus.Passed, createdAt: '2026-04-25' },
];

export const TEST_MONTHLY_MOCK = [
  { month: 'Jan', avgScore: 68, passRate: 61 },
  { month: 'Feb', avgScore: 72, passRate: 65 },
  { month: 'Mar', avgScore: 74, passRate: 68 },
  { month: 'Apr', avgScore: 76, passRate: 70 },
  { month: 'May', avgScore: 71, passRate: 64 },
  { month: 'Jun', avgScore: 78, passRate: 72 },
];

export const SCORE_DISTRIBUTION_MOCK = [
  { range: '0–20%',   count: 148  },
  { range: '21–40%',  count: 312  },
  { range: '41–60%',  count: 890  },
  { range: '61–80%',  count: 2340 },
  { range: '81–100%', count: 1220 },
];
