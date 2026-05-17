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
      this.toastService.showToast({
        severity: 'info',
        message: 'Info',
        detail: 'Password change is not yet implemented.',
        life: 3000,
      });
    }
  }
}
