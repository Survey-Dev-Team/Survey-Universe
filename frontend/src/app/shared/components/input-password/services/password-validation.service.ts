import { Injectable } from '@angular/core';
import {
  PasswordStrength,
  PasswordStrengthLevel,
  PasswordCriteria,
  PasswordStrengthCssClass,
} from '../models/password-strength.model';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  assessPasswordStrength(password: string): PasswordStrength {
    const criteria = this.getCriteria(password);
    return this.calculateStrength(password, criteria);
  }

  private getCriteria(password: string): PasswordCriteria {
    return {
      hasUppercase: this.hasUppercase(password),
      hasLowercase: this.hasLowercase(password),
      hasNumber: this.hasNumber(password),
      hasSpecialChar: this.hasSpecialChar(password),
      hasValidLength: this.hasValidLength(password),
      hasNoCommonPatterns: this.hasNoCommonPatterns(password),
      hasNoPersonalInfo: this.hasNoPersonalInfo(password),
    };
  }

  private calculateStrength(password: string, criteria: PasswordCriteria): PasswordStrength {
    if (!password || password.length === 0) {
      return {
        score: 0,
        maxScore: 8,
        percentage: 0,
        level: PasswordStrengthLevel.NONE,
        cssClass: '',
        label: '',
      };
    }

    let score = 0;

    if (criteria.hasLowercase) score++;
    if (criteria.hasUppercase) score++;
    if (criteria.hasNumber) score++;
    if (criteria.hasSpecialChar) score++;
    if (criteria.hasValidLength) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (criteria.hasNoCommonPatterns) score++;

    const maxScore = 8;
    const percentage = Math.round((score / maxScore) * 100);
    const level = this.getStrengthLevel(score, password.length);

    return {
      score,
      maxScore,
      percentage,
      level,
      cssClass: this.getCssClass(level),
      label: this.getLabel(level),
    };
  }

  private hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  private hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  private hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  private hasSpecialChar(password: string): boolean {
    return /[!@#$%^&*()_+\-=[]{};':"\\|,.<>\/?~`]/.test(password);
  }

  private hasValidLength(password: string): boolean {
    return password.length >= 8 && password.length <= 128;
  }

  private hasNoCommonPatterns(password: string): boolean {
    const commonPatterns = [/123456/, /abcdef/i, /qwerty/i, /password/i, /admin/i, /(.)\1{2,}/];

    return !commonPatterns.some(pattern => pattern.test(password));
  }

  private hasNoPersonalInfo(password: string): boolean {
    const personalPatterns = [/user/i, /name/i, /email/i];

    return !personalPatterns.some(pattern => pattern.test(password));
  }

  private getStrengthLevel(score: number, length: number): PasswordStrengthLevel {
    if (length < 8 || score <= 2) return PasswordStrengthLevel.WEAK;
    if (length >= 16 || score >= 7) return PasswordStrengthLevel.STRONG;
    if (length >= 12 || score >= 5) return PasswordStrengthLevel.MEDIUM;
    if (score >= 3) return PasswordStrengthLevel.MEDIUM;

    return PasswordStrengthLevel.WEAK;
  }

  private getCssClass(level: PasswordStrengthLevel): string {
    switch (level) {
      case PasswordStrengthLevel.WEAK:
        return PasswordStrengthCssClass.WEAK_CLASS;
      case PasswordStrengthLevel.MEDIUM:
        return PasswordStrengthCssClass.MEDIUM_CLASS;
      case PasswordStrengthLevel.STRONG:
        return PasswordStrengthCssClass.STRONG_CLASS;
      default:
        return '';
    }
  }

  private getLabel(level: PasswordStrengthLevel): string {
    switch (level) {
      case PasswordStrengthLevel.WEAK:
        return (
          PasswordStrengthLevel.WEAK.charAt(0).toUpperCase() + PasswordStrengthLevel.WEAK.slice(1)
        );
      case PasswordStrengthLevel.MEDIUM:
        return (
          PasswordStrengthLevel.MEDIUM.charAt(0).toUpperCase() +
          PasswordStrengthLevel.MEDIUM.slice(1)
        );
      case PasswordStrengthLevel.STRONG:
        return (
          PasswordStrengthLevel.STRONG.charAt(0).toUpperCase() +
          PasswordStrengthLevel.STRONG.slice(1)
        );
      default:
        return '';
    }
  }
}
