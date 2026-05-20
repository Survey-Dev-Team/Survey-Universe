import { TestStat } from './test-stats.model';
import { StatStatus } from '../../../../shared/models/enums';

export const TESTS_MOCK: TestStat[] = [
  { id: '7',  title: 'UX Research Knowledge',  category: 'Technology', participants: 980,  completionRate: 82, avgScore: 74, passRate: 68, avgTimeMin: 22, status: StatStatus.Active, createdAt: '2025-04-15' },
  { id: '8',  title: 'AI Fundamentals Quiz',   category: 'Technology', participants: 3400, completionRate: 76, avgScore: 79, passRate: 71, avgTimeMin: 18, status: StatStatus.Active, createdAt: '2025-08-20' },
  { id: '9',  title: 'Business Ethics Test',   category: 'Business',   participants:  640, completionRate: 61, avgScore: 58, passRate: 47, avgTimeMin: 30, status: StatStatus.Passed, createdAt: '2025-11-10' },
  { id: '10', title: 'Health & Safety Cert',   category: 'Health',     participants: 1850, completionRate: 94, avgScore: 85, passRate: 82, avgTimeMin: 25, status: StatStatus.Passed, createdAt: '2026-01-25' },
  { id: '11', title: 'Data Privacy Awareness', category: 'Technology', participants:  410, completionRate: 58, avgScore: 61, passRate: 54, avgTimeMin: 15, status: StatStatus.Active, createdAt: '2026-03-12' },
  { id: '12', title: 'Leadership Skills Eval', category: 'Business',   participants:  720, completionRate: 72, avgScore: 67, passRate: 62, avgTimeMin: 35, status: StatStatus.Active, createdAt: '2026-04-30' },
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
