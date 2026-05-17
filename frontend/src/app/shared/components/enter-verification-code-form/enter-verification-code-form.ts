import { 
  Component, 
  inject, 
  OnInit, 
  output, 
  signal, 
  model,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  ActivatedRoute, 
  Router, 
  RouterLink
} from '@angular/router';
import { ROUTES } from '../../models/routes.constants';
import { ToastService } from '../../services/toast-service/toast-service';
import { EnterVerificationCodePasswordPayload } from './models/interfaces';
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
  private destroyRef = inject(DestroyRef);
  errorText = signal<string>('');
  InputType = InputType;
  ButtonText = ButtonText;
  routes = ROUTES;
  activatedRoute = inject(ActivatedRoute);
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
      this.authService.currentEmailForResetPassword.set(this.currentEmail());
      this.isRegistrationFlow.set(true);
      return;
    }
    
    const storedEmail = localStorage.getItem('registrationEmail');
    if (storedEmail) {
      this.authService.currentEmailForResetPassword.set(storedEmail);
      this.isRegistrationFlow.set(true);
      return;
    }
    
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
      const token = params['token'] || '';
      if (token) {
        this.currentToken.set(token);
        console.log('Token from query params:', token);
        
        this.authService.requestVerifyToken(token).subscribe({
          next: (response: EnterVerificationCodePasswordPayload) => {
            this.currentCode.set(response.code);
            this.authService.currentEmailForResetPassword.set(response.email);
            this.currentEmail.set(response.email);
            this.isRegistrationFlow.set(false);
            this.copyCodeToClipboard(response.code);
          },
          error: (error: any) => {
            console.error('Verify token request failed:', error);
            const errorMessage =
              error.error?.message ||
              'The verification link has expired. Please request a new password reset.';
            this.errorText.set(errorMessage);
            this.verificationCodeForm.markAllAsTouched();
          },
        });
      }
    });
  }

  onSubmit() {
    this.verificationCodeForm.markAllAsTouched();
    if (this.verificationCodeForm.valid) {
      const email = this.currentEmail() || this.authService.currentEmailForResetPassword();
      const code = this.verificationCodeForm.get('verificationCode')?.value;
      
      if (email && code) {
        if (this.isRegistrationFlow()) {
          this.authService.registrationVerificationCode(email, code).subscribe({
            next: (response) => {
              this.toastService.showToast({
                severity: 'success',
                message: 'Success',
                detail: 'Your account has been created successfully. Please sign in with your details.',
                life: 3000
              });
              localStorage.removeItem('registrationEmail');
              this.router.navigate([`/${this.routes.LOGIN}`]);
            },
            error: (error) => {
              if (error.status === 400) {
                this.errorText.set('Invalid verification code. Please try again.');
              } else {
                const errorMessage = error.error?.message || 'An error occurred while verifying code.';
                this.errorText.set(errorMessage);
              }
              this.verificationCodeForm.markAllAsTouched();
            },
          });
        } 

        else {
          this.authService.requestVerifyCode({ code, email }).subscribe({
            next: (response) => {
              this.isSuccessVerificationCode.emit(true);
              this.isResendCodeClicked.set(true);
            },
            error: (error) => {
              if (error.status === 400) {
                this.errorText.set('Invalid verification code. Please try again.');
              } else {
                const errorMessage = error.error?.message || 'An error occurred while requesting password reset.';
                this.errorText.set(errorMessage);
              }
              this.verificationCodeForm.markAllAsTouched();
            },
          });
        }
      }
    }
  }

  resendCode() {
    this.counter.set(60);
    this.isCounterActive.set(true);

    const email = this.currentEmail() || this.authService.currentEmailForResetPassword();
    
    if (this.isRegistrationFlow()) {
      this.authService.resendVerificationCode(email).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          const errorMessage =
            error.error?.message ||
            'An error occurred while resending verification code.';
          this.errorText.set(errorMessage);
          this.verificationCodeForm.markAllAsTouched();
        },
      });
    } else {
      this.authService.requestPasswordReset(email).subscribe({
        next: (response: any) => {
          console.log(response);
          this.isResendCodeClicked.set(true);
          this.verificationCodeForm.get('verificationCode')?.setValue('');
          this.verificationCodeForm.markAllAsTouched();
        },
        error: (error: any) => {
          const errorMessage =
            error.error?.message ||
            'An error occurred while requesting verify token.';
          this.errorText.set(errorMessage);
          this.verificationCodeForm.markAllAsTouched();
        },
      });
    }
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
