import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegistrationForm } from './registration-form';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { ROUTES } from '../../../../shared/models/routes.constants';

describe('RegistrationForm', () => {
  let component: RegistrationForm;
  let fixture: ComponentFixture<RegistrationForm>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockCaptchaResponse = {
    image: 'base64encodedimage',
    captchaId: 'captcha-123'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'addCaptchaRequest']);
    authServiceSpy.addCaptchaRequest.and.returnValue(of(mockCaptchaResponse));

    await TestBed.configureTestingModule({
      imports: [RegistrationForm, ReactiveFormsModule],
      providers: [
        provideZoneChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.registrationForm.value).toEqual({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        captchaCode: ''
      });
    });

    it('should load captcha on init', () => {
      expect(authService.addCaptchaRequest).toHaveBeenCalled();
    });

    it('should set captcha URL and ID on successful load', (done) => {
      setTimeout(() => {
        expect(component.captchaUrl()).toBe(`data:image/png;base64,${mockCaptchaResponse.image}`);
        expect(component.captchaId()).toBe(mockCaptchaResponse.captchaId);
        done();
      }, 500);
    });

    it('should set error text on captcha load failure', (done) => {
      const error = { error: { message: 'Failed to load captcha' } };
      authService.addCaptchaRequest.and.returnValue(throwError(() => error));
      
      const newFixture = TestBed.createComponent(RegistrationForm);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      setTimeout(() => {
        expect(newComponent.textError()).toBe('Failed to load captcha');
        done();
      }, 500);
    });

    it('should handle captcha error without message', (done) => {
      authService.addCaptchaRequest.and.returnValue(throwError(() => ({ error: {} })));
      
      const newFixture = TestBed.createComponent(RegistrationForm);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      setTimeout(() => {
        expect(newComponent.textError()).toBe('An error occurred while loading captcha.');
        done();
      }, 500);
    });
  });

  describe('Form Validation', () => {
    it('should validate firstName as required', () => {
      const control = component.registrationForm.get('firstName');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate firstName min length', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue('J');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate firstName max length', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue('a'.repeat(51));
      expect(control?.hasError('maxlength')).toBe(true);
    });

    it('should validate firstName pattern', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue('John123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept valid firstName', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue('John');
      expect(control?.valid).toBe(true);
    });

    it('should accept firstName with hyphen', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue('Mary-Jane');
      expect(control?.valid).toBe(true);
    });

    it('should accept firstName with apostrophe', () => {
      const control = component.registrationForm.get('firstName');
      control?.setValue("O'Brien");
      expect(control?.valid).toBe(true);
    });

    it('should validate lastName as required', () => {
      const control = component.registrationForm.get('lastName');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate lastName pattern', () => {
      const control = component.registrationForm.get('lastName');
      control?.setValue('Doe123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should validate email format', () => {
      const control = component.registrationForm.get('email');
      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBe(true);
    });

    it('should validate password as required', () => {
      const control = component.registrationForm.get('password');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate password min length', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('Pass1!');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate password max length', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('Password123!'.repeat(5));
      expect(control?.hasError('maxlength')).toBe(true);
    });

    it('should validate password pattern - missing lowercase', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('PASSWORD123!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should validate password pattern - missing uppercase', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('password123!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should validate password pattern - missing digit', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('Password!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should validate password pattern - missing special character', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('Password123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept valid password', () => {
      const control = component.registrationForm.get('password');
      control?.setValue('Password123!');
      expect(control?.valid).toBe(true);
    });

    it('should validate confirmPassword as required', () => {
      const control = component.registrationForm.get('confirmPassword');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate passwords match', () => {
      component.registrationForm.patchValue({
        password: 'Password123!',
        confirmPassword: 'DifferentPass123!'
      });
      expect(component.registrationForm.hasError('passwordMismatch')).toBe(true);
    });

    it('should validate captchaCode as required', () => {
      const control = component.registrationForm.get('captchaCode');
      expect(control?.hasError('required')).toBe(true);
    });
  });

  describe('Captcha Reload', () => {
    it('should reload captcha', () => {
      authService.addCaptchaRequest.calls.reset();
      component.loadCaptcha();
      
      expect(authService.addCaptchaRequest).toHaveBeenCalled();
    });

    it('should update captcha URL on reload', (done) => {
      const newCaptcha = {
        image: 'newbase64image',
        captchaId: 'captcha-456'
      };
      authService.addCaptchaRequest.and.returnValue(of(newCaptcha));
      
      component.loadCaptcha();

      setTimeout(() => {
        expect(component.captchaUrl()).toBe(`data:image/png;base64,${newCaptcha.image}`);
        expect(component.captchaId()).toBe(newCaptcha.captchaId);
        done();
      }, 500);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      authService.register.and.returnValue(of({ message: 'Success' }));
    });

    it('should not submit when form is invalid', () => {
      component.onSubmit();
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched on invalid submit', () => {
      component.onSubmit();
      expect(component.registrationForm.get('firstName')?.touched).toBe(true);
      expect(component.registrationForm.get('email')?.touched).toBe(true);
    });

    it('should emit registrationSuccess when valid', () => {
      spyOn(component.registrationSuccess, 'emit');
      
      component.registrationForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        captchaCode: '12345'
      });

      component.onSubmit();

      expect(component.registrationSuccess.emit).toHaveBeenCalledWith('john@example.com');
    });

    it('should submit with correct payload', () => {
      component.registrationForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        captchaCode: '12345'
      });

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        captchaAnswer: '12345',
        captchaId: mockCaptchaResponse.captchaId
      });
    });

    it('should set success text on successful registration', () => {
      authService.register.and.returnValue(of({ message: 'Registration successful!' }));
      
      component.registrationForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        captchaCode: '12345'
      });

      component.onSubmit();

      expect(component.successText).toBe('Registration successful!');
      expect(component.isSuccess).toBe(true);
    });

    it('should use default success message when none provided', () => {
      authService.register.and.returnValue(of({ message: '' }));
      
      component.registrationForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        captchaCode: '12345'
      });

      component.onSubmit();

      expect(component.successText).toBe('Registration successful! You can now log in with your credentials.');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      component.registrationForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        captchaCode: '12345'
      });
    });

    it('should handle 400 error', () => {
      const error = { status: 400, error: {} };
      authService.register.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorText()).toBe('Registration failed. Please check your input and try again.');
    });

    it('should handle error with message', () => {
      const error = { error: { message: 'Email already exists' } };
      authService.register.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorText()).toBe('Email already exists');
    });

    it('should handle error without message', () => {
      const error = { error: {} };
      authService.register.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorText()).toBe('An error occurred during registration. Please try again.');
    });

    it('should set captcha error text on failure', () => {
      const error = { error: { message: 'Invalid captcha' } };
      authService.register.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.textError()).toBe("CAPTCHA validation failed. Please ensure you've entered the correct characters and try again.");
    });
  });

  describe('Constants', () => {
    it('should have buttonText constant', () => {
      expect(component.buttonText).toBeDefined();
    });

    it('should have inputType constant', () => {
      expect(component.inputType).toBeDefined();
    });
  });

  describe('Signals', () => {
    it('should initialize errorText signal', () => {
      expect(component.errorText()).toBe('');
    });

    it('should initialize isFormInvalid signal', () => {
      expect(component.isFormInvalid()).toBe(false);
    });

    it('should initialize captchaUrl signal', () => {
      expect(component.captchaUrl()).toBeDefined();
    });

    it('should initialize captchaId signal', () => {
      expect(component.captchaId()).toBeDefined();
    });

    it('should initialize textError signal', () => {
      expect(component.textError()).toBe('');
    });

    it('should initialize isSuccess', () => {
      expect(component.isSuccess).toBe(false);
    });

    it('should initialize successText', () => {
      expect(component.successText).toBe('');
    });
  });
});
