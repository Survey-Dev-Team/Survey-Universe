package com.survey.universe.web.dto.response;

import java.util.List;

import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;

public record SurveyDetailsResponseDto(SurveyDetailsSummaryDto summary, String revision, List<Question> questions) {

}
