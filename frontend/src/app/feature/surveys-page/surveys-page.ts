import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Search } from '../../shared/components/search/search';
import { RouterLink } from '@angular/router';
import { SurveysService } from '../../shared/services/surveys/surveys.service';
import { SurveyCardModel } from '../../shared/models/interfaces';
import { ALL_SURVEYS_MOCK } from './surveys-page.mock';

@Component({
  selector: 'gt-surveys-page',
  imports: [Header, Footer, PageHeaderRole, SurveyCard, Search, RouterLink],
  templateUrl: './surveys-page.html',
  styleUrl: './surveys-page.scss',
})
export class SurveysPage implements OnInit {
  private surveysService = inject(SurveysService);

  ngOnInit(): void {
    this.surveysService.getAllSurveys().subscribe({
      next: (response) => console.log('[SurveysPage] API response:', response),
      error: (err) => console.error('[SurveysPage] API error:', err),
    });
  }

  readonly searchQuery = signal('');

  readonly openGroups = signal<Set<string>>(
    typeof window !== 'undefined' && window.innerWidth <= 768
      ? new Set(['Date'])
      : new Set(['Date', 'Category', 'Author', 'Test', 'Status'])
  );

  isGroupOpen(name: string): boolean {
    return this.openGroups().has(name);
  }

  toggleGroup(name: string) {
    this.openGroups.update(set => {
      if (set.has(name)) {
        const next = new Set(set);
        next.delete(name);
        return next;
      }
      // на мобайлі — лише один відкритий, на десктопі всі можуть бути відкриті
      if (window.innerWidth <= 768) {
        return new Set([name]);
      }
      return new Set([...set, name]);
    });
  }

  readonly filters = signal({
    dates: [] as string[],
    categories: [] as string[],
    authors: [] as string[],
    statuses: [] as string[],
    isTest: false,
  });

  readonly allSurveys: SurveyCardModel[] = ALL_SURVEYS_MOCK;

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.dates.length || f.categories.length || f.authors.length || f.statuses.length || f.isTest || this.searchQuery());
  });

  readonly filteredSurveys = computed(() => {
    const f = this.filters();
    const q = this.searchQuery().toLowerCase();
    return this.allSurveys.filter(s => {
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (f.categories.length && !f.categories.includes(s.category)) return false;
      if (f.authors.length && !f.authors.includes(s.author)) return false;
      if (f.statuses.length && !f.statuses.includes(s.status ?? '')) return false;
      if (f.isTest && s.category !== 'Test') return false;
      return true;
    });
  });

  toggleMulti(key: 'categories' | 'authors' | 'dates' | 'statuses', value: string) {
    this.filters.update(f => {
      const current = f[key];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...f, [key]: updated };
    });
  }

  toggleTest() {
    this.filters.update(f => ({ ...f, isTest: !f.isTest }));
  }
}
