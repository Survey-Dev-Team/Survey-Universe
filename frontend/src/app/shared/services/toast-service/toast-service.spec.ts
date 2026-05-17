import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ToastService } from './toast-service';
import { ToastSeverityType } from '../../models/enums';

describe('ToastService', () => {
  let service: ToastService;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    messageServiceSpy.messageObserver = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    service = TestBed.inject(ToastService);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signals initialization', () => {
    it('should initialize toastMessage signal with empty string', () => {
      expect(service.toastMessage()).toBe('');
    });

    it('should initialize toastSeverity signal with success', () => {
      expect(service.toastSeverity()).toBe('success');
    });
  });

  describe('setToast', () => {
    it('should set toast message and severity to success', () => {
      const message = 'Operation successful';
      const severity: ToastSeverityType = 'success';

      service.setToast(message, severity);

      expect(service.toastMessage()).toBe(message);
      expect(service.toastSeverity()).toBe(severity);
    });

    it('should set toast message and severity to error', () => {
      const message = 'An error occurred';
      const severity: ToastSeverityType = 'error';

      service.setToast(message, severity);

      expect(service.toastMessage()).toBe(message);
      expect(service.toastSeverity()).toBe(severity);
    });

    it('should set toast message and severity to info', () => {
      const message = 'Information message';
      const severity: ToastSeverityType = 'info';

      service.setToast(message, severity);

      expect(service.toastMessage()).toBe(message);
      expect(service.toastSeverity()).toBe(severity);
    });

    it('should set toast message and severity to warn', () => {
      const message = 'Warning message';
      const severity: ToastSeverityType = 'warn';

      service.setToast(message, severity);

      expect(service.toastMessage()).toBe(message);
      expect(service.toastSeverity()).toBe(severity);
    });

    it('should update toast message when called multiple times', () => {
      service.setToast('First message', 'success');
      expect(service.toastMessage()).toBe('First message');
      expect(service.toastSeverity()).toBe('success');

      service.setToast('Second message', 'error');
      expect(service.toastMessage()).toBe('Second message');
      expect(service.toastSeverity()).toBe('error');
    });
  });

  describe('showToast', () => {
    it('should call messageService.add with correct parameters', () => {
      const params = {
        severity: 'success' as ToastSeverityType,
        message: 'Test Message',
        detail: 'Test Detail',
        life: 3000
      };

      service.showToast(params);

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Test Message',
        detail: 'Test Detail',
        life: 3000
      });
    });

    it('should call messageService.add with error severity', () => {
      const params = {
        severity: 'error' as ToastSeverityType,
        message: 'Error Message',
        detail: 'Error Detail',
        life: 5000
      };

      service.showToast(params);

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Error Detail',
        life: 5000
      });
    });

    it('should call messageService.add with warn severity', () => {
      const params = {
        severity: 'warn' as ToastSeverityType,
        message: 'Warning Message',
        detail: 'Warning Detail',
        life: 4000
      };

      service.showToast(params);

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Warning Message',
        detail: 'Warning Detail',
        life: 4000
      });
    });

    it('should call messageService.add with info severity', () => {
      const params = {
        severity: 'info' as ToastSeverityType,
        message: 'Info Message',
        detail: 'Info Detail',
        life: 2000
      };

      service.showToast(params);

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Info Message',
        detail: 'Info Detail',
        life: 2000
      });
    });
  });
});

