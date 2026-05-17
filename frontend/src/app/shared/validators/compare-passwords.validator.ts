import { 
  AbstractControl, 
  ValidatorFn, 
  ValidationErrors 
} from '@angular/forms';

export function comparePasswordsValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (!password || !confirmPassword) {
      return null;
    }

    const currentErrors = confirmPasswordControl.errors || {};
    
    if (password !== confirmPassword) {
      // Add passwordMismatch error while preserving other errors
      confirmPasswordControl.setErrors({ 
        ...currentErrors, 
        passwordMismatch: true 
      });
      return { passwordMismatch: true }; 
    } else {
      // Remove only passwordMismatch error if passwords match
      if ('passwordMismatch' in currentErrors) {
        const { passwordMismatch, ...otherErrors } = currentErrors;
        const hasOtherErrors = Object.keys(otherErrors).length > 0;
        confirmPasswordControl.setErrors(hasOtherErrors ? otherErrors : null);
      }
    }
    
    return null;
  };
}