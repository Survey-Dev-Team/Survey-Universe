import { StatStatus } from '../../../../shared/models/enums';

export interface SurveyStat {
  id: string;
  title: string;
  category: string;
  participants: number;
  completionRate: number;
  status: StatStatus;
  createdAt: string;
}
