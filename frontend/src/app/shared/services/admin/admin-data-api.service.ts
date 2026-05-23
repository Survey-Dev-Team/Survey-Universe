import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL, API_ENDPOINTS } from '../../models/api';
import { MessageResponse } from '../../models/interfaces';
import {
  AdminUsersPageDto,
  UserSurveyResponseDto,
  GetUsersParams,
  AdminSurveysPageDto,
  SurveyDetailsResponseDto,
  SurveyCreateRequestDto,
  SurveyUpdateRequestDto,
  RevisionRecordDto,
  RevisionMessageDto,
  SurveyHomePatchDto,
  GetAdminSurveysParams,
} from '../../models/api/admin-data-api.models';

@Injectable({ providedIn: 'root' })
export class AdminDataApiService {
  private http = inject(HttpClient);

  getUsers(params: GetUsersParams = {}): Observable<AdminUsersPageDto> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<AdminUsersPageDto>(`${SURVEY_BASE_URL}users`, { params: httpParams });
  }

  getUserResponses(urlId: string): Observable<UserSurveyResponseDto[]> {
    return this.http.get<UserSurveyResponseDto[]>(`${SURVEY_BASE_URL}users/${urlId}/responses`);
  }

  deleteUser(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}users/${urlId}`);
  }

  // ── Admin Surveys ─────────────────────────────────────────────────────────

  getAdminSurveys(params: GetAdminSurveysParams = {}): Observable<AdminSurveysPageDto> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<AdminSurveysPageDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}`, { params: httpParams });
  }

  getAdminSurveyByUrlId(urlId: string): Observable<SurveyDetailsResponseDto> {
    return this.http.get<SurveyDetailsResponseDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`);
  }

  createAdminSurvey(dto: SurveyCreateRequestDto): Observable<SurveyDetailsResponseDto> {
    return this.http.post<SurveyDetailsResponseDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}`, dto);
  }

  updateAdminSurvey(urlId: string, dto: SurveyUpdateRequestDto): Observable<SurveyDetailsResponseDto> {
    return this.http.put<SurveyDetailsResponseDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`, dto);
  }

  deleteAdminSurvey(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`);
  }

  publishSurvey(urlId: string, revision: RevisionRecordDto): Observable<RevisionMessageDto> {
    return this.http.post<RevisionMessageDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/publish`, revision);
  }

  closeSurvey(urlId: string, revision: RevisionRecordDto): Observable<RevisionMessageDto> {
    return this.http.post<RevisionMessageDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/close`, revision);
  }

  draftSurvey(urlId: string, revision: RevisionRecordDto): Observable<RevisionMessageDto> {
    return this.http.post<RevisionMessageDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/draft`, revision);
  }

  setSurveyHome(urlId: string, dto: SurveyHomePatchDto): Observable<RevisionMessageDto> {
    return this.http.patch<RevisionMessageDto>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/home`, dto);
  }
}
