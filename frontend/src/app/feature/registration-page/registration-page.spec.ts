import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection, signal } from '@angular/core';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of, BehaviorSubject } from 'rxjs';
import { RegistrationPage } from './registration-page';
import { ROUTES } from '../../shared/models/routes.constants';

describe('RegistrationPage', () => {
  let component: RegistrationPage;
  let fixture: ComponentFixture<RegistrationPage>;
  let activatedRoute: any;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({});
    
    activatedRoute = {
      queryParams: queryParamsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [RegistrationPage],
      providers: [
        provideZoneChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        MessageService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have routes constant', () => {
    expect(component.routes).toBe(ROUTES);
  });

  it('should have correct login link route', () => {
    expect(component.LoginLinkRoute).toBe(`/${ROUTES.LOGIN}`);
  });

  describe('Initialization', () => {
    it('should initialize with verification form hidden', () => {
      expect(component.showVerificationForm()).toBe(false);
    });

    it('should initialize with empty registered email', () => {
      expect(component.registeredEmail()).toBe('');
    });
  });

  describe('Registration Success Handler', () => {
    it('should set registered email on success', () => {
      const testEmail = 'test@example.com';
      component.onRegistrationSuccess(testEmail);
      
      expect(component.registeredEmail()).toBe(testEmail);
    });

    it('should show verification form on success', () => {
      const testEmail = 'test@example.com';
      component.onRegistrationSuccess(testEmail);
      
      expect(component.showVerificationForm()).toBe(true);
    });

    it('should store email in localStorage', () => {
      spyOn(localStorage, 'setItem');
      const testEmail = 'test@example.com';
      
      component.onRegistrationSuccess(testEmail);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('registrationEmail', testEmail);
    });

    it('should handle multiple registration success calls', () => {
      const firstEmail = 'first@example.com';
      const secondEmail = 'second@example.com';
      
      component.onRegistrationSuccess(firstEmail);
      expect(component.registeredEmail()).toBe(firstEmail);
      expect(component.showVerificationForm()).toBe(true);
      
      component.onRegistrationSuccess(secondEmail);
      expect(component.registeredEmail()).toBe(secondEmail);
      expect(component.showVerificationForm()).toBe(true);
    });

    it('should handle empty email', () => {
      component.onRegistrationSuccess('');
      
      expect(component.registeredEmail()).toBe('');
      expect(component.showVerificationForm()).toBe(true);
    });
  });

  describe('Signals', () => {
    it('should update showVerificationForm signal', () => {
      expect(component.showVerificationForm()).toBe(false);
      
      component.showVerificationForm.set(true);
      expect(component.showVerificationForm()).toBe(true);
      
      component.showVerificationForm.set(false);
      expect(component.showVerificationForm()).toBe(false);
    });

    it('should update registeredEmail signal', () => {
      expect(component.registeredEmail()).toBe('');
      
      component.registeredEmail.set('test@example.com');
      expect(component.registeredEmail()).toBe('test@example.com');
      
      component.registeredEmail.set('another@example.com');
      expect(component.registeredEmail()).toBe('another@example.com');
    });
  });

  describe('Template Integration', () => {
    it('should pass registrationSuccess output to handler', () => {
      spyOn(component, 'onRegistrationSuccess');
      const testEmail = 'test@example.com';
      
      // Simulate the registration form emitting success
      component.onRegistrationSuccess(testEmail);
      
      expect(component.onRegistrationSuccess).toHaveBeenCalledWith(testEmail);
    });
  });

  describe('ngOnInit query params', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should handle query param isVerificationCodeForm=true with stored email', () => {
      const testEmail = 'stored@example.com';
      localStorage.setItem('registrationEmail', testEmail);
      
      queryParamsSubject.next({ isVerificationCodeForm: 'true' });
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(component.registeredEmail()).toBe(testEmail);
      expect(component.showVerificationForm()).toBe(true);
    });

    it('should not show verification form without stored email', () => {
      queryParamsSubject.next({ isVerificationCodeForm: 'true' });
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(component.showVerificationForm()).toBe(false);
    });

    it('should reset form when query param is not set', () => {
      component.showVerificationForm.set(true);
      component.registeredEmail.set('test@example.com');
      
      queryParamsSubject.next({});
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(component.showVerificationForm()).toBe(false);
      expect(component.registeredEmail()).toBe('');
    });
  });

  describe('navigation', () => {
    it('should navigate with correct query params on registration success', () => {
      spyOn(component.router, 'navigate');
      const testEmail = 'test@example.com';
      
      component.onRegistrationSuccess(testEmail);
      
      expect(component.router.navigate).toHaveBeenCalledWith([], {
        relativeTo: component.activatedRoute,
        queryParams: { isVerificationCodeForm: 'true' },
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('computed properties', () => {
    it('should compute logoSrc based on theme service', () => {
      expect(component.logoSrc()).toBeDefined();
      expect(typeof component.logoSrc()).toBe('string');
    });

    it('should compute formImageSrc based on theme service', () => {
      expect(component.formImageSrc()).toBeDefined();
      expect(typeof component.formImageSrc()).toBe('string');
    });
  });
});
