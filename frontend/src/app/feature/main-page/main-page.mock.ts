import { SurveyCardModel } from '../../shared/models/interfaces';
import { SURVEYS_SUMMARY_MOCK } from '../../shared/services/surveys/surveys.mock';
import { mapSurveyToCard } from '../../shared/utils/survey-mapper.util';

export const HOT_SURVEYS_MOCK: SurveyCardModel[] = SURVEYS_SUMMARY_MOCK.slice(0, 4).map(mapSurveyToCard);

