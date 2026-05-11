package com.survey.universe.mapper;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.spring.util.Base64UrlUtil;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.request.survey.SurveyDetailsResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyReadResponseDto;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class SurveyToDtoMapper {

	private Base64UrlUtil base64Url;
	private QuestionToPublicDtoMapper questionToDtoPublic;
	private QuestionToDetailsDtoMapper questionToDtoDetails;

	public SurveyDetailsSummaryDto toAdminSummaryDto(Survey survey, Integer responseCount) {
		String urlId = base64Url.encode(survey.getId(), DocType.SURVEY);
		String creatorId = survey.getCreatorId();

		return new SurveyDetailsSummaryDto(survey.getId(), urlId, creatorId, base64Url.encode(creatorId, DocType.USER),
				survey.getTitle(), survey.getDescription(), survey.getIcon(), survey.getCategory(),
				survey.getEstimatedTime(), survey.getPublishedAt(), survey.getClosedAt(), survey.getCreatedAt(),
				survey.getModifiedAt(), survey.getStatus(), survey.isDeleted(), responseCount);
	}

	public SurveyDetailsResponseDto toAdminResponseDto(Survey survey, Integer responseCount) {
		return new SurveyDetailsResponseDto(toAdminSummaryDto(survey, responseCount), survey.getRevision(),
				survey.getQuestions().stream().map(question -> question.accept(questionToDtoDetails)).toList());

	}

	public SurveyReadSummaryDto toReadSummaryDto(Survey survey) {
		return new SurveyReadSummaryDto(base64Url.encode(survey.getId(), DocType.SURVEY),
				base64Url.encode(survey.getCreatorId(), DocType.USER), survey.getTitle(), survey.getDescription(),
				survey.getIcon(), survey.getCategory(), survey.getEstimatedTime(), survey.getPublishedAt(),
				survey.getSurveyType());
	}

	public SurveyReadResponseDto toReadResponseDto(Survey survey) {
		return new SurveyReadResponseDto(toReadSummaryDto(survey),
				survey.getQuestions().stream().map(question -> question.accept(questionToDtoPublic)).toList());
	}
}
