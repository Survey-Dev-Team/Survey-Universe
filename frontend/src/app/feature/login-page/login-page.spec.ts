import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LoginPage } from './login-page';
import { ROUTES } from '../../shared/models/routes.constants';
import { ToastService } from '../../shared/services/toast-service/toast-service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let toastService: jasmine.SpyObj<ToastService>;
  let activatedRoute: any;

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    activatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideZoneChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have routes constant', () => {
    expect(component.routes).toBe(ROUTES);
  });

  it('should have correct registration link route', () => {
    expect(component.registrationLinkRoute).toBe(`/${ROUTES.REGISTER}`);
  });

  it('should initialize with default state', () => {
    expect(component.showResetForm()).toBe(false);
    expect(component.isOnVerifyCodeRoute()).toBe(false);
    expect(component.isSuccessVerificationCode()).toBe(false);
    expect(component.isConfirmationMessage()).toBe(false);
    expect(component.isNewPasswordSubmitted()).toBe(false);
  });

  describe('handleShowResetForm', () => {
    it('should show reset form and navigate with query params', () => {
      spyOn(router, 'navigate');
      
      component.handleShowResetForm(true);
      
      expect(component.showResetForm()).toBe(true);
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should hide reset form when false', () => {
      component.showResetForm.set(true);
      
      component.handleShowResetForm(false);
      
      expect(component.showResetForm()).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should set isOnVerifyCodeRoute when token param exists', (done) => {
      activatedRoute.queryParams = of({ token: 'test-token' });
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(component.isOnVerifyCodeRoute()).toBe(true);
        done();
      }, 100);
    });

    it('should reset states when no query params', (done) => {
      component.showResetForm.set(true);
      component.isSuccessVerificationCode.set(true);
      activatedRoute.queryParams = of({});
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(component.showResetForm()).toBe(false);
        expect(component.isSuccessVerificationCode()).toBe(false);
        done();
      }, 100);
    });

    it('should set success verification when reset-password param exists', (done) => {
      activatedRoute.queryParams = of({ 'reset-password': true });
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(component.isSuccessVerificationCode()).toBe(true);
        done();
      }, 100);
    });
  });

  describe('handleBackToLogin', () => {
    it('should hide reset form', () => {
      component.showResetForm.set(true);
      
      component.handleBackToLogin();
      
      expect(component.showResetForm()).toBe(false);
    });
  });

  describe('handleShowConfirmationMessage', () => {
    it('should set confirmation message state', () => {
      component.handleShowConfirmationMessage(true);
      
      expect(component.isConfirmationMessage()).toBe(true);
    });
  });

  describe('getStateSuccessNewPassword', () => {
    it('should set new password submitted state', () => {
      component.getStateSuccessNewPassword(true);
      
      expect(component.isNewPasswordSubmitted()).toBe(true);
    });

    it('should show success toast and navigate to login on success', () => {
      spyOn(router, 'navigate');
      
      component.getStateSuccessNewPassword(true);
      
      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'success',
        message: 'Success',
        detail: 'Your password has been successfully changed.',
        life: 5000
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not show toast when false', () => {
      component.getStateSuccessNewPassword(false);
      
      expect(toastService.showToast).not.toHaveBeenCalled();
    });
  });

  describe('getSuccessVerificationCode', () => {
    it('should set success verification code state', () => {
      component.getSuccessVerificationCode(true);
      
      expect(component.isSuccessVerificationCode()).toBe(true);
    });

    it('should navigate with reset-password param on success', () => {
      spyOn(router, 'navigate');
      
      component.getSuccessVerificationCode(true);
      
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not navigate when false', () => {
      spyOn(router, 'navigate');
      
      component.getSuccessVerificationCode(false);
      
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
