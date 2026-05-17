import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EnterVerificationCodeEmailForm } from './enter-verification-code-email-form';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { Input } from '../../../../shared/components/input/input';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage';

describe('EnterVerificationCodeEmailForm', () => {
  let component: EnterVerificationCodeEmailForm;
  let fixture: ComponentFixture<EnterVerificationCodeEmailForm>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let activatedRoute: any;

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'CUSTOMER' as const,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(async () => {
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', ['getUser', 'verifyEmailChangeCode', 'changeUserEmail'], {
      currentCode: jasmine.createSpy().and.returnValue('')
    });
    (userStoreServiceSpy.currentCode as any).set = jasmine.createSpy('set');
    
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'removeItem']);
    
    activatedRoute = {
      queryParams: of({ token: 'test-token-123' })
    };

    await TestBed.configureTestingModule({
      imports: [
        EnterVerificationCodeEmailForm,
        ReactiveFormsModule,
        Input
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;

    userStoreService.getUser.and.returnValue(mockUser);
    localStorageService.getItem.and.returnValue(null);

    fixture = TestBed.createComponent(EnterVerificationCodeEmailForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty verification code', () => {
      expect(component.enterVerificationCodeEmailForm.value).toEqual({
        verificationCode: ''
      });
    });

    it('should start counter on init', () => {
      expect(component.counter()).toBe(60);
      expect(component.isCounterActive()).toBe(true);
    });

    it('should extract token from query params', () => {
      expect(component.currentToken()).toBe('test-token-123');
    });

    it('should compute currentUser from userStoreService', () => {
      expect(component.currentUser()).toEqual(mockUser);
    });

    it('should initialize signals with default values', () => {
      expect(component.errorText()).toBe('');
      expect(component.isSuccess()).toBe(false);
      expect(component.sentEmail()).toBe('');
    });
  });

  describe('Form Controls', () => {
    it('should have verificationCode control', () => {
      const control = component.enterVerificationCodeEmailForm.get('verificationCode');
      expect(control).toBeDefined();
    });

    it('should require verificationCode', () => {
      const control = component.enterVerificationCodeEmailForm.get('verificationCode');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid verificationCode', () => {
      const control = component.enterVerificationCodeEmailForm.get('verificationCode');
      control?.setValue('123456');
      expect(control?.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.newEmail.set('new@example.com');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: '123456'
      });
      userStoreService.verifyEmailChangeCode.and.returnValue(of({ message: 'Success' }));
    });

    it('should submit valid form', () => {
      component.onSubmit();

      expect(userStoreService.verifyEmailChangeCode).toHaveBeenCalledWith({
        newEmail: 'new@example.com',
        verificationCode: '123456'
      });
    });

    it('should not submit invalid form', () => {
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: ''
      });

      component.onSubmit();

      expect(userStoreService.verifyEmailChangeCode).not.toHaveBeenCalled();
    });

    it('should show success toast on successful verification', fakeAsync(() => {
      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'success',
        message: 'Success',
        detail: 'Your email has been changed successfully.',
        life: 3000
      });

      tick(2000);
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('Resend Code', () => {
    beforeEach(() => {
      component.newEmail.set('test@example.com');
      userStoreService.changeUserEmail.and.returnValue(of('Code sent'));
    });

    it('should reset counter to 60', () => {
      component.counter.set(10);
      component.resendCode();

      expect(component.counter()).toBe(60);
    });

    it('should activate counter', () => {
      component.isCounterActive.set(false);
      component.resendCode();

      expect(component.isCounterActive()).toBe(true);
    });

    it('should call changeUserEmail service', () => {
      component.resendCode();

      expect(userStoreService.changeUserEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('Counter', () => {
    it('should decrement counter each second', fakeAsync(() => {
      component.counter.set(60);
      component.startCounter();
      tick(1000);
      expect(component.counter()).toBe(59);
    }));

    it('should deactivate when counter reaches 0', fakeAsync(() => {
      component.counter.set(1);
      component.isCounterActive.set(false);
      component.startCounter();
      expect(component.isCounterActive()).toBe(true);
      tick(1000);
      expect(component.counter()).toBe(0);
      tick(1000);
      expect(component.isCounterActive()).toBe(false);
    }));
  });

  describe('Navigation', () => {
    it('should navigate back to user profile', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/profile'], { queryParams: {} });
    });
  });

  describe('setCode functionality', () => {
    it('should set code from currentCode signal', () => {
      userStoreService.currentCode.and.returnValue('999888');
      fixture.detectChanges();
      
      component.setCode();
      fixture.detectChanges();
      
      expect(component.enterVerificationCodeEmailForm.get('verificationCode')?.value).toBe('999888');
      expect(component.isSetCodeClicked()).toBe(true);
    });

    it('should mark setCode button as clicked', () => {
      userStoreService.currentCode.and.returnValue('123456');
      expect(component.isSetCodeClicked()).toBe(false);
      
      component.setCode();
      
      expect(component.isSetCodeClicked()).toBe(true);
    });

    it('should handle empty currentCode', () => {
      userStoreService.currentCode.and.returnValue('');
      
      component.setCode();
      
      expect(component.enterVerificationCodeEmailForm.get('verificationCode')?.value).toBe('');
    });
  });

  describe('copyCodeToClipboard', () => {
    let writeTextSpy: jasmine.Spy;

    beforeEach(() => {
      writeTextSpy = spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    });

    it('should copy code to clipboard', async () => {
      component.copyCodeToClipboard('123456');
      
      expect(writeTextSpy).toHaveBeenCalledWith('123456');
    });

    it('should handle empty code', async () => {
      component.copyCodeToClipboard('');
      
      expect(writeTextSpy).toHaveBeenCalledWith('');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      component.newEmail.set('new@example.com');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: '123456'
      });
    });

    it('should handle 400 error with specific message', () => {
      const error = { status: 400, error: { message: 'Invalid code' } };
      userStoreService.verifyEmailChangeCode.and.returnValue(throwError(() => error));
      
      component.onSubmit();
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Invalid verification code or the code has expired. Please check the code and try again or request a new one.',
        life: 3000
      });
    });

    it('should handle generic error', () => {
      const error = { status: 500, error: { message: 'Server error' } };
      userStoreService.verifyEmailChangeCode.and.returnValue(throwError(() => error));
      
      component.onSubmit();
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Failed to verify email change.',
        life: 3000
      });
    });

    it('should handle resend code error', () => {
      component.newEmail.set('test@example.com');
      const error = { error: { message: 'Too many requests' } };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));
      
      component.resendCode();
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Too many requests',
        life: 3000
      });
      expect(component.isCounterActive()).toBe(false);
    });

    it('should handle resend code error without message', () => {
      component.newEmail.set('test@example.com');
      const error = { error: {} };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));
      
      component.resendCode();
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Failed to resend verification code.',
        life: 3000
      });
    });
  });

  describe('localStorage integration', () => {
    it('should load pending email from localStorage on init', () => {
      localStorageService.getItem.and.returnValue('pending@example.com');
      
      component.ngOnInit();
      
      expect(component.newEmail()).toBe('pending@example.com');
    });

    it('should set sentEmail from currentUser email', () => {
      localStorageService.getItem.and.returnValue('pending@example.com');
      
      component.ngOnInit();
      
      expect(component.sentEmail()).toBe(mockUser.email);
    });

    it('should remove pending email from localStorage on success', fakeAsync(() => {
      component.newEmail.set('new@example.com');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: '123456'
      });
      userStoreService.verifyEmailChangeCode.and.returnValue(of({ message: 'Success' }));
      
      component.onSubmit();
      
      expect(localStorageService.removeItem).toHaveBeenCalledWith('pendingEmailChange');
      tick(2000);
    }));

    it('should not set newEmail if no pending email in localStorage', () => {
      localStorageService.getItem.and.returnValue(null);
      component.newEmail.set('');
      
      component.ngOnInit();
      
      expect(component.newEmail()).toBe('');
    });
  });

  describe('counter interval management', () => {
    it('should clear existing interval when starting new counter', fakeAsync(() => {
      component.startCounter();
      const firstIntervalId = component['intervalId'];
      tick(1000);
      
      component.startCounter();
      
      expect(component['intervalId']).not.toBe(firstIntervalId);
      tick(1000);
    }));

    it('should clear interval when counter reaches 0', fakeAsync(() => {
      component.counter.set(1);
      component.startCounter();
      
      tick(1000);
      expect(component.counter()).toBe(0);
      
      tick(1000);
      expect(component.isCounterActive()).toBe(false);
      expect(component['intervalId']).toBeNull();
    }));
  });

  describe('form validation', () => {
    it('should mark form as touched on submit', () => {
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: ''
      });
      
      component.onSubmit();
      
      expect(component.enterVerificationCodeEmailForm.touched).toBe(true);
    });

    it('should not submit without email', () => {
      component.newEmail.set('');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: '123456'
      });
      
      component.onSubmit();
      
      expect(userStoreService.verifyEmailChangeCode).not.toHaveBeenCalled();
    });

    it('should not submit without code', () => {
      component.newEmail.set('test@example.com');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: ''
      });
      
      component.onSubmit();
      
      expect(userStoreService.verifyEmailChangeCode).not.toHaveBeenCalled();
    });
  });

  describe('success flow', () => {
    it('should show toast on successful resend', () => {
      component.newEmail.set('test@example.com');
      userStoreService.changeUserEmail.and.returnValue(of('Code sent'));
      
      component.resendCode();
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'success',
        message: 'Code Resent',
        detail: 'A new verification code has been sent to your email.',
        life: 3000
      });
    });

    it('should logout after 2 seconds on successful verification', fakeAsync(() => {
      component.newEmail.set('new@example.com');
      component.enterVerificationCodeEmailForm.patchValue({
        verificationCode: '123456'
      });
      userStoreService.verifyEmailChangeCode.and.returnValue(of({ message: 'Success' }));
      
      component.onSubmit();
      tick(1000);
      
      expect(authService.logout).not.toHaveBeenCalled();
      
      tick(1000);
      
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });
});


