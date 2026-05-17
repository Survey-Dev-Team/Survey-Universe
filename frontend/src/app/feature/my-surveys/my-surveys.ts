import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ROUTES } from '../../shared/models/routes.constants';

type ActiveTab = 'completed' | 'about-me';

interface CompletedSurvey {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  completedAt: string;
  completionRate: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpentMin: number;
}

interface ResponseAboutMe {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  respondents: number;
  lastResponseAt: string;
  avgScore: number; // 0–100 how positive the responses were
}

@Component({
  selector: 'gt-my-surveys',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './my-surveys.html',
  styleUrl: './my-surveys.scss',
})
export class MySurveys {
  readonly routes = ROUTES;
  readonly activeTab = signal<ActiveTab>('completed');

  // ── Surveys completed by this user ────────────────────────────────────────
  readonly completedSurveys = signal<CompletedSurvey[]>([
    {
      id: '1',
      title: 'Explore the Unknown',
      coverImage: '/assets/images/banner/card1.png',
      category: 'Science',
      completedAt: '2026-04-10',
      completionRate: 100,
      totalQuestions: 7,
      answeredQuestions: 7,
      timeSpentMin: 4,
    },
    {
      id: '2',
      title: 'Remote Work Culture',
      coverImage: '/assets/images/banner/card3.png',
      category: 'Business',
      completedAt: '2026-03-28',
      completionRate: 88,
      totalQuestions: 9,
      answeredQuestions: 8,
      timeSpentMin: 6,
    },
    {
      id: '3',
      title: 'Mental Health at Work',
      coverImage: '/assets/images/banner/card1.png',
      category: 'Health',
      completedAt: '2026-03-05',
      completionRate: 100,
      totalQuestions: 11,
      answeredQuestions: 11,
      timeSpentMin: 7,
    },
    {
      id: '4',
      title: 'Social Media Habits',
      coverImage: '/assets/images/banner/card2.png',
      category: 'Technology',
      completedAt: '2026-02-18',
      completionRate: 100,
      totalQuestions: 6,
      answeredQuestions: 6,
      timeSpentMin: 3,
    },
    {
      id: '5',
      title: 'Climate Awareness 2025',
      coverImage: '/assets/images/banner/card4.png',
      category: 'Science',
      completedAt: '2026-01-30',
      completionRate: 72,
      totalQuestions: 10,
      answeredQuestions: 7,
      timeSpentMin: 5,
    },
  ]);

  // ── Surveys where others responded about this user (360° feedback) ────────
  readonly responsesAboutMe = signal<ResponseAboutMe[]>([
    {
      id: 'r1',
      title: 'Team Collaboration Assessment',
      coverImage: '/assets/images/banner/card2.png',
      category: 'Business',
      respondents: 8,
      lastResponseAt: '2026-04-22',
      avgScore: 84,
    },
    {
      id: 'r2',
      title: 'Peer Communication Review',
      coverImage: '/assets/images/banner/card4.png',
      category: 'Psychology',
      respondents: 5,
      lastResponseAt: '2026-03-14',
      avgScore: 91,
    },
    {
      id: 'r3',
      title: 'Leadership Style Feedback',
      coverImage: '/assets/images/banner/card3.png',
      category: 'Business',
      respondents: 12,
      lastResponseAt: '2026-02-28',
      avgScore: 76,
    },
  ]);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  readonly totalCompleted = computed(() => this.completedSurveys().length);
  readonly avgCompletion = computed(() => {
    const list = this.completedSurveys();
    if (!list.length) return 0;
    return Math.round(list.reduce((s, x) => s + x.completionRate, 0) / list.length);
  });
  readonly totalRespondents = computed(() =>
    this.responsesAboutMe().reduce((s, r) => s + r.respondents, 0)
  );
  readonly avgFeedbackScore = computed(() => {
    const list = this.responsesAboutMe();
    if (!list.length) return 0;
    return Math.round(list.reduce((s, r) => s + r.avgScore, 0) / list.length);
  });

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }
}
