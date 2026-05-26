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
  Stats     = 'stats',
  Created   = 'created',
}

export enum CreatedSurveyStatus {
  Draft      = 'draft',
  Pending    = 'pending',
  Published  = 'published',
  Closed     = 'closed',
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

export enum VisibilityLabel {
  Shown  = 'Shown',
  Hidden = 'Hidden',
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
  ChartBar    = 'pi pi-chart-bar',
  PenToSquare = 'pi pi-pen-to-square',
  FileEdit    = 'pi pi-file-edit',
  Lock        = 'pi pi-lock',
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
  // ── KPI users ───────────────────────────────────────────
  TotalUsers    = 'Total users',
  AdminUsers    = 'Admins',
  AvgSurveys    = 'Avg surveys created',
  AvgTests      = 'Avg tests taken',

  // ── Column headers users ────────────────────────────────
  Name          = 'Name',
  Email         = 'Email',
  Role          = 'Role',
  SurveysCount  = 'Surveys',
  TestsCount    = 'Tests',
  Joined        = 'Joined',
  LastSession   = 'Last session',}

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
