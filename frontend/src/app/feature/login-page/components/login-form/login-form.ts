import { 
  Component, 
  inject, 
  signal, 
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { InputType } from '../../../../shared/components/input/models/input.model';
import { ButtonText } from '../../../../shared/models/buttons.constants';

import { Input } from '../../../../shared/components/input/input';
import { 
  UserLogin, 
  UserAuthResponse, 
  UserErrorResponse 
} from '../../../../shared/models/interfaces';
import { AuthService } from '../../../../shared/services/auth-service/auth-service';
import { take } from 'rxjs/internal/operators/take';
import { Toast } from '../../../../shared/components/toast/toast';
import { ROUTES } from '../../../../shared/models/routes.constants';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage';

@Component({
  selector: 'gt-login-form',
  imports: [
    Input, 
    ReactiveFormsModule, 
    Toast
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  errorText = signal<string>('');
  errorText429 = signal<string>('');
  inputType = InputType;
  buttonText = ButtonText;
  isSuccess = false;
  successText = '';

  loginForm = this.fb.group({
    email: ['', [
      Validators.email,
      Validators.required
    ]],
    password: [
      '',
      [
        Validators.required,
      ],
    ],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const payload: UserLogin = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService
      .login(payload)
      .pipe(take(1))
      .subscribe({
        next: (response: UserAuthResponse) => {
          this.localStorageService.setToken(response.jwtToken);
          this.successText = 'Login successful! You will be redirected shortly.';
          this.router.navigate([ROUTES.MAIN_PAGE]);
          this.isSuccess = true;
        },
        error: (error: UserErrorResponse) => {
          console.log('Login error response:', error);
          if(error.status === 429) {
            this.errorText429.set(error.error.message || 'Too many login attempts. Please wait a moment and try again.');
            this.errorText.set('Incorrect email or password. Try again or create an account.');
          } else if (error.status === 400 || error.status === 403) {
            this.errorText.set('Incorrect email or password. Try again or create an account.');
          } else if(error.status === 401) {
            this.errorText.set(error.error.message || 'Incorrect email or password. Try again or create an account.');
          }
        },
      });
  }
}
