import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';

import { UpdateUserEmailForm } from './update-user-email-form';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { Input } from '../../../../shared/components/input/input';

describe('UpdateUserEmailForm', () => {
  let component: UpdateUserEmailForm;
  let fixture: ComponentFixture<UpdateUserEmailForm>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'CUSTOMER' as const,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(async () => {
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', [
      'getUser',
      'changeUserEmail'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [
        UpdateUserEmailForm,
        ReactiveFormsModule,
        Input
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    userStoreService.getUser.and.returnValue(mockUser);

    fixture = TestBed.createComponent(UpdateUserEmailForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty newEmail', () => {
      expect(component.updateUserEmailForm.value).toEqual({
        newEmail: ''
      });
    });

    it('should compute currentUser from userStoreService', () => {
      expect(component.currentUser()).toEqual(mockUser);
    });

    it('should initialize errorText as empty string', () => {
      expect(component.errorText()).toBe('');
    });

    it('should initialize isSuccess as false', () => {
      expect(component.isSuccess()).toBe(false);
    });

    it('should initialize sentEmail as empty string', () => {
      expect(component.sentEmail()).toBe('');
    });
  });

  describe('Form Controls', () => {
    it('should have newEmail control', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      expect(control).toBeDefined();
    });

    it('should require newEmail', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      
      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBe(true);
      
      control?.setValue('test@');
      expect(control?.hasError('email')).toBe(true);
      
      control?.setValue('@example.com');
      expect(control?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      
      control?.setValue('valid@example.com');
      expect(control?.valid).toBe(true);
      
      control?.setValue('user.name+tag@example.co.uk');
      expect(control?.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      userStoreService.changeUserEmail.and.returnValue(of('Email change initiated successfully'));
    });

    it('should submit valid form', () => {
      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(userStoreService.changeUserEmail).toHaveBeenCalledWith('newemail@example.com');
    });

    it('should not submit invalid form', () => {
      component.updateUserEmailForm.patchValue({
        newEmail: ''
      });

      component.onSubmit();

      expect(userStoreService.changeUserEmail).not.toHaveBeenCalled();
    });

    it('should not submit form with invalid email format', () => {
      component.updateUserEmailForm.patchValue({
        newEmail: 'invalid-email'
      });

      component.onSubmit();

      expect(userStoreService.changeUserEmail).not.toHaveBeenCalled();
    });

    it('should log form submission with valid data', () => {
      spyOn(console, 'log');
      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith('Form Submitted', {
        newEmail: 'newemail@example.com'
      });
    });

    it('should set sentEmail on successful submission', () => {
      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(component.sentEmail()).toBe('john@example.com');
    });

    it('should set isSuccess to true on successful submission', () => {
      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(component.isSuccess()).toBe(true);
    });

    it('should log email change initiation', () => {
      spyOn(console, 'log');
      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith('Email change initiated:', 'Email change initiated successfully');
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on submission failure', () => {
      const error = {
        error: {
          message: 'Email already in use'
        }
      };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));

      component.updateUserEmailForm.patchValue({
        newEmail: 'existing@example.com'
      });

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Email already in use',
        life: 4000
      });
    });

    it('should show default error message when error has no message', () => {
      userStoreService.changeUserEmail.and.returnValue(throwError(() => ({})));

      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Failed to initiate email change. Please try again.',
        life: 4000
      });
    });

    it('should set emailInUse error on form control', () => {
      const error = {
        error: {
          message: 'Email already exists'
        }
      };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));

      component.updateUserEmailForm.patchValue({
        newEmail: 'existing@example.com'
      });

      component.onSubmit();

      expect(component.updateUserEmailForm.get('newEmail')?.hasError('emailInUse')).toBe(true);
    });

    it('should log error on submission failure', () => {
      spyOn(console, 'error');
      const error = {
        error: {
          message: 'Network error'
        }
      };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));

      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Failed to initiate email change:', error);
    });

    it('should not set isSuccess on error', () => {
      const error = {
        error: {
          message: 'Error occurred'
        }
      };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));

      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(component.isSuccess()).toBe(false);
    });

    it('should not set sentEmail on error', () => {
      const error = {
        error: {
          message: 'Error occurred'
        }
      };
      userStoreService.changeUserEmail.and.returnValue(throwError(() => error));

      component.updateUserEmailForm.patchValue({
        newEmail: 'newemail@example.com'
      });

      component.onSubmit();

      expect(component.sentEmail()).toBe('');
    });
  });

  describe('Constants', () => {
    it('should have inputType constant', () => {
      expect(component.inputType).toBeDefined();
    });

    it('should have buttonText constant', () => {
      expect(component.buttonText).toBeDefined();
    });
  });

  describe('Email Validation Edge Cases', () => {
    it('should reject email without domain', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('username@');
      expect(control?.hasError('email')).toBe(true);
    });

    it('should reject email without @', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('username.example.com');
      expect(control?.hasError('email')).toBe(true);
    });

    it('should accept email with subdomain', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('user@mail.example.com');
      expect(control?.valid).toBe(true);
    });

    it('should accept email with plus addressing', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('user+tag@example.com');
      expect(control?.valid).toBe(true);
    });

    it('should accept email with dots in username', () => {
      const control = component.updateUserEmailForm.get('newEmail');
      control?.setValue('first.last@example.com');
      expect(control?.valid).toBe(true);
    });
  });
});
