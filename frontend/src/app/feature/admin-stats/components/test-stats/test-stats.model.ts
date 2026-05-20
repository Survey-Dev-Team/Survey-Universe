import { StatStatus } from '../../../../shared/models/enums';

export interface TestStat {
  id: string;
  title: string;
  category: string;
  participants: number;
  completionRate: number;
  avgScore: number;
  passRate: number;
  avgTimeMin: number;
  status: StatStatus;
  createdAt: string;
}
