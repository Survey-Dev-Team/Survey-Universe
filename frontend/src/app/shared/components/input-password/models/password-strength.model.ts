export interface PasswordStrength {
  score: number;
  maxScore: number;
  percentage: number;
  level: PasswordStrengthLevel;
  cssClass: string;
  label: string;
}

export enum PasswordStrengthLevel {
  NONE = 'none',
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong'
}

export enum PasswordStrengthCssClass {
  MEDIUM_CLASS = 'gt-input__medium',
  WEAK_CLASS = 'gt-input__weak',
  STRONG_CLASS = 'gt-input__strong'
}

export interface PasswordCriteria {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasValidLength: boolean;
  hasNoCommonPatterns: boolean;
  hasNoPersonalInfo: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  criteria: PasswordCriteria;
  errors: string[];
  suggestions: string[];
}