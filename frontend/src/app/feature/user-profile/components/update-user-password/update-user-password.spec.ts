import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';

import { UpdateUserPassword } from './update-user-password';
import { InputPassword } from '../../../../shared/components/input-password/input-password';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';

describe('UpdateUserPassword', () => {
  let component: UpdateUserPassword;
  let fixture: ComponentFixture<UpdateUserPassword>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', ['changeUserPassword']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [
        UpdateUserPassword,
        ReactiveFormsModule,
        InputPassword
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    fixture = TestBed.createComponent(UpdateUserPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.updateUserPasswordForm.value).toEqual({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    });

    it('should have oldPassword control', () => {
      const control = component.updateUserPasswordForm.get('oldPassword');
      expect(control).toBeDefined();
    });

    it('should have newPassword control', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      expect(control).toBeDefined();
    });

    it('should have confirmPassword control', () => {
      const control = component.updateUserPasswordForm.get('confirmPassword');
      expect(control).toBeDefined();
    });

    it('should initialize errorText as empty string', () => {
      expect(component.errorText()).toBe('');
    });
  });

  describe('Old Password Validation', () => {
    it('should require oldPassword', () => {
      const control = component.updateUserPasswordForm.get('oldPassword');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid oldPassword', () => {
      const control = component.updateUserPasswordForm.get('oldPassword');
      control?.setValue('OldPassword1!');
      expect(control?.valid).toBe(true);
    });
  });

  describe('New Password Validation', () => {
    it('should require newPassword', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate newPassword minimum length of 8', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Pass1!');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate newPassword maximum length of 16', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password123!@#$%^&*()');
      expect(control?.hasError('maxlength')).toBe(true);
    });

    it('should require lowercase letter', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('PASSWORD1!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should require uppercase letter', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('password1!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should require digit', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password!');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should require special character', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept valid newPassword', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password1!');
      expect(control?.valid).toBe(true);
    });

    it('should accept password with various special characters', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      const validPasswords = [
        'Password1!',
        'Password1@',
        'Password1#',
        'Password1$',
        'Password1%',
        'Password1^',
        'Password1&',
        'Password1*',
        'Password1(',
        'Password1)',
        'Password1_',
        'Password1+',
        'Password1-',
        'Password1='
      ];

      validPasswords.forEach(password => {
        control?.setValue(password);
        expect(control?.valid).toBe(true);
      });
    });
  });

  describe('Confirm Password Validation', () => {
    it('should require confirmPassword', () => {
      const control = component.updateUserPasswordForm.get('confirmPassword');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should match newPassword', () => {
      component.updateUserPasswordForm.patchValue({
        newPassword: 'Password1!',
        confirmPassword: 'Password1!'
      });

      expect(component.updateUserPasswordForm.hasError('passwordsMismatch')).toBe(false);
    });

    it('should error when passwords do not match', () => {
      component.updateUserPasswordForm.patchValue({
        newPassword: 'Password1!',
        confirmPassword: 'Different1!'
      });

      expect(component.updateUserPasswordForm.hasError('passwordMismatch')).toBe(true);
    });
  });

  describe('Form Submission Success', () => {
    beforeEach(() => {
      userStoreService.changeUserPassword.and.returnValue(of({
        old_password: 'OldPassword1!',
        new_password: 'NewPassword1!'
      }));
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
        confirmPassword: 'NewPassword1!'
      });
    });

    it('should call changeUserPassword with correct payload', () => {
      component.onSubmit();

      expect(userStoreService.changeUserPassword).toHaveBeenCalledWith(
        jasmine.objectContaining({
          old_password: 'OldPassword1!',
          new_password: 'NewPassword1!',
          confirm_password: 'NewPassword1!'
        })
      );
    });

    it('should log form submission', () => {
      spyOn(console, 'log');
      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith(
        'Form Submitted',
        jasmine.objectContaining({
          oldPassword: 'OldPassword1!',
          newPassword: 'NewPassword1!',
          confirmPassword: 'NewPassword1!'
        })
      );
    });

    it('should show success toast on successful password change', () => {
      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'success',
        message: 'Success',
        detail: 'Password updated successfully.',
        life: 3000
      });
    });

    it('should clear errorText on success', () => {
      component.errorText.set('Previous error');
      component.onSubmit();

      expect(component.errorText()).toBe('');
    });

    it('should log success message', () => {
      spyOn(console, 'log');
      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith('Password updated successfully');
    });
  });

  describe('Form Submission Validation', () => {
    it('should not submit invalid form', () => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(userStoreService.changeUserPassword).not.toHaveBeenCalled();
    });

    it('should not submit when passwords mismatch', () => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
        confirmPassword: 'Different1!'
      });

      component.onSubmit();

      expect(userStoreService.changeUserPassword).not.toHaveBeenCalled();
    });

    it('should not submit when oldPassword is missing', () => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: '',
        newPassword: 'NewPassword1!',
        confirmPassword: 'NewPassword1!'
      });

      component.onSubmit();

      expect(userStoreService.changeUserPassword).not.toHaveBeenCalled();
    });

    it('should not submit when newPassword is missing', () => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'OldPassword1!',
        newPassword: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(userStoreService.changeUserPassword).not.toHaveBeenCalled();
    });

    it('should not submit when newPassword is invalid', () => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'OldPassword1!',
        newPassword: 'weak',
        confirmPassword: 'weak'
      });

      component.onSubmit();

      expect(userStoreService.changeUserPassword).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling - 404 Not Found', () => {
    beforeEach(() => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'WrongPassword1!',
        newPassword: 'NewPassword1!',
        confirmPassword: 'NewPassword1!'
      });
    });

    it('should handle 404 error correctly', () => {
      const error = { status: 404 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorText()).toBe('Password not found. Please check your current password.');
    });

    it('should show error toast for 404', () => {
      const error = { status: 404 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Password not found. Please check your current password.',
        life: 5000
      });
    });

    it('should log 404 error', () => {
      spyOn(console, 'error');
      const error = { status: 404 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error updating password:', error);
    });
  });

  describe('Error Handling - Other Errors', () => {
    beforeEach(() => {
      component.updateUserPasswordForm.patchValue({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
        confirmPassword: 'NewPassword1!'
      });
    });

    it('should handle error with message in errors array', () => {
      const error = {
        status: 400,
        error: {
          errors: [{ message: 'Password too weak' }]
        }
      };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Password too weak',
        life: 5000
      });
    });

    it('should handle error with message in error object', () => {
      const error = {
        status: 400,
        error: {
          message: 'Invalid password format'
        }
      };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Invalid password format',
        life: 5000
      });
    });

    it('should show default error message when no specific message', () => {
      const error = { status: 500 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith({
        severity: 'error',
        message: 'Error',
        detail: 'Failed to update password. Please try again.',
        life: 5000
      });
    });

    it('should set errorText on general error', () => {
      const error = { status: 500 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.errorText()).toBe('Failed to update password. Please try again.');
    });

    it('should log error on failure', () => {
      spyOn(console, 'error');
      const error = { status: 500 };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error updating password:', error);
    });

    it('should handle network error', () => {
      const error = {
        status: 0,
        error: {
          message: 'Network error'
        }
      };
      userStoreService.changeUserPassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          message: 'Error'
        })
      );
    });
  });

  describe('Constants', () => {
    it('should have buttonText constant', () => {
      expect((component as any).buttonText).toBeDefined();
    });

    it('should have inputType constant', () => {
      expect((component as any).inputType).toBeDefined();
    });
  });

  describe('Password Pattern Edge Cases', () => {
    it('should reject password with only letters and numbers', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should reject password with only letters and special chars', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password!@#');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should reject password with only numbers and special chars', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('123456!@#');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept password at minimum length with all requirements', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Pass123!');
      expect(control?.valid).toBe(true);
    });

    it('should accept password at maximum length with all requirements', () => {
      const control = component.updateUserPasswordForm.get('newPassword');
      control?.setValue('Password12345!@');
      expect(control?.valid).toBe(true);
    });
  });
});
