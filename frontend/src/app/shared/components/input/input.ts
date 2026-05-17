import { CommonModule } from '@angular/common';
import { 
  Component, 
  input, 
  forwardRef
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';
import { errorsMap } from '../../validators/validators';
import { PasswordToggleDirective } from '../../directives/password-toggle.directive';

@Component({
  selector: 'gt-input',
  imports: [CommonModule, ReactiveFormsModule, PasswordToggleDirective],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  type = input.required();
  label = input.required();
  placeholder = input.required();
  description = input();
  class = input.required();
  formControlName = input.required<string>();
  parentForm = input.required<FormGroup>();
  isLoginForm = input.required<boolean>();
  isAddWaiterForm = input<boolean>(false);
  BEValidationsErrors = input<string | undefined>();

  value: string = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange = (value: string) => {};
  private _onTouched = () => {};

  get control() {
    return this.parentForm()?.get(this.formControlName()) as FormControl | null;
  }

  getErrorMessages(): string[] {
    const control = this.control;
    const errors = control?.errors;

    if (!errors) {
      return [];
    }

    return Object.keys(errors).map(key => this.getErrorMessage(key));
  }

  private getErrorMessage(key: string): string {
    if (this.isLoginForm() && key === 'required') {
      return this.getLoginRequiredError();
    }
    
    if (this.isAddWaiterForm()) {
      return this.getWaiterFormError(key);
    }

    if (key === 'email' && !this.isAddWaiterForm()) {
      return errorsMap.get('email') || 'Invalid email';
    }
    
    if (key === 'emailInUse') {
      return errorsMap.get('emailInUse') || 'Email already in use';
    }
    
    if (key === 'pattern') {
      return errorsMap.get('pattern') || 'Invalid format';
    }
    
    const errorMessage = errorsMap.get(key);
    return errorMessage ? `${this.label()} ${errorMessage}` : 'Unknown error';
  }

  private getLoginRequiredError(): string {
    if (this.type() === 'email') {
      return errorsMap.get('loginEmailRequired') || 'Email is required';
    }
    if (this.type() === 'password') {
      return errorsMap.get('loginPasswordRequired') || 'Password is required';
    }
    return 'Field is required';
  }

  private getWaiterFormError(key: string): string {
    if (key === 'required') {
      return errorsMap.get('required') 
        ? `${this.label()} ${errorsMap.get('required')}` 
        : 'Field is required';
    }
    if (key === 'email') {
      return errorsMap.get('email') || 'Invalid email';
    }
    const errorMessage = errorsMap.get(key);
    return errorMessage ? `${this.label()} ${errorMessage}` : 'Unknown error';
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this._onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  onBlur(): void {
    this._onTouched();
    this.control?.markAsTouched();
  }
}
