import { 
  Component, 
  inject,
  signal,
  output
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { take} from 'rxjs/internal/operators/take';

import { InputType } from '../../../../shared/components/input/models/input.model';
import { ButtonText } from '../../../../shared/models/buttons.constants';

import { Input } from '../../../../shared/components/input/input';
import { InputPassword } from '../../../../shared/components/input-password/input-password';
import { 
  UserErrorResponse, 
  UserRegistration, 
  UserSuccessResponse 
} from '../../../../shared/models/interfaces';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { comparePasswordsValidator } from '../../../../shared/validators/compare-passwords.validator';
import { Toast } from '../../../../shared/components/toast/toast';

@Component({
  selector: 'gt-registration-form',
  imports: [
    Input, 
    ReactiveFormsModule, 
    InputPassword, 
    Toast
  ],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
})
export class RegistrationForm {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  inputType = InputType;
  buttonText = ButtonText;
  errorText = signal<string>('');
  isFormInvalid = signal<boolean>(false);
  isSuccess = false;
  successText = '';
  registrationSuccess = output<string>();

  registrationForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z'-]+$/),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z'-]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
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
  }, { 
    validators: comparePasswordsValidator('password', 'confirmPassword') 
  });

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const payload: UserRegistration = {
      email: this.registrationForm.value.email!,
      password: this.registrationForm.value.password!,
      firstName: this.registrationForm.value.firstName!,
      lastName: this.registrationForm.value.lastName!,
      captchaAnswer: '',
      captchaId: '',
    };

    this.authService
      .register(payload)
      .pipe(take(1))
      .subscribe({
        next: (response: UserSuccessResponse) => {
          this.successText = response.message || 'Registration successful! You can now log in with your credentials.';
          this.isSuccess = true;
          this.registrationSuccess.emit(this.registrationForm.value.email!);
        },
      error: (error: UserErrorResponse) => {
        if(error.status === 400) {
          this.errorText.set( 'Registration failed. Please check your input and try again.');
        } else {
          this.errorText.set(error.error?.message || 'An error occurred during registration. Please try again.');
        }
        },
      });
  }
}
