import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SURVEY_BASE_URL, API_ENDPOINTS } from '../../models/api';
import { PagedResponse, SurveyReadSummary, SurveysQueryParams } from '../../models/interfaces';

@Injectable({ providedIn: 'root' })
export class SurveysApiService {
  private http = inject(HttpClient);

  getSurveys(params: SurveysQueryParams = {}): Observable<PagedResponse<SurveyReadSummary>> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<PagedResponse<SurveyReadSummary>>(
      `${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEYS}`,
      { params: httpParams }
    );
  }

  getHomeSurveys(): Observable<SurveyReadSummary[]> {
    return this.http.get<SurveyReadSummary[]>(`${SURVEY_BASE_URL}${API_ENDPOINTS.SURVEYS_HOME}`);
  }
}
