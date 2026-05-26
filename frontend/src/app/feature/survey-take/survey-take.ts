import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ROUTES } from '../../shared/models/routes.constants';
import { SurveysApiService } from '../../shared/services/surveys/surveys-api.service';
import { ToastService } from '../../shared/services/toast-service/toast-service';
import { SurveySubmitStateService } from '../../shared/services/survey-submit-state/survey-submit-state.service';
import { QuestionBase, SurveyReadSummary, AnswerSubmit } from '../../shared/models/interfaces';

const NON_ANSWER_TYPES = new Set(['title', 'text', 'image', 'space', 'page_break']);

@Component({
  selector: 'gt-survey-take',
  imports: [Header, Footer, PageHeaderRole, EmptyState, RouterLink, FormsModule, ToastModule],
  templateUrl: './survey-take.html',
  styleUrl: './survey-take.scss',
})
export class SurveyTake implements OnInit {
  private readonly route    = inject(ActivatedRoute);
  readonly router           = inject(Router);
  private readonly api      = inject(SurveysApiService);
  private readonly toast    = inject(ToastService);
  private readonly submitState = inject(SurveySubmitStateService);

  readonly surveyId          = signal<string>('');
  readonly surveyDetailRoute = signal<string>('');
  readonly mySurveysRoute    = `/${ROUTES.USER_SURVEYS}`;
  readonly isLoading         = signal(true);
  readonly isSubmitting      = signal(false);
  readonly isSubmitted       = signal(false);
  readonly summary           = signal<SurveyReadSummary | null>(null);
  readonly questions         = signal<QuestionBase[]>([]);
  readonly answers           = signal<Map<string, AnswerSubmit>>(new Map());

  // ── Pagination ──────────────────────────────────────────────────────────────
  readonly currentPage = signal(0);

  readonly pages = computed(() => {
    const result: QuestionBase[][] = [];
    let current: QuestionBase[] = [];
    for (const q of this.questions()) {
      if (q.type === 'page_break') {
        result.push(current);
        current = [];
      } else {
        current.push(q);
      }
    }
    result.push(current);
    return result.filter(p => p.length > 0);
  });

  readonly currentPageQuestions = computed(() => this.pages()[this.currentPage()] ?? []);
  readonly totalPages            = computed(() => this.pages().length);
  readonly isFirstPage           = computed(() => this.currentPage() === 0);
  readonly isLastPage            = computed(() => this.currentPage() === this.totalPages() - 1);

  nextPage(): void {
    const unanswered = this.currentPageQuestions().filter(q => {
      if (!q.is_required || NON_ANSWER_TYPES.has(q.type)) return false;
      const ans = this.answers().get(q.id);
      if (!ans) return true;
      if (q.type === 'radio_button' || q.type === 'checkbox') return (ans.options ?? []).length === 0;
      return !ans.value?.trim();
    });

    if (unanswered.length > 0) {
      this.toast.showToast({ severity: 'warn', message: 'Required fields', detail: 'Please answer all required questions on this page.', life: 4000 });
      return;
    }

    this.currentPage.update(p => p + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    this.currentPage.update(p => p - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.surveyId.set(id);
    this.surveyDetailRoute.set(`/${ROUTES.SURVEYS}/${id}`);

    if (this.submitState.hasSubmitted(id)) {
      this.router.navigate([`/${ROUTES.SURVEYS}/${id}`]);
      return;
    }

    this.api.getSurvey(id).subscribe({
      next: (data) => {
        this.summary.set(data.summary);
        this.questions.set([...data.questions].sort((a, b) => a.sort_order - b.sort_order));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.showToast({ severity: 'error', message: 'Error', detail: 'Failed to load survey.', life: 4000 });
      },
    });
  }

  // ── Answer helpers ──────────────────────────────────────────────────────────

  getValue(questionId: string): string {
    return this.answers().get(questionId)?.value ?? '';
  }

  setValue(questionId: string, value: string): void {
    const map = new Map(this.answers());
    map.set(questionId, { questionId, value, options: [] });
    this.answers.set(map);
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    return this.answers().get(questionId)?.options?.includes(optionId) ?? false;
  }

  toggleCheckbox(questionId: string, optionId: string): void {
    const map = new Map(this.answers());
    const current = map.get(questionId)?.options ?? [];
    const updated = current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : [...current, optionId];
    map.set(questionId, { questionId, value: '', options: updated });
    this.answers.set(map);
  }

  setRadio(questionId: string, optionId: string): void {
    const map = new Map(this.answers());
    map.set(questionId, { questionId, value: '', options: [optionId] });
    this.answers.set(map);
  }

  isRadioSelected(questionId: string, optionId: string): boolean {
    return this.answers().get(questionId)?.options?.[0] === optionId;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  submit(): void {
    const unanswered = this.questions().filter(q => {
      if (!q.is_required || NON_ANSWER_TYPES.has(q.type)) return false;
      const ans = this.answers().get(q.id);
      if (!ans) return true;
      if (q.type === 'radio_button' || q.type === 'checkbox') {
        return (ans.options ?? []).length === 0;
      }
      return !ans.value?.trim();
    });

    if (unanswered.length > 0) {
      this.toast.showToast({ severity: 'warn', message: 'Required fields', detail: 'Please answer all required questions.', life: 4000 });
      return;
    }

    this.isSubmitting.set(true);
    this.api.submitResponse(this.surveyId(), { answers: Array.from(this.answers().values()) }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitState.markSubmitted(this.surveyId());
        this.isSubmitted.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to submit.', life: 4000 });
      },
    });
  }
}
