import { Component, computed, inject, model, signal, ViewEncapsulation } from '@angular/core';
import { CREATOR_NAMES } from '../../../../shared/utils/survey-mapper.util';
import { SurveysService } from '../../../../shared/services/surveys/surveys.service';
import { VisibilityLabel } from '../../../../shared/models/enums';
import {
  DATE_FILTER_OPTIONS,
  DURATION_FILTER_OPTIONS,
  FilterGroup,
  MultiFilterKey,
  STATUS_FILTER_OPTIONS,
  SurveyFilters,
} from '../../surveys-page.model';
import { toggleMultiFilter } from '../../surveys-page.utils';

@Component({
  selector: 'gt-surveys-filters',
  templateUrl: './surveys-filters.html',
  styleUrl: './surveys-filters.scss',
  imports: [],
  encapsulation: ViewEncapsulation.None,
})
export class SurveysFilters {
  readonly filters = model.required<SurveyFilters>();

  private surveysService = inject(SurveysService);

  readonly FilterGroup = FilterGroup;
  readonly VisibilityLabel = VisibilityLabel;
  readonly dateOptions = DATE_FILTER_OPTIONS;
  readonly statusOptions = STATUS_FILTER_OPTIONS;
  readonly durationOptions = DURATION_FILTER_OPTIONS;

  readonly openGroups = signal<Set<FilterGroup>>(
    typeof window !== 'undefined' && window.innerWidth <= 768
      ? new Set([FilterGroup.Date])
      : new Set([
          FilterGroup.Date,
          FilterGroup.Category,
          FilterGroup.Author,
          FilterGroup.Duration,
          FilterGroup.Test,
          FilterGroup.Status,
        ]),
  );

  readonly categoryOptions = computed(() =>
    this.surveysService.availableCategories().map(c => c.charAt(0).toUpperCase() + c.slice(1)),
  );

  readonly authorOptions = computed(() =>
    this.surveysService.availableCreatorIds()
      .map(id => CREATOR_NAMES[id])
      .filter(Boolean),
  );

  isGroupOpen(name: FilterGroup): boolean {
    return this.openGroups().has(name);
  }

  toggleGroup(name: FilterGroup): void {
    this.openGroups.update(set => {
      if (set.has(name)) {
        const next = new Set(set);
        next.delete(name);
        return next;
      }
      if (window.innerWidth <= 768) {
        return new Set<FilterGroup>([name]);
      }
      return new Set<FilterGroup>([...set, name]);
    });
  }

  toggleMulti(key: MultiFilterKey, value: string): void {
    this.filters.update(f => toggleMultiFilter(f, key, value));
  }

  toggleTest(): void {
    this.filters.update(f => ({ ...f, isTest: !f.isTest }));
  }
}
