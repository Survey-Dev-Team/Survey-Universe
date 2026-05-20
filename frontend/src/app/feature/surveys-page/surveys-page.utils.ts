import { SurveysQueryParams } from '../../shared/models/interfaces';
import { AUTHOR_MAP, MultiFilterKey, STATUS_MAP, SURVEY_TYPE_TEST, SurveyFilters, TIME_RANGE_MAP } from './surveys-page.model';

export function buildSurveysParams(filters: SurveyFilters, search: string): SurveysQueryParams {
  const params: SurveysQueryParams = {};

  if (search) params.search = search;

  if (filters.categories.length) params.category = filters.categories[0].toLowerCase();

  const creatorId = AUTHOR_MAP[filters.authors[0] as keyof typeof AUTHOR_MAP];
  if (creatorId) params.creator = creatorId;

  const timeRange = TIME_RANGE_MAP[filters.dates[0] as keyof typeof TIME_RANGE_MAP];
  if (timeRange) params.timeRange = timeRange;

  if (filters.isTest) params.surveyType = SURVEY_TYPE_TEST;

  const surveyStatus = STATUS_MAP[filters.statuses[0] as keyof typeof STATUS_MAP];
  if (surveyStatus) params.surveyStatus = surveyStatus;

  return params;
}

export function matchesDuration(time: number | null | undefined, selected: string[]): boolean {
  if (time == null) return false;
  return selected.some(opt => {
    if (opt === 'Up to 5 min') return time <= 5;
    if (opt === '6\u201310 min')   return time >= 6 && time <= 10;
    if (opt === '11+ min')    return time > 10;
    return false;
  });
}

export function toggleMultiFilter(filters: SurveyFilters, key: MultiFilterKey, value: string): SurveyFilters {
  const current = filters[key];
  const updated = current.includes(value)
    ? current.filter(v => v !== value)
    : [...current, value];
  return { ...filters, [key]: updated };
}
