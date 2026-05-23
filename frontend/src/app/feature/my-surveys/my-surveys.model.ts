import { CreatedSurveyStatus } from '../../shared/models/enums';

export interface CompletedSurvey {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  completedAt: string;
  completionRate: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpentMin: number;
}

export interface SurveyStats {
  id: string;
  type: 'survey' | 'test';
  title: string;
  coverImage: string;
  category: string;
  totalRespondents: number;
  lastActivityAt: string;
  avgScore: number;
}

export interface CreatedSurvey {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  questionCount: number;
  createdAt: string;
  status: CreatedSurveyStatus;
}
