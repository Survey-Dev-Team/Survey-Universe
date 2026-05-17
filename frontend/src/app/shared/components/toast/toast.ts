import { 
  Component, 
  input, 
  signal, 
  inject, 
  effect 
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastSeverityType } from '../../models/enums';

@Component({
  selector: 'gt-toast',
  imports: [ToastModule],
  templateUrl: './toast.html',
})
export class Toast {
  message = input<string>('');
  severity = input<ToastSeverityType>('success');
  summary = input<string>('');
  autoHide = input<boolean>(true);
  life = input<number>(3000);

  private messageService = inject(MessageService);
  private isVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      const messageValue = this.message();
      if (messageValue && messageValue.trim() !== '') {
        this.showToast();
      }
    });
  }

  showToast() {
    this.messageService.add({
      severity: this.severity(),
      summary: this.summary() || this.getDefaultSummary(),
      detail: this.message(),
      life: this.autoHide() ? this.life() : 0
    });
    this.isVisible.set(true);
  }

  private getDefaultSummary(): string {
    switch (this.severity()) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warn': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  }

  showSuccess(message: string, summary?: string) {
    this.messageService.add({ 
      severity: 'success', 
      summary: summary || 'Success', 
      detail: message,
      life: this.life()
    });
    this.isVisible.set(true);
  }

  showError(message: string, summary?: string) {
    this.messageService.add({ 
      severity: 'error', 
      summary: summary || 'Error', 
      detail: message,
      life: this.life()
    });
    this.isVisible.set(true);
  }

  showInfo(message: string, summary?: string) {
    this.messageService.add({ 
      severity: 'info', 
      summary: summary || 'Info', 
      detail: message,
      life: this.life()
    });
    this.isVisible.set(true);
  }

  showWarn(message: string, summary?: string) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: summary || 'Warning', 
      detail: message,
      life: this.life()
    });
    this.isVisible.set(true);
  }

  hide() {
    this.messageService.clear();
    this.isVisible.set(false);
  }
}
