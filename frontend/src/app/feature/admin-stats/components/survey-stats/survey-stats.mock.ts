import { SurveyStat } from './survey-stats.model';
import { StatStatus } from '../../../../shared/models/enums';

export const SURVEYS_MOCK: SurveyStat[] = [
  { id: '1', title: 'Remote Work Culture',      category: 'Business',   participants: 1240, completionRate: 78, status: StatStatus.Active, createdAt: '2025-04-10' },
  { id: '2', title: 'Mental Health at Work',    category: 'Health',     participants:  890, completionRate: 64, status: StatStatus.Active, createdAt: '2025-07-14' },
  { id: '3', title: 'Customer Satisfaction Q1', category: 'Business',   participants: 2100, completionRate: 91, status: StatStatus.Passed, createdAt: '2025-12-01' },
  { id: '4', title: 'Education Trends',         category: 'Education',  participants:  560, completionRate: 55, status: StatStatus.Passed, createdAt: '2026-01-20' },
  { id: '5', title: 'Climate Awareness 2025',   category: 'Science',    participants: 3100, completionRate: 83, status: StatStatus.Active, createdAt: '2026-03-05' },
  { id: '6', title: 'Social Media Habits',      category: 'Technology', participants:  720, completionRate: 70, status: StatStatus.Active, createdAt: '2026-04-28' },
];

export const SURVEY_MONTHLY_MOCK = [
  { month: 'Jan', participants: 820  },
  { month: 'Feb', participants: 1150 },
  { month: 'Mar', participants: 2340 },
  { month: 'Apr', participants: 3200 },
  { month: 'May', participants: 1780 },
  { month: 'Jun', participants: 2100 },
];
