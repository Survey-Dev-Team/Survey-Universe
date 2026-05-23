import { SurveyCardModel, SurveyReadSummary } from '../models/interfaces';
import { StatStatus } from '../models/enums';

const CARD_IMAGES = [
  '/assets/images/banner/card1.png',
  '/assets/images/banner/card2.png',
  '/assets/images/banner/card3.png',
  '/assets/images/banner/card4.png',
];

export const CREATOR_NAMES: Record<string, string> = {
  'YWxleC1tb25yb2U=': 'Alex Monroe',
  'bGVuYS1vcmlz':     'Lena Oris',
  'bWFyay12ZWdh':     'Mark Vega',
  'c29maWEtbGFuZQ==': 'Sofia Lane',
  'aXZhbi1wZXRyb3Y=': 'Ivan Petrov',
  'ZGFuYS1rb2w=':     'Dana Kol',
};

// Reference date for status: surveys published within 21 days are considered Active
const REFERENCE_DATE = new Date('2026-05-20T00:00:00Z');
const ACTIVE_WINDOW_MS = 21 * 24 * 60 * 60 * 1000;

export function mapSurveyToCard(survey: SurveyReadSummary, index: number): SurveyCardModel {
  const published = new Date(survey.publishedAt);
  const formatted = published.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const isActive = REFERENCE_DATE.getTime() - published.getTime() <= ACTIVE_WINDOW_MS;

  const category = survey.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');

  return {
    id: survey.urlId,
    title: survey.title,
    description: survey.description,
    coverImage: survey.icon || CARD_IMAGES[index % CARD_IMAGES.length],
    category,
    surveyType: survey.surveyType,
    author: CREATOR_NAMES[survey.creatorUrlId] ?? 'Survey Universe',
    date: formatted,
    estimatedTime: survey.estimatedTime ?? null,
    status: isActive ? StatStatus.Active : StatStatus.Passed,
  };
}
