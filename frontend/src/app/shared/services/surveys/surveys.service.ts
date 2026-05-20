import { inject, Injectable, signal } from '@angular/core';
import { delay, Observable } from 'rxjs';
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
  availableCategories = signal<string[]>([]);
  availableCreatorIds = signal<string[]>([]);

  loadSurveys(params: SurveysQueryParams = {}): void {
    this.loading.set(true);

    this.api.getSurveys(params).pipe(delay(450)).subscribe({
      next: (response) => {
        this.surveys.set(response.content);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.hasNext.set(response.hasNext);
        this.loading.set(false);

        const newCategories = response.content.flatMap(s => s.category);
        const newCreatorIds = response.content.map(s => s.creatorUrlId);
        this.availableCategories.update(existing => [...new Set([...existing, ...newCategories])]);
        this.availableCreatorIds.update(existing => [...new Set([...existing, ...newCreatorIds])]);
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
