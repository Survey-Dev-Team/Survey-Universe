import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Tabs, TabItem } from '../../shared/components/tabs/tabs';
import { KpiRow, KpiCard } from '../../shared/components/kpi-row/kpi-row';
import { CreateSurveyForm } from '../user-profile/components/create-survey-form/create-survey-form';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { ROUTES } from '../../shared/models/routes.constants';
import { MySurveysTab, CreatedSurveyStatus, PrimeIcon } from '../../shared/models/enums';
import { CompletedSurvey, ResponseAboutMe, CreatedSurvey } from './my-surveys.model';
import { COMPLETED_SURVEYS_MOCK, RESPONSES_ABOUT_ME_MOCK, CREATED_SURVEYS_MOCK } from './my-surveys.mock';
import {
  MY_SURVEYS_KPI_CONFIG,
  MY_SURVEYS_TAB_CONFIG,
  CREATED_STATUS_LABELS,
} from './my-surveys.config';

@Component({
  selector: 'gt-my-surveys',
  imports: [RouterLink, Header, Footer, CreateSurveyForm, PageHeaderRole, Tabs, KpiRow, SurveyCard],
  templateUrl: './my-surveys.html',
  styleUrl: './my-surveys.scss',
})
export class MySurveys {
  readonly routes              = ROUTES;
  readonly MySurveysTab        = MySurveysTab;
  readonly CreatedSurveyStatus = CreatedSurveyStatus;
  readonly PrimeIcon           = PrimeIcon;

  readonly activeTab = signal<MySurveysTab>(MySurveysTab.Completed);

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly completedSurveys = signal<CompletedSurvey[]>(COMPLETED_SURVEYS_MOCK);
  readonly responsesAboutMe = signal<ResponseAboutMe[]>(RESPONSES_ABOUT_ME_MOCK);
  readonly createdSurveys   = signal<CreatedSurvey[]>(CREATED_SURVEYS_MOCK);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  readonly totalCompleted = computed(() => this.completedSurveys().length);
  readonly avgCompletion  = computed(() => {
    const list = this.completedSurveys();
    if (!list.length) return 0;
    return Math.round(list.reduce((s, x) => s + x.completionRate, 0) / list.length);
  });
  readonly totalRespondents = computed(() =>
    this.responsesAboutMe().reduce((s, r) => s + r.respondents, 0)
  );
  readonly avgFeedbackScore = computed(() => {
    const list = this.responsesAboutMe();
    if (!list.length) return 0;
    return Math.round(list.reduce((s, r) => s + r.avgScore, 0) / list.length);
  });

  readonly kpiCards = computed<KpiCard[]>(() => [
    { ...MY_SURVEYS_KPI_CONFIG[0], value: this.totalCompleted()         },
    { ...MY_SURVEYS_KPI_CONFIG[1], value: this.avgCompletion() + '%'    },
    { ...MY_SURVEYS_KPI_CONFIG[2], value: this.totalRespondents()       },
    { ...MY_SURVEYS_KPI_CONFIG[3], value: this.avgFeedbackScore() + '%' },
  ]);

  readonly tabItems = computed<TabItem[]>(() => [
    { ...MY_SURVEYS_TAB_CONFIG[0], badge: this.completedSurveys().length },
    { ...MY_SURVEYS_TAB_CONFIG[1], badge: this.responsesAboutMe().length },
    { ...MY_SURVEYS_TAB_CONFIG[2], badge: this.createdSurveys().length   },
  ]);

  readonly createdStatusLabel = CREATED_STATUS_LABELS;

  setTab(tab: MySurveysTab): void {
    this.activeTab.set(tab);
  }

  // ── Form panel ────────────────────────────────────────────────────────────
  readonly showForm = signal(false);

  openCreateForm(): void {
    this.showForm.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeForm(): void {
    this.showForm.set(false);
    document.body.style.overflow = '';
  }
}
