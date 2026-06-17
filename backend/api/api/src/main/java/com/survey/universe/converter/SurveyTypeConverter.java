package com.survey.universe.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.SurveyType;

@Component
public class SurveyTypeConverter implements Converter<String, SurveyType> {
	
	@Override
	public SurveyType convert(String source) {
		return SurveyType.fromString(source);
	}
}
