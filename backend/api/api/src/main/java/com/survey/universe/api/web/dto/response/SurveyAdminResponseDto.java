package com.survey.universe.api.web.dto.response;

import java.util.List;

import com.survey.universe.api.persistence.entity.survey.Question;
import com.survey.universe.api.web.dto.SurveyAdminSummaryDto;

public record SurveyAdminResponseDto(SurveyAdminSummaryDto summary, String revision, List<Question> questions) {

}
