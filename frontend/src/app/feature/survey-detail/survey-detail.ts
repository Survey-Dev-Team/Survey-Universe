import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ROUTES } from '../../shared/models/routes.constants';

interface SurveyData {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  status: 'Active' | 'Passed';
  description: string;
  about: string;
  questionsCount: number;
  estimatedTime: string;
  activeUntil: string;
  author: string;
  authorAvatar: string;
  participants: number;
}

@Component({
  selector: 'gt-survey-detail',
  imports: [Header, Footer, RouterLink, DecimalPipe],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly surveysRoute = `/${ROUTES.SURVEYS}`;

  readonly surveyId = signal<string>('');
  readonly isLoading = signal(true);
  readonly survey = signal<SurveyData | null>(null);

  // Mock data — replace with HTTP call using this.surveyId()
  private readonly mockSurveys: SurveyData[] = [
    {
      id: '1',
      title: 'Explore the Unknown',
      coverImage: '/assets/images/banner/card1.png',
      category: 'Science',
      status: 'Active',
      description: 'Take a short journey through questions about space, discovery and the limits of human knowledge.',
      about: 'This survey explores how people think about unknown worlds, future discoveries, scientific progress and cosmic uncertainty. Your answers will help shape a better understanding of how different people imagine the future.',
      questionsCount: 7,
      estimatedTime: '3–5 min',
      activeUntil: 'May 15, 2025',
      author: 'Alex Monroe',
      authorAvatar: '',
      participants: 1245,
    },
    {
      id: '2',
      title: 'Cosmic Perspective Check',
      coverImage: '/assets/images/banner/card2.png',
      category: 'Philosophy',
      status: 'Active',
      description: 'Reflect on your place in the universe through a series of thought-provoking questions.',
      about: 'A philosophical exploration of how humans position themselves in the vast cosmos. This survey gathers diverse perspectives on existence, meaning, and our collective future.',
      questionsCount: 10,
      estimatedTime: '5 min',
      activeUntil: 'Anonymous survey',
      author: 'Lena Oris',
      authorAvatar: '',
      participants: 873,
    },
    {
      id: '3',
      title: 'Signal from the Crowd',
      coverImage: '/assets/images/banner/card3.png',
      category: 'Society',
      status: 'Passed',
      description: 'Quick pulse-check on social dynamics and collective behavior patterns.',
      about: 'Society shapes us in ways we rarely notice. This survey digs into attitudes about community, cooperation, and the signals we send each other as members of a shared world.',
      questionsCount: 4,
      estimatedTime: '2 min',
      activeUntil: 'June 1, 2025',
      author: 'Mark Vega',
      authorAvatar: '',
      participants: 2104,
    },
  ];

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
