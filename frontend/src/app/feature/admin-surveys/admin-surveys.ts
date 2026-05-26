import { Component, signal, computed, inject, OnInit } from '@angular/core';
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
import { ADMIN_SURVEYS_COLUMNS } from './admin-surveys.config';
import { lockBodyScroll, unlockBodyScroll } from '../../shared/utils/scroll-lock.util';
import { AdminDataService } from '../../shared/services/admin/admin-data.service';
import { ToastService } from '../../shared/services/toast-service/toast-service';
import { SurveyDetailsSummaryDto, SurveyCreateRequestDto, SurveyUpdateRequestDto } from '../../shared/models/api/admin-data-api.models';
import { SurveyCreateRequest, SurveyDetailsResponse } from '../../shared/models/interfaces';

type FormMode = 'create' | 'edit';

@Component({
  selector: 'gt-admin-surveys',
  imports: [Header, Footer, CreateSurveyForm, PageHeaderRole, Button, Tabs, Search, GtTable],
  templateUrl: './admin-surveys.html',
  styleUrl: './admin-surveys.scss',
})
export class AdminSurveys implements OnInit {
  private adminService = inject(AdminDataService);
  private toastService = inject(ToastService);

  readonly routes      = ROUTES;
  readonly StatStatus  = StatStatus;
  readonly SurveysTab  = SurveysTab;
  readonly tableColumns = ADMIN_SURVEYS_COLUMNS;

  readonly loading = this.adminService.surveysLoading;
  readonly savingForm = signal(false);

  readonly surveys = computed(() =>
    this.adminService.surveys().map(dto => this.mapToAdminSurvey(dto))
  );

  ngOnInit(): void {
    this.adminService.loadAdminSurveys();
    this.adminService.loadUsers();
  }

  private mapToAdminSurvey(dto: SurveyDetailsSummaryDto): AdminSurvey {
    // TODO(backend): додати поле `creatorName: string` до SurveyDetailsSummaryDto.
    // Поточний підхід (пошук по GET /users) ненадійний — якщо юзера видалено, ім'я загубиться.
    // Рішення: зберігати `creator_name` (firstName + " " + lastName) у документі Survey
    // на момент створення/редагування (в SurveyToDtoMapper.toAdminSummaryDto — через UserService.findById),
    // і повертати його поряд з `creatorUrlId`.
    return {
      id:            dto.urlId,
      title:         dto.title,
      coverImage:    dto.icon ?? '',
      category:      Array.isArray(dto.category) ? dto.category.join(', ') : (dto.category ?? ''),
      author:        dto.creatorName ?? this.adminService.users().find(u => u.urlId === dto.creatorUrlId)?.name ?? dto.creatorUrlId,
      questionCount: 0,
      responses:     dto.responseCount,
      status:        dto.status === 'published' ? StatStatus.Active : StatStatus.Passed,
      published:     dto.status === 'published',
      createdAt:     dto.createdAt
        ? new Date(dto.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '',
      description:   dto.description ?? '',
    };
  }

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
  readonly totalSurveys     = computed(() => this.surveys().length);
  readonly publishedCount   = computed(() => this.surveys().filter((s) => s.published).length);
  readonly activeCount      = computed(() => this.surveys().filter((s) => s.status === StatStatus.Active).length);
  readonly totalResponses   = computed(() => this.surveys().reduce((sum, s) => sum + s.responses, 0));
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
  readonly showForm        = signal(false);
  readonly closingForm     = signal(false);
  readonly formMode        = signal<FormMode>('create');
  readonly formType        = signal<'survey' | 'test'>('survey');
  readonly editingSurveyId = signal<string | null>(null);
  readonly editingData     = signal<SurveyDetailsResponse | null>(null);
  readonly loadingEdit     = signal(false);
  private _editingRevision: string | null = null;

  openCreateForm(): void {
    this.formMode.set('create');
    this.formType.set('survey');
    this.editingSurveyId.set(null);
    this.editingData.set(null);
    this._editingRevision = null;
    this.showForm.set(true);
    lockBodyScroll();
  }

  openEditForm(urlId: string): void {
    this.formMode.set('edit');
    this.editingSurveyId.set(urlId);
    this.editingData.set(null);
    this._editingRevision = null;
    this.loadingEdit.set(true);
    this.showForm.set(true);
    lockBodyScroll();

    this.adminService.getAdminSurveyByUrlId(urlId).subscribe({
      next: (data) => {
        this._editingRevision = data.revision;
        this.editingData.set(data as unknown as SurveyDetailsResponse);
        this.loadingEdit.set(false);
      },
      error: () => {
        this.loadingEdit.set(false);
        this.closeForm();
      },
    });
  }

  closeForm(): void {
    if (this.closingForm()) return;
    this.closingForm.set(true);
    setTimeout(() => {
      this.closingForm.set(false);
      this.showForm.set(false);
      unlockBodyScroll();
    }, 550);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  togglePublish(urlId: string): void {
    this.adminService.getAdminSurveyByUrlId(urlId).subscribe({
      next: (details) => {
        this.adminService.publishSurvey(urlId, { revision: details.revision });
      },
      error: (err) => {
        this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to fetch survey details.', life: 4000 });
      },
    });
  }

  deleteSurvey(urlId: string): void {
    this.adminService.deleteAdminSurvey(urlId);
  }

  onFormSave(payload: SurveyCreateRequest): void {
    this._doSave(payload, 'published');
  }

  onFormDraft(payload: SurveyCreateRequest): void {
    this._doSave(payload, 'draft');
  }

  private _doSave(payload: SurveyCreateRequest, status: 'published' | 'draft'): void {
    this.savingForm.set(true);
    if (this.formMode() === 'edit' && this.editingSurveyId() && this._editingRevision) {
      const urlId = this.editingSurveyId()!;
      this.adminService.updateAdminSurvey(
        urlId,
        { ...(payload as SurveyCreateRequestDto), revision: this._editingRevision } as SurveyUpdateRequestDto,
        (res) => {
          this._editingRevision = res.revision;
          this.savingForm.set(false);
          this.closeForm();
        },
      );
    } else {
      this.adminService.createAdminSurvey(
        { ...(payload as SurveyCreateRequestDto), status },
        () => { this.savingForm.set(false); this.closeForm(); },
        () => { this.savingForm.set(false); },
      );
    }
  }
}
