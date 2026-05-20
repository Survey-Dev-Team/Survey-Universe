import { SurveyStatus, SurveyTimeRange, SurveyType } from '../../shared/models/interfaces';

export enum FilterGroup {
  Date = 'Date',
  Category = 'Category',
  Author = 'Author',
  Duration = 'Duration',
  Test = 'Test',
  Status = 'Status',
}

export interface SurveyFilters {
  dates: string[];
  categories: string[];
  authors: string[];
  durations: string[];
  statuses: string[];
  isTest: boolean;
}

export const DATE_FILTER_OPTIONS = ['This week', 'This month', 'All time'] as const;
export const STATUS_FILTER_OPTIONS = ['Active', 'Passed'] as const;
export const DURATION_FILTER_OPTIONS = ['Up to 5 min', '6–10 min', '11+ min'] as const;

export type DateFilterOption = typeof DATE_FILTER_OPTIONS[number];
export type StatusFilterOption = typeof STATUS_FILTER_OPTIONS[number];

export const TIME_RANGE_MAP: Record<DateFilterOption, SurveyTimeRange | ''> = {
  'This week': 'week',
  'This month': 'month',
  'All time': '',
};

export const STATUS_MAP: Record<StatusFilterOption, SurveyStatus> = {
  'Active': 'published',
  'Passed': 'closed',
};

export type AuthorFilterOption = string;

export const AUTHOR_MAP: Record<string, string> = {
  'Alex Monroe':  'user:alex-monroe',
  'Lena Oris':    'user:lena-oris',
  'Mark Vega':    'user:mark-vega',
  'Sofia Lane':   'user:sofia-lane',
  'Ivan Petrov':  'user:ivan-petrov',
  'Dana Kol':     'user:dana-kol',
};

export const SURVEY_TYPE_TEST: SurveyType = 'test';

export type MultiFilterKey = keyof Pick<SurveyFilters, 'categories' | 'authors' | 'dates' | 'durations' | 'statuses'>;
