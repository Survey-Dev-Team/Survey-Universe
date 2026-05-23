export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  email: string;
  imageUrl: string;
}

export interface UserSuccessResponse {
  message: string;
}

export interface UserErrorResponse {
  status: number;
  error: {
    message: string;
  };
}

export interface UserPrivateSummary {
  id: string;
  urlId: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

export interface UserAuthResponse {
  jwtToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userSummary: UserPrivateSummary;
}

export interface UserRegisterResponse {
  email: string;
  firstName: string;
  lastName: string;
}
export interface LabeledOption {
  value: string;
  label: string;
}

export interface ChangeUserPasswordPayload {
  old_password: string;
  new_password: string;
  confirmNewPassword?: string;
}

export interface ChangeUserEmailPayload {
  newEmail: string;
}

export interface VerifyEmailCodePayload {
  newEmail: string;
  verificationCode: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  code: string;
  newEmail: string;
  userId: string;
}

// ── Chart ──────────────────────────────────────────────────

export interface ChartTheme {
  textColor:    string;
  gridColor:    string;
  accent:       string;
  accentAlpha:  string;
  success:      string;
  successAlpha: string;
  danger:       string;
  orange:       string;
  yellow:       string;
  cyan:         string;
  teal:         string;
  amber:        string;
  pass:         string;
  fail:         string;
  accentBar:    string;
}

// Surveys
export type SurveyStatus = 'draft' | 'published' | 'closed';
export type SurveyType = 'test' | 'questionnaire' | 'presentation';
export type SurveySortOption = 'newest' | 'oldest' | 'popular';
export type SurveyTimeRange = 'today' | 'week' | 'month';

export interface SurveyReadSummary {
  urlId: string;
  creatorUrlId: string;
  title: string;
  description: string;
  icon: string;
  category: string[];
  estimatedTime: number;
  publishedAt: string;
  surveyType: SurveyType;
}

export interface PagedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface SurveysQueryParams {
  surveyStatus?: SurveyStatus;
  surveyType?: SurveyType;
  category?: string;
  search?: string;
  creator?: string;
  sortBy?: SurveySortOption;
  timeRange?: SurveyTimeRange;
  page?: number;
  size?: number;
}

// Users
export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  revision: string;
}

export interface UserPrivateDetails {
  userSummary: UserPrivateSummary;
  surveysCompleted: number;
  revision: string;
  lastSession: string;
}

export interface MessageResponse {
  message: string;
}

export interface SurveyCardModel {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  date: string;
  category: string;
  surveyType: string;
  author: string;
  estimatedTime: number | null;
  status?: 'Active' | 'Passed';
}

// ── Question ──────────────────────────────────────────────────────────────────

export type QuestionType =
  | 'range' | 'checkbox' | 'radio_button' | 'search_select'
  | 'title' | 'text' | 'input' | 'text_area' | 'date_pick'
  | 'file_upload' | 'image' | 'space' | 'page_break';

export interface OptionDetails {
  id: string;
  label: string;
  isCorrect?: boolean;
  imageUrl?: string;
}

export interface QuestionBase {
  id: string;
  label?: string;
  sort_order: number;
  type: QuestionType;
  is_required?: boolean;
  question_category?: string;
  // selection subtypes
  options?: OptionDetails[];
  // range subtype
  min?: number;
  max?: number;
  step?: number;
  correct_answer?: number;
  [key: string]: unknown;
}

// ── Survey detail summary (admin/my list item) ────────────────────────────────

export interface SurveyDetailsSummary {
  surveyId: string;
  urlId: string;
  creatorId: string;
  creatorUrlId: string;
  title: string;
  description: string;
  icon: string;
  category: string[];
  estimatedTime: number;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  modifiedAt: string;
  status: SurveyStatus;
  isDeleted: boolean;
  responseCount: number;
}

// ── Survey responses (admin/my single survey with questions) ──────────────────

export interface SurveyDetailsResponse {
  summary: SurveyDetailsSummary;
  revision: string;
  questions: QuestionBase[];
}

export interface SurveyReadResponse {
  summary: SurveyReadSummary;
  questions: QuestionBase[];
}

// ── Admin/My query params ─────────────────────────────────────────────────────

export interface AdminSurveysQueryParams extends SurveysQueryParams {
  showDeleted?: boolean;
}

export interface MySurveysQueryParams {
  surveyStatus?: SurveyStatus;
  surveyType?: SurveyType;
  search?: string;
  category?: string;
  showDeleted?: boolean;
  sortBy?: SurveySortOption;
  timeRange?: SurveyTimeRange;
  page?: number;
  size?: number;
}

// ── Survey create / update request ───────────────────────────────────────────

export interface SurveyCreateRequest {
  title: string;
  description?: string;
  category: string[];
  estimatedTime?: number;
  icon?: string;
  questions: QuestionBase[];
}

export interface SurveyUpdateRequest extends SurveyCreateRequest {
  revision: string;
  isHome?: boolean;
}

// ── Revision ─────────────────────────────────────────────────────────────────

export interface RevisionRecord {
  revision: string;
}

export interface RevisionMessage {
  message: string;
  revision: string;
  id: string;
  urlId: string;
}

export interface SurveyHomePatch {
  revision: string;
  isHome: boolean;
}

// ── Response & stats ─────────────────────────────────────────────────────────

export interface ResponseAnswer {
  id: string;
  value?: string;
  selected_options?: string[];
}

export interface AnswerSubmit {
  questionId: string;
  value?: string;
  options?: string[];
}

export interface SurveyResponseSubmit {
  answers: AnswerSubmit[];
}

export interface UserSurveyResponse {
  responseId: string;
  surveyUrlId: string;
  userUrlId: string;
  title: string;
  submittedAt: string;
  answers: ResponseAnswer[];
}

export interface PersonalRespondentAnswer {
  questionId: string;
  selectedOptions?: string[];
  correctOptions?: string[];
  selectedValue?: string;
  correctValue?: string;
  isCorrect?: boolean;
}

export interface PersonalSurveyResponse {
  userId: string;
  surveyUrlId: string;
  questionsTotal: number;
  nonContentQuestionsTotal: number;
  markedQuestionsTotal: number;
  questionsAnswered: number;
  markedQuestionsAnswered: number;
  correctAnswerCount: number;
  sumbittedAt: string;
  respondentAswers: PersonalRespondentAnswer[];
}

export type SubmitResponseResult = MessageResponse | PersonalSurveyResponse;

export interface QuestionStats {
  questionId: string;
  label: string;
  type: QuestionType;
  answerCounts: Record<string, number>;
  averageValue: number | null;
  textSamples: string[];
}

export interface SurveyStats {
  surveyUrlId: string;
  title: string;
  totalResponses: number;
  questionStats: QuestionStats[];
}
