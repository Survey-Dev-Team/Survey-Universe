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
