import { ButtonText } from '../../../../shared/models/buttons.constants';
import { InputType } from '../../../../shared/components/input/models/input.model';
import { 
  Component, 
  computed, 
  inject, 
  signal 
} from '@angular/core';
import { 
  ReactiveFormsModule, 
  Validators, 
  FormBuilder 
} from '@angular/forms';
import { Input } from '../../../../shared/components/input/input';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage';

@Component({
  selector: 'gt-update-user-email-form',
  imports: [
    Input, 
    ReactiveFormsModule
  ],
  templateUrl: './update-user-email-form.html',
  styleUrl: './update-user-email-form.scss',
})
export class UpdateUserEmailForm {
  fb = inject(FormBuilder);
  userStoreService = inject(UserStoreService);
  toastService = inject(ToastService);
  localStorageService = inject(LocalStorageService);
  currentUser = computed(() => this.userStoreService.getUser());
  errorText = signal<string>('');
  isSuccess = signal<boolean>(false);
  sentEmail = signal<string>('');
  inputType = InputType;
  buttonText = ButtonText;

  updateUserEmailForm = this.fb.group({
    newEmail: ['',
      [
        Validators.required,
        Validators.email,
      ],
    ],
  });

  onSubmit() {
    if (this.updateUserEmailForm.valid) {
      console.log('Form Submitted', this.updateUserEmailForm.value);
      const newEmail = this.updateUserEmailForm.value.newEmail;
      if (newEmail) {
        this.userStoreService.changeUserEmail(newEmail).subscribe({
          next: (response) => {
            console.log('Email change initiated:', response);
            this.sentEmail.set(this.currentUser()?.email || '');
            this.localStorageService.setItem('pendingEmailChange', newEmail);
            this.isSuccess.set(true);
          },
          error: (error) => {
            console.error('Failed to initiate email change:', error);
            const errorMessage = error.error?.message || 'Failed to initiate email change. Please try again.';
            this.toastService.showToast({
              severity: 'error',
              message: 'Error',
              detail: errorMessage,
              life: 4000
            });
            this.updateUserEmailForm.get('newEmail')?.setErrors({ emailInUse: true });
          }
        });
      }
    }
  }

}
