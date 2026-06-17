package com.survey.universe.web.dto.request.survey;

import java.util.List;

import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.question.read.QuestionPublicDto;

public record SurveyReadResponseDto(SurveyReadSummaryDto summary, List<QuestionPublicDto> questions) {
	
}
