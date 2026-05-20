import { AppUser } from './admin-users.model';
import { StatStatus, UserRole } from '../../shared/models/enums';

export const ADMIN_USERS_MOCK: AppUser[] = [
  {
    id: '1', name: 'Olivia Bennett', email: 'olivia.bennett@example.com',
    role: UserRole.User, createdAt: '2025-03-12', lastSession: '2026-05-17',
    surveys: [
      { id: 's1', title: 'Remote Work Culture',   category: 'Business',   completedAt: '2026-02-10', completionRate: 100 },
      { id: 's2', title: 'Mental Health at Work', category: 'Health',     completedAt: '2026-03-15', completionRate: 88  },
      { id: 's3', title: 'Social Media Habits',   category: 'Technology', completedAt: '2026-04-22', completionRate: 100 },
    ],
    tests: [
      { id: 't1', title: 'AI Fundamentals Quiz',   category: 'Technology', completedAt: '2026-02-20', completionRate: 100, score: 82, result: StatStatus.Passed, timeTakenMin: 16 },
      { id: 't2', title: 'Data Privacy Awareness', category: 'Technology', completedAt: '2026-03-30', completionRate: 100, score: 55, result: StatStatus.Failed, timeTakenMin: 13 },
    ],
  },
  {
    id: '2', name: 'Lucas Moreau', email: 'lucas.moreau@example.com',
    role: UserRole.User, createdAt: '2025-05-20', lastSession: '2026-05-15',
    surveys: [
      { id: 's4', title: 'Climate Awareness 2025', category: 'Science',   completedAt: '2026-01-08', completionRate: 100 },
      { id: 's5', title: 'Education Trends',       category: 'Education', completedAt: '2026-04-01', completionRate: 72  },
    ],
    tests: [
      { id: 't3', title: 'UX Research Knowledge', category: 'Technology', completedAt: '2026-01-25', completionRate: 100, score: 77, result: StatStatus.Passed, timeTakenMin: 20 },
      { id: 't4', title: 'Health & Safety Cert',  category: 'Health',     completedAt: '2026-03-10', completionRate: 100, score: 91, result: StatStatus.Passed, timeTakenMin: 22 },
      { id: 't5', title: 'Business Ethics Test',  category: 'Business',   completedAt: '2026-04-18', completionRate: 85,  score: 63, result: StatStatus.Passed, timeTakenMin: 28 },
    ],
  },
  {
    id: '3', name: 'Amelia Novak', email: 'amelia.novak@example.com',
    role: UserRole.Admin, createdAt: '2024-11-05', lastSession: '2026-05-18',
    surveys: [
      { id: 's6', title: 'Customer Satisfaction Q1', category: 'Business', completedAt: '2025-12-20', completionRate: 100 },
    ],
    tests: [
      { id: 't6', title: 'Leadership Skills Eval', category: 'Business', completedAt: '2026-02-14', completionRate: 100, score: 74, result: StatStatus.Passed, timeTakenMin: 34 },
    ],
  },
  {
    id: '4', name: 'Ethan Clarke', email: 'ethan.clarke@example.com',
    role: UserRole.User, createdAt: '2026-01-30', lastSession: '2026-02-10',
    surveys: [],
    tests: [
      { id: 't7', title: 'AI Fundamentals Quiz', category: 'Technology', completedAt: '2026-02-05', completionRate: 60, score: 42, result: StatStatus.Failed, timeTakenMin: 11 },
    ],
  },
  {
    id: '5', name: 'Sofia Reyes', email: 'sofia.reyes@example.com',
    role: UserRole.User, createdAt: '2025-08-14', lastSession: '2026-05-16',
    surveys: [
      { id: 's7', title: 'Remote Work Culture',   category: 'Business',   completedAt: '2026-01-17', completionRate: 100 },
      { id: 's8', title: 'Social Media Habits',   category: 'Technology', completedAt: '2026-03-09', completionRate: 100 },
      { id: 's9', title: 'Mental Health at Work', category: 'Health',     completedAt: '2026-04-25', completionRate: 95  },
    ],
    tests: [
      { id: 't8', title: 'Health & Safety Cert',   category: 'Health',     completedAt: '2026-02-28', completionRate: 100, score: 88, result: StatStatus.Passed, timeTakenMin: 24 },
      { id: 't9', title: 'Data Privacy Awareness', category: 'Technology', completedAt: '2026-04-10', completionRate: 100, score: 70, result: StatStatus.Passed, timeTakenMin: 14 },
    ],
  },
  {
    id: '6', name: 'Noah Fischer', email: 'noah.fischer@example.com',
    role: UserRole.User, createdAt: '2025-12-01', lastSession: '2026-05-12',
    surveys: [
      { id: 's10', title: 'Education Trends',       category: 'Education', completedAt: '2026-02-18', completionRate: 68  },
      { id: 's11', title: 'Climate Awareness 2025', category: 'Science',   completedAt: '2026-03-22', completionRate: 100 },
    ],
    tests: [],
  },
];
