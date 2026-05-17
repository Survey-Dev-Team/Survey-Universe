import { 
  Component, 
  inject, 
  signal 
} from '@angular/core';
import { 
  ReactiveFormsModule, 
  Validators, 
  FormBuilder 
} from '@angular/forms';
import { comparePasswordsValidator } from '../../../../shared/validators/compare-passwords.validator';
import { InputPassword } from '../../../../shared/components/input-password/input-password';
import { ButtonText } from '../../../../shared/models/buttons.constants';
import { InputType } from '../../../../shared/components/input/models/input.model';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';

@Component({
  selector: 'gt-update-user-password',
  imports: [
    ReactiveFormsModule, 
    InputPassword
  ],
  templateUrl: './update-user-password.html',
  styleUrl: './update-user-password.scss',
})
export class UpdateUserPassword {
  fb = inject(FormBuilder);
  private userStoreService = inject(UserStoreService);
  private toastService = inject(ToastService);
  protected readonly buttonText = ButtonText;
  errorText = signal<string>('');
  protected readonly inputType = InputType;

  updateUserPasswordForm = this.fb.group(
    {
      oldPassword: [
        '',
        [
          Validators.required,
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: comparePasswordsValidator('newPassword', 'confirmPassword'),
    }
  );

  onSubmit() {
    if (!this.updateUserPasswordForm.valid) {
      return;
    }

    console.log('Form Submitted', this.updateUserPasswordForm.value);
    
    const currentPassword = this.updateUserPasswordForm.get('oldPassword')?.value ?? '';
    const newPassword = this.updateUserPasswordForm.get('newPassword')?.value ?? '';
    const confirmNewPassword = this.updateUserPasswordForm.get('confirmPassword')?.value ?? '';

    if (currentPassword && newPassword) {
      const payload = {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      };
      this.userStoreService.changeUserPassword(payload).subscribe({
        next: () => {
          console.log('Password updated successfully');
          this.errorText.set('');
          this.toastService.showToast({
            severity: 'success',
            message: 'Success',
            detail: 'Password updated successfully.',
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating password:', error);
          
          if (error.status === 404) {
            this.errorText.set('Password not found. Please check your current password.');
            this.toastService.showToast({
              severity: 'error',
              message: 'Error',
              detail: 'Password not found. Please check your current password.',
              life: 5000,
            });
          } else {
            this.errorText.set('Failed to update password. Please try again.');
            this.toastService.showToast({
              severity: 'error',
              message: 'Error',
              detail: error?.error?.errors?.[0]?.message || error?.error?.message || 'Failed to update password. Please try again.',
              life: 5000,
            });
          }
        },
      });
    }
  }
}
