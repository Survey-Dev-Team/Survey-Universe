import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsersApiService } from './users-api.service';
import { UserStoreService } from '../user-store-service/user-store-service';
import { UserPrivateDetails, UserUpdateRequest } from '../../models/interfaces';
import { ROUTES } from '../../models/routes.constants';
import { ToastService } from '../toast-service/toast-service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private api = inject(UsersApiService);
  private userStore = inject(UserStoreService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loading = signal<boolean>(false);

  getUserDetails(urlId: string): Observable<UserPrivateDetails> {
    return this.api.getUser(urlId);
  }

  updateUser(urlId: string, data: UserUpdateRequest, onSuccess?: (details: UserPrivateDetails) => void): void {
    this.loading.set(true);

    this.api.updateUser(urlId, data).subscribe({
      next: (response) => {
        this.userStore.setUser(response.userSummary);
        onSuccess?.(response);
        this.toastService.showToast({
          severity: 'success',
          message: 'Success',
          detail: 'Profile updated successfully.',
          life: 3000,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.showToast({
          severity: 'error',
          message: 'Error',
          detail: err?.error?.message ?? 'Failed to update profile.',
          life: 4000,
        });
        this.loading.set(false);
      },
    });
  }

  deleteUser(urlId: string): void {
    this.loading.set(true);

    this.api.deleteUser(urlId).subscribe({
      next: (response) => {
        console.log('[UsersService] deleteUser:', response);
        this.userStore.clearUser();
        this.router.navigate([`/${ROUTES.LOGIN}`]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[UsersService] deleteUser error:', err);
        this.loading.set(false);
      },
    });
  }
}
