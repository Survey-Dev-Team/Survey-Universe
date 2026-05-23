import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL, API_ENDPOINTS } from '../../models/api';
import {
  PagedResponse,
  SurveyReadSummary,
  SurveysQueryParams,
  SurveyReadResponse,
  SurveyDetailsSummary,
  SurveyDetailsResponse,
  AdminSurveysQueryParams,
  MySurveysQueryParams,
  SurveyCreateRequest,
  SurveyUpdateRequest,
  RevisionRecord,
  RevisionMessage,
  SurveyHomePatch,
  SurveyResponseSubmit,
  SubmitResponseResult,
  UserSurveyResponse,
  PersonalSurveyResponse,
  SurveyStats,
  MessageResponse,
} from '../../models/interfaces';

@Injectable({ providedIn: 'root' })
export class SurveysApiService {
  private http = inject(HttpClient);

  // ── Public read ────────────────────────────────────────────────────────────

  getSurveys(params: SurveysQueryParams = {}): Observable<PagedResponse<SurveyReadSummary>> {
    return this.http.get<PagedResponse<SurveyReadSummary>>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEYS}`,
      { params: this.buildParams(params) }
    );
  }

  getSurvey(urlId: string): Observable<SurveyReadResponse> {
    return this.http.get<SurveyReadResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEYS}/${urlId}`);
  }

  getHomeSurveys(): Observable<SurveyReadSummary[]> {
    return this.http.get<SurveyReadSummary[]>(`${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEYS_HOME}`);
  }

  // ── My surveys ─────────────────────────────────────────────────────────────

  getMySurveys(params: MySurveysQueryParams = {}): Observable<PagedResponse<SurveyDetailsSummary>> {
    return this.http.get<PagedResponse<SurveyDetailsSummary>>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}`,
      { params: this.buildParams(params) }
    );
  }

  getMySurvey(urlId: string): Observable<SurveyDetailsResponse> {
    return this.http.get<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}/${urlId}`);
  }

  createMySurvey(body: SurveyCreateRequest): Observable<SurveyDetailsResponse> {
    return this.http.post<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}`, body);
  }

  updateMySurvey(urlId: string, body: SurveyUpdateRequest): Observable<SurveyDetailsResponse> {
    return this.http.put<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}/${urlId}`, body);
  }

  deleteMySurvey(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}/${urlId}`);
  }

  closeMySurvey(urlId: string, body: RevisionRecord): Observable<RevisionMessage> {
    return this.http.post<RevisionMessage>(`${SURVEY_BASE_URL}${API_ENDPOINTS.MY_SURVEYS}/${urlId}/close`, body);
  }

  // ── Admin surveys ──────────────────────────────────────────────────────────

  getAdminSurveys(params: AdminSurveysQueryParams = {}): Observable<PagedResponse<SurveyDetailsSummary>> {
    return this.http.get<PagedResponse<SurveyDetailsSummary>>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}`,
      { params: this.buildParams(params) }
    );
  }

  getAdminSurvey(urlId: string): Observable<SurveyDetailsResponse> {
    return this.http.get<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`);
  }

  createAdminSurvey(body: SurveyCreateRequest): Observable<SurveyDetailsResponse> {
    return this.http.post<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}`, body);
  }

  updateAdminSurvey(urlId: string, body: SurveyUpdateRequest): Observable<SurveyDetailsResponse> {
    return this.http.put<SurveyDetailsResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`, body);
  }

  deleteAdminSurvey(urlId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}`);
  }

  publishSurvey(urlId: string, body: RevisionRecord): Observable<RevisionMessage> {
    return this.http.post<RevisionMessage>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/publish`, body);
  }

  closeSurvey(urlId: string, body: RevisionRecord): Observable<RevisionMessage> {
    return this.http.post<RevisionMessage>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/close`, body);
  }

  draftSurvey(urlId: string, body: RevisionRecord): Observable<RevisionMessage> {
    return this.http.post<RevisionMessage>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/draft`, body);
  }

  setSurveyHome(urlId: string, body: SurveyHomePatch): Observable<RevisionMessage> {
    return this.http.patch<RevisionMessage>(`${SURVEY_BASE_URL}${API_ENDPOINTS.ADMIN_SURVEYS}/${urlId}/home`, body);
  }

  // ── Responses & stats ──────────────────────────────────────────────────────

  submitResponse(urlId: string, body: SurveyResponseSubmit): Observable<SubmitResponseResult> {
    return this.http.post<SubmitResponseResult>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEY_RESPONSES}/${urlId}/responses`, body
    );
  }

  getSurveyResponses(urlId: string): Observable<UserSurveyResponse[]> {
    return this.http.get<UserSurveyResponse[]>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEY_RESPONSES}/${urlId}/responses`
    );
  }

  getUserResponse(surveyUrlId: string, userUrlId: string): Observable<PersonalSurveyResponse> {
    return this.http.get<PersonalSurveyResponse>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEY_RESPONSES}/${surveyUrlId}/responses/${userUrlId}`
    );
  }

  getSurveyStats(urlId: string): Observable<SurveyStats> {
    return this.http.get<SurveyStats>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEY_RESPONSES}/${urlId}/stats`
    );
  }

  // ── Helper ─────────────────────────────────────────────────────────────────

  private buildParams(params: object): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }
}

