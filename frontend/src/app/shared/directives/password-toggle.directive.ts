import { 
  Directive, 
  ElementRef, 
  Renderer2, 
  inject, 
  AfterViewInit 
} from '@angular/core';

@Directive({
  selector: 'input[type="password"][gtPasswordToggle]',
  standalone: true
})
export class PasswordToggleDirective implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private isPasswordVisible = false;
  private toggleButton: HTMLElement | null = null;

  ngAfterViewInit() {
    setTimeout(() => {
      this.createToggleButton();
      this.setupInputListener();
    }, 0);
  }

  private setupInputListener(): void {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    this.renderer.listen(inputElement, 'input', () => this.updateToggleButtonVisibility());
    this.updateToggleButtonVisibility();
  }

  private updateToggleButtonVisibility(): void {
    if (!this.toggleButton) return;
    
    const hasValue = this.elementRef.nativeElement.value.length > 0;
    this.setToggleButtonVisibility(hasValue);
  }

  private setToggleButtonVisibility(isVisible: boolean): void {
    this.renderer.setStyle(this.toggleButton, 'opacity', isVisible ? '1' : '0');
    this.renderer.setStyle(this.toggleButton, 'pointer-events', isVisible ? 'auto' : 'none');
    this.renderer.setStyle(this.toggleButton, 'visibility', isVisible ? 'visible' : 'hidden');
  }

  private createToggleButton(): void {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    const parentElement = inputElement.parentElement;

    if (!parentElement) return;
    const parentStyle = window.getComputedStyle(parentElement);
    if (parentStyle.position === 'static') {
      this.renderer.setStyle(parentElement, 'position', 'relative');
    }
    this.toggleButton = this.renderer.createElement('button');
    this.renderer.setAttribute(this.toggleButton, 'type', 'button');
    this.renderer.addClass(this.toggleButton, 'password-toggle-btn');
    this.renderer.setStyle(this.toggleButton, 'transition', 'opacity 0.2s');
    
    const hasValue = inputElement.value.length > 0;
    this.setToggleButtonVisibility(hasValue);
    
    this.updateToggleIcon();

    this.renderer.listen(this.toggleButton, 'click', (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      this.togglePasswordVisibility();
    });

    this.renderer.appendChild(parentElement, this.toggleButton);
    this.renderer.setStyle(inputElement, 'padding-right', '40px');
  }

  private togglePasswordVisibility(): void {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    this.isPasswordVisible = !this.isPasswordVisible;
    const newType = this.isPasswordVisible ? 'text' : 'password';
    this.renderer.setAttribute(inputElement, 'type', newType);
    this.updateToggleIcon();
  }

  private updateToggleIcon(): void {
    if (!this.toggleButton) return;
    this.renderer.removeClass(this.toggleButton, 'password-visible');
    this.renderer.removeClass(this.toggleButton, 'password-hidden');

    const iconClass = this.isPasswordVisible ? 'password-visible' : 'password-hidden';
    this.renderer.addClass(this.toggleButton, iconClass);
    
    const ariaLabel = this.isPasswordVisible ? 'Hide password' : 'Show password';
    this.renderer.setAttribute(this.toggleButton, 'aria-label', ariaLabel);
  }

  ngOnDestroy(): void {
    if (this.toggleButton && this.toggleButton.parentElement) {
      this.renderer.removeChild(this.toggleButton.parentElement, this.toggleButton);
    }
  }
}
