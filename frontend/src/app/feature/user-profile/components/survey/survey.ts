import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gt-survey',
  imports: [],
  templateUrl: './survey.html',
  styleUrl: './survey.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyComponent {
  readonly text = input<string>('');
  readonly coverImage = input<string>('');
  readonly description = input<string>('');
  readonly date = input<string>('');
  readonly color = input<string>('');
  readonly category = input<string>('');
  readonly author = input<string>('');
}
