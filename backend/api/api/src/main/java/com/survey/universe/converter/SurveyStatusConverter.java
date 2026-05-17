package com.survey.universe.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.SurveyStatus;

@Component
public class SurveyStatusConverter implements Converter<String, SurveyStatus> {
	
	@Override
	public SurveyStatus convert(String source) {
		return SurveyStatus.fromString(source);
	}
}
