import { AppUser } from './admin-users.model';
import { StatStatus, UserRole } from '../../shared/models/enums';

export const ADMIN_USERS_MOCK: AppUser[] = [
  {
    id: 'user:019de942-9929-7fe2-a364-530aba65d8d8', urlId: 'jaxson-stokes', name: 'Jaxson Stokes', email: 'hajamag257@lohinja.com',
    role: UserRole.Admin, createdAt: '', lastSession: '2026-05-03', surveysCount: 3, testsCount: 0,
    surveys: [
      { id: 'r1', title: 'Survey Universe Community Profile',    category: 'society',    completedAt: '2026-05-03', completionRate: 100 },
      { id: 'r2', title: 'How Do You Handle Stress?',            category: 'psychology', completedAt: '2026-05-02', completionRate: 100 },
      { id: 'r3', title: 'How Do You Learn Best?',               category: 'psychology', completedAt: '2026-05-02', completionRate: 100 },
    ],
    tests: [],
  },
  {
    id: 'user:019de94a-d11f-761e-ba08-8f389fa1c4ff', urlId: 'emily-bean', name: 'Emily Bean', email: 'bv7oo@deltajohnsons.com',
    role: UserRole.User, createdAt: '', lastSession: '2026-05-03', surveysCount: 2, testsCount: 1,
    surveys: [
      { id: 'r4', title: 'How Do You Learn Best?',    category: 'psychology', completedAt: '2026-05-03', completionRate: 100 },
      { id: 'r5', title: 'Sleep & Your Daily Energy', category: 'psychology', completedAt: '2026-04-23', completionRate: 100 },
    ],
    tests: [
      { id: 'r6', title: 'Great Thinkers: Know Your Philosophy?', category: 'philosophy', completedAt: '2026-05-03', completionRate: 100, score: 78, result: StatStatus.Passed, timeTakenMin: 18 },
    ],
  },
  {
    id: 'user:019de94b-06be-7bf6-a972-ce3da920d965', urlId: 'edie-levine', name: 'Edie Levine', email: '2ft12@deltajohnsons.com',
    role: UserRole.User, createdAt: '', lastSession: '2026-05-03', surveysCount: 2, testsCount: 2,
    surveys: [
      { id: 'r7', title: 'Digital Wellbeing Check — Winter 2026', category: 'wellbeing', completedAt: '2026-01-19', completionRate: 100 },
      { id: 'r8', title: 'Sleep & Your Daily Energy',             category: 'psychology', completedAt: '2026-04-23', completionRate: 100 },
    ],
    tests: [
      { id: 'r9',  title: 'Great Thinkers: Know Your Philosophy?', category: 'philosophy', completedAt: '2026-05-03', completionRate: 100, score: 65, result: StatStatus.Passed, timeTakenMin: 22 },
      { id: 'r10', title: 'The Human Body: Fact or Fiction?',      category: 'science',    completedAt: '2026-05-03', completionRate: 100, score: 82, result: StatStatus.Passed, timeTakenMin: 15 },
    ],
  },
  {
    id: 'user:019de94b-4fc0-7659-a7de-a19f279a943b', urlId: 'peter-delacruz', name: 'Peter Delacruz', email: 'kimbernodle@vnvmail.com',
    role: UserRole.User, createdAt: '', lastSession: '2026-04-29', surveysCount: 2, testsCount: 2,
    surveys: [
      { id: 'r11', title: 'Sleep & Your Daily Energy', category: 'psychology', completedAt: '2026-05-01', completionRate: 100 },
      { id: 'r12', title: 'How Do You Learn Best?',    category: 'psychology', completedAt: '2026-05-01', completionRate: 100 },
    ],
    tests: [
      { id: 'r13', title: 'The Human Body: Fact or Fiction?',      category: 'science',    completedAt: '2026-05-03', completionRate: 100, score: 71, result: StatStatus.Passed, timeTakenMin: 17 },
      { id: 'r14', title: 'Great Thinkers: Know Your Philosophy?', category: 'philosophy', completedAt: '2026-05-03', completionRate: 100, score: 55, result: StatStatus.Failed, timeTakenMin: 25 },
    ],
  },
  {
    id: 'user:019de94b-92d1-7f88-bbdc-f590f2186541', urlId: 'kamil-orr', name: 'Kamil Orr', email: 'hooriyah1979@konterkulo.com',
    role: UserRole.User, createdAt: '', lastSession: '2026-04-30', surveysCount: 2, testsCount: 1,
    surveys: [
      { id: 'r15', title: 'Digital Wellbeing Check — Winter 2026', category: 'wellbeing', completedAt: '2026-01-18', completionRate: 100 },
      { id: 'r16', title: 'How Do You Handle Stress?',             category: 'psychology', completedAt: '2026-05-02', completionRate: 100 },
    ],
    tests: [
      { id: 'r17', title: 'Great Thinkers: Know Your Philosophy?', category: 'philosophy', completedAt: '2026-05-03', completionRate: 100, score: 90, result: StatStatus.Passed, timeTakenMin: 20 },
    ],
  },
];
