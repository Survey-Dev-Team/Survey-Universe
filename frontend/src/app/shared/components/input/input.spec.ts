import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input } from './input';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;
  let testForm: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    
    testForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)])
    });

    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('placeholder', 'Enter email');
    fixture.componentRef.setInput('description', 'Email address');
    fixture.componentRef.setInput('class', 'input-class');
    fixture.componentRef.setInput('formControlName', 'email');
    fixture.componentRef.setInput('parentForm', testForm);
    fixture.componentRef.setInput('isLoginForm', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get form control from parent form', () => {
    expect(component.control).toBe(testForm.get('email') as any);
  });

  it('should return error messages for required field', () => {
    const control = testForm.get('email');
    control?.markAsTouched();
    control?.setValue('');
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('Email');
  });

  it('should return error messages for invalid email', () => {
    fixture.componentRef.setInput('type', 'email');
    const control = testForm.get('email');
    control?.markAsTouched();
    control?.setValue('invalid-email');
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(err => err.includes('email') || err.includes('Invalid'))).toBe(true);
  });

  it('should return login-specific error for required email in login form', () => {
    fixture.componentRef.setInput('isLoginForm', true);
    fixture.componentRef.setInput('type', 'email');
    const control = testForm.get('email');
    control?.setValue('');
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.some(err => err.includes('Email'))).toBe(true);
  });

  it('should return login-specific error for required password in login form', () => {
    fixture.componentRef.setInput('isLoginForm', true);
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('formControlName', 'password');
    const control = testForm.get('password');
    control?.setValue('');
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.some(err => err.includes('Password'))).toBe(true);
  });

  it('should return error message for pattern validation', () => {
    fixture.componentRef.setInput('formControlName', 'username');
    const control = testForm.get('username');
    control?.setValue('user@name!');
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return empty array when no errors', () => {
    const control = testForm.get('email');
    control?.setValue('valid@email.com');
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBe(0);
  });

  it('should handle input event and call onChange', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);
    
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'test@email.com' } });
    
    component.onInput(event);
    
    expect(component.value).toBe('test@email.com');
    expect(onChangeSpy).toHaveBeenCalledWith('test@email.com');
  });

  it('should write value', () => {
    component.writeValue('new-value');
    expect(component.value).toBe('new-value');
  });

  it('should register onChange callback', () => {
    const fn = jasmine.createSpy('onChange');
    component.registerOnChange(fn);
    
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'test' } });
    component.onInput(event);
    
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const fn = jasmine.createSpy('onTouched');
    component.registerOnTouched(fn);
    
    component.onBlur();
    
    expect(fn).toHaveBeenCalled();
  });

  it('should mark control as touched on blur', () => {
    const control = testForm.get('email');
    expect(control?.touched).toBe(false);
    
    component.onBlur();
    
    expect(control?.touched).toBe(true);
  });

  it('should return error message for emailInUse error', () => {
    const control = testForm.get('email');
    control?.setErrors({ emailInUse: true });
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(err => err.includes('already in use') || err.includes('emailInUse'))).toBe(true);
  });

  it('should handle isAddWaiterForm for required error', () => {
    fixture.componentRef.setInput('isAddWaiterForm', true);
    const control = testForm.get('email');
    control?.setValue('');
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle isAddWaiterForm for email error', () => {
    fixture.componentRef.setInput('isAddWaiterForm', true);
    fixture.componentRef.setInput('type', 'email');
    const control = testForm.get('email');
    control?.setErrors({ email: true });
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle unknown error types', () => {
    const control = testForm.get('email');
    control?.setErrors({ unknownError: true });
    control?.markAsTouched();
    
    const errors = component.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should handle BEValidationsErrors', () => {
    fixture.componentRef.setInput('BEValidationsErrors', 'Backend validation error');
    fixture.detectChanges();
    
    expect(component.BEValidationsErrors()).toBe('Backend validation error');
  });

  it('should handle description input', () => {
    fixture.componentRef.setInput('description', 'Test description');
    fixture.detectChanges();
    
    expect(component.description()).toBe('Test description');
  });

  it('should return null when control does not exist', () => {
    fixture.componentRef.setInput('formControlName', 'nonExistent');
    fixture.detectChanges();
    
    expect(component.control).toBeNull();
  });
});
