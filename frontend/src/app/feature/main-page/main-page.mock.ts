import { SurveyCardModel } from '../../shared/models/interfaces';

export const HOT_SURVEYS_MOCK: SurveyCardModel[] = [
  {
    id: '1',
    title: 'Explore the Unknown',
    coverImage: '/assets/images/banner/card1.png',
    description: '7 questions · 3–5 min',
    date: 'Active until May 15, 2025',
    category: 'Science',
    author: 'Alex Monroe',
  },
  {
    id: '2',
    title: 'Cosmic Perspective Check',
    coverImage: '/assets/images/banner/card2.png',
    description: '10 questions · 5 min',
    date: 'Anonymous survey',
    category: 'Philosophy',
    author: 'Lena Oris',
  },
  {
    id: '3',
    title: 'Signal from the Crowd',
    coverImage: '/assets/images/banner/card3.png',
    description: '4 questions · 2 min',
    date: 'Active until June 1, 2025',
    category: 'Society',
    author: 'Mark Vega',
  },
  {
    id: '4',
    title: 'New Orbit of Thoughts',
    coverImage: '/assets/images/banner/card4.png',
    description: '8 questions · 4 min',
    date: 'Every answer matters',
    category: 'Test',
    author: 'Dana Kol',
  },
];
