import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginForm } from './login-form';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage';
import { ROUTES } from '../../../../shared/models/routes.constants';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let authService: jasmine.SpyObj<AuthService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', ['getUserProfile']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['setToken']);

    await TestBed.configureTestingModule({
      imports: [LoginForm, ReactiveFormsModule],
      providers: [
        provideZoneChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: ''
    });
  });

  it('should validate email as required', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should validate password as required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.onSubmit();
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should submit form when valid', () => {
    authService.login.and.returnValue(of({ 
      accessToken: 'test-token',
      idToken: 'test-id-token',
      refreshToken: 'refresh-token',
      username: 'testuser',
      role: 'customer',
      email: 'test@example.com',
      imageUrl: ''
    }));
    spyOn(router, 'navigate');

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!'
    });
  });

  it('should save token and navigate on successful login', () => {
    authService.login.and.returnValue(of({ 
      accessToken: 'test-token',
      idToken: 'test-id-token',
      refreshToken: 'refresh-token',
      refresh_token: 'refresh-token',
      username: 'testuser',
      role: 'customer',
      email: 'test@example.com',
      imageUrl: ''
    }));
    spyOn(router, 'navigate');

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(localStorageService.setToken).toHaveBeenCalledWith('test-id-token');
    expect(router.navigate).toHaveBeenCalledWith([ROUTES.MAIN_PAGE]);
    expect(component.isSuccess).toBe(true);
  });

  it('should handle 429 error', () => {
    const error = { status: 429, error: { message: 'Too many attempts' } };
    authService.login.and.returnValue(throwError(() => error));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.errorText429()).toBe('Too many attempts');
    expect(component.errorText()).toBe('Incorrect email or password. Try again or create an account.');
  });

  it('should handle generic error', () => {
    const error = { status: 400, error: { message: 'Unauthorized' } };
    authService.login.and.returnValue(throwError(() => error));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.errorText()).toBe('Incorrect email or password. Try again or create an account.');
  });

  it('should handle error without message', () => {
    const error = { status: 400, error: {} };
    authService.login.and.returnValue(throwError(() => error));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(component.errorText()).toBe('Incorrect email or password. Try again or create an account.');
  });
});
