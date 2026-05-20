import { StatStatus } from '../../shared/models/enums';

export interface AdminSurvey {
  id:            string;
  title:         string;
  coverImage:    string;
  category:      string;
  author:        string;
  questionCount: number;
  responses:     number;
  status:        StatStatus;
  published:     boolean;
  createdAt:     string;
  description:   string;
}
