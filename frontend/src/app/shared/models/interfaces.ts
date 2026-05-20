import { DishState, DishType } from "./enums";

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
export interface MenuItem {
  label: string;
  route: string;
  isActive: boolean;
}

export interface Dish {
  id: string;
  name: string;
  price: string;
  weight: string;
  imageUrl: string;
  popularity: number;
  state: string;
  quantity?: number;
}

export interface DishAvailable {
  content: Dish[];
}

export interface CurrentDishDetails {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  popularity: number;
  dishType: DishType;
  state: DishState;
  weight: string;
  calories: string;
  proteins: string;
  fats: string;
  carbohydrates: string;
  vitamins: string;
}

export interface LocationSelectOptions {
  id: string;
  name: string;
}



export interface TableResponse {
  id: string;
  name: string;
}

export interface AvailableTimeslots {
  tableId: string;
  availableSlots: string[];
}

export interface LabeledOption {
  value: string;
  label: string;
}

export interface ReservationData {
  location: string;
  tableNumber?: string;
  date: string;
  timeslot: string;
  reservationId: string;
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
