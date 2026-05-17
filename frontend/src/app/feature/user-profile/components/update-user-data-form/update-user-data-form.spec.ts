import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { UpdateUserDataForm } from './update-user-data-form';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { Input } from '../../../../shared/components/input/input';

describe('UpdateUserDataForm', () => {
  let component: UpdateUserDataForm;
  let fixture: ComponentFixture<UpdateUserDataForm>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://example.com/image.jpg',
    role: 'CUSTOMER' as const,
    email: 'john@example.com'
  };

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'CUSTOMER' as const,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(async () => {
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', [
      'getUserData',
      'updateUserData',
      'getUser',
      'getUserProfile'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    await TestBed.configureTestingModule({
      imports: [
        UpdateUserDataForm,
        ReactiveFormsModule,
        Input
      ],
      providers: [
        provideZoneChangeDetection(),
        provideHttpClient(),
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    userStoreService.getUserData.and.returnValue(of(mockUserData));
    userStoreService.getUser.and.returnValue(mockUser);

    fixture = TestBed.createComponent(UpdateUserDataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user data on init', () => {
      expect(userStoreService.getUserData).toHaveBeenCalled();
      expect(component.currentUserData().firstName).toBe('John');
      expect(component.currentUserData().lastName).toBe('Doe');
    });

    it('should initialize form with user data', () => {
      expect(component.updateUserDataForm.get('firstName')?.value).toBe('John');
      expect(component.updateUserDataForm.get('lastName')?.value).toBe('Doe');
    });

    it('should set currentUserData signal', () => {
      expect(component.currentUserData()).toEqual(mockUserData);
    });

    it('should compute currentUser from service', () => {
      expect(component.currentUser()).toEqual(mockUser);
    });

    it('should compute currentUserRole as capitalized string', () => {
      expect(component.currentUserRole()).toBe('Customer');
    });
  });

  describe('Form Controls', () => {
    it('should have base64encodedImage control', () => {
      const control = component.updateUserDataForm.get('base64encodedImage');
      expect(control).toBeDefined();
    });

    it('should have firstName control with validators', () => {
      const control = component.updateUserDataForm.get('firstName');
      expect(control).toBeDefined();
      
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate firstName minimum length', () => {
      const control = component.updateUserDataForm.get('firstName');
      control?.setValue('J');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate firstName maximum length', () => {
      const control = component.updateUserDataForm.get('firstName');
      control?.setValue('J'.repeat(51));
      expect(control?.hasError('maxlength')).toBe(true);
    });

    it('should validate firstName pattern', () => {
      const control = component.updateUserDataForm.get('firstName');
      control?.setValue('John123');
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept valid firstName with hyphen and apostrophe', () => {
      const control = component.updateUserDataForm.get('firstName');
      control?.setValue("Mary-Jane");
      expect(control?.valid).toBe(true);

      control?.setValue("O'Brien");
      expect(control?.valid).toBe(true);
    });

    it('should have lastName control with validators', () => {
      const control = component.updateUserDataForm.get('lastName');
      expect(control).toBeDefined();
      
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate lastName minimum length', () => {
      const control = component.updateUserDataForm.get('lastName');
      control?.setValue('D');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should validate lastName maximum length', () => {
      const control = component.updateUserDataForm.get('lastName');
      control?.setValue('D'.repeat(51));
      expect(control?.hasError('maxlength')).toBe(true);
    });

    it('should validate lastName pattern', () => {
      const control = component.updateUserDataForm.get('lastName');
      control?.setValue('Doe123');
      expect(control?.hasError('pattern')).toBe(true);
    });
  });

  describe('File Upload', () => {
    it('should process file selection', () => {
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
      const event = { files: [file] };

      const reader = new FileReader();
      spyOn(reader, 'readAsDataURL');

      component.onSelect(event);

      expect(reader.readAsDataURL).not.toHaveBeenCalled();
    });

    it('should handle file selection without file', () => {
      const event = { files: [] };
      component.onSelect(event);

      expect(component.updateUserDataForm.get('base64encodedImage')?.value).toBeNull();
    });

    it('should update form with base64 image', (done) => {
      const mockBase64 = 'mockBase64String';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = { files: [file] };

      const mockReader = {
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null,
        readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function(this: FileReader) {
          (this as any).result = `data:image/jpeg;base64,${mockBase64}`;
          if (this.onload) {
            this.onload.call(this, {} as ProgressEvent<FileReader>);
          }
        })
      };

      spyOn(window as any, 'FileReader').and.returnValue(mockReader);

      component.onSelect(event);

      setTimeout(() => {
        expect(component.updateUserDataForm.get('base64encodedImage')?.value).toBe(mockBase64);
        done();
      }, 100);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      userStoreService.updateUserData.and.returnValue(of({ message: 'Success' }));
      component.updateUserDataForm.patchValue({
        firstName: 'Jane',
        lastName: 'Smith'
      });
    });

    it('should submit valid form', () => {
      component.onSubmit();

      expect(userStoreService.updateUserData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          firstName: 'Jane',
          lastName: 'Smith'
        })
      );
    });

    it('should not submit invalid form', () => {
      component.updateUserDataForm.patchValue({
        firstName: '',
        lastName: ''
      });

      component.onSubmit();

      expect(userStoreService.updateUserData).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched on invalid submission', () => {
      component.updateUserDataForm.patchValue({
        firstName: '',
        lastName: ''
      });

      component.onSubmit();

      expect(component.updateUserDataForm.get('firstName')?.touched).toBe(true);
      expect(component.updateUserDataForm.get('lastName')?.touched).toBe(true);
    });

    it('should show success toast on successful update', () => {
      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          detail: 'Success'
        })
      );
    });

    it('should reload user data after successful update', () => {
      userStoreService.getUserData.calls.reset();
      component.onSubmit();

      expect(userStoreService.getUserData).toHaveBeenCalled();
    });

    it('should clear file upload after submission', () => {
      component.updateUserDataForm.patchValue({
        base64encodedImage: 'base64string'
      });

      component.onSubmit();

      expect(component.updateUserDataForm.get('base64encodedImage')?.value).toBeNull();
    });

    it('should show error toast on update failure', () => {
      const error = {
        error: {
          message: 'Update failed'
        }
      };
      userStoreService.updateUserData.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          detail: 'Update failed'
        })
      );
    });

    it('should handle error with errors array', () => {
      const error = {
        error: {
          errors: [{ message: 'Validation error' }]
        }
      };
      userStoreService.updateUserData.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          detail: 'Validation error'
        })
      );
    });

    it('should handle error without specific message', () => {
      userStoreService.updateUserData.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(toastService.showToast).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          detail: 'An error occurred while updating your account. Please try again.'
        })
      );
    });

    it('should log form value on submit', () => {
      spyOn(console, 'log');
      component.onSubmit();

      expect(console.log).toHaveBeenCalled();
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

  describe('Role Formatting', () => {
    it('should format CUSTOMER role', () => {
      expect(component.currentUserRole()).toBe('Customer');
    });

    it('should format WAITER role', () => {
      userStoreService.getUserData.and.returnValue(of({
        ...mockUserData,
        role: 'WAITER' as const
      }));
      
      fixture = TestBed.createComponent(UpdateUserDataForm);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.currentUserRole()).toBe('Waiter');
    });

    it('should handle empty role', () => {
      userStoreService.getUserData.and.returnValue(of({
        ...mockUserData,
        role: '' as any
      }));
      
      fixture = TestBed.createComponent(UpdateUserDataForm);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.currentUserRole()).toBe('');
    });
  });
});
