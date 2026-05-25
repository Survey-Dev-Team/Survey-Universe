import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Tabs, TabItem } from '../../shared/components/tabs/tabs';
import { CreateSurveyForm } from '../user-profile/components/create-survey-form/create-survey-form';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Button } from '../../shared/components/button/button';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ROUTES } from '../../shared/models/routes.constants';
import { MySurveysTab, CreatedSurveyStatus, PrimeIcon } from '../../shared/models/enums';
import { CompletedSurvey, SurveyStats, CreatedSurvey } from './my-surveys.model';
import { AggregationApiService } from '../../shared/services/aggregation/aggregation-api.service';
import {
  MY_SURVEYS_TAB_CONFIG,
  CREATED_STATUS_LABELS,
} from './my-surveys.config';
import { lockBodyScroll, unlockBodyScroll } from '../../shared/utils/scroll-lock.util';
import { UsersApiService } from '../../shared/services/users/users-api.service';
import { UserStoreService } from '../../shared/services/user-store-service/user-store-service';
import { UserSurveyResponseDto } from '../../shared/models/api/admin-data-api.models';
import { SurveysApiService } from '../../shared/services/surveys/surveys-api.service';
import { ToastService } from '../../shared/services/toast-service/toast-service';
import { SurveyCreateRequest, SurveyDetailsSummary, SurveyDetailsResponse } from '../../shared/models/interfaces';

@Component({
  selector: 'gt-my-surveys',
  imports: [Header, Footer, CreateSurveyForm, PageHeaderRole, Tabs, SurveyCard, Button, EmptyState, Dialog, ToastModule],
  templateUrl: './my-surveys.html',
  styleUrl: './my-surveys.scss',
})
export class MySurveys implements OnInit {
  private usersApi     = inject(UsersApiService);
  private userStore    = inject(UserStoreService);
  private surveysApi      = inject(SurveysApiService);
  private aggregationApi  = inject(AggregationApiService);
  private router          = inject(Router);
  private toastService    = inject(ToastService);

  readonly routes              = ROUTES;
  readonly MySurveysTab        = MySurveysTab;
  readonly CreatedSurveyStatus = CreatedSurveyStatus;
  readonly PrimeIcon           = PrimeIcon;

  readonly activeTab = signal<MySurveysTab>(MySurveysTab.Completed);

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly completedSurveys = signal<CompletedSurvey[]>([]);
  readonly surveyStats      = signal<SurveyStats[]>([]);
  readonly createdSurveys   = signal<CreatedSurvey[]>([]);
  readonly savingForm       = signal(false);

  readonly surveyStatsOnly = computed(() => this.surveyStats().filter(s => s.type === 'survey'));
  readonly testStatsOnly   = computed(() => this.surveyStats().filter(s => s.type === 'test'));

  ngOnInit(): void {
    const urlId = this.userStore.currentUser()?.urlId;
    if (!urlId) return;

    this.usersApi.getUserResponses(urlId).pipe(
      switchMap(responses => {
        if (responses.length === 0) return of({ responses, icons: {} as Record<string, string> });
        const uniqueIds = [...new Set(responses.map(r => r.surveyUrlId))];
        return forkJoin(
          Object.fromEntries(uniqueIds.map(id => [id, this.surveysApi.getSurvey(id)]))
        ).pipe(
          map(surveys => ({
            responses,
            icons: Object.fromEntries(
              Object.entries(surveys).map(([id, data]) => [id, (data as any).summary?.icon ?? ''])
            ) as Record<string, string>,
          }))
        );
      })
    ).subscribe({
      next: ({ responses, icons }) =>
        this.completedSurveys.set(responses.map(r => this.mapResponse(r, icons[r.surveyUrlId] ?? ''))),
    });

    this.surveysApi.getMySurveys().subscribe({
      next: (page) => this.createdSurveys.set(page.content.map(s => this._mapSummaryToCreated(s))),
    });

    this.aggregationApi.getActiveAssessments().subscribe({
      next: (data) => this.surveyStats.set([
        ...data.surveys.map(s => ({
          id:               s.urlId,
          type:             'survey' as const,
          title:            s.title,
          coverImage:       '',
          category:         s.category,
          totalRespondents: s.respondents,
          lastActivityAt:   s.formattedDate,
          avgScore:         s.avgCompletionRate,
        })),
        ...data.tests.map(t => ({
          id:               t.urlId,
          type:             'test' as const,
          title:            t.title,
          coverImage:       '',
          category:         t.category,
          totalRespondents: t.respondents,
          lastActivityAt:   t.formattedDate,
          avgScore:         t.avgScore,
        })),
      ]),
    });
  }

