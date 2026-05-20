import { inject, Injectable, signal } from '@angular/core';
import { AdminDataApiService } from './admin-data-api.service';
import {
  AdminUserDetailsDto,
  UserSurveyResponseDto,
  GetUsersParams,
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
}
