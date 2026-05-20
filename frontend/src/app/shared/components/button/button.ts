import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'gt-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
})
export class Button {
  label = input<string>('');
  icon = input<string>('');
  styleClass = input<string>('');
  clicked = output<void>();
}
