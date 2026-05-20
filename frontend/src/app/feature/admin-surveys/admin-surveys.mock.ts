import { AdminSurvey } from './admin-surveys.model';
import { StatStatus } from '../../shared/models/enums';

export const ADMIN_SURVEYS_MOCK: AdminSurvey[] = [
  { id: '1', title: 'Explore the Unknown',      coverImage: '/assets/images/banner/card1.png', category: 'Science',    author: 'Alex Monroe',  questionCount: 7,  responses: 1240, status: StatStatus.Active, published: true,  createdAt: '2026-01-10', description: '7 questions · 3–5 min'  },
  { id: '2', title: 'Cosmic Perspective Check', coverImage: '/assets/images/banner/card2.png', category: 'Philosophy', author: 'Lena Oris',    questionCount: 10, responses:  890, status: StatStatus.Active, published: true,  createdAt: '2026-01-22', description: '10 questions · 5 min'   },
  { id: '3', title: 'Signal from the Crowd',    coverImage: '/assets/images/banner/card3.png', category: 'Society',    author: 'Mark Vega',    questionCount: 4,  responses: 2100, status: StatStatus.Passed, published: true,  createdAt: '2026-02-03', description: '4 questions · 2 min'   },
  { id: '4', title: 'New Orbit of Thoughts',    coverImage: '/assets/images/banner/card4.png', category: 'Test',       author: 'Dana Kol',     questionCount: 8,  responses:  560, status: StatStatus.Passed, published: false, createdAt: '2026-02-18', description: '8 questions · 4 min'   },
  { id: '5', title: 'Voices of the Void',       coverImage: '/assets/images/banner/card1.png', category: 'Psychology', author: 'Ivan Petrov',  questionCount: 6,  responses: 3100, status: StatStatus.Active, published: true,  createdAt: '2026-03-05', description: '6 questions · 3 min'   },
  { id: '6', title: 'Data and Dreams',          coverImage: '/assets/images/banner/card2.png', category: 'Science',    author: 'Sofia Lane',   questionCount: 12, responses:  720, status: StatStatus.Passed, published: true,  createdAt: '2026-03-22', description: '12 questions · 6 min'  },
  { id: '7', title: 'Remote Work Culture',      coverImage: '/assets/images/banner/card3.png', category: 'Business',   author: 'Amelia Novak', questionCount: 9,  responses: 1850, status: StatStatus.Active, published: true,  createdAt: '2026-04-01', description: '9 questions · 4 min'   },
  { id: '8', title: 'AI Fundamentals Quiz',     coverImage: '/assets/images/banner/card4.png', category: 'Test',       author: 'Lucas Moreau', questionCount: 15, responses: 3400, status: StatStatus.Active, published: true,  createdAt: '2026-04-15', description: '15 questions · 8 min'  },
  { id: '9', title: 'Mental Health at Work',    coverImage: '/assets/images/banner/card1.png', category: 'Health',     author: 'Sofia Reyes',  questionCount: 11, responses:  410, status: StatStatus.Active, published: false, createdAt: '2026-04-28', description: '11 questions · 5 min'  },
];
