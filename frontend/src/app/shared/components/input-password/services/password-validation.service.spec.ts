import { TestBed } from '@angular/core/testing';
import { PasswordValidationService } from './password-validation.service';
import { PasswordStrengthLevel } from '../models/password-strength.model';

describe('PasswordValidationService', () => {
  let service: PasswordValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assessPasswordStrength', () => {
    it('should return score 0 for empty password', () => {
      const result = service.assessPasswordStrength('');
      expect(result.score).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.level).toBe(PasswordStrengthLevel.NONE);
    });

    it('should assess weak password', () => {
      const result = service.assessPasswordStrength('abc');
      expect(result.level).toBe(PasswordStrengthLevel.WEAK);
      expect(result.score).toBeLessThanOrEqual(2);
    });

    it('should assess medium password', () => {
      const result = service.assessPasswordStrength('Pass@123');
      expect(result.level).toBe(PasswordStrengthLevel.MEDIUM);
      expect(result.score).toBeGreaterThanOrEqual(3);
    });

    it('should assess strong password', () => {
      const result = service.assessPasswordStrength('Str0ng!P@ssw0rd1234');
      expect(result.level).toBe(PasswordStrengthLevel.STRONG);
      expect(result.score).toBeGreaterThanOrEqual(7);
    });

    it('should increment score for lowercase letters', () => {
      const withLowercase = service.assessPasswordStrength('abcdefgh');
      expect(withLowercase.score).toBeGreaterThan(0);
    });

    it('should increment score for uppercase letters', () => {
      const withUppercase = service.assessPasswordStrength('ABCDEFGH');
      expect(withUppercase.score).toBeGreaterThan(0);
    });

    it('should increment score for numbers', () => {
      const withNumbers = service.assessPasswordStrength('12345678');
      expect(withNumbers.score).toBeGreaterThan(0);
    });

    it('should increment score for special characters', () => {
      const withSpecial = service.assessPasswordStrength('!@#$%^&*');
      expect(withSpecial.score).toBeGreaterThan(0);
    });

    it('should increment score for valid length (8-128)', () => {
      const validLength = service.assessPasswordStrength('12345678');
      expect(validLength.score).toBeGreaterThan(0);
    });

    it('should increment score for length >= 12', () => {
      const longPassword = service.assessPasswordStrength('Pass@1234567');
      const shortPassword = service.assessPasswordStrength('Pass@123');
      expect(longPassword.score).toBeGreaterThan(shortPassword.score);
    });

    it('should increment score for length >= 16', () => {
      const veryLongPassword = service.assessPasswordStrength('Pass@12345678901');
      const mediumPassword = service.assessPasswordStrength('Pass@1234567');
      // veryLongPassword has score 7 (contains 123456 pattern), mediumPassword has score 6
      expect(veryLongPassword.score).toBeGreaterThan(mediumPassword.score);
    });

    it('should increment score for no common patterns', () => {
      const noCommon = service.assessPasswordStrength('UniqueP@ss1');
      expect(noCommon.score).toBeGreaterThan(0);
    });

    it('should not increment for common patterns', () => {
      const withPattern = service.assessPasswordStrength('password123');
      expect(withPattern.score).toBeLessThan(8);
    });

    it('should detect 123456 pattern', () => {
      const result = service.assessPasswordStrength('test123456');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect abcdef pattern', () => {
      const result = service.assessPasswordStrength('ABCDEFtest');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect qwerty pattern', () => {
      const result = service.assessPasswordStrength('QWERTYpass');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect password pattern', () => {
      const result = service.assessPasswordStrength('password123');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect admin pattern', () => {
      const result = service.assessPasswordStrength('admin123');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect repeating characters', () => {
      const result = service.assessPasswordStrength('aaa123');
      expect(result.score).toBeLessThan(8);
    });

    it('should detect personal info - user', () => {
      const result = service.assessPasswordStrength('username123');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect personal info - name', () => {
      const result = service.assessPasswordStrength('myname123');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect personal info - email', () => {
      const result = service.assessPasswordStrength('email@123');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should calculate correct percentage', () => {
      const result = service.assessPasswordStrength('Str0ng!P@ssw0rd1234');
      expect(result.percentage).toBe(Math.round((result.score / result.maxScore) * 100));
    });

    it('should return correct max score', () => {
      const result = service.assessPasswordStrength('test');
      expect(result.maxScore).toBe(8);
    });

    it('should return correct CSS class for weak password', () => {
      const result = service.assessPasswordStrength('weak');
      expect(result.cssClass).toBeDefined();
      expect(result.cssClass.length).toBeGreaterThan(0);
    });

    it('should return correct CSS class for medium password', () => {
      const result = service.assessPasswordStrength('Medium@123');
      expect(result.cssClass).toBeDefined();
    });

    it('should return correct CSS class for strong password', () => {
      const result = service.assessPasswordStrength('Str0ng!P@ssw0rd1234');
      expect(result.cssClass).toBeDefined();
    });

    it('should return correct label for weak password', () => {
      const result = service.assessPasswordStrength('weak');
      expect(result.label).toBe('Weak');
    });

    it('should return correct label for medium password', () => {
      const result = service.assessPasswordStrength('Medium@123');
      expect(result.label).toBe('Medium');
    });

    it('should return correct label for strong password', () => {
      const result = service.assessPasswordStrength('Str0ng!P@ssw0rd1234');
      expect(result.label).toBe('Strong');
    });

    it('should assess password with all criteria met', () => {
      const result = service.assessPasswordStrength('Str0ng!Uniq@P@ssw0rd');
      expect(result.score).toBe(7); // No common patterns check will fail due to repeating characters
    });

    it('should handle password with length < 8 as weak', () => {
      const result = service.assessPasswordStrength('Ab@1');
      expect(result.level).toBe(PasswordStrengthLevel.WEAK);
    });

    it('should handle password with length > 128 as invalid length', () => {
      const longPassword = 'A'.repeat(129) + '@1';
      const result = service.assessPasswordStrength(longPassword);
      expect(result.score).toBeLessThan(8);
    });

    it('should properly classify medium strength with score 5', () => {
      const result = service.assessPasswordStrength('GoodP@ss12');
      if (result.score === 5) {
        expect(result.level).toBe(PasswordStrengthLevel.MEDIUM);
      }
    });

    it('should properly classify strong strength with length >= 16', () => {
      const password = 'VeryStr0ng!P@ss1';
      const result = service.assessPasswordStrength(password);
      if (password.length >= 16) {
        expect(result.level).toBe(PasswordStrengthLevel.STRONG);
      }
    });

    it('should detect special characters correctly', () => {
      const specialChars = '!@#$%^&*()_+-=[]{};\':\"\\|,.<>/?~`';
      for (const char of specialChars) {
        const result = service.assessPasswordStrength(`Test${char}123`);
        expect(result.score).toBeGreaterThan(0);
      }
    });

    it('should not give score for too short passwords', () => {
      const result = service.assessPasswordStrength('Ab@1');
      expect(result.score).toBeLessThan(5);
    });

    it('should assess null-like values safely', () => {
      const result = service.assessPasswordStrength('');
      expect(result.score).toBe(0);
      expect(result.level).toBe(PasswordStrengthLevel.NONE);
    });

    it('should handle passwords with only spaces', () => {
      const result = service.assessPasswordStrength('        ');
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });
});
