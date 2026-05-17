import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
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
import { SurveyComponent } from '../user-profile/components/survey/survey';
import { ROUTES } from '../../shared/models/routes.constants';

@Component({
  selector: 'gt-main-page',
  imports: [Header, Footer, SurveyComponent, RouterLink],
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
export class MainPage implements AfterViewInit, OnDestroy {
  @ViewChild('parallaxScene')
  private parallaxScene?: ElementRef<HTMLElement>;

  @ViewChild('lunarScene')
  private lunarScene?: ElementRef<HTMLElement>;

  private parallaxInstance?: Parallax;
  private lunarParallaxInstance?: Parallax;

  readonly bannerTitle = 'Every answer opens a new perspective';
  readonly titleWords = this.bannerTitle.split(' ').map(word => word.split(''));
  readonly surveysRoute = `/${ROUTES.SURVEYS}`;

  readonly hotSurveys = [
    {
      id: '1',
      text: 'Explore the Unknown',
      coverImage: '/assets/images/banner/card1.png',
      description: '7 questions · 3–5 min',
      date: 'Active until May 15, 2025',
      category: 'Science',
      author: 'Alex Monroe',
    },
    {
      id: '2',
      text: 'Cosmic Perspective Check',
      coverImage: '/assets/images/banner/card2.png',
      description: '10 questions · 5 min',
      date: 'Anonymous survey',
      category: 'Philosophy',
      author: 'Lena Oris',
    },
    {
      id: '3',
      text: 'Signal from the Crowd',
      coverImage: '/assets/images/banner/card3.png',
      description: '4 questions · 2 min',
      date: 'Active until June 1, 2025',
      category: 'Society',
      author: 'Mark Vega',
    },
    {
      id: '4',
      text: 'New Orbit of Thoughts',
      coverImage: '/assets/images/banner/card4.png',
      description: '8 questions · 4 min',
      date: 'Every answer matters',
      category: 'Test',
      author: 'Dana Kol',
    },
  ];

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
