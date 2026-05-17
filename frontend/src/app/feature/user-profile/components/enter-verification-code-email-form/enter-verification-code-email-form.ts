 import { 
  Component, 
  computed, 
  inject, 
  OnInit, 
  signal,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  FormBuilder, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { InputType } from '../../../../shared/components/input/models/input.model';
import { ButtonText } from '../../../../shared/models/buttons.constants';
import { Input } from '../../../../shared/components/input/input';
import { 
  ActivatedRoute, 
  Router 
} from '@angular/router';
import { ROUTES } from '../../../../shared/models/routes.constants';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage';

@Component({
  selector: 'gt-enter-verification-code-email-form',
  imports: [ReactiveFormsModule, Input],
  templateUrl: './enter-verification-code-email-form.html',
  styleUrl: './enter-verification-code-email-form.scss',
})
export class EnterVerificationCodeEmailForm implements OnInit {
  fb = inject(FormBuilder);
  userStoreService = inject(UserStoreService);
  toastService = inject(ToastService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  private destroyRef = inject(DestroyRef);
  currentUser = computed(() => this.userStoreService.getUser());
  errorText = signal<string>('');
  isSuccess = signal<boolean>(false);
  sentEmail = signal<string>('');
  newEmail = signal<string>('');
  currentToken = signal<string>('');
  counter = signal<number>(60);
  isCounterActive = signal<boolean>(false);
  isResendCodeClicked = signal<boolean>(false);
  isSetCodeClicked = signal<boolean>(false);
  currentCode = computed(() => this.userStoreService.currentCode());
  inputType = InputType;
  buttonText = ButtonText;
  routes = ROUTES;
  private intervalId: any = null;

  enterVerificationCodeEmailForm = this.fb.group({
    verificationCode: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.startCounter();

    const pendingEmail = this.localStorageService.getItem<string>('pendingEmailChange');
    if (pendingEmail) {
      this.newEmail.set(pendingEmail);
      this.sentEmail.set(this.currentUser()?.email || '');
    }

    console.log('Current code from service on init:', this.userStoreService.currentCode());
    
    const code = this.userStoreService.currentCode();
    if (code) {
      this.copyCodeToClipboard(code);
    }

    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
      const token = params['token'] || '';
      this.currentToken.set(token);
    });
  }

  onSubmit() {
    this.enterVerificationCodeEmailForm.markAllAsTouched();
    if (this.enterVerificationCodeEmailForm.valid) {
      const code =
      this.enterVerificationCodeEmailForm.get('verificationCode')?.value;
      const email = this.newEmail();

      console.log(
        'Verifying email change with code:',
        code,
        'for email:',
        email
      );

      if (email && code) {
        this.userStoreService
          .verifyEmailChangeCode({
            newEmail: email,
            verificationCode: code,
          })
          .subscribe({
            next: (response) => {
              this.localStorageService.removeItem('pendingEmailChange');
              this.userStoreService.currentCode.set('');
              this.toastService.showToast({
                severity: 'success',
                message: 'Success',
                detail: 'Your email has been changed successfully.',
                life: 3000,
              });
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate([`/${this.routes.LOGIN}`]);
              }, 2000);
            },
            error: (error) => {
              let errorDescripiton = '';
              if (error.status === 400) {
                errorDescripiton = 'Invalid verification code or the code has expired. Please check the code and try again or request a new one.';
              } else {
                errorDescripiton = 'Failed to verify email change.';
              }
              console.error('Error verifying email change:', error);
              this.toastService.showToast({
                severity: 'error',
                message: 'Error',
                detail: errorDescripiton,
                life: 3000,
              });
            },
          });
      }
    }
  }

  resendCode() {
    this.counter.set(60);
    this.isCounterActive.set(true);

    const newEmail = this.newEmail();
    console.log('Resending verification code to email:', newEmail);
    
    if (newEmail) {
      this.userStoreService.changeUserEmail(newEmail).subscribe({
        next: (response) => {
          console.log('Verification code resent:', response);
          this.toastService.showToast({
            severity: 'success',
            message: 'Code Resent',
            detail: 'A new verification code has been sent to your email.',
            life: 3000,
          });
          this.startCounter();
        },
        error: (error) => {
          console.error('Failed to resend verification code:', error);
          this.toastService.showToast({
            severity: 'error',
            message: 'Error',
            detail: error.error?.message || 'Failed to resend verification code.',
            life: 3000,
          });
          this.isCounterActive.set(false);
        }
      });
    }
  }

  startCounter() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.isCounterActive.set(true);
    this.intervalId = setInterval(() => {
      if (this.counter() > 0) {
        this.counter.set(this.counter() - 1);
      } else {
        this.isCounterActive.set(false);
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 1000);
  }

  goBack() {
    this.router.navigate([`/${this.routes.USER_PROFILE}`], {
      queryParams: {},
    });
  }

  setCode() {
    this.enterVerificationCodeEmailForm.get('verificationCode')?.setValue(this.currentCode());
    this.isSetCodeClicked.set(true);
  }

  copyCodeToClipboard(code: string): void {
    navigator.clipboard.writeText(code);
  }
}
