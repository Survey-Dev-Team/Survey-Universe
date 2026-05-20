import { Component, inject, signal, computed, effect } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Search } from '../../shared/components/search/search';
import { RouterLink } from '@angular/router';
import { SurveysService } from '../../shared/services/surveys/surveys.service';
import { mapSurveyToCard } from '../../shared/utils/survey-mapper.util';
import { SurveyFilters } from './surveys-page.model';
import { buildSurveysParams, matchesDuration } from './surveys-page.utils';
import { SurveysFilters } from './components/surveys-filters/surveys-filters';
import { SurveyCardSkeleton } from '../../shared/components/survey-card-skeleton/survey-card-skeleton';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'gt-surveys-page',
  imports: [Header, Footer, PageHeaderRole, SurveyCard, SurveyCardSkeleton, EmptyState, Search, RouterLink, SurveysFilters],
  templateUrl: './surveys-page.html',
  styleUrl: './surveys-page.scss',
})
export class SurveysPage {
  protected surveysService = inject(SurveysService);

  readonly searchQuery = signal<string>('');
  readonly filters = signal<SurveyFilters>({
    dates: [],
    categories: [],
    authors: [],
    durations: [],
    statuses: [],
    isTest: false,
  });

  readonly surveys = computed(() => {
    const mapped = this.surveysService.surveys().map((s, i) => mapSurveyToCard(s, i));
    const durations = this.filters().durations;
    if (!durations.length) return mapped;
    return mapped.filter(s => matchesDuration(s.estimatedTime, durations));
  });

  readonly skeletonItems = computed(() => {
    const prev = this.surveys().length;
    return Array(prev > 0 ? Math.min(prev, 12) : 6).fill(0);
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(
      f.dates.length ||
      f.categories.length ||
      f.authors.length ||
      f.durations.length ||
      f.statuses.length ||
      f.isTest ||
      this.searchQuery()
    );
  });

  constructor() {
    effect(() => {
      this.surveysService.loadSurveys(buildSurveysParams(this.filters(), this.searchQuery()));
    });
  }

  clearFilters(): void {
    this.filters.set({ dates: [], categories: [], authors: [], durations: [], statuses: [], isTest: false });
    this.searchQuery.set('');
  }
}

