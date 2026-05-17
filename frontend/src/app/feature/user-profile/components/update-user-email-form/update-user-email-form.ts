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
        this.toastService.showToast({
          severity: 'info',
          message: 'Info',
          detail: 'Email change is not yet implemented.',
          life: 3000,
        });
      }
    }
  }

}
