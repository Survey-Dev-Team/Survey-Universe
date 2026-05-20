import { CreatedSurveyStatus } from '../../shared/models/enums';
import { CompletedSurvey, ResponseAboutMe, CreatedSurvey } from './my-surveys.model';

export const COMPLETED_SURVEYS_MOCK: CompletedSurvey[] = [
  { id: '1', title: 'Explore the Unknown',    coverImage: '/assets/images/banner/card1.png', category: 'Science',    completedAt: '2026-04-10', completionRate: 100, totalQuestions: 7,  answeredQuestions: 7,  timeSpentMin: 4 },
  { id: '2', title: 'Remote Work Culture',    coverImage: '/assets/images/banner/card3.png', category: 'Business',   completedAt: '2026-03-28', completionRate: 88,  totalQuestions: 9,  answeredQuestions: 8,  timeSpentMin: 6 },
  { id: '3', title: 'Mental Health at Work',  coverImage: '/assets/images/banner/card1.png', category: 'Health',     completedAt: '2026-03-05', completionRate: 100, totalQuestions: 11, answeredQuestions: 11, timeSpentMin: 7 },
  { id: '4', title: 'Social Media Habits',    coverImage: '/assets/images/banner/card2.png', category: 'Technology', completedAt: '2026-02-18', completionRate: 100, totalQuestions: 6,  answeredQuestions: 6,  timeSpentMin: 3 },
  { id: '5', title: 'Climate Awareness 2025', coverImage: '/assets/images/banner/card4.png', category: 'Science',    completedAt: '2026-01-30', completionRate: 72,  totalQuestions: 10, answeredQuestions: 7,  timeSpentMin: 5 },
];

export const RESPONSES_ABOUT_ME_MOCK: ResponseAboutMe[] = [
  { id: 'r1', title: 'Team Collaboration Assessment', coverImage: '/assets/images/banner/card2.png', category: 'Business',   respondents: 8,  lastResponseAt: '2026-04-22', avgScore: 84 },
  { id: 'r2', title: 'Peer Communication Review',     coverImage: '/assets/images/banner/card4.png', category: 'Psychology', respondents: 5,  lastResponseAt: '2026-03-14', avgScore: 91 },
  { id: 'r3', title: 'Leadership Style Feedback',     coverImage: '/assets/images/banner/card3.png', category: 'Business',   respondents: 12, lastResponseAt: '2026-02-28', avgScore: 76 },
];

export const CREATED_SURVEYS_MOCK: CreatedSurvey[] = [
  { id: 'c1', title: 'Urban Mobility Survey',     coverImage: '/assets/images/banner/card1.png', category: 'Society', questionCount: 8,  createdAt: '2026-05-01', status: CreatedSurveyStatus.Published },
  { id: 'c2', title: 'Music Taste Questionnaire', coverImage: '/assets/images/banner/card2.png', category: 'Culture', questionCount: 5,  createdAt: '2026-05-10', status: CreatedSurveyStatus.Pending   },
  { id: 'c3', title: 'Daily Habits Tracker',      coverImage: '/assets/images/banner/card3.png', category: 'Health',  questionCount: 12, createdAt: '2026-05-15', status: CreatedSurveyStatus.Draft     },
];
