import { SurveyStat } from './survey-stats.model';
import { StatStatus } from '../../../../shared/models/enums';

export const SURVEYS_MOCK: SurveyStat[] = [
  { id: 'survey:019de9f1-0001-7001-b001-c3d4e5f60101', title: 'Do We Rely Too Much on Technology?',    category: 'society',    participants: 2847, completionRate: 82, status: StatStatus.Active, createdAt: '2026-05-14' },
  { id: 'survey:019de9f2-0001-7001-b002-c3d4e5f60102', title: 'Is Space Exploration Worth the Cost?',  category: 'science',    participants: 1956, completionRate: 75, status: StatStatus.Active, createdAt: '2026-05-10' },
  { id: 'survey:019de9f3-0001-7001-b003-c3d4e5f60103', title: 'What Shapes Who We Are?',               category: 'psychology', participants: 2103, completionRate: 79, status: StatStatus.Active, createdAt: '2026-05-06' },
  { id: 'survey:019de95c-3401-7001-a1b2-c3d4e5f60001', title: 'How Do You Handle Stress?',             category: 'psychology', participants: 1284, completionRate: 88, status: StatStatus.Active, createdAt: '2026-05-01' },
  { id: 'survey:019deda9-096f-7d0c-825e-226ce4c946ff', title: 'A Place That Changed You',              category: 'society',    participants:  428, completionRate: 91, status: StatStatus.Active, createdAt: '2026-05-02' },
  { id: 'survey:019df434-1423-76e1-9e23-2808d5d51fbf', title: 'Survey Universe Community Profile',     category: 'society',    participants:  312, completionRate: 74, status: StatStatus.Active, createdAt: '2026-05-01' },
  { id: 'survey:019de96a-0001-7000-8000-c3d4e5f60001', title: 'How Do You Learn Best?',                category: 'psychology', participants: 1847, completionRate: 68, status: StatStatus.Active, createdAt: '2026-04-30' },
  { id: 'survey:019ded05-5fbc-7e45-919f-ea20c34a34ac', title: 'Sleep & Your Daily Energy',             category: 'psychology', participants: 2390, completionRate: 71, status: StatStatus.Active, createdAt: '2026-04-20' },
  { id: 'survey:019ded3a-dead-beef-8888-c3d4e5f60001', title: 'Digital Wellbeing Check — Winter 2026', category: 'wellbeing',  participants: 3294, completionRate: 91, status: StatStatus.Passed, createdAt: '2026-01-10' },
];

export const SURVEY_MONTHLY_MOCK = [
  { month: 'Jan', participants: 820  },
  { month: 'Feb', participants: 1150 },
  { month: 'Mar', participants: 2340 },
  { month: 'Apr', participants: 3200 },
  { month: 'May', participants: 1780 },
  { month: 'Jun', participants: 2100 },
];
