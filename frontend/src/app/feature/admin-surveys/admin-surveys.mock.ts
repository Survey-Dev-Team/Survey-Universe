import { AdminSurvey } from './admin-surveys.model';
import { StatStatus } from '../../shared/models/enums';

const COVERS = [
  '/assets/images/banner/card1.png',
  '/assets/images/banner/card2.png',
  '/assets/images/banner/card3.png',
  '/assets/images/banner/card4.png',
];

export const ADMIN_SURVEYS_MOCK: AdminSurvey[] = [
  { id: 'survey:019de9f1-0001-7001-b001-c3d4e5f60101', title: 'Do We Rely Too Much on Technology?',     coverImage: COVERS[0], category: 'society',    author: 'Alex Monroe',  questionCount:  4, responses: 2847, status: StatStatus.Active, published: true,  createdAt: '2026-05-14', description: '4 questions · 5 min'  },
  { id: 'survey:019de9f2-0001-7001-b002-c3d4e5f60102', title: 'Is Space Exploration Worth the Cost?',   coverImage: COVERS[1], category: 'science',    author: 'Lena Oris',    questionCount:  4, responses: 1956, status: StatStatus.Active, published: true,  createdAt: '2026-05-10', description: '4 questions · 4 min'  },
  { id: 'survey:019de9f3-0001-7001-b003-c3d4e5f60103', title: 'What Shapes Who We Are?',                coverImage: COVERS[2], category: 'psychology', author: 'Mark Vega',    questionCount:  4, responses: 2103, status: StatStatus.Active, published: true,  createdAt: '2026-05-06', description: '4 questions · 7 min'  },
  { id: 'survey:019de9f4-0001-7001-b004-c3d4e5f60104', title: 'Myths & Facts: The Human Brain',         coverImage: COVERS[3], category: 'science',    author: 'Sofia Lane',   questionCount:  4, responses: 1648, status: StatStatus.Active, published: true,  createdAt: '2026-04-12', description: '4 questions · 8 min'  },
  { id: 'survey:019de95c-3401-7001-a1b2-c3d4e5f60001', title: 'How Do You Handle Stress?',              coverImage: COVERS[0], category: 'psychology', author: 'Ivan Petrov',  questionCount:  3, responses: 1284, status: StatStatus.Active, published: true,  createdAt: '2026-05-01', description: '3 questions · 5 min'  },
  { id: 'survey:019de96a-0001-7000-8000-c3d4e5f60001', title: 'How Do You Learn Best?',                 coverImage: COVERS[1], category: 'psychology', author: 'Dana Kol',     questionCount:  5, responses: 1847, status: StatStatus.Active, published: true,  createdAt: '2026-04-30', description: '5 questions · 10 min' },
  { id: 'survey:019ded05-5fbc-7e45-919f-ea20c34a34ac', title: 'Sleep & Your Daily Energy',              coverImage: COVERS[2], category: 'psychology', author: 'Alex Monroe',  questionCount:  4, responses: 2390, status: StatStatus.Active, published: true,  createdAt: '2026-04-20', description: '4 questions · 7 min'  },
  { id: 'survey:019de95c-3401-7001-a1b2-c3d4e5f60003', title: 'If You Could Ask the World One Question', coverImage: COVERS[3], category: 'philosophy', author: 'Lena Oris',   questionCount:  1, responses:    0, status: StatStatus.Passed, published: false, createdAt: '2026-04-25', description: '1 question · draft'   },
  { id: 'survey:019ded10-b3a3-7bc1-a0bc-7a31ff091616', title: 'The Human Body: Fact or Fiction?',       coverImage: COVERS[0], category: 'science',    author: 'Mark Vega',    questionCount:  3, responses: 1523, status: StatStatus.Active, published: true,  createdAt: '2026-04-25', description: '3 questions · 10 min' },
  { id: 'survey:019ded10-74bd-7a6e-8cc1-50de7ba23977', title: 'Our Planet: Environmental Basics',       coverImage: COVERS[1], category: 'science',    author: 'Sofia Lane',   questionCount:  2, responses:    0, status: StatStatus.Passed, published: false, createdAt: '2026-04-25', description: '2 questions · draft'  },
  { id: 'survey:019ded26-cabe-71af-bc58-ac1b804617c0', title: 'Great Thinkers: Know Your Philosophy?',  coverImage: COVERS[2], category: 'philosophy', author: 'Ivan Petrov',  questionCount:  3, responses: 3126, status: StatStatus.Active, published: true,  createdAt: '2026-04-29', description: '3 questions · 15 min' },
  { id: 'survey:019ded3a-dead-beef-8888-c3d4e5f60001', title: 'Digital Wellbeing Check — Winter 2026',  coverImage: COVERS[3], category: 'wellbeing',  author: 'Dana Kol',     questionCount:  3, responses: 3294, status: StatStatus.Passed, published: true,  createdAt: '2026-01-10', description: '3 questions · 7 min'  },
  { id: 'survey:019deda9-096f-7d0c-825e-226ce4c946ff', title: 'A Place That Changed You',               coverImage: COVERS[0], category: 'society',    author: 'Alex Monroe',  questionCount:  3, responses:  428, status: StatStatus.Active, published: true,  createdAt: '2026-05-02', description: '3 questions · 5 min'  },
  { id: 'survey:019df434-1423-76e1-9e23-2808d5d51fbf', title: 'Survey Universe Community Profile',      coverImage: COVERS[1], category: 'society',    author: 'Lena Oris',    questionCount: 12, responses:  312, status: StatStatus.Active, published: true,  createdAt: '2026-05-01', description: '12 questions · 15 min' },
];
