import { SurveyCardModel } from '../../shared/models/interfaces';
import { SURVEYS_SUMMARY_MOCK } from '../../shared/services/surveys/surveys.mock';
import { mapSurveyToCard } from '../../shared/utils/survey-mapper.util';

export const ALL_SURVEYS_MOCK: SurveyCardModel[] = SURVEYS_SUMMARY_MOCK.map(mapSurveyToCard);

