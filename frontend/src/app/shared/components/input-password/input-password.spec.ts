import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InputPassword } from './input-password';
import { PasswordValidationService } from './services/password-validation.service';

describe('InputPassword', () => {
  let component: InputPassword;
  let fixture: ComponentFixture<InputPassword>;
  let testForm: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPassword],
      providers: [
        provideZoneChangeDetection(),
        PasswordValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputPassword);
    component = fixture.componentInstance;
    
    testForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    fixture.componentRef.setInput('label', 'Password');
    fixture.componentRef.setInput('placeholder', 'Enter password');
    fixture.componentRef.setInput('name', 'password');
    fixture.componentRef.setInput('formControlName', 'password');
    fixture.componentRef.setInput('parentForm', testForm);
    fixture.componentRef.setInput('isRegistrationPassword', false);
    fixture.componentRef.setInput('isRegistrationConfirmPassword', false);
    fixture.componentRef.setInput('isLoginPassword', true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get form control from parent form', () => {
    expect(component.control).toBe(testForm.get('password') as any);
  });

  it('should write value and update signal', () => {
    component.writeValue('test123');
    expect(component.value).toBe('test123');
  });

  it('should register onChange callback', () => {
    const fn = jasmine.createSpy('onChange');
    component.registerOnChange(fn);
    
    component.onInput('password123');
    
    expect(fn).toHaveBeenCalledWith('password123');
  });

  it('should register onTouched callback', () => {
    const fn = jasmine.createSpy('onTouched');
    component.registerOnTouched(fn);
    
    component.onBlur();
    
    expect(fn).toHaveBeenCalled();
  });

  it('should detect uppercase characters', () => {
    component.writeValue('Password');
    expect(component.hasUppercase()).toBe(true);
    
    component.writeValue('password');
    expect(component.hasUppercase()).toBe(false);
  });

  it('should detect lowercase characters', () => {
    component.writeValue('password');
    expect(component.hasLowercase()).toBe(true);
    
    component.writeValue('PASSWORD');
    expect(component.hasLowercase()).toBe(false);
  });

  it('should detect numbers', () => {
    component.writeValue('pass123');
    expect(component.hasNumber()).toBe(true);
    
    component.writeValue('password');
    expect(component.hasNumber()).toBe(false);
  });

  it('should detect special characters', () => {
    component.writeValue('pass@123');
    expect(component.hasSpecialChar()).toBe(true);
    
    component.writeValue('pass123');
    expect(component.hasSpecialChar()).toBe(false);
  });

  it('should validate length between 8 and 16 characters', () => {
    component.writeValue('12345678');
    expect(component.hasValidLength()).toBe(true);
    
    component.writeValue('1234567890123456');
    expect(component.hasValidLength()).toBe(true);
    
    component.writeValue('1234567');
    expect(component.hasValidLength()).toBe(false);
    
    component.writeValue('12345678901234567');
    expect(component.hasValidLength()).toBe(false);
  });

  it('should detect common patterns', () => {
    component.writeValue('ValidPass123!');
    expect(component.hasNoCommonPatterns()).toBe(true);
    
    component.writeValue('password123');
    expect(component.hasNoCommonPatterns()).toBe(false);
    
    component.writeValue('123456');
    expect(component.hasNoCommonPatterns()).toBe(false);
  });

  it('should detect personal info', () => {
    component.writeValue('ValidPass123!');
    expect(component.hasNoPersonalInfo()).toBe(true);
    
    component.writeValue('username123');
    expect(component.hasNoPersonalInfo()).toBe(false);
  });

  it('should show hasValue as true when password is entered', () => {
    component.writeValue('test');
    expect(component.hasValue()).toBe(true);
    
    component.writeValue('');
    expect(component.hasValue()).toBe(false);
  });

  it('should assess password strength', () => {
    component.writeValue('Weak1');
    expect(component.passwordStrength().score).toBeGreaterThan(0);
    
    component.writeValue('StrongP@ssw0rd!');
    expect(component.passwordStrength().score).toBeGreaterThan(5);
  });

  it('should check if password is very weak', fakeAsync(() => {
    component.writeValue('111'); // Contains repeating pattern, will score only for hasNumber (1 point)
    fixture.detectChanges();
    tick(200);
    fixture.detectChanges(); // Ensure signals are evaluated
    
    const isVeryWeak = component.isVeryWeak();
    // Password '111' should be very weak (score <= 1)
    expect(isVeryWeak).toBe(true);
  }));

  it('should check if password is weak', () => {
    component.writeValue('abc');
    expect(component.isWeak()).toBe(true);
  });

  it('should check if password is strong', () => {
    component.writeValue('StrongP@ssw0rd!1234');
    expect(component.isStrong()).toBe(true);
  });

  it('should validate passwords match for confirm password field', () => {
    fixture.componentRef.setInput('isRegistrationConfirmPassword', true);
    fixture.componentRef.setInput('formControlName', 'confirmPassword');
    
    const passwordControl = testForm.get('password');
    const confirmControl = testForm.get('confirmPassword');
    
    passwordControl?.setValue('Password123!');
    confirmControl?.setValue('Password123!');
    component.writeValue('Password123!');
    
    expect(component.passwordsMatch()).toBe(true);
  });

  it('should mark control as touched on blur', () => {
    component.onBlur();
    
    expect(component['touchedSignal']()).toBe(true);
  });

  it('should update value signal on input', () => {
    component.onInput('newPassword123');
    
    expect(component.value).toBe('newPassword123');
  });

  it('should validate registration password criteria', () => {
    fixture.componentRef.setInput('isRegistrationPassword', true);
    component.writeValue('ValidP@ss1');
    
    expect(component.hasUppercase()).toBe(true);
    expect(component.hasLowercase()).toBe(true);
    expect(component.hasNumber()).toBe(true);
    expect(component.hasSpecialChar()).toBe(true);
    expect(component.hasValidLength()).toBe(true);
  });

  it('should check if password is fair', () => {
    component.writeValue('Pass@123');
    fixture.detectChanges();
    expect(component.isFair()).toBe(true);
  });

  it('should check if password is good', () => {
    component.writeValue('GoodPass@123');
    expect(component.isGood()).toBe(true);
  });

  it('should check if password is very strong', () => {
    component.writeValue('V3ryStr0ng!P@ssw0rdH3r3');
    fixture.detectChanges();
    expect(component.isVeryStrong()).toBe(true);
  });

  it('should check if password meets enterprise standard', () => {
    component.writeValue('EnterPr1se!P@ss');
    expect(component.meetsEnterpriseStandard()).toBe(true);
  });

  it('should check if password meets banking standard', () => {
    component.writeValue('B@nk1ngStr0ngP@ss');
    expect(component.meetsBankingStandard()).toBe(true);
  });
  it('should check if password meets government standard', () => {
    component.writeValue('G0v3rnm3nt!Str0ngP@ss');
    fixture.detectChanges();
    expect(component.meetsGovernmentStandard()).toBe(true);
  });

  it('should get password strength score', () => {
    component.writeValue('StrongP@ss123');
    expect(component.getPasswordStrength()).toBeGreaterThan(0);
  });

  it('should get meter class', () => {
    component.writeValue('Test@123');
    const meterClass = component.getMeterClass();
    expect(meterClass).toBeDefined();
    expect(typeof meterClass).toBe('string');
  });

  it('should validate isTouchedAndInvalid for registration password', () => {
    fixture.componentRef.setInput('isRegistrationPassword', true);
    component.onBlur();
    component.writeValue('weak');
    
    expect(component.isTouchedAndInvalid()).toBe(true);
  });
  it('should validate isTouchedAndInvalid for confirm password', () => {
    fixture.componentRef.setInput('isRegistrationConfirmPassword', true);
    component.onBlur();
    component.writeValue('mismatch');
    fixture.detectChanges();
    
    expect(component.isTouchedAndInvalid()).toBe(true);
  });

  it('should validate isTouchedAndInvalid for login password', () => {
    fixture.componentRef.setInput('isLoginPassword', true);
    component.onBlur();
    component.writeValue('');
    
    expect(component.isTouchedAndInvalid()).toBe(true);
  });

  it('should return false for isTouchedAndInvalid when not touched', () => {
    expect(component.isTouchedAndInvalid()).toBe(false);
  });

  it('should handle ngAfterViewInit with existing value', () => {
    const control = testForm.get('password');
    control?.setValue('existingValue');
    
    component.ngAfterViewInit();
    
    expect(component.value).toBe('existingValue');
  });

  it('should handle ngAfterViewInit with errors', () => {
    const control = testForm.get('password');
    control?.setErrors({ required: true });
    
    component.ngAfterViewInit();
    
    expect(component['errorsSignal']()).toBeTruthy();
  });

  it('should cleanup subscriptions on destroy', () => {
    const subscription = component['subscriptions'];
    spyOn(subscription, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle empty value in hasValue', () => {
    component.writeValue('');
    expect(component.hasValue()).toBe(false);
  });

  it('should return false for passwordsMatch when not confirm password field', () => {
    fixture.componentRef.setInput('isRegistrationConfirmPassword', false);
    component.writeValue('Password123!');
    
    expect(component.passwordsMatch()).toBe(false);
  });

  it('should validate password with valid length at boundaries', () => {
    component.writeValue('1234567'); // 7 chars
    expect(component.hasValidLength()).toBe(false);
    
    component.writeValue('12345678'); // 8 chars
    expect(component.hasValidLength()).toBe(true);
    
    component.writeValue('1234567890123456'); // 16 chars
    expect(component.hasValidLength()).toBe(true);
    
    component.writeValue('12345678901234567'); // 17 chars
    expect(component.hasValidLength()).toBe(false);
  });

  it('should handle value setter and getter', () => {
    component.value = 'testValue';
    expect(component.value).toBe('testValue');
  });
});
