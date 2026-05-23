import { CreatedSurveyStatus } from '../../shared/models/enums';
import { CompletedSurvey, SurveyStats, CreatedSurvey } from './my-surveys.model';

export const COMPLETED_SURVEYS_MOCK: CompletedSurvey[] = [
  { id: 'r1', title: 'Survey Universe Community Profile',    coverImage: '/assets/images/banner/card1.png', category: 'society',    completedAt: '2026-05-03', completionRate: 100, totalQuestions: 8,  answeredQuestions: 8,  timeSpentMin: 5  },
  { id: 'r2', title: 'How Do You Handle Stress?',            coverImage: '/assets/images/banner/card3.png', category: 'psychology', completedAt: '2026-05-02', completionRate: 100, totalQuestions: 10, answeredQuestions: 10, timeSpentMin: 7  },
  { id: 'r3', title: 'How Do You Learn Best?',               coverImage: '/assets/images/banner/card2.png', category: 'psychology', completedAt: '2026-05-02', completionRate: 100, totalQuestions: 9,  answeredQuestions: 9,  timeSpentMin: 6  },
];

export const SURVEY_STATS_MOCK: SurveyStats[] = [
  { id: 'ss1', type: 'survey', title: 'What Shapes Who We Are?',               coverImage: '/assets/images/banner/card2.png', category: 'psychology', totalRespondents: 8,  lastActivityAt: '2026-04-22', avgScore: 84 },
  { id: 'ss2', type: 'survey', title: 'If You Could Ask the World One Question', coverImage: '/assets/images/banner/card4.png', category: 'philosophy', totalRespondents: 5,  lastActivityAt: '2026-03-14', avgScore: 91 },
  { id: 'ss3', type: 'survey', title: 'A Place That Changed You',                coverImage: '/assets/images/banner/card3.png', category: 'society',    totalRespondents: 12, lastActivityAt: '2026-02-28', avgScore: 76 },
  { id: 'st1', type: 'test',   title: 'JavaScript Fundamentals Quiz',            coverImage: '/assets/images/banner/card1.png', category: 'technology', totalRespondents: 34, lastActivityAt: '2026-05-01', avgScore: 72 },
  { id: 'st2', type: 'test',   title: 'Critical Thinking Assessment',            coverImage: '/assets/images/banner/card5.png', category: 'psychology', totalRespondents: 19, lastActivityAt: '2026-04-10', avgScore: 68 },
];

export const CREATED_SURVEYS_MOCK: CreatedSurvey[] = [
  { id: 'survey:019ded3a-dead-beef-8888-c3d4e5f60001', title: 'Digital Wellbeing Check — Winter 2026', coverImage: '/assets/images/banner/card1.png', category: 'wellbeing',  questionCount: 8,  createdAt: '2026-01-05', status: CreatedSurveyStatus.Published },
  { id: 'survey:019de9f1-0001-7001-b001-c3d4e5f60101', title: 'Do We Rely Too Much on Technology?',    coverImage: '/assets/images/banner/card2.png', category: 'technology', questionCount: 10, createdAt: '2026-03-12', status: CreatedSurveyStatus.Published },
  { id: 'survey:019deda9-096f-7d0c-825e-226ce4c946ff', title: 'A Place That Changed You',              coverImage: '/assets/images/banner/card3.png', category: 'society',    questionCount: 6,  createdAt: '2026-05-10', status: CreatedSurveyStatus.Draft     },
];
