import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';
import { LocalStorageService } from '../local-storage/local-storage';
import { UserStoreService } from '../user-store-service/user-store-service';
import { SURVEY_BASE_URL } from '../../models/api';
import {
  UserRegistration,
  UserLogin,
  UserAuthResponse,
  UserRegisterResponse,
  UserPrivateSummary,
} from '../../models/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;

  const createMockToken = (expiresInMinutes = 60): string => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresInMinutes * 60;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp, iat: now, sub: 'user123' }));
    return `${header}.${payload}.mock-signature`;
  };

  const mockUserSummary: UserPrivateSummary = {
    id: 'user:123',
    urlId: 'abc123',
    profileImage: '',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    email: 'john@example.com',
  };

  const buildAuthResponse = (overrides: Partial<UserAuthResponse> = {}): UserAuthResponse => ({
    jwtToken: createMockToken(),
    refreshToken: 'mock-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
    userSummary: mockUserSummary,
    ...overrides,
  });

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', [
      'getToken',
      'setToken',
      'deleteToken',
      'getItem',
      'setItem',
      'removeItem',
    ]);
    localStorageSpy.getToken.and.returnValue(null);
    localStorageSpy.getItem.and.returnValue(null);

    const userStoreSpy = jasmine.createSpyObj<UserStoreService>('UserStoreService', [
      'setUser',
      'clearUser',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: UserStoreService, useValue: userStoreSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
  });

  afterEach(() => {
    httpMock.verify();
    service['stopRefreshTokenTimer']();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Constructor ────────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('should initialize isAuthorized to false when no token is stored', () => {
      expect(service.isAuthorized()).toBe(false);
      expect(service.token).toBe('');
    });

    it('should initialize isAuthorized to true when a valid token is stored', () => {
      const validToken = createMockToken(60);

      const localStorageSpy = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', [
        'getToken', 'setToken', 'deleteToken', 'getItem', 'setItem', 'removeItem',
      ]);
      localStorageSpy.getToken.and.returnValue(validToken);
      localStorageSpy.getItem.and.callFake((key: string) =>
        key === 'refreshToken' ? 'stored-refresh' : null
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          AuthService,
          { provide: LocalStorageService, useValue: localStorageSpy },
          { provide: UserStoreService, useValue: jasmine.createSpyObj('UserStoreService', ['setUser', 'clearUser']) },
        ],
      });

      const newService = TestBed.inject(AuthService);
      expect(newService.isAuthorized()).toBe(true);
      expect(newService.token).toBe(validToken);
      newService['stopRefreshTokenTimer']();
    });

    it('should clear stored tokens when no valid access token exists', () => {
      expect(localStorageService.deleteToken).toHaveBeenCalled();
      expect(localStorageService.removeItem).toHaveBeenCalledWith('idToken');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  // ── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should POST to auth/login and set authorization state', () => {
      const credentials: UserLogin = { email: 'john@example.com', password: 'password123' };
      const authResponse = buildAuthResponse();

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(authResponse);
        expect(service.isAuthorized()).toBe(true);
        expect(service.token).toBe(authResponse.jwtToken);
      });

      const req = httpMock.expectOne(`${SURVEY_BASE_URL}auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(authResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith(authResponse.jwtToken);
      expect(localStorageService.setItem).toHaveBeenCalledWith('refreshToken', authResponse.refreshToken);
      expect(userStoreService.setUser).toHaveBeenCalledWith(authResponse.userSummary);
    });

    it('should propagate errors from auth/login', (done) => {
      service.login({ email: 'x@x.com', password: 'wrong' }).subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${SURVEY_BASE_URL}auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  // ── logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should clear all auth state', () => {
      service['token'] = 'existing-token';
      service.isAuthorized.set(true);

      service.logout();

      expect(localStorageService.deleteToken).toHaveBeenCalled();
      expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(service.isAuthorized()).toBe(false);
      expect(service.token).toBe('');
      expect(userStoreService.clearUser).toHaveBeenCalled();
    });
  });

  // ── refreshAccessToken ─────────────────────────────────────────────────────

  describe('refreshAccessToken', () => {
    it('should POST to auth/refresh with stored refreshToken', (done) => {
      const storedRefresh = 'stored-refresh-token';
      service['refreshToken'] = storedRefresh;
      const newResponse = buildAuthResponse({ jwtToken: createMockToken(60), refreshToken: 'new-refresh' });

      service.refreshAccessToken().subscribe(response => {
        expect(response).toEqual(newResponse);
        expect(service.token).toBe(newResponse.jwtToken);
        done();
      });

      const req = httpMock.expectOne(`${SURVEY_BASE_URL}auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: storedRefresh });
      req.flush(newResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith(newResponse.jwtToken);
      expect(localStorageService.setItem).toHaveBeenCalledWith('refreshToken', newResponse.refreshToken);
    });

    it('should clear auth and rethrow on refresh error', (done) => {
      service['refreshToken'] = 'bad-refresh';
      service.isAuthorized.set(true);

      service.refreshAccessToken().subscribe({
        error: () => {
          expect(localStorageService.deleteToken).toHaveBeenCalled();
          expect(service.isAuthorized()).toBe(false);
          done();
        },
      });

      const req = httpMock.expectOne(`${SURVEY_BASE_URL}auth/refresh`);
      req.error(new ProgressEvent('error'));
    });
  });

  // ── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should POST to auth/register', () => {
      const user: UserRegistration = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'secret123',
      };
      const mockResponse: UserRegisterResponse = {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      service.register(user).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${SURVEY_BASE_URL}auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush(mockResponse);
    });
  });

  // ── getAuthOptions ─────────────────────────────────────────────────────────

  describe('getAuthOptions', () => {
    it('should return Authorization header with Bearer token from accessToken key', () => {
      localStorageService.getItem.and.callFake((key: string) =>
        key === 'accessToken' ? 'my-token' : null
      );

      const options = service.getAuthOptions();
      expect(options.headers.get('Authorization')).toBe('Bearer my-token');
    });

    it('should fall back to getToken() when accessToken is absent', () => {
      localStorageService.getItem.and.returnValue(null);
      localStorageService.getToken.and.returnValue('fallback-token');

      const options = service.getAuthOptions();
      expect(options.headers.get('Authorization')).toBe('Bearer fallback-token');
    });

    it('should not double-prefix Bearer when token already has it', () => {
      localStorageService.getItem.and.callFake((key: string) =>
        key === 'accessToken' ? 'Bearer prefixed-token' : null
      );

      const options = service.getAuthOptions();
      expect(options.headers.get('Authorization')).toBe('Bearer prefixed-token');
    });

    it('should return empty Authorization when no token is available', () => {
      localStorageService.getItem.and.returnValue(null);
      localStorageService.getToken.and.returnValue(null);

      const options = service.getAuthOptions();
      expect(options.headers.get('Authorization')).toBe('');
    });
  });

  // ── Token decoding helpers ─────────────────────────────────────────────────

  describe('decodeToken', () => {
    it('should decode a valid JWT', () => {
      const token = createMockToken(60);
      const decoded = service['decodeToken'](token);
      expect(decoded).toBeTruthy();
      expect(decoded?.['sub']).toBe('user123');
    });

    it('should return null for a token with wrong number of parts', () => {
      expect(service['decodeToken']('invalid.token')).toBeNull();
    });

    it('should return null for a non-token string', () => {
      expect(service['decodeToken']('not-a-token')).toBeNull();
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should return true when token expires within buffer window', () => {
      const token = createMockToken(3);
      expect(service['isTokenExpiringSoon'](token, 5)).toBe(true);
    });

    it('should return false when token expires after buffer window', () => {
      const token = createMockToken(60);
      expect(service['isTokenExpiringSoon'](token, 5)).toBe(false);
    });

    it('should return true for an invalid token', () => {
      expect(service['isTokenExpiringSoon']('bad')).toBe(true);
    });
  });

  // ── Refresh timer ──────────────────────────────────────────────────────────

  describe('startRefreshTokenTimer', () => {
    it('should not start a timer when token is empty', () => {
      service.token = '';
      service['startRefreshTokenTimer']();
      expect(service['refreshTokenTimeout']).toBeUndefined();
    });

    it('should schedule a refresh timer for a valid token', fakeAsync(() => {
      const longLivedToken = createMockToken(60);
      service.token = longLivedToken;
      service['refreshToken'] = 'some-refresh';

      service['startRefreshTokenTimer']();

      expect(service['refreshTokenTimeout']).toBeDefined();

      service['stopRefreshTokenTimer']();
      tick(0);
    }));
  });
});
