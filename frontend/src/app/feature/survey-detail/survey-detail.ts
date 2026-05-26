import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ROUTES } from '../../shared/models/routes.constants';
import { StatStatus } from '../../shared/models/enums';
import { SurveyType } from '../../shared/models/interfaces';
import { SurveySubmitStateService } from '../../shared/services/survey-submit-state/survey-submit-state.service';
import { SurveysApiService } from '../../shared/services/surveys/surveys-api.service';
import { SurveyData } from './survey-detail.mock';

@Component({
  selector: 'gt-survey-detail',
  imports: [Header, Footer, RouterLink, DecimalPipe],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail implements OnInit {
  private readonly route       = inject(ActivatedRoute);
  private readonly submitState = inject(SurveySubmitStateService);
  private readonly api         = inject(SurveysApiService);

  readonly surveysRoute = `/${ROUTES.SURVEYS}`;
  readonly StatStatus   = StatStatus;

  readonly surveyId         = signal<string>('');
  readonly isLoading        = signal(true);
  readonly survey           = signal<SurveyData | null>(null);
  readonly alreadySubmitted = signal(false);
  readonly surveyType       = signal<SurveyType | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.surveyId.set(id);
    const submitted = this.submitState.hasSubmitted(id);
    this.alreadySubmitted.set(submitted);

    forkJoin({
      surveyData: this.api.getSurvey(id),
      stats:      this.api.getSurveyStats(id).pipe(
        catchError(() => of({ surveyUrlId: id, title: '', totalResponses: 0, questionStats: [] }))
      ),
    }).subscribe({
      next: ({ surveyData, stats }) => {
        const s = surveyData.summary;
        this.survey.set({
          id,
          title:          s.title,
          coverImage:     s.icon ?? '',
          category:       Array.isArray(s.category) ? s.category[0] ?? '' : (s.category as string),
          status:         submitted ? StatStatus.Passed : StatStatus.Active,
          description:    s.description,
          about:          s.description,
          questionsCount: surveyData.questions.length,
          estimatedTime:  s.estimatedTime ? `${s.estimatedTime} min` : '—',
          activeUntil:    'Anonymous survey',
          author:         s.creatorName || '—',
          authorAvatar:   '',
          participants:   stats.totalResponses,
        });
        this.surveyType.set(s.surveyType ?? null);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  readonly beforeYouStart = [
    { num: '01', title: 'Answer honestly',      desc: 'There are no right or wrong answers. Choose what feels closest to your opinion.' },
    { num: '02', title: 'You can finish quickly', desc: 'The survey contains only a few questions and usually takes less than 5 minutes.' },
    { num: '03', title: 'Your response matters', desc: 'Each answer contributes to the final result and helps improve the survey data.' },
  ];

  isSaved = signal(false);

  toggleSave(): void {
    this.isSaved.update(v => !v);
  }
}

