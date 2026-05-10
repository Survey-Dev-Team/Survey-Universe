package com.survey.universe.web.dto.response;

import java.util.List;

import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.question.QuestionPublicDto;

public record SurveyReadResponseDto(SurveyReadSummaryDto summary, List<QuestionPublicDto> questions) {
	
}
