package com.survey.universe.web.dto.question;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class OpenFormQuestionPublicDto extends QuestionPublicDto {

	private String placeholder;

}
