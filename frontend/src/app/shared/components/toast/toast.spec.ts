import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Toast } from './toast';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add', 'clear']);
    // PrimeNG's MessageService expects messageObserver and clearObserver as Subjects
    messageServiceSpy.messageObserver = new Subject();
    messageServiceSpy.clearObserver = new Subject();

    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [
        provideZoneChangeDetection(),
        provideAnimations(),
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show toast when message input changes', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      detail: 'Test message'
    }));
  });

  it('should use default summary when not provided', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.componentRef.setInput('severity', 'error');
    fixture.detectChanges();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Error'
    }));
  });

  it('should use custom summary when provided', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.componentRef.setInput('summary', 'Custom Summary');
    fixture.detectChanges();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Custom Summary'
    }));
  });

  it('should respect autoHide and life settings', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.componentRef.setInput('autoHide', true);
    fixture.componentRef.setInput('life', 5000);
    fixture.detectChanges();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      life: 5000
    }));
  });

  it('should set life to 0 when autoHide is false', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.componentRef.setInput('autoHide', false);
    fixture.detectChanges();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      life: 0
    }));
  });

  it('should show success toast', () => {
    component.showSuccess('Success message', 'Success Title');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success Title',
      detail: 'Success message'
    }));
  });

  it('should show error toast', () => {
    component.showError('Error message', 'Error Title');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error Title',
      detail: 'Error message'
    }));
  });

  it('should show info toast', () => {
    component.showInfo('Info message', 'Info Title');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'info',
      summary: 'Info Title',
      detail: 'Info message'
    }));
  });

  it('should show warn toast', () => {
    component.showWarn('Warning message', 'Warning Title');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'warn',
      summary: 'Warning Title',
      detail: 'Warning message'
    }));
  });

  it('should use default summary for showSuccess when not provided', () => {
    component.showSuccess('Success message');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Success'
    }));
  });

  it('should use default summary for showError when not provided', () => {
    component.showError('Error message');
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Error'
    }));
  });

  it('should hide toast and clear messages', () => {
    component.hide();
    
    expect(messageService.clear).toHaveBeenCalled();
  });

  it('should not show toast for empty message', () => {
    messageService.add.calls.reset();
    fixture.componentRef.setInput('message', '');
    fixture.detectChanges();
    
    expect(messageService.add).not.toHaveBeenCalled();
  });

  it('should not show toast for whitespace-only message', () => {
    messageService.add.calls.reset();
    fixture.componentRef.setInput('message', '   ');
    fixture.detectChanges();
    
    expect(messageService.add).not.toHaveBeenCalled();
  });

  it('should return correct default summary for each severity', () => {
    const summaryTests = [
      { severity: 'success' as const, expected: 'Success' },
      { severity: 'error' as const, expected: 'Error' },
      { severity: 'warn' as const, expected: 'Warning' },
      { severity: 'info' as const, expected: 'Info' }
    ];

    summaryTests.forEach(({ severity, expected }) => {
      messageService.add.calls.reset();
      fixture.componentRef.setInput('message', 'Test');
      fixture.componentRef.setInput('severity', severity);
      fixture.detectChanges();
      
      expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        summary: expected
      }));
    });
  });
});
