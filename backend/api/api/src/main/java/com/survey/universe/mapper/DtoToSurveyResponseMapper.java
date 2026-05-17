package com.survey.universe.mapper;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.ResponseAnswer;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.web.dto.request.SurveyResponseSubmitDto;

@Component
public class DtoToSurveyResponseMapper {

	public SurveyResponse toSurveyResponse(String id, String surveyId, String respondentId, String surveyRev, SurveyResponseSubmitDto submitDto) {
		SurveyResponse response = new SurveyResponse();
		response.setId(id);
		response.setSurveyId(surveyId);
		response.setRespondentId(respondentId);
		response.setSurveyRev(surveyRev);
		List<ResponseAnswer> answers = submitDto.answers().stream().map(dto -> {
			ResponseAnswer a = new ResponseAnswer();
			a.setId(dto.questionId());
			Optional.of(dto.value()).ifPresent(a::setValue);
			Optional.of(dto.options()).ifPresent(a::setSelectedOptions);
			return a;
		}).toList();
		response.setResponseAnswers(answers);
		return response;
	}

}
