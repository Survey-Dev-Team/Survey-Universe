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
