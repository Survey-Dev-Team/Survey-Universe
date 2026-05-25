package com.survey.universe.mapper;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.request.survey.SurveyDetailsResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyReadResponseDto;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class SurveyToDtoMapper {

	private QuestionToPublicDtoMapper questionToDtoPublic;
	private QuestionToDetailsDtoMapper questionToDtoDetails;

	public SurveyDetailsSummaryDto toAdminSummaryDto(Survey survey, User creator, Integer responseCount) {

		return new SurveyDetailsSummaryDto(survey.getId(), survey.getSlugId(), creator.getId(), creator.getSlugId(),
				creator.getFirstName() + " " + creator.getLastName(), survey.getTitle(), survey.getDescription(),
				survey.getIcon(), survey.getCategory(), survey.getEstimatedTime(), survey.getPublishedAt(),
				survey.getClosedAt(), survey.getCreatedAt(), survey.getModifiedAt(), survey.getStatus(),
				survey.getPassThreshold(), survey.isDeleted(), responseCount);
	}

	public SurveyDetailsResponseDto toAdminResponseDto(Survey survey, User creator, Integer responseCount) {
		return new SurveyDetailsResponseDto(toAdminSummaryDto(survey, creator, responseCount), survey.getRevision(),
				survey.getQuestions().stream().map(question -> question.accept(questionToDtoDetails)).toList());

	}

	public SurveyReadSummaryDto toReadSummaryDto(Survey survey, User creator) {
		return new SurveyReadSummaryDto(survey.getSlugId(), creator.getSlugId(), survey.getTitle(),
				survey.getDescription(), survey.getIcon(), survey.getCategory(), survey.getEstimatedTime(),
				survey.getPublishedAt(), survey.getSurveyType());
	}

	public SurveyReadResponseDto toReadResponseDto(Survey survey, User creator) {
		return new SurveyReadResponseDto(toReadSummaryDto(survey, creator),
				survey.getQuestions().stream().map(question -> question.accept(questionToDtoPublic)).toList());
	}
}
