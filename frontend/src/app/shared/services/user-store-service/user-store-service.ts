import { 
  inject, 
  Injectable, 
  signal 
} from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage';
import {
  API_ENDPOINTS,
  getAuthOptions,
  NEW_BASE_URL,
} from '../../models/api';
import { HttpClient } from '@angular/common/http';
import { 
  Observable, 
  Subscription, 
  take 
} from 'rxjs';
import {
  UpdateUserData,
  UpdateUserDataFormResponse,
  UpdateUserDataPayload,
} from '../../../feature/user-profile/models/interfaces';
import { 
  ChangeUserPasswordPayload, 
  VerifyEmailCodePayload, 
  VerifyTokenResponse 
} from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  currentUser = signal<UpdateUserData | null>(null);
  private localStorage = inject(LocalStorageService);
  private http = inject(HttpClient);

  isAdmin = signal<boolean>(false);
  isWaiter = signal<boolean>(false);
  isCustomer = signal<boolean>(false);
  isLoggin = signal<boolean>(this.localStorage.hasToken());
  currentCode = signal<string>('');

  private buildAuthOptions() {
    const token = this.localStorage.getToken() as string | null;
    return getAuthOptions(token ?? '');
  }

  setUser(user: UpdateUserData) {
    this.currentUser.set(user);
    this.isAdmin.set(user.role === 'ADMIN');
    this.isWaiter.set(user.role === 'WAITER');
    this.isCustomer.set(user.role === 'CUSTOMER');
  }

  getUser(): UpdateUserData | null {
    return this.currentUser();
  }

  clearUser(): void {
    this.currentUser.set(null);
    this.isAdmin.set(false);
    this.isWaiter.set(false);
    this.isCustomer.set(false);
  }

  getUserProfile(force: boolean = false): Subscription | undefined {
    if (this.currentUser() && !force) return;
    if (!this.localStorage.hasToken()) return;
    return this.getUserData()
      .pipe(take(1))
      .subscribe({
        next: (user: UpdateUserData) => {
          this.setUser(user);
        },
        error: (error: { status: number }) => {
          console.error('Failed to fetch user profile:', error);
          if (error.status === 401) {
            this.clearUser();
          }
        },
      });
  }

  getUserData(): Observable<UpdateUserData> {
    return this.http.get<UpdateUserData>(
      `${NEW_BASE_URL}${API_ENDPOINTS.PROFILE}`,
      this.buildAuthOptions()
    );
  }

  updateUserData(
    userData: UpdateUserDataPayload
  ): Observable<UpdateUserDataFormResponse> {
    return this.http.put<UpdateUserDataFormResponse>(
      `${NEW_BASE_URL}${API_ENDPOINTS.PROFILE}`,
      userData,
      this.buildAuthOptions()
    );
  }

  changeUserPassword(
    payload: ChangeUserPasswordPayload
  ): Observable<ChangeUserPasswordPayload> {
    const accessToken = this.localStorage.getItem<string>('accessToken') || '';
    const authOptions = getAuthOptions(accessToken);
    return this.http.put<ChangeUserPasswordPayload>(
      `${NEW_BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`,
      payload,
      authOptions
    );
  }

  changeUserEmail(newEmail: string): Observable<string> {
    const idToken = this.localStorage.getItem<string>('idToken') || '';
    return this.http.post<string>(
      `${NEW_BASE_URL}${API_ENDPOINTS.CHANGE_USER_EMAIL}`,
      { newEmail },
      getAuthOptions(idToken)
    );
  }

  verifyEmailChangeCode(verifyEmailCodePayload: VerifyEmailCodePayload): Observable<{ message: string }> {
    const idToken = this.localStorage.getItem<string>('idToken') || '';
    return this.http.post<{ message: string }>(
      `${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL_VERIFICATION_CODE}`,
      verifyEmailCodePayload,
      getAuthOptions(idToken)
    );
  }

  verifyEmailChangeToken(token: string): Observable<VerifyTokenResponse> {
    const idToken = this.localStorage.getItem<string>('idToken') || '';
    return this.http.get<VerifyTokenResponse>(
      `${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL_VERIFICATION_TOKEN}?token=${token}`,
      getAuthOptions(idToken)
    );
  }
}

