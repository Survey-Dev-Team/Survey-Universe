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
  UserAuthResponse,
  UserRegisterResponse,
} from '../../models/interfaces';
import {
  httpOptions,
  SURVEY_BASE_URL
} from '../../models/api';
import { LocalStorageService } from '../local-storage/local-storage';
import { UserStoreService } from '../user-store-service/user-store-service';

interface TokenPayload {
  exp: number;
  iat: number;
  [key: string]: unknown;
}

interface RefreshTokenResponse {
  jwtToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);
  userStoreService = inject(UserStoreService);
  
  private readonly RESET_EMAIL_KEY = 'reset_pwd_email';

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
    const bufferMs = bufferMinutes * 60 * 1000;

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
    return this.http
      .post<RefreshTokenResponse>(
        `${SURVEY_BASE_URL}auth/refresh`,
        { refreshToken: this.refreshToken },
        httpOptions
      )
      .pipe(
        tap((response) => {
          this.token = response.jwtToken;
          this.refreshToken = response.refreshToken;
          this.localStorageService.setToken(response.jwtToken);
          this.localStorageService.setItem('refreshToken', response.refreshToken);
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

  register(user: UserRegistration): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(
      `${SURVEY_BASE_URL}auth/register`,
      user,
      httpOptions
    );
  }

  login(user: UserLogin): Observable<UserAuthResponse> {
    return this.http
      .post<UserAuthResponse>(
        `${SURVEY_BASE_URL}auth/login`,
        user,
        httpOptions
      )
      .pipe(
        tap((result) => {
          this.isAuthorized.set(true);
          this.token = result.jwtToken;
          this.refreshToken = result.refreshToken;
          this.localStorageService.setToken(result.jwtToken);
          this.localStorageService.setItem('refreshToken', result.refreshToken);
          this.startRefreshTokenTimer();
          this.userStoreService.setUser(result.userSummary);
        })
      );
  }

  logout(): void {
    this.clearLocalAuth();
  }

  private clearLocalAuth(): void {
    this.stopRefreshTokenTimer();
    this.localStorageService.deleteToken();
    this.localStorageService.removeItem('refreshToken');
    this.isAuthorized.set(false);
    this.token = '';
    this.refreshToken = '';
    this.userStoreService.clearUser();
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
