// ── Admin Stats Tabs ───────────────────────────────────────

export enum AdminTab {
  Surveys = 'surveys',
  Tests   = 'tests',
}

export enum SurveysTab {
  All         = 'all',
  Unmoderated = 'unmoderated',
}

export enum MySurveysTab {
  Completed = 'completed',
  AboutMe   = 'about-me',
  Created   = 'created',
}

export enum CreatedSurveyStatus {
  Draft      = 'draft',
  Pending    = 'pending',
  Published  = 'published',
}

// ── User ───────────────────────────────────────────────────

export enum UserTab {
  Surveys = 'surveys',
  Tests   = 'tests',
}

export enum UserRole {
  User  = 'user',
  Admin = 'admin',
}

export type ToastSeverityType = 'success' | 'error' | 'info' | 'warn';


export type DatePickerSelectionMode =
  | 'single'
  | 'multiple'
  | 'range'
  | undefined;

// ── Status & Ranges ────────────────────────────────────────

export enum StatStatus {
  Active = 'Active',
  Passed = 'Passed',
  Failed = 'Failed',
}

export enum TimeRange {
  All = 'all',
  M3  = '3m',
  M6  = '6m',
  Y1  = '1y',
}

// ── PrimeNG Icons ──────────────────────────────────────────

export enum PrimeIcon {
  Users       = 'pi pi-users',
  List        = 'pi pi-list',
  CheckCircle = 'pi pi-check-circle',
  Percentage  = 'pi pi-percentage',
  Pencil      = 'pi pi-pencil',
  Star        = 'pi pi-star',
  Trophy      = 'pi pi-trophy',
  Clock       = 'pi pi-clock',
  Eye         = 'pi pi-eye',
  CheckSquare = 'pi pi-check-square',
  Comment     = 'pi pi-comment',
  PenToSquare = 'pi pi-pen-to-square',
  FileEdit    = 'pi pi-file-edit',
}

// ── Stats Labels ───────────────────────────────────────────

export enum StatsLabel {
  // ── KPI shared ─────────────────────────────────────────────
  TotalParticipants = 'Total participants',

  // ── KPI surveys ────────────────────────────────────────────
  TotalSurveys  = 'Total surveys',
  ActiveSurveys = 'Active surveys',
  AvgCompletion = 'Avg completion',

  // ── KPI tests ──────────────────────────────────────────────
  TotalTests  = 'Total tests',
  ActiveTests = 'Active tests',
  AvgPassRate = 'Avg pass rate',

  // ── KPI + column header (identical string) ─────────────────
  AvgScore = 'Avg score',
  AvgTime  = 'Avg time',

  // ── Column headers shared ──────────────────────────────────
  Category     = 'Category',
  Participants = 'Participants',
  Status       = 'Status',

  // ── Column headers surveys ─────────────────────────────────
  Survey     = 'Survey',
  Completion = 'Completion',
  Created    = 'Created',

  // ── Column headers tests ───────────────────────────────────
  Test     = 'Test',
  PassRate = 'Pass rate',

  // ── Funnel labels ──────────────────────────────────────────
  Started   = 'Started',
  Reached50 = 'Reached 50%',
  Completed = 'Completed',

  // ── KPI admin-surveys ──────────────────────────────────────
  Published      = 'Published',
  Active         = 'Active',
  TotalResponses = 'Total responses',

  // ── Tab labels admin-surveys ───────────────────────────────
  AllSurveys    = 'All Surveys',
  Unmoderated   = 'Unmoderated',

  // ── KPI my-surveys ─────────────────────────────────────────
  SurveysCompleted  = 'Surveys Completed',
  AvgCompletionRate = 'Avg Completion Rate',
  PeersResponded    = 'Peers Responded About Me',
  AvgFeedbackScore  = 'Avg Feedback Score',
}

// ── Table Fields ───────────────────────────────────────────

export enum SurveyStatField {
  Id             = 'id',
  Title          = 'title',
  Category       = 'category',
  Participants   = 'participants',
  CompletionRate = 'completionRate',
  Status         = 'status',
  CreatedAt      = 'createdAt',
}

export enum TestStatField {
  Id           = 'id',
  Title        = 'title',
  Category     = 'category',
  Participants = 'participants',
  AvgScore     = 'avgScore',
  PassRate     = 'passRate',
  AvgTimeMin   = 'avgTimeMin',
  Status       = 'status',
}
