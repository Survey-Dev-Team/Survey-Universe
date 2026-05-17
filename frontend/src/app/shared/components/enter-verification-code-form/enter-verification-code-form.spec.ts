import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EnterVerificationCodeForm } from './enter-verification-code-form';
import { AuthService } from '../../services/auth-service/auth-service';
import { ToastService } from '../../services/toast-service/toast-service';
import { signal } from '@angular/core';

describe('EnterVerificationCodeForm', () => {
  let component: EnterVerificationCodeForm;
  let fixture: ComponentFixture<EnterVerificationCodeForm>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'requestVerifyToken',
      'requestVerifyCode',
      'registrationVerificationCode',
      'requestPasswordReset'
    ], {
      currentEmailForResetPassword: signal('')
    });

    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    activatedRoute = {
      queryParams: of({ token: 'test-token-123' })
    };

    // Mock Clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
      },
      configurable: true,
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [EnterVerificationCodeForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterVerificationCodeForm);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Setup default mocks
    authService.requestVerifyToken.and.returnValue(of({
      code: '123456',
      email: 'test@example.com'
    }));
    authService.requestVerifyCode.and.returnValue(of({ message: 'Code sent' }));
    authService.registrationVerificationCode.and.returnValue(of({ message: 'Success' }));
    authService.requestPasswordReset.and.returnValue(of({ message: 'Password reset code sent' }));
    
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty verification code', () => {
    expect(component.verificationCodeForm.get('verificationCode')?.value).toBe('');
  });

  it('should mark verification code as required', () => {
    const control = component.verificationCodeForm.get('verificationCode');
    control?.setValue('');
    expect(control?.hasError('required')).toBe(true);
  });

  it('should set registration flow when currentEmail is provided', () => {
    fixture.componentRef.setInput('currentEmail', 'test@example.com');
    
    component.ngOnInit();
    
    expect(component.isRegistrationFlow()).toBe(true);
    expect(authService.currentEmailForResetPassword()).toBe('test@example.com');
  });

  it('should set registration flow when email is in localStorage', () => {
    localStorage.setItem('registrationEmail', 'stored@example.com');
    
    component.ngOnInit();
    
    expect(component.isRegistrationFlow()).toBe(true);
    expect(authService.currentEmailForResetPassword()).toBe('stored@example.com');
  });

  it('should verify token from query params', fakeAsync(() => {
    const mockResponse = { code: '123456', email: 'verified@example.com' };
    authService.requestVerifyToken.and.returnValue(of(mockResponse));
    
    component.ngOnInit();
    tick();
    
    expect(authService.requestVerifyToken).toHaveBeenCalledWith('test-token-123');
    expect(authService.currentEmailForResetPassword()).toBe('verified@example.com');
  }));

  it('should handle token verification error', fakeAsync(() => {
    const error = { error: { message: 'Token expired' } };
    authService.requestVerifyToken.and.returnValue(throwError(() => error));
    
    component.ngOnInit();
    tick();
    
    expect(component.errorText()).toBe('Token expired');
  }));

  it('should set default error message when token verification fails without message', fakeAsync(() => {
    authService.requestVerifyToken.and.returnValue(throwError(() => ({})));
    
    component.ngOnInit();
    tick();
    
    expect(component.errorText()).toBe('The verification link has expired. Please request a new password reset.');
  }));

  it('should start counter on init', fakeAsync(() => {
    component.ngOnInit();
    expect(component.counter()).toBe(60);
    expect(component.isCounterActive()).toBe(true);
  }));

  it('should not submit invalid form', () => {
    component.onSubmit();
    
    expect(component.verificationCodeForm.touched).toBe(true);
    expect(authService.requestVerifyCode).not.toHaveBeenCalled();
    expect(authService.registrationVerificationCode).not.toHaveBeenCalled();
  });

  it('should submit registration verification code successfully', fakeAsync(() => {
    fixture.componentRef.setInput('currentEmail', 'test@example.com');
    component.ngOnInit();
    
    component.verificationCodeForm.patchValue({
      verificationCode: '123456'
    });
    
    authService.registrationVerificationCode.and.returnValue(of({ message: 'Success' }));
    
    component.onSubmit();
    tick();
    
    expect(authService.registrationVerificationCode).toHaveBeenCalledWith('test@example.com', '123456');
    expect(toastService.showToast).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      detail: 'Your account has been created successfully. Please sign in with your details.'
    }));
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should handle registration verification code error', fakeAsync(() => {
    fixture.componentRef.setInput('currentEmail', 'test@example.com');
    component.ngOnInit();
    
    component.verificationCodeForm.patchValue({
      verificationCode: '123456'
    });
    
    const error = { status: 400, error: { message: 'Invalid code' } };
    authService.registrationVerificationCode.and.returnValue(throwError(() => error));
    
    component.onSubmit();
    tick();
    
    expect(component.errorText()).toBe('Invalid verification code. Please try again.');
  }));

  it('should submit password reset verification code successfully', fakeAsync(() => {
    authService.currentEmailForResetPassword.set('reset@example.com');
    authService.requestVerifyToken.and.returnValue(of({ email: 'reset@example.com' }));
    
    component.ngOnInit();
    tick();
    
    component.verificationCodeForm.patchValue({
      verificationCode: '654321'
    });
    
    authService.requestVerifyCode.and.returnValue(of({ success: true }));
    spyOn(component.isSuccessVerificationCode, 'emit');
    
    component.onSubmit();
    tick();
    
    expect(authService.requestVerifyCode).toHaveBeenCalledWith({
      code: '654321',
      email: 'reset@example.com'
    });
    expect(component.isSuccessVerificationCode.emit).toHaveBeenCalledWith(true);
  }));

  it('should handle password reset verification code error', fakeAsync(() => {
    authService.currentEmailForResetPassword.set('reset@example.com');
    authService.requestVerifyToken.and.returnValue(of({ email: 'reset@example.com' }));
    
    component.ngOnInit();
    tick();
    
    component.verificationCodeForm.patchValue({
      verificationCode: 'wrong'
    });
    
    const error = { status: 400, error: { message: 'Invalid code' } };
    authService.requestVerifyCode.and.returnValue(throwError(() => error));
    
    component.onSubmit();
    tick();
    
    expect(component.errorText()).toBe('Invalid verification code. Please try again.');
  }));

  it('should resend verification code', fakeAsync(() => {
    authService.currentEmailForResetPassword.set('test@example.com');
    authService.requestPasswordReset.and.returnValue(of({ message: 'Code sent' }));
    
    component.resendCode();
    tick();
    
    expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
    expect(component.counter()).toBe(60);
    expect(component.isCounterActive()).toBe(true);
  }));

  it('should handle resend code error', fakeAsync(() => {
    authService.currentEmailForResetPassword.set('test@example.com');
    const error = { error: { message: 'Resend failed' } };
    authService.requestPasswordReset.and.returnValue(throwError(() => error));
    
    component.resendCode();
    tick();
    
    expect(component.errorText()).toBe('Resend failed');
  }));

  it('should decrease counter every second', fakeAsync(() => {
    component.counter.set(5);
    component.startCounter();
    
    tick(1000);
    expect(component.counter()).toBe(4);
    
    tick(1000);
    expect(component.counter()).toBe(3);
    
    tick(3000);
    expect(component.counter()).toBe(0);
    tick(1000);
    expect(component.isCounterActive()).toBe(false);
  }));

  it('should use currentEmail input over authService email', fakeAsync(() => {
    fixture.componentRef.setInput('currentEmail', 'input@example.com');
    component.isRegistrationFlow.set(true);
    authService.currentEmailForResetPassword.set('service@example.com');
    
    component.verificationCodeForm.patchValue({
      verificationCode: '123456'
    });
    
    authService.registrationVerificationCode.and.returnValue(of({ message: 'Success' }));
    
    component.onSubmit();
    tick();
    
    expect(authService.registrationVerificationCode).toHaveBeenCalledWith('input@example.com', '123456');
  }));

  it('should remove registrationEmail from localStorage on successful registration', fakeAsync(() => {
    localStorage.setItem('registrationEmail', 'test@example.com');
    fixture.componentRef.setInput('currentEmail', 'test@example.com');
    component.isRegistrationFlow.set(true);
    
    component.verificationCodeForm.patchValue({
      verificationCode: '123456'
    });
    
    authService.registrationVerificationCode.and.returnValue(of({ message: 'Success' }));
    
    component.onSubmit();
    tick();
    
    expect(localStorage.getItem('registrationEmail')).toBeNull();
  }));
});
