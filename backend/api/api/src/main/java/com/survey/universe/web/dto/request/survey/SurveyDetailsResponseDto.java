package com.survey.universe.web.dto.request.survey;

import java.util.List;

import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.question.details.QuestionDetailsDto;

public record SurveyDetailsResponseDto(SurveyDetailsSummaryDto summary, String revision, List<QuestionDetailsDto> questions) {

}
