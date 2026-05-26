export interface AdminUserSummaryDto {
  id:           string;
  urlId:        string;
  profileImage: string | null;
  firstName:    string;
  lastName:     string;
  role:         string;
  email:        string;
}

export interface AdminUserDetailsDto {
  userSummary:      AdminUserSummaryDto;
  surveysCompleted: number;
  revision:         string;
  lastSession:      string | null;
}

export interface AdminUsersPageDto {
  content:       AdminUserDetailsDto[];
  currentPage:   number;
  totalPages:    number;
  totalElements: number;
  hasNext:       boolean;
}

export interface UserSurveyResponseDto {
  responseId:  string;
  surveyUrlId: string;
  userUrlId:   string;
  title:       string;
  submittedAt: string;
  answers:     unknown[];
}

export interface GetUsersParams {
  search?:      string;
  showDeleted?: boolean;
  sortBy?:      string;
  page?:        number;
  size?:        number;
}

// ── Admin Surveys ────────────────────────────────────────────────────────────

export interface SurveyDetailsSummaryDto {
  surveyId:      string;
  urlId:         string;
  creatorId:     string;
  creatorUrlId:  string;
  title:         string;
  description:   string;
  icon:          string;
  category:      string[];
  estimatedTime: number;
  publishedAt:   string | null;
  closedAt:      string | null;
  createdAt:     string;
  modifiedAt:    string;
  status:        string;
  isDeleted:     boolean;
  responseCount: number;
  creatorName?:  string; // TODO(backend): має повертатись з SurveyDetailsSummaryDto
}

export interface AdminSurveysPageDto {
  content:       SurveyDetailsSummaryDto[];
  currentPage:   number;
  totalPages:    number;
  totalElements: number;
  hasNext:       boolean;
}

export interface SurveyQuestionDto {
  id:               string;
  label:            string;
  sort_order:       number;
  type:             string;
  is_required:      boolean;
  question_category: string;
  [key: string]:    unknown;
}

export interface SurveyDetailsResponseDto {
  summary:   SurveyDetailsSummaryDto;
  revision:  string;
  questions: SurveyQuestionDto[];
}

export interface SurveyCreateRequestDto {
  title:         string;
  description?:  string;
  category:      string[];
  estimatedTime?: number;
  icon?:         string;
  questions:     SurveyQuestionDto[];
  status?:       'published' | 'draft';
}

export interface SurveyUpdateRequestDto {
  revision:      string;
  title:         string;
  description?:  string;
  category?:     string[];
  estimatedTime?: number;
  icon?:         string;
  isHome?:       boolean;
  questions:     SurveyQuestionDto[];
}

export interface RevisionRecordDto {
  revision: string;
}

export interface RevisionMessageDto {
  message:  string;
  revision: string;
  id:       string;
  urlId:    string;
}

export interface SurveyHomePatchDto {
  revision: string;
  isHome:   boolean;
}

export interface GetAdminSurveysParams {
  surveyType?:  string;
  surveyStatus?: string;
  creator?:     string;
  search?:      string;
  category?:    string;
  showDeleted?: boolean;
  sortby?:      string;
  timeRange?:   string;
  page?:        number;
  size?:        number;
}
