import { StatStatus, UserRole } from '../../shared/models/enums';

export interface CompletedSurvey {
  id:             string;
  title:          string;
  category:       string;
  completedAt:    string;
  completionRate: number;
}

export interface CompletedTest {
  id:             string;
  title:          string;
  category:       string;
  completedAt:    string;
  completionRate: number;
  score:          number;
  result:         StatStatus;
  timeTakenMin:   number;
}

export interface AppUser {
  id:           string;
  urlId:        string;
  name:         string;
  email:        string;
  role:         UserRole;
  createdAt:    string;
  lastSession:  string;
  surveysCount: number;
  testsCount:   number;
  surveys:      CompletedSurvey[];
  tests:        CompletedTest[];
}
