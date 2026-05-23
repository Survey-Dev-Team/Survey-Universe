import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gt-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  title       = input<string>('Nothing here yet');
  message     = input<string>('');
  actionLabel = input<string>('');
  image       = input<string>('/assets/images/empty-state.webp');

  actionClick = output<void>();
}
