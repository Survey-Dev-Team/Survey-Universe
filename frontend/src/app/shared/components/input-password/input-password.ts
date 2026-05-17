 import { 
  Component, 
  input, 
  forwardRef, 
  inject,
  signal,
  computed,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import {
  FormsModule,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PasswordValidationService } from './services/password-validation.service';
import { PasswordStrength } from './models/password-strength.model';

@Component({
  selector: 'gt-input-password',
  imports: [
    PasswordModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './input-password.html',
  styleUrl: './input-password.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPassword),
      multi: true,
    },
  ],
})
export class InputPassword implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private passwordService = inject(PasswordValidationService);
  private elementRef = inject(ElementRef);
  private subscriptions = new Subscription();

  label = input.required<string>();
  placeholder = input.required<string>();
  name = input.required<string>();
  formControlName = input.required<string>();
  parentForm = input.required<FormGroup>();
  isRegistrationPassword = input.required<boolean>();
  isRegistrationConfirmPassword = input.required<boolean>();
  isLoginPassword = input.required<boolean>();

  private valueSignal = signal<string>('');
  private errorsSignal = signal<ValidationErrors | null>(null);
  private touchedSignal = signal<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (value: string) => {};
  private _onTouched = () => {};

  hasValue = computed<boolean>(() => {
    return this.valueSignal().length > 0;
  });

  passwordStrength = computed<PasswordStrength>(() => {
    return this.passwordService.assessPasswordStrength(this.valueSignal());
  });

  hasUppercase = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? /[A-Z]/.test(value) : false;
  });

  hasLowercase = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? /[a-z]/.test(value) : false;
  });

  hasNumber = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? /[0-9]/.test(value) : false;
  });

  hasSpecialChar = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~`]/.test(value) : false;
  });

  hasValidLength = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length >= 8 && value.length <= 16;
  });

  hasNoCommonPatterns = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? !/123456|abcdef|qwerty|password|admin|(.)\1{2,}/i.test(value) : false;
  });

  hasNoPersonalInfo = computed<boolean>(() => {
    const value = this.valueSignal();
    return value.length > 0 ? !/user|name|email/i.test(value) : false;
  });

  passwordsMatch = computed<boolean>(() => {
    if (!this.isRegistrationConfirmPassword()) {
      return false;
    }
    
    const confirmPassword = this.valueSignal();
    const errors = this.errorsSignal();
    
    return !!(confirmPassword && 
              confirmPassword.length > 0 && 
              (!errors || !errors['passwordMismatch']));
  });

  isTouchedAndInvalid = computed<boolean>(() => {
  const touched = this.touchedSignal();
  if (!touched) return false;

  if (this.isRegistrationPassword()) {
    const isValid =
      this.hasUppercase() &&
      this.hasLowercase() &&
      this.hasNumber() &&
      this.hasSpecialChar() &&
      this.hasValidLength();

    return !isValid;
  }

  if (this.isRegistrationConfirmPassword()) {
    return !this.passwordsMatch();
  }

  if (this.isLoginPassword()) {
    return this.valueSignal().length === 0 || !!this.control?.invalid;
  }

  return !!this.control?.invalid;
});

  get value(): string {
    return this.valueSignal();
  }

  set value(newValue: string) {
    this.valueSignal.set(newValue);
  }

  get control() {
    return this.parentForm()?.get(this.formControlName()) as FormControl | null;
  }

  isVeryWeak = computed<boolean>(() => {
    return this.passwordStrength().score <= 1;
  });

  isWeak = computed<boolean>(() => {
    return this.passwordStrength().score <= 2;
  });

  isFair = computed<boolean>(() => {
    return this.passwordStrength().score >= 3 && this.passwordStrength().score <= 4;
  });

  isGood = computed<boolean>(() => {
    return this.passwordStrength().score >= 5 && this.passwordStrength().score <= 6;
  });

  isStrong = computed<boolean>(() => {
    return this.passwordStrength().score >= 7;
  });

  isVeryStrong = computed<boolean>(() => {
    return this.passwordStrength().score === 8 && this.valueSignal().length >= 16;
  });

  meetsEnterpriseStandard = computed<boolean>(() => {
    return this.passwordStrength().score >= 6 && this.valueSignal().length >= 12;
  });

  meetsBankingStandard = computed<boolean>(() => {
    return this.passwordStrength().score >= 7 && this.valueSignal().length >= 14 && this.hasNoCommonPatterns();
  });

  meetsGovernmentStandard = computed<boolean>(() => {
    return this.passwordStrength().score === 8 && this.valueSignal().length >= 15 && this.hasNoCommonPatterns();
  });

  getPasswordStrength(): number {
    return this.passwordStrength().score;
  }

  getMeterClass(): string {
    return this.passwordStrength().cssClass;
  }

  ngAfterViewInit() {
    const valueChanges = this.control?.valueChanges.subscribe(value => {
      this.valueSignal.set(value || '');
    });
    if (valueChanges) {
      this.subscriptions.add(valueChanges);
    }
    
    const statusChanges = this.control?.statusChanges.subscribe(() => {
      this.errorsSignal.set(this.control?.errors ?? null);
    });
    if (statusChanges) {
      this.subscriptions.add(statusChanges);
    }
    
    if (this.control?.value) {
      this.valueSignal.set(this.control.value);
    }
    this.errorsSignal.set(this.control?.errors ?? null);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  writeValue(value: string): void {
    this.valueSignal.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  onBlur(): void {
    this.touchedSignal.set(true);
    this._onTouched();
  }

  onInput(value: string): void {
    this.valueSignal.set(value);
    this._onChange(value);
  }
}
