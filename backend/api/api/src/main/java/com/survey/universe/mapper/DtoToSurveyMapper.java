package com.survey.universe.mapper;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.web.dto.request.survey.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyUpdateRequestDto;

@Component
public class DtoToSurveyMapper {
	
	public void mapUpdate(SurveyUpdateRequestDto updateDto, Survey survey) {
		Optional.ofNullable(updateDto.title()).ifPresent(survey::setTitle);
		Optional.ofNullable(updateDto.description()).ifPresent(survey::setDescription);
		Optional.ofNullable(updateDto.category()).ifPresent(survey::setCategory);
		Optional.ofNullable(updateDto.estimatedTime()).ifPresent(survey::setEstimatedTime);
		Optional.ofNullable(updateDto.isHome()).ifPresent(survey::setHome);
		Optional.ofNullable(updateDto.questions()).ifPresent(survey::setQuestions);
		Optional.ofNullable(updateDto.icon()).ifPresent(survey::setIcon);
		Optional.ofNullable(updateDto.passThreshold()).ifPresent(survey::setPassThreshold);
	}

	
	public Survey mapPost(SurveyCreateRequestDto surveyCreateDto, String id, String userId, SurveyStatus status) {
		Survey survey = new Survey();

		survey.setId(id);
		survey.setTitle(surveyCreateDto.title());
		survey.setDescription(surveyCreateDto.description());
		survey.setCategory(surveyCreateDto.category());
		survey.setEstimatedTime(surveyCreateDto.estimatedTime());
		survey.setHome(false);
		survey.setStatus(status);
		survey.setIcon(surveyCreateDto.icon());
		survey.setCreatorId(userId);
		survey.setCreatedAt(Instant.now());
		survey.setQuestions(surveyCreateDto.questions());
		survey.setPassThreshold(surveyCreateDto.passThreshold());	
		return survey;
	}
}
