import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ROUTES } from '../../shared/models/routes.constants';
import { StatStatus } from '../../shared/models/enums';
import { SurveyData, SURVEY_DETAIL_MOCK } from './survey-detail.mock';

@Component({
  selector: 'gt-survey-detail',
  imports: [Header, Footer, RouterLink, DecimalPipe],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly surveysRoute = `/${ROUTES.SURVEYS}`;
  readonly StatStatus = StatStatus;

  readonly surveyId = signal<string>('');
  readonly isLoading = signal(true);
  readonly survey = signal<SurveyData | null>(null);

  // Mock data — replace with HTTP call using this.surveyId()
  private readonly mockSurveys: SurveyData[] = SURVEY_DETAIL_MOCK;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.surveyId.set(id);

    // TODO: replace with: this.http.get<SurveyDetail>(`/api/surveys/${id}`)
    const found = this.mockSurveys.find(s => s.id === id) ?? this.mockSurveys[0];
    this.survey.set(found);
    this.isLoading.set(false);
  }

  readonly beforeYouStart = [
    { num: '01', title: 'Answer honestly', desc: 'There are no right or wrong answers. Choose what feels closest to your opinion.' },
    { num: '02', title: 'You can finish quickly', desc: `The survey contains only a few questions and usually takes less than 5 minutes.` },
    { num: '03', title: 'Your response matters', desc: 'Each answer contributes to the final result and helps improve the survey data.' },
  ];

  isSaved = signal(false);

  toggleSave(): void {
    this.isSaved.update(v => !v);
  }
}
