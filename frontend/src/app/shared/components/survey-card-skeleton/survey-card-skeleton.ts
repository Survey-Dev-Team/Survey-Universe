import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gt-survey-card-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './survey-card-skeleton.html',
  styleUrl: './survey-card-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyCardSkeleton {}
