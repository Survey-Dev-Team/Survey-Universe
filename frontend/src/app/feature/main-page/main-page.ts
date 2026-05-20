import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import Parallax from 'parallax-js';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { ROUTES } from '../../shared/models/routes.constants';
import { SurveysService } from '../../shared/services/surveys/surveys.service';
import { SurveyCardModel } from '../../shared/models/interfaces';
import { mapSurveyToCard } from '../../shared/utils/survey-mapper.util';
import { HOT_SURVEYS_MOCK } from './main-page.mock';

@Component({
  selector: 'gt-main-page',
  imports: [Header, Footer, SurveyCard, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
  animations: [
    trigger('titleLetters', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', [
        style({ opacity: 1 }),
        query('.gt-main-page__letter', [
          style({ opacity: 0, transform: 'translateY(12px)' }),
          stagger(45, [
            animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
    trigger('fadeSlideIn', [
      state('hidden', style({ opacity: 0, transform: 'translateY(16px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('500ms ease-out')),
    ]),
  ],
})
export class MainPage implements AfterViewInit, OnDestroy, OnInit {
  private surveysService = inject(SurveysService);

  ngOnInit(): void {
    this.surveysService.getHomeSurveys().subscribe({
      next: (surveys) => {
        this.hotSurveys.set(surveys.map((s, i) => mapSurveyToCard(s, i)));
      },
      error: () => {
        this.hotSurveys.set(HOT_SURVEYS_MOCK);
      },
    });
  }

  @ViewChild('parallaxScene')
  private parallaxScene?: ElementRef<HTMLElement>;

  @ViewChild('lunarScene')
  private lunarScene?: ElementRef<HTMLElement>;

  private parallaxInstance?: Parallax;
  private lunarParallaxInstance?: Parallax;

  readonly bannerTitle = 'Every answer opens a new perspective';
  readonly titleWords = this.bannerTitle.split(' ').map(word => word.split(''));
  readonly surveysRoute = `/${ROUTES.SURVEYS}`;

  hotSurveys = signal<SurveyCardModel[]>(HOT_SURVEYS_MOCK);

  titleState: 'hidden' | 'visible' = 'hidden';
  descState: 'hidden' | 'visible' = 'hidden';
  buttonsState: 'hidden' | 'visible' = 'hidden';

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !this.parallaxScene) {
      return;
    }

    this.parallaxInstance = new Parallax(this.parallaxScene.nativeElement, {
      relativeInput: true,
      hoverOnly: false,
      clipRelativeInput: true,
    });

    if (this.lunarScene) {
      this.lunarParallaxInstance = new Parallax(this.lunarScene.nativeElement, {
        relativeInput: true,
        hoverOnly: false,
        clipRelativeInput: false,
      });
    }

    setTimeout(() => {
      this.titleState = 'visible';
      setTimeout(() => { this.descState = 'visible'; }, 1600);
      setTimeout(() => { this.buttonsState = 'visible'; }, 2100);
    }, 200);
  }

  ngOnDestroy(): void {
    this.parallaxInstance?.destroy();
    this.lunarParallaxInstance?.destroy();
  }
}
