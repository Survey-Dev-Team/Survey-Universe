import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL } from '../../models/api';
import {
  OverviewStatsDto,
  ActivityMetricsDto,
  SurveyTableItemDto,
  CompletionFunnelDto,
  TestDashboardOverviewDto,
  PerformanceAnalysisDto,
  TestSummaryDto,
  UserTableSummaryDto,
  UserReportDto,
  ActiveAssessmentsDashboardDto,
  UserCreatedSurveyCardDto,
  UserCompletedTestCardDto,
  ActiveAssessmentCardDto,
} from '../../models/api/aggregation-api.models';

@Injectable({ providedIn: 'root' })
export class AggregationApiService {
  private http = inject(HttpClient);

  // ── /aggregation/surveys ──────────────────────────────────────────────────

  getSurveysOverview(range = 'all'): Observable<OverviewStatsDto> {
    return this.http.get<OverviewStatsDto>(
      `${SURVEY_BASE_URL}aggregation/surveys/overview`,
      { params: new HttpParams().set('range', range) }
    );
  }

  getSurveysActivity(range = 'all'): Observable<ActivityMetricsDto> {
    return this.http.get<ActivityMetricsDto>(
      `${SURVEY_BASE_URL}aggregation/surveys/activity`,
      { params: new HttpParams().set('range', range) }
    );
  }

  getSurveysTable(range = 'all'): Observable<SurveyTableItemDto[]> {
    return this.http.get<SurveyTableItemDto[]>(
      `${SURVEY_BASE_URL}aggregation/surveys/table`,
      { params: new HttpParams().set('range', range) }
    );
  }

  // ── /aggregation/tests ────────────────────────────────────────────────────

  getTestsFunnel(range = 'all'): Observable<CompletionFunnelDto> {
    return this.http.get<CompletionFunnelDto>(
      `${SURVEY_BASE_URL}aggregation/tests/funnel`,
      { params: new HttpParams().set('range', range) }
    );
  }

  getTestsOverview(range = 'all'): Observable<TestDashboardOverviewDto> {
    return this.http.get<TestDashboardOverviewDto>(
      `${SURVEY_BASE_URL}aggregation/tests/overview`,
      { params: new HttpParams().set('range', range) }
    );
  }

  getTestsPerformance(range = 'all'): Observable<PerformanceAnalysisDto> {
    return this.http.get<PerformanceAnalysisDto>(
      `${SURVEY_BASE_URL}aggregation/tests/performance`,
      { params: new HttpParams().set('range', range) }
    );
  }

  getTestsTable(range = 'all'): Observable<TestSummaryDto[]> {
    return this.http.get<TestSummaryDto[]>(
      `${SURVEY_BASE_URL}aggregation/tests/table`,
      { params: new HttpParams().set('range', range) }
    );
  }

  // ── /aggregation/users ────────────────────────────────────────────────────

  getUsersSummary(): Observable<UserTableSummaryDto[]> {
    return this.http.get<UserTableSummaryDto[]>(`${SURVEY_BASE_URL}aggregation/users/summary`);
  }

  getUserReport(userId: string): Observable<UserReportDto> {
    return this.http.get<UserReportDto>(`${SURVEY_BASE_URL}aggregation/users/${userId}/report`);
  }

  // ── /aggregation/surveys/public ───────────────────────────────────────────

  getActiveAssessments(): Observable<ActiveAssessmentsDashboardDto> {
    return this.http.get<ActiveAssessmentsDashboardDto>(
      `${SURVEY_BASE_URL}aggregation/surveys/public/active`
    );
  }

  getMyCreatedSurveys(): Observable<UserCreatedSurveyCardDto[]> {
    return this.http.get<UserCreatedSurveyCardDto[]>(
      `${SURVEY_BASE_URL}aggregation/surveys/public/my`
    );
  }

  getCompletedTests(): Observable<UserCompletedTestCardDto[]> {
    return this.http.get<UserCompletedTestCardDto[]>(
      `${SURVEY_BASE_URL}aggregation/surveys/public/complete`
    );
  }

  getAssessmentDetail(urlId: string): Observable<ActiveAssessmentCardDto> {
    return this.http.get<ActiveAssessmentCardDto>(
      `${SURVEY_BASE_URL}aggregation/surveys/public/${urlId}/details`
    );
  }
}
