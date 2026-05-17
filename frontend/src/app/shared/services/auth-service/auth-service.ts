import { 
  inject, 
  Injectable, 
  signal
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  Observable, 
  tap, 
  catchError, 
  throwError 
} from 'rxjs';
import {
  UserRegistration,
  UserLogin,
  UserLoginResponse,
  UserSuccessResponse,
} from '../../models/interfaces';
import {
  httpOptions,
  API_ENDPOINTS,
  NEW_BASE_URL
} from '../../models/api';
import { LocalStorageService } from '../local-storage/local-storage';
import { UserStoreService } from '../user-store-service/user-store-service';
import { CartService } from '../../../feature/cart-component/services/cart-service/cart-service';

interface TokenPayload {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

interface RefreshTokenResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);
  userStoreService = inject(UserStoreService);
  private cartService = inject(CartService);
  
  private readonly RESET_EMAIL_KEY = 'reset_pwd_email';

  currentEmailForResetPassword = signal<string>(
    typeof window !== 'undefined' ? sessionStorage.getItem(this.RESET_EMAIL_KEY) || '' : ''
  );

  isAuthorized = signal<boolean>(false);
  token = '';
  private refreshToken = '';
  private refreshTokenTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    const storedToken = this.localStorageService.getToken() || '';
    const hasValidToken = !!storedToken && !this.isTokenExpiringSoon(storedToken, 0);

    this.isAuthorized.set(hasValidToken);
    this.token = hasValidToken ? storedToken : '';
    this.refreshToken = this.localStorageService.getItem('refreshToken') || '';
    if (this.token && this.refreshToken) {
      this.startRefreshTokenTimer();
    } else if (!hasValidToken) {
      this.localStorageService.deleteToken();
      this.localStorageService.removeItem('idToken');
      this.localStorageService.removeItem('accessToken');
      this.localStorageService.removeItem('refreshToken');
    }
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private getTokenExpirationTime(token: string): number | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return decoded.exp * 1000;
  }

  private isTokenExpiringSoon(
    token: string,
    bufferMinutes: number = 5
  ): boolean {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) {
      return true;
    }

    const now = Date.now();
    const bufferMs = bufferMinutes * 59 * 1000;

    return expirationTime - now <= bufferMs;
  }
  
  private startRefreshTokenTimer(): void {
    if (!this.token) {
      return;
    }

    const expirationTime = this.getTokenExpirationTime(this.token);
    if (!expirationTime) {
      return;
    }
    
    const now = Date.now();
    const refreshTime = expirationTime - now - 5 * 60 * 1000;
    
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    
    if (refreshTime > 0) {
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshAccessToken().subscribe({
          next: () => {
          },
          error: (error) => {
            this.logout();
          },
        });
      }, refreshTime);
    } else {
      this.refreshAccessToken().subscribe({
        next: () => {
        },
        error: (error) => {
          this.logout();
        },
      });
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = undefined;
    }
  }

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const idToken = this.localStorageService.getItem<string>('idToken') || this.token;
    const options = {
      headers: httpOptions.headers.set('Authorization', `Bearer ${idToken}`)
    };

    return this.http
      .post<RefreshTokenResponse>(
        `${NEW_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
        { refreshToken: this.refreshToken },
        options
      )
      .pipe(
        tap((response) => {
          this.token = response.idToken;
          this.refreshToken = response.refreshToken;
          this.localStorageService.setToken(response.idToken);
          this.localStorageService.setItem('idToken', response.idToken);
          this.localStorageService.setItem('accessToken', response.accessToken);
          this.localStorageService.setItem(
            'refreshToken',
            response.refreshToken
          );
          this.startRefreshTokenTimer();
        }),
        catchError((error) => {
          this.clearLocalAuth();
          return throwError(() => error);
        })
      );
  }

  getAuthOptions() {
    const token =
      this.localStorageService.getItem<string>('accessToken') ||
      this.localStorageService.getToken() ||
      '';
    const authToken =
      token && token.trim() !== ''
        ? token.startsWith('Bearer ')
          ? token
          : `Bearer ${token}`
        : '';
    return {
      headers: httpOptions.headers.set('Authorization', authToken),
    };
  }

  register(user: UserRegistration): Observable<UserSuccessResponse> {
    return this.http.post<UserSuccessResponse>(
      `${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_UP}`,
      user,
      httpOptions
    );
  }

  login(user: UserLogin): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(
        `${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`,
        user,
        httpOptions
      )
      .pipe(
        tap((result) => {
          console.log('Login response:', result);
          this.isAuthorized.set(true);
          this.token = result.idToken;
          this.refreshToken = result.refreshToken;
          this.localStorageService.setToken(result.idToken);
          this.localStorageService.setItem('idToken', result.idToken);
          this.localStorageService.setItem('accessToken', result.accessToken);
          this.localStorageService.setItem('refreshToken', result.refreshToken);
          this.startRefreshTokenTimer();
          this.userStoreService.clearUser();
          this.userStoreService.getUserProfile(true);
          this.cartService.loadCartCount();
        })
      );
  }

  logout(): void {
    const accessToken =
      this.localStorageService.getItem<string>('accessToken') || '';

    this.http
      .post(
        `${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`,
        { accessToken },
        httpOptions
      )
      .subscribe({
        next: () => {
          this.clearLocalAuth();
        },
        error: () => {
          this.clearLocalAuth();
        },
      });
  }

  private clearLocalAuth(): void {
    this.stopRefreshTokenTimer();
    this.localStorageService.deleteToken();
    this.localStorageService.removeItem('idToken');
    this.localStorageService.removeItem('accessToken');
    this.localStorageService.removeItem('refreshToken');
    this.isAuthorized.set(false);
    this.token = '';
    this.refreshToken = '';

    this.userStoreService.clearUser();
    this.cartService.clearCart();
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.PASSWORD_RESET_REQUEST}`,
      { email },
      httpOptions
    );
  }

  requestVerifyToken(token: string): Observable<any> {
    return this.http.get<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`,
      httpOptions
    ).pipe(
      tap((response) => {
        if (response?.email) {
          this.setResetPasswordEmail(response.email);
        }
      })
    );
  }

  requestVerifyCode({
    code,
    email,
  }: {
    code: any;
    email: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE}`,
      { code, email },
      httpOptions
    );
  }

  resetPassword({
    newPassword,
    confirmPassword,
    email,
  }: {
    newPassword: any;
    confirmPassword: any;
    email: any;
  }): Observable<any> {
    return this.http.post<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`,
      { newPassword, confirmPassword, email },
      httpOptions
    ).pipe(
      tap(() => {
        this.clearResetPasswordEmail();
      })
    );
  }

  setResetPasswordEmail(email: string): void {
    this.currentEmailForResetPassword.set(email);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.RESET_EMAIL_KEY, email);
    }
  }

  clearResetPasswordEmail(): void {
    this.currentEmailForResetPassword.set('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.RESET_EMAIL_KEY);
    }
  }

  addCaptchaRequest() {
    return this.http.get<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.GET_CAPTCHA}`,
      httpOptions
    );
  }

    registrationVerificationCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE_REGISTRATION}`,
      { email, code },
      httpOptions
    );
  }

  resendVerificationCode(email: string): Observable<string> {
    return this.http.post<string>(
      `${NEW_BASE_URL}${API_ENDPOINTS.RESEND_VERIFICATION_CODE}`,
      { email },
      httpOptions
    );
  }

  /* loginWithSocialGoogle(): Observable<any> {
    return this.http.get<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.SOCIAL_LOGIN_WITH_GOOGLE}`,
      httpOptions
    );
  }

  loginWithSocialFacebook(): Observable<any> {
    return this.http.get<any>(
      `${NEW_BASE_URL}${API_ENDPOINTS.SOCIAL_LOGIN_WITH_FACEBOOK}`,
      httpOptions
    );
  } */
}
