import { 
  Component, 
  inject, 
  OnInit, 
  output, 
  signal, 
  model
} from '@angular/core';
import { 
  FormBuilder, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { ButtonText } from '../../models/buttons.constants';
import { InputType } from '../input/models/input.model';
import { AuthService } from '../../services/auth-service/auth-service';
import { Input } from '../input/input';
import { 
  Router, 
  RouterLink
} from '@angular/router';
import { ROUTES } from '../../models/routes.constants';
import { ToastService } from '../../services/toast-service/toast-service';
import { UserStoreService } from '../../services/user-store-service/user-store-service';

@Component({
  selector: 'gt-enter-verification-code-form',
  imports: [
    Input, 
    ReactiveFormsModule, 
    RouterLink
  ],
  templateUrl: './enter-verification-code-form.html',
  styleUrl: './enter-verification-code-form.scss',
})
export class EnterVerificationCodeForm implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserStoreService);
  router = inject(Router);
  toastService = inject(ToastService);
  errorText = signal<string>('');
  InputType = InputType;
  ButtonText = ButtonText;
  routes = ROUTES;
  currentToken = signal<string>('');
  currentCode = signal<string>('');
  currentEmail = model<string>('');
  counter = signal<number>(60);
  isCounterActive = signal<boolean>(false);
  isSuccessVerificationCode = output<boolean>();
  isRegistrationFlow = signal<boolean>(false);
  isResendCodeClicked = signal<boolean>(false);
  isSetCodeClicked = signal<boolean>(false);

  verificationCodeForm = this.fb.group({
    verificationCode: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.startCounter();
    
    if (this.currentEmail()) {
      this.isRegistrationFlow.set(true);
      return;
    }
    
    const storedEmail = localStorage.getItem('registrationEmail');
    if (storedEmail) {
      this.currentEmail.set(storedEmail);
      this.isRegistrationFlow.set(true);
      return;
    }
  }

  onSubmit() {
    this.verificationCodeForm.markAllAsTouched();
    if (this.verificationCodeForm.valid) {
      const email = this.currentEmail();
      const code = this.verificationCodeForm.get('verificationCode')?.value;
      
      if (email && code) {
        this.toastService.showToast({
          severity: 'info',
          message: 'Info',
          detail: 'This feature is not yet implemented.',
          life: 3000
        });
      }
    }
  }

  resendCode() {
    this.counter.set(60);
    this.isCounterActive.set(true);
    this.startCounter();
  }

  startCounter() {
    this.isCounterActive.set(true);
    const interval = setInterval(() => {
      if (this.counter() > 0) {
        this.counter.set(this.counter() - 1);
      } else {
        this.isCounterActive.set(false);
        clearInterval(interval);
      }
    }, 1000);
  }

  setCode() {
    this.verificationCodeForm.get('verificationCode')?.setValue(this.currentCode());
    this.isSetCodeClicked.set(true);
  }

  copyCodeToClipboard(code: string): void {
    navigator.clipboard.writeText(code);
  }
}
