export const errorsMap = new Map<string, string>([
  ['password', 'Password is required. Please enter your password to continue.'],
  ['email', 'Invalid email address. Please ensure it follows the format: username@domain.com'],
  ['required', 'is required.'],
  ['loginEmailRequired', 'Email address is required. Please enter your email to continue.'],
  ['loginPasswordRequired', 'Password is required. Please enter your password to continue.'],
  ['minlength', 'must be at least 2 characters and up to 50 characters.'],
  ['maxlength', 'must be at least 2 characters and up to 50 characters.'],
  ['pattern', 'Only Latin letters, hyphens, and apostrophes are allowed.'],
  ['passwordMismatch', 'Confirm password must match new password.'],
  ['emailInUse', 'This email is already in use or invalid. Please enter a different email address.']
]);

