import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDataApiService } from './admin-data-api.service';
import {
  AdminUserDetailsDto,
  UserSurveyResponseDto,
  GetUsersParams,
  SurveyDetailsSummaryDto,
  AdminSurveysPageDto,
  SurveyDetailsResponseDto,
  SurveyCreateRequestDto,
  SurveyUpdateRequestDto,
  RevisionRecordDto,
  RevisionMessageDto,
  SurveyHomePatchDto,
  GetAdminSurveysParams,
} from '../../models/api/admin-data-api.models';
import { AppUser, CompletedSurvey } from '../../../feature/admin-users/admin-users.model';
import { UserRole } from '../../models/enums';
import { ToastService } from '../toast-service/toast-service';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private api          = inject(AdminDataApiService);
  private toastService = inject(ToastService);

  users         = signal<AppUser[]>([]);
  loading       = signal(false);
  totalElements = signal(0);
  totalPages    = signal(0);
  currentPage   = signal(0);

  surveys              = signal<SurveyDetailsSummaryDto[]>([]);
  surveysLoading       = signal(false);
  surveysTotalElements = signal(0);
  surveysTotalPages    = signal(0);
  surveysCurrentPage   = signal(0);

  // ── Load all users ──────────────────────────────────────────────────────

  loadUsers(params: GetUsersParams = {}): void {
    this.loading.set(true);

    this.api.getUsers(params).subscribe({
      next: (page) => {
        this.users.set(page.content.map(dto => this.mapUser(dto)));
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.currentPage.set(page.currentPage);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to load users.',
          life: 4000,
        });
        this.loading.set(false);
      },
    });
  }

  // ── Load responses for a specific user (called on row expand) ───────────

  loadUserResponses(userId: string, urlId: string): void {
    this.api.getUserResponses(urlId).subscribe({
      next: (responses) => {
        this.users.update(list =>
          list.map(u =>
            u.id === userId
              ? { ...u, surveys: responses.map(r => this.mapSurveyResponse(r)) }
              : u
          )
        );
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to load user responses.',
          life: 4000,
        });
      },
    });
  }

  // ── Delete user ─────────────────────────────────────────────────────────

  deleteUser(urlId: string, onSuccess?: () => void): void {
    this.api.deleteUser(urlId).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.urlId !== urlId));
        this.toastService.showToast({
          severity: 'success',
          message: 'Success',
          detail: 'User deleted successfully.',
          life: 3000,
        });
        onSuccess?.();
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to delete user.',
          life: 4000,
        });
      },
    });
  }

  // ── Mapping helpers ─────────────────────────────────────────────────────

  private mapUser(dto: AdminUserDetailsDto): AppUser {
    const u = dto.userSummary;
    return {
      id:           u.id,
      urlId:        u.urlId,
      name:         `${u.firstName} ${u.lastName}`,
      email:        u.email,
      role:         u.role as UserRole,
      createdAt:    '',
      lastSession:  dto.lastSession ?? '',
      surveysCount: dto.surveysCompleted,
      testsCount:   0,
      surveys:      [],
      tests:        [],
    };
  }

  private mapSurveyResponse(dto: UserSurveyResponseDto): CompletedSurvey {
    return {
      id:             dto.responseId,
      title:          dto.title,
      category:       '',
      completedAt:    dto.submittedAt,
      completionRate: 0,
    };
  }

  // ── Get survey details (Observable) ────────────────────────────────────

  getAdminSurveyByUrlId(urlId: string): Observable<SurveyDetailsResponseDto> {
    return this.api.getAdminSurveyByUrlId(urlId);
  }

  // ── Load admin surveys ───────────────────────────────────────────────────

  loadAdminSurveys(params: GetAdminSurveysParams = {}): void {
    this.surveysLoading.set(true);

    this.api.getAdminSurveys(params).subscribe({
      next: (page) => {
        this.surveys.set(page.content);
        this.surveysTotalElements.set(page.totalElements);
        this.surveysTotalPages.set(page.totalPages);
        this.surveysCurrentPage.set(page.currentPage);
        this.surveysLoading.set(false);
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to load surveys.',
          life: 4000,
        });
        this.surveysLoading.set(false);
      },
    });
  }

  // ── Create survey ────────────────────────────────────────────────────────

  createAdminSurvey(dto: SurveyCreateRequestDto, onSuccess?: (res: SurveyDetailsResponseDto) => void, onError?: () => void): void {
    this.api.createAdminSurvey(dto).subscribe({
      next: (res) => {
        this.surveys.update(list => [res.summary, ...list]);
        this.toastService.showToast({
          severity: 'success',
          message: 'Success',
          detail: 'Survey created successfully.',
          life: 3000,
        });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to create survey.',
          life: 4000,
        });
        onError?.();
      },
    });
  }

  // ── Update survey ────────────────────────────────────────────────────────

  updateAdminSurvey(urlId: string, dto: SurveyUpdateRequestDto, onSuccess?: (res: SurveyDetailsResponseDto) => void): void {
    this.api.updateAdminSurvey(urlId, dto).subscribe({
      next: (res) => {
        this.surveys.update(list =>
          list.map(s => s.urlId === urlId ? { ...res.summary, status: 'draft' as const } : s)
        );
        this.toastService.showToast({
          severity: 'success',
          message: 'Success',
          detail: 'Survey updated successfully.',
          life: 3000,
        });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to update survey.',
          life: 4000,
        });
      },
    });
  }

  // ── Delete survey ────────────────────────────────────────────────────────

  deleteAdminSurvey(urlId: string, onSuccess?: () => void): void {
    this.api.deleteAdminSurvey(urlId).subscribe({
      next: () => {
        this.surveys.update(list => list.filter(s => s.urlId !== urlId));
        this.toastService.showToast({
          severity: 'success',
          message: 'Success',
          detail: 'Survey deleted successfully.',
          life: 3000,
        });
        onSuccess?.();
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to delete survey.',
          life: 4000,
        });
      },
    });
  }

  // ── Publish / Close / Draft ───────────────────────────────────────────────

  publishSurvey(urlId: string, revision: RevisionRecordDto, onSuccess?: (res: RevisionMessageDto) => void): void {
    this.api.publishSurvey(urlId, revision).subscribe({
      next: (res) => {
        this.surveys.update(list =>
          list.map(s => s.urlId === urlId ? { ...s, status: 'published', publishedAt: new Date().toISOString() } : s)
        );
        this.toastService.showToast({ severity: 'success', message: 'Success', detail: 'Survey published.', life: 3000 });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to publish survey.', life: 4000 });
      },
    });
  }

  closeSurvey(urlId: string, revision: RevisionRecordDto, onSuccess?: (res: RevisionMessageDto) => void): void {
    this.api.closeSurvey(urlId, revision).subscribe({
      next: (res) => {
        this.surveys.update(list =>
          list.map(s => s.urlId === urlId ? { ...s, status: 'closed', closedAt: new Date().toISOString() } : s)
        );
        this.toastService.showToast({ severity: 'success', message: 'Success', detail: 'Survey closed.', life: 3000 });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to close survey.', life: 4000 });
      },
    });
  }

  draftSurvey(urlId: string, revision: RevisionRecordDto, onSuccess?: (res: RevisionMessageDto) => void): void {
    this.api.draftSurvey(urlId, revision).subscribe({
      next: (res) => {
        this.surveys.update(list =>
          list.map(s => s.urlId === urlId ? { ...s, status: 'draft' } : s)
        );
        this.toastService.showToast({ severity: 'success', message: 'Success', detail: 'Survey moved to draft.', life: 3000 });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to draft survey.', life: 4000 });
      },
    });
  }

  // ── Set home ─────────────────────────────────────────────────────────────

  setSurveyHome(urlId: string, dto: SurveyHomePatchDto, onSuccess?: (res: RevisionMessageDto) => void): void {
    this.api.setSurveyHome(urlId, dto).subscribe({
      next: (res) => {
        this.toastService.showToast({ severity: 'success', message: 'Success', detail: 'Survey home status updated.', life: 3000 });
        onSuccess?.(res);
      },
      error: (err) => {
        this.toastService.showToast({ severity: 'error', message: 'Error', detail: err?.error?.message ?? 'Failed to update home status.', life: 4000 });
      },
    });
  }
}
