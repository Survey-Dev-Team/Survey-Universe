import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

export type SurveyCardVariant = 'hero' | 'compact';

export interface SurveyCardMetaItem {
  icon: string;
  text: string;
}

@Component({
  selector: 'gt-survey-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyCard {
  // shared
  title          = input<string>('');
  coverImage     = input<string>('');
  category       = input<string>('');
  date           = input<string>('');
  variant        = input<SurveyCardVariant>('hero');

  // hero only
  description    = input<string>('');
  author         = input<string>('');
  surveyType     = input<string>('');
  estimatedTime  = input<number | null>(null);

  // compact only
  metaItems      = input<SurveyCardMetaItem[]>([]);
  completionRate = input<number | null>(null);
  progressLabel  = input<string>('');
  progressColor  = input<'accent' | 'green' | 'amber'>('accent');
  statusLabel    = input<string>('');
  statusIcon     = input<string>('');
  statusClass    = input<string>('');

  readonly isCompact = computed(() => this.variant() === 'compact');
}
