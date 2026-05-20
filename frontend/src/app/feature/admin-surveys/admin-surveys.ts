import { Component, signal, computed } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Button } from '../../shared/components/button/button';
import { Tabs, TabItem } from '../../shared/components/tabs/tabs';
import { Search } from '../../shared/components/search/search';
import { GtTable } from '../../shared/components/table/table';
import { CreateSurveyForm } from '../user-profile/components/create-survey-form/create-survey-form';
import { ROUTES } from '../../shared/models/routes.constants';
import { StatStatus, SurveysTab, StatsLabel, PrimeIcon } from '../../shared/models/enums';
import { AdminSurvey } from './admin-surveys.model';
import { ADMIN_SURVEYS_MOCK } from './admin-surveys.mock';
import { ADMIN_SURVEYS_COLUMNS } from './admin-surveys.config';
import { lockBodyScroll, unlockBodyScroll } from '../../shared/utils/scroll-lock.util';

type FormMode = 'create' | 'edit';

@Component({
  selector: 'gt-admin-surveys',
  imports: [Header, Footer, CreateSurveyForm, PageHeaderRole, Button, Tabs, Search, GtTable],
  templateUrl: './admin-surveys.html',
  styleUrl: './admin-surveys.scss',
})
export class AdminSurveys {
  readonly routes = ROUTES;
  readonly StatStatus = StatStatus;
  readonly SurveysTab = SurveysTab;
  readonly tableColumns = ADMIN_SURVEYS_COLUMNS;

  readonly surveys = signal<AdminSurvey[]>(ADMIN_SURVEYS_MOCK);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  readonly activeTab = signal<SurveysTab>(SurveysTab.All);

  setTab(tab: SurveysTab): void {
    this.activeTab.set(tab);
  }

  // ── Search ────────────────────────────────────────────────────────────────
  readonly searchQuery = signal('');

  private matchesQuery(s: AdminSurvey, q: string): boolean {
    return (
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q)
    );
  }

  readonly filteredSurveys = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.surveys();
    return this.surveys().filter(s => this.matchesQuery(s, q));
  });

  readonly unmoderatedSurveys = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.surveys()
      .filter(s => !s.published)
      .filter(s => !q || this.matchesQuery(s, q));
  });

  readonly displayedSurveys = computed(() =>
    this.activeTab() === SurveysTab.Unmoderated ? this.unmoderatedSurveys() : this.filteredSurveys()
  );

  // ── Summary KPIs ──────────────────────────────────────────────────────────
  readonly totalSurveys    = computed(() => this.surveys().length);
  readonly publishedCount  = computed(() => this.surveys().filter((s) => s.published).length);
  readonly activeCount     = computed(() => this.surveys().filter((s) => s.status === StatStatus.Active).length);
  readonly totalResponses  = computed(() => this.surveys().reduce((sum, s) => sum + s.responses, 0));
  readonly unmoderatedCount = computed(() => this.surveys().filter((s) => !s.published).length);

  readonly tabItems = computed<TabItem[]>(() => [
    { value: SurveysTab.All,         label: StatsLabel.AllSurveys,  badge: this.totalSurveys() },
    { value: SurveysTab.Unmoderated, label: StatsLabel.Unmoderated, badge: this.unmoderatedCount() || null, badgeVariant: 'warn' },
  ]);

  readonly kpiCards = computed(() => [
    { icon: PrimeIcon.List,        value: this.totalSurveys(),   label: StatsLabel.TotalSurveys,   accent: false },
    { icon: PrimeIcon.Eye,         value: this.publishedCount(), label: StatsLabel.Published,      accent: true  },
    { icon: PrimeIcon.CheckCircle, value: this.activeCount(),    label: StatsLabel.Active,         accent: false },
    { icon: PrimeIcon.Users,       value: this.totalResponses(), label: StatsLabel.TotalResponses, accent: false },
  ]);

  // ── Form panel ────────────────────────────────────────────────────────────
  readonly showForm = signal(false);
  readonly formMode = signal<FormMode>('create');
  readonly editingSurveyId = signal<string | null>(null);

  openCreateForm(): void {
    this.formMode.set('create');
    this.editingSurveyId.set(null);
    this.showForm.set(true);
    lockBodyScroll();
  }

  openEditForm(id: string): void {
    this.formMode.set('edit');
    this.editingSurveyId.set(id);
    this.showForm.set(true);
    lockBodyScroll();
  }

  closeForm(): void {
    this.showForm.set(false);
    unlockBodyScroll();
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  togglePublish(id: string): void {
    this.surveys.update((list) =>
      list.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    );
  }

  deleteSurvey(id: string): void {
    this.surveys.update((list) => list.filter((s) => s.id !== id));
  }
}
