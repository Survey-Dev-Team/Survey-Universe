// ── /aggregation/surveys ─────────────────────────────────────────────────────

export interface OverviewStatsDto {
  totalParticipants: number;
  totalSurveys:      number;
  activeSurveys:     number;
  avgCompletion:     number;
}

export interface ActivityMetricsDto {
  participantsByMonth: Record<string, number>;
  surveysByCategory:   Record<string, number>;
}

export interface SurveyTableItemDto {
  title:          string;
  categories:     string[];
  participants:   number;
  completionRate: number;
  status:         string;
  createdDate:    string;
}

// ── /aggregation/tests ────────────────────────────────────────────────────────

export interface MonthlyTrendDto {
  month:    string;
  avgScore: number;
  passRate: number;
}

export interface ScoreDistributionDto {
  range0to20:   number;
  range21to40:  number;
  range41to60:  number;
  range61to80:  number;
  range81to100: number;
}

export interface TestDashboardOverviewDto {
  totalParticipants: number;
  totalItems:        number;
  activeItems:       number;
  avgCompletion:     number;
  avgScore:          number;
  avgPassRate:       number;
  avgTime:           number;
}

export interface PerformanceAnalysisDto {
  monthlyTrends:     MonthlyTrendDto[];
  scoreDistribution: ScoreDistributionDto;
}

export interface TestSummaryDto {
  id:               string;
  title:            string;
  category:         string;
  participants:     number;
  avgScore:         number;
  passRate:         number;
  avgTimeInMinutes: number;
  status:           string;
}

export interface FunnelStepDto {
  stage:      string;
  count:      number;
  percentage: number;
}

export interface CompletionFunnelDto {
  steps: FunnelStepDto[];
}

// ── /aggregation/users ────────────────────────────────────────────────────────

export interface UserTableSummaryDto {
  id:             string;
  firstName:      string;
  lastName:       string;
  email:          string;
  role:           string;
  surveysCreated: number;
  testsTaken:     number;
  createdAt:      string;
  lastSession:    string;
}

export interface UserSurveyReportDto {
  id:                   string;
  title:                string;
  category:             string;
  completionPercentage: number;
  completedOn:          string;
}

export interface UserTestReportDto {
  id:          string;
  title:       string;
  category:    string;
  score:       number;
  status:      string;
  completedOn: string;
}

export interface UserReportDto {
  surveys: UserSurveyReportDto[];
  tests:   UserTestReportDto[];
}

// ── /aggregation/surveys/public ───────────────────────────────────────────────

export interface ActiveSurveyCardDto {
  urlId:             string;
  title:             string;
  category:          string;
  formattedDate:     string;
  respondents:       number;
  avgCompletionRate: number;
}

export interface ActiveTestCardDto {
  urlId:         string;
  title:         string;
  category:      string;
  formattedDate: string;
  respondents:   number;
  avgScore:      number;
}

export interface ActiveAssessmentsDashboardDto {
  surveys: ActiveSurveyCardDto[];
  tests:   ActiveTestCardDto[];
}

export interface UserCreatedSurveyCardDto {
  urlId:            string;
  title:            string;
  category:         string;
  formattedDate:    string;
  totalRespondents: number;
  avgMetrics:       number;
}

export interface UserCompletedTestCardDto {
  urlId:         string;
  title:         string;
  category:      string;
  formattedDate: string;
  userResult:    number;
  passStatus:    string;
}

export interface ActiveAssessmentCardDto {
  urlId:            string;
  title:            string;
  type:             string;
  category:         string;
  totalRespondents: number;
  completedCount:   number;
  displayMetric:    number;
  lastActivity:     string;
  status:           string;
}
