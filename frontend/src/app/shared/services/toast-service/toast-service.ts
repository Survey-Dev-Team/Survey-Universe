import { 
  inject, 
  Injectable, 
  signal 
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastSeverityType } from '../../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastMessage = signal<string>('');
  toastSeverity = signal<ToastSeverityType>('success');

  private messageService = inject(MessageService);

  setToast(message: string, severity: ToastSeverityType) {
    this.toastMessage.set(message);
    this.toastSeverity.set(severity);
  }

  showToast({severity, message, detail, life}: {
    severity: ToastSeverityType, 
    message: string, 
    detail: string, 
    life: number
  }) {
    this.messageService.add({
      severity: severity,
      summary: message,
      detail: detail,
      life: life
    });
  }
}
