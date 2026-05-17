import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveysApiService } from './surveys-api.service';
import { PagedResponse, SurveyReadSummary, SurveysQueryParams } from '../../models/interfaces';

@Injectable({ providedIn: 'root' })
export class SurveysService {
  private api = inject(SurveysApiService);

  surveys = signal<SurveyReadSummary[]>([]);
  loading = signal<boolean>(false);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  hasNext = signal<boolean>(false);

  loadSurveys(params: SurveysQueryParams = {}): void {
    this.loading.set(true);

    this.api.getSurveys(params).subscribe({
      next: (response) => {
        this.surveys.set(response.content);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.hasNext.set(response.hasNext);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getAllSurveys(params: SurveysQueryParams = {}): Observable<PagedResponse<SurveyReadSummary>> {
    return this.api.getSurveys(params);
  }

  getHomeSurveys(): Observable<SurveyReadSummary[]> {
    return this.api.getHomeSurveys();
  }
}