  private mapResponse(dto: UserSurveyResponseDto, coverImage = ''): CompletedSurvey {
    return {
      id:                dto.responseId,
      title:             dto.title,
      coverImage,
      category:          '',
      completedAt:       dto.submittedAt as string,
      completionRate:    100,
      totalQuestions:    (dto.answers as unknown[]).length,
      answeredQuestions: (dto.answers as unknown[]).length,
      timeSpentMin:      0,
    };
  }

  // ── KPIs ──────────────────────────────────────────────────────────────────
  readonly totalCompleted = computed(() => this.completedSurveys().length);

  readonly tabItems = computed<TabItem[]>(() => [
    { ...MY_SURVEYS_TAB_CONFIG[0], badge: this.completedSurveys().length },
    { ...MY_SURVEYS_TAB_CONFIG[1], badge: this.surveyStats().length   },
    { ...MY_SURVEYS_TAB_CONFIG[2], badge: this.createdSurveys().length   },
  ]);

  readonly createdStatusLabel = CREATED_STATUS_LABELS;

  setTab(tab: MySurveysTab): void {
    this.activeTab.set(tab);
  }

  // ── Form panel ────────────────────────────────────────────────────────────
  readonly showForm     = signal(false);
  readonly closingForm  = signal(false);
  readonly formMode     = signal<'create' | 'edit'>('create');
  readonly formType     = signal<'survey' | 'test'>('survey');
  readonly loadingEdit  = signal(false);
  readonly editingData  = signal<SurveyDetailsResponse | null>(null);
  private  _editingUrlId: string | null = null;
  private  _editingRevision: string | null = null;

  // ── Stat dialog ───────────────────────────────────────────────────────────
  readonly selectedStat      = signal<SurveyStats | null>(null);
  readonly statDialogVisible = signal(false);

  openStatDialog(stat: SurveyStats): void {
    this.selectedStat.set(stat);
    this.statDialogVisible.set(true);
  }

  browseSurveys(): void {
    this.router.navigate(['/', this.routes.SURVEYS]);
  }

  openCreateForm(): void {
    this.formMode.set('create');
    this.formType.set('survey');
    this.editingData.set(null);
    this._editingUrlId = null;
    this._editingRevision = null;
    this.showForm.set(true);
    lockBodyScroll();
  }

  openEditForm(survey: CreatedSurvey): void {
    this.formMode.set('edit');
    this.editingData.set(null);
    this._editingUrlId = survey.id;
    this._editingRevision = null;
    this.loadingEdit.set(true);
    this.showForm.set(true);
    lockBodyScroll();

    this.surveysApi.getMySurvey(survey.id).subscribe({
      next: (data: SurveyDetailsResponse) => {
        this._editingRevision = data.revision;
        this.editingData.set(data);
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

  onFormSave(payload: SurveyCreateRequest): void {
    this.savingForm.set(true);
    if (this.formMode() === 'edit' && this._editingUrlId && this._editingRevision) {
      this.surveysApi.updateMySurvey(this._editingUrlId, { ...payload, revision: this._editingRevision }).subscribe({
        next: (response: SurveyDetailsResponse) => {
          const updated = { ...this._mapSummaryToCreated(response.summary), questionCount: response.questions.length, status: CreatedSurveyStatus.Draft };
          this.createdSurveys.update(list => list.map(s => s.id === updated.id ? updated : s));
          this._editingRevision = response.revision;
          this.savingForm.set(false);
          this.closeForm();
        },
        error: (err) => {
          this.savingForm.set(false);
          this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to save survey.', life: 4000 });
        },
      });
    } else {
      this.surveysApi.createMySurvey(payload).subscribe({
        next: (response: SurveyDetailsResponse) => {
          const created = { ...this._mapSummaryToCreated(response.summary), questionCount: response.questions.length };
          this.createdSurveys.update(list => [created, ...list]);
          this.savingForm.set(false);
          this.closeForm();
        },
        error: (err) => {
          this.savingForm.set(false);
          this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to create survey.', life: 4000 });
        },
      });
    }
  }

  onFormDraft(payload: SurveyCreateRequest): void {
    this.onFormSave(payload);
  }

  showPublishedNotice(): void {
    this.toastService.showToast({
      severity: 'info',
      message: 'Survey is published',
      detail: 'This survey has already been published and cannot be edited.',
      life: 4000,
    });
  }

  private _mapSummaryToCreated(s: SurveyDetailsSummary): CreatedSurvey {
    return {
      id:            s.urlId,
      title:         s.title,
      coverImage:    s.icon ?? '',
      category:      s.category[0] ?? '',
      questionCount: 0,
      createdAt:     s.createdAt,
      status:        s.status as CreatedSurveyStatus,
    };
  }
}
