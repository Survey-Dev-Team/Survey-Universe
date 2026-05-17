import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';
import { LocalStorageService } from '../local-storage/local-storage';
import { UserStoreService } from '../user-store-service/user-store-service';
import { CartService } from '../../../feature/cart-component/services/cart-service/cart-service';
import { NEW_BASE_URL, API_ENDPOINTS } from '../../models/api';
import { UserRegistration, UserLogin, UserLoginResponse, UserSuccessResponse } from '../../models/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;
  let cartService: jasmine.SpyObj<CartService>;

  // Helper function to create a mock JWT token
  const createMockToken = (expiresInMinutes: number = 60): string => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (expiresInMinutes * 60);
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp, iat: now, sub: 'user123' }));
    const signature = 'mock-signature';
    return `${header}.${payload}.${signature}`;
  };

  beforeEach(() => {
    // Clear sessionStorage before each test
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }

    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'hasToken',
      'getToken',
      'setToken',
      'deleteToken',
      'getItem',
      'setItem',
      'removeItem'
    ]);
    
    const userStoreSpy = jasmine.createSpyObj('UserStoreService', [
      'clearUser',
      'getUserProfile'
    ]);
    
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'loadCartCount',
      'clearCart'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: UserStoreService, useValue: userStoreSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  afterEach(() => {
    httpMock.verify();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should initialize isAuthorized signal based on token existence', () => {
      localStorageService.hasToken.and.returnValue(true);
      localStorageService.getToken.and.returnValue('test-token');
      
      // Create a new TestBed configuration with hasToken returning true
      TestBed.resetTestingModule();
      const localStorageSpyWithToken = jasmine.createSpyObj('LocalStorageService', [
        'hasToken',
        'getToken',
        'setToken',
        'deleteToken',
        'getItem',
        'setItem',
        'removeItem'
      ]);
      localStorageSpyWithToken.hasToken.and.returnValue(true);
      localStorageSpyWithToken.getToken.and.returnValue('test-token');
      localStorageSpyWithToken.getItem.and.returnValue('test-refresh-token');
      
      const userStoreSpy = jasmine.createSpyObj('UserStoreService', [
        'clearUser',
        'getUserProfile'
      ]);
      
      const cartServiceSpy = jasmine.createSpyObj('CartService', [
        'loadCartCount',
        'clearCart'
      ]);
      
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          AuthService,
          { provide: LocalStorageService, useValue: localStorageSpyWithToken },
          { provide: UserStoreService, useValue: userStoreSpy },
          { provide: CartService, useValue: cartServiceSpy }
        ]
      });
      
      const newService = TestBed.inject(AuthService);
      
      expect(newService.isAuthorized()).toBe(true);
    });
  });

  describe('getAuthOptions', () => {
    it('should return auth options with token', () => {
      const token = 'Bearer test-token';
      localStorageService.getToken.and.returnValue(token);
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe(token);
    });

    it('should return auth options with empty string when no token', () => {
      localStorageService.getToken.and.returnValue(null);
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('');
    });
  });

  describe('register', () => {
    it('should register a new user', () => {
      const user: UserRegistration = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        captchaAnswer: '42',
        captchaId: 'captcha-123'
      };
      
      const mockResponse: UserSuccessResponse = {
        message: 'User registered successfully'
      };

      service.register(user).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_UP}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should login user and set authorization state', () => {
      const user: UserLogin = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      const mockResponse: UserLoginResponse = {
        accessToken: 'test-access-token',
        idToken: 'test-id-token',
        refreshToken: 'test-refresh-token',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        email: 'john@example.com',
        imageUrl: 'http://example.com/image.jpg'
      };

      service.login(user).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthorized()).toBe(true);
        expect(service.token).toBe('test-id-token');
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush(mockResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith('test-id-token');
      expect(userStoreService.clearUser).toHaveBeenCalled();
      expect(userStoreService.getUserProfile).toHaveBeenCalledWith(true);
      expect(cartService.loadCartCount).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', () => {
      localStorageService.getToken.and.returnValue('test-token');
      
      service.logout();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(localStorageService.deleteToken).toHaveBeenCalled();
      expect(service.isAuthorized()).toBe(false);
      expect(service.token).toBe('');
      expect(userStoreService.clearUser).toHaveBeenCalled();
      expect(cartService.clearCart).toHaveBeenCalled();
    });

    it('should clear local auth even on logout error', () => {
      localStorageService.getToken.and.returnValue('test-token');
      
      service.logout();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`);
      req.error(new ProgressEvent('error'));

      expect(localStorageService.deleteToken).toHaveBeenCalled();
      expect(service.isAuthorized()).toBe(false);
      expect(service.token).toBe('');
      expect(userStoreService.clearUser).toHaveBeenCalled();
      expect(cartService.clearCart).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', (done) => {
      const mockRefreshToken = 'test-refresh-token';
      const mockIdToken = 'test-id-token';
      service['refreshToken'] = mockRefreshToken;
      
      localStorageService.getItem.and.returnValue(mockIdToken);
      
      const mockResponse = {
        accessToken: 'new-access-token',
        idToken: 'new-id-token',
        refreshToken: 'new-refresh-token'
      };

      service.refreshAccessToken().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.token).toBe('new-id-token');
        done();
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: mockRefreshToken });
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockIdToken}`);
      req.flush(mockResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith('new-id-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('idToken', 'new-id-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token');
    });

    it('should clear local auth on refresh token error', (done) => {
      const mockRefreshToken = 'test-refresh-token';
      const mockIdToken = 'test-id-token';
      service['refreshToken'] = mockRefreshToken;
      
      localStorageService.getItem.and.returnValue(mockIdToken);

      service.refreshAccessToken().subscribe({
        error: () => {
          expect(localStorageService.deleteToken).toHaveBeenCalled();
          expect(service.isAuthorized()).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('Password reset flow', () => {
    it('should request password reset', () => {
      const email = 'test@example.com';
      const mockResponse = { message: 'Reset email sent' };

      service.requestPasswordReset(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.PASSWORD_RESET_REQUEST}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });

    it('should verify reset token and set email', () => {
      const token = 'reset-token-123';
      const mockResponse = { email: 'user@example.com', valid: true };

      service.requestVerifyToken(token).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentEmailForResetPassword()).toBe('user@example.com');
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should verify reset code', () => {
      const payload = { code: '123456', email: 'user@example.com' };
      const mockResponse = { valid: true };

      service.requestVerifyCode(payload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should reset password and clear email', () => {
      const payload = {
        newPassword: 'newPass123',
        confirmPassword: 'newPass123',
        email: 'user@example.com'
      };
      const mockResponse = { message: 'Password reset successful' };

      service.resetPassword(payload).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentEmailForResetPassword()).toBe('');
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should set and clear reset password email', () => {
      service.setResetPasswordEmail('test@example.com');
      expect(service.currentEmailForResetPassword()).toBe('test@example.com');

      service.clearResetPasswordEmail();
      expect(service.currentEmailForResetPassword()).toBe('');
    });
  });

  describe('Captcha', () => {
    it('should request captcha', () => {
      const mockResponse = {
        captchaId: 'captcha-123',
        captchaImage: 'base64-image-data'
      };

      service.addCaptchaRequest().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.GET_CAPTCHA}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('Registration verification', () => {
    it('should verify registration code', () => {
      const email = 'newuser@example.com';
      const code = '654321';
      const mockResponse = { verified: true };

      service.registrationVerificationCode(email, code).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE_REGISTRATION}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, code });
      req.flush(mockResponse);
    });
  });

  describe('getAuthOptions', () => {
    it('should return auth options with access token', () => {
      localStorageService.getItem.and.returnValue('access-token-123');
      localStorageService.getToken.and.returnValue('id-token-456');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('Bearer access-token-123');
    });

    it('should add Bearer prefix if missing', () => {
      localStorageService.getItem.and.returnValue('token-without-bearer');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('Bearer token-without-bearer');
    });

    it('should not add Bearer prefix if already present', () => {
      localStorageService.getItem.and.returnValue('Bearer token-with-bearer');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('Bearer token-with-bearer');
    });

    it('should handle empty token', () => {
      localStorageService.getItem.and.returnValue('');
      localStorageService.getToken.and.returnValue('');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('');
    });
  });

  describe('Token management', () => {
    it('should store all tokens on login', () => {
      const user = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      const mockResponse = {
        accessToken: 'access-token',
        idToken: 'id-token',
        refreshToken: 'refresh-token',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        email: 'john@example.com',
        imageUrl: 'http://example.com/image.jpg'
      };

      service.login(user).subscribe();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      req.flush(mockResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith('id-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('idToken', 'id-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('accessToken', 'access-token');
      expect(localStorageService.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
    });

    it('should clear all tokens on logout', () => {
      localStorageService.getToken.and.returnValue('test-token');
      localStorageService.getItem.and.returnValue('access-token');
      
      service.logout();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`);
      req.flush({});

      expect(localStorageService.deleteToken).toHaveBeenCalled();
      expect(localStorageService.removeItem).toHaveBeenCalledWith('idToken');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('Error handling', () => {
    it('should handle registration error', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        captchaAnswer: '42',
        captchaId: 'captcha-123'
      };

      service.register(user).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_UP}`);
      req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle login error', (done) => {
      const user = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      service.login(user).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle password reset request error', (done) => {
      const email = 'nonexistent@example.com';

      service.requestPasswordReset(email).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.PASSWORD_RESET_REQUEST}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle verify token error', (done) => {
      const token = 'invalid-token';

      service.requestVerifyToken(token).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`);
      req.flush('Invalid token', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle reset password error', (done) => {
      const payload = {
        newPassword: 'newPass123',
        confirmPassword: 'different',
        email: 'user@example.com'
      };

      service.resetPassword(payload).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`);
      req.flush('Passwords do not match', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('Token decoding and validation', () => {
    it('should decode valid JWT token', () => {
      const token = createMockToken(60);
      const decoded = service['decodeToken'](token);

      expect(decoded).toBeTruthy();
      expect(decoded?.exp).toBeDefined();
      expect(decoded?.iat).toBeDefined();
      expect(decoded?.['sub']).toBe('user123');
    });

    it('should return null for invalid token format', () => {
      const invalidToken = 'invalid.token';
      const decoded = service['decodeToken'](invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', () => {
      const malformedToken = 'not-a-token';
      const decoded = service['decodeToken'](malformedToken);

      expect(decoded).toBeNull();
    });

    it('should get token expiration time', () => {
      const token = createMockToken(60);
      const expirationTime = service['getTokenExpirationTime'](token);

      expect(expirationTime).toBeTruthy();
      expect(expirationTime).toBeGreaterThan(Date.now());
    });

    it('should return null for token without expiration', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ iat: Math.floor(Date.now() / 1000) }));
      const token = `${header}.${payload}.signature`;

      const expirationTime = service['getTokenExpirationTime'](token);

      expect(expirationTime).toBeNull();
    });

    it('should detect token expiring soon', () => {
      const token = createMockToken(3); // Expires in 3 minutes
      const isExpiringSoon = service['isTokenExpiringSoon'](token, 5);

      expect(isExpiringSoon).toBe(true);
    });

    it('should detect token not expiring soon', () => {
      const token = createMockToken(60); // Expires in 60 minutes
      const isExpiringSoon = service['isTokenExpiringSoon'](token, 5);

      expect(isExpiringSoon).toBe(false);
    });

    it('should handle invalid token in expiration check', () => {
      const invalidToken = 'invalid.token';
      const isExpiringSoon = service['isTokenExpiringSoon'](invalidToken);

      expect(isExpiringSoon).toBe(true);
    });
  });

  describe('Token refresh timer', () => {
    it('should start refresh timer after login', fakeAsync(() => {
      const user = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      const mockToken = createMockToken(60);
      const mockResponse = {
        accessToken: 'access-token',
        idToken: mockToken,
        refreshToken: 'refresh-token',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        email: 'john@example.com',
        imageUrl: 'http://example.com/image.jpg'
      };

      service.login(user).subscribe();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      req.flush(mockResponse);

      expect(service['refreshTokenTimeout']).toBeDefined();
      
      // Clean up any pending timers
      service['stopRefreshTokenTimer']();
      tick();
    }));

    it('should stop refresh timer on logout', fakeAsync(() => {
      localStorageService.getToken.and.returnValue('test-token');
      localStorageService.getItem.and.returnValue('access-token');
      
      service['refreshTokenTimeout'] = setTimeout(() => {}, 10000);
      const timeoutId = service['refreshTokenTimeout'];

      service.logout();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`);
      req.flush({});

      expect(service['refreshTokenTimeout']).toBeUndefined();
      flush();
    }));

    it('should not start refresh timer without token', () => {
      service.token = '';
      service['startRefreshTokenTimer']();

      expect(service['refreshTokenTimeout']).toBeUndefined();
    });

    it('should refresh token immediately if already expired', fakeAsync(() => {
      const expiredToken = createMockToken(-5); // Already expired
      service.token = expiredToken;
      service['refreshToken'] = 'test-refresh-token';
      localStorageService.getItem.and.returnValue(expiredToken);

      const mockResponse = {
        accessToken: 'new-access-token',
        idToken: createMockToken(60),
        refreshToken: 'new-refresh-token'
      };

      service['startRefreshTokenTimer']();

      tick();
      
      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(localStorageService.setToken).toHaveBeenCalledWith(mockResponse.idToken);

      // Clean up any pending timers
      service['stopRefreshTokenTimer']();
      tick();
    }));
  });

  describe('Session storage for password reset', () => {
    it('should store email in session storage', () => {
      const email = 'test@example.com';
      
      service.setResetPasswordEmail(email);

      expect(service.currentEmailForResetPassword()).toBe(email);
      if (typeof sessionStorage !== 'undefined') {
        expect(sessionStorage.getItem('reset_pwd_email')).toBe(email);
      }
    });

    it('should clear email from session storage', () => {
      const email = 'test@example.com';
      service.setResetPasswordEmail(email);
      
      service.clearResetPasswordEmail();

      expect(service.currentEmailForResetPassword()).toBe('');
      if (typeof sessionStorage !== 'undefined') {
        expect(sessionStorage.getItem('reset_pwd_email')).toBeNull();
      }
    });

    it('should initialize email from session storage on service creation', () => {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('reset_pwd_email', 'stored@example.com');
      }

      // Create new service instance
      TestBed.resetTestingModule();
      const localStorageSpyNew = jasmine.createSpyObj('LocalStorageService', [
        'hasToken', 'getToken', 'setToken', 'deleteToken', 'getItem', 'setItem', 'removeItem'
      ]);
      const userStoreSpyNew = jasmine.createSpyObj('UserStoreService', ['clearUser', 'getUserProfile']);
      const cartServiceSpyNew = jasmine.createSpyObj('CartService', ['loadCartCount', 'clearCart']);
      
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          AuthService,
          { provide: LocalStorageService, useValue: localStorageSpyNew },
          { provide: UserStoreService, useValue: userStoreSpyNew },
          { provide: CartService, useValue: cartServiceSpyNew }
        ]
      });

      const newService = TestBed.inject(AuthService);

      if (typeof sessionStorage !== 'undefined') {
        expect(newService.currentEmailForResetPassword()).toBe('stored@example.com');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle empty email in password reset', () => {
      const mockResponse = { message: 'Email sent' };

      service.requestPasswordReset('').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.PASSWORD_RESET_REQUEST}`);
      expect(req.request.body).toEqual({ email: '' });
      req.flush(mockResponse);
    });

    it('should handle multiple Bearer prefixes in token', () => {
      localStorageService.getItem.and.returnValue('Bearer Bearer token');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('Bearer Bearer token');
    });

    it('should handle token with whitespace', () => {
      localStorageService.getItem.and.returnValue('  token-with-spaces  ');
      
      const options = service.getAuthOptions();
      
      expect(options.headers.get('Authorization')).toBe('Bearer   token-with-spaces  ');
    });

    it('should handle null response from verify token', () => {
      const token = 'test-token';

      service.requestVerifyToken(token).subscribe(response => {
        expect(response).toBeNull();
        expect(service.currentEmailForResetPassword()).toBe('');
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`);
      req.flush(null);
    });

    it('should handle verify token response without email', () => {
      const token = 'test-token';
      const mockResponse = { valid: true };

      service.requestVerifyToken(token).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentEmailForResetPassword()).toBe('');
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`);
      req.flush(mockResponse);
    });

    it('should handle concurrent login requests', () => {
      const user = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      const mockResponse = {
        accessToken: 'access-token',
        idToken: 'id-token',
        refreshToken: 'refresh-token',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        email: 'john@example.com',
        imageUrl: 'http://example.com/image.jpg'
      };

      service.login(user).subscribe();
      service.login(user).subscribe();

      const requests = httpMock.match(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      expect(requests.length).toBe(2);
      
      requests.forEach(req => req.flush(mockResponse));
    });

    it('should handle logout without access token', () => {
      localStorageService.getToken.and.returnValue('');
      localStorageService.getItem.and.returnValue('');
      
      service.logout();

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_OUT}`);
      expect(req.request.body).toEqual({ accessToken: '' });
      req.flush({});
    });

    it('should clear auth state even if refresh token request fails', fakeAsync(() => {
      const mockRefreshToken = 'test-refresh-token';
      const mockIdToken = 'test-id-token';
      service['refreshToken'] = mockRefreshToken;
      service.token = mockIdToken;
      
      localStorageService.getItem.and.returnValue(mockIdToken);

      service.refreshAccessToken().subscribe({
        error: () => {
          expect(service.isAuthorized()).toBe(false);
          expect(service.token).toBe('');
        }
      });

      const req = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`);
      req.error(new ProgressEvent('Network error'));

      flush();
    }));
  });

  describe('Integration scenarios', () => {
    it('should handle complete registration to login flow', fakeAsync(() => {
      // Step 1: Get captcha
      const captchaResponse = {
        captchaId: 'captcha-123',
        captchaImage: 'base64-image'
      };

      service.addCaptchaRequest().subscribe();
      const captchaReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.GET_CAPTCHA}`);
      captchaReq.flush(captchaResponse);

      // Step 2: Register
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        captchaAnswer: '42',
        captchaId: 'captcha-123'
      };

      service.register(user).subscribe();
      const registerReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_UP}`);
      registerReq.flush({ message: 'Success' });

      // Step 3: Verify registration code
      service.registrationVerificationCode(user.email, '654321').subscribe();
      const verifyReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE_REGISTRATION}`);
      verifyReq.flush({ verified: true });

      // Step 4: Login
      const loginResponse = {
        accessToken: 'access-token',
        idToken: createMockToken(60),
        refreshToken: 'refresh-token',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        email: 'john@example.com',
        imageUrl: 'http://example.com/image.jpg'
      };

      service.login({ email: user.email, password: user.password }).subscribe();
      const loginReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.AUTH_SIGN_IN}`);
      loginReq.flush(loginResponse);

      expect(service.isAuthorized()).toBe(true);
      expect(localStorageService.setToken).toHaveBeenCalled();

      // Clean up any pending timers
      service['stopRefreshTokenTimer']();
      tick();
    }));

    it('should handle complete password reset flow', () => {
      // Step 1: Request password reset
      const email = 'user@example.com';
      service.requestPasswordReset(email).subscribe();
      const resetReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.PASSWORD_RESET_REQUEST}`);
      resetReq.flush({ message: 'Email sent' });

      // Step 2: Verify token
      const token = 'reset-token-123';
      service.requestVerifyToken(token).subscribe();
      const verifyTokenReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}?token=${token}`);
      verifyTokenReq.flush({ email: email, valid: true });

      expect(service.currentEmailForResetPassword()).toBe(email);

      // Step 3: Verify code
      const code = '123456';
      service.requestVerifyCode({ code, email }).subscribe();
      const verifyCodeReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.VERIFY_CODE}`);
      verifyCodeReq.flush({ valid: true });

      // Step 4: Reset password
      const payload = {
        newPassword: 'newPass123',
        confirmPassword: 'newPass123',
        email: email
      };
      service.resetPassword(payload).subscribe();
      const resetPasswordReq = httpMock.expectOne(`${NEW_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`);
      resetPasswordReq.flush({ message: 'Password reset successful' });

      expect(service.currentEmailForResetPassword()).toBe('');
    });
  });
});

