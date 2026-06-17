package com.survey.universe.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserResponseStatsSnapshot {
	
	@NotBlank
    @JsonProperty("_id")
    private String id;
    
    @JsonProperty("_rev")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "snapshot";
    
    @JsonProperty("user_id")
    private String userId;
    
    @JsonProperty("survey_id")
    private String surveyId;
    
    @JsonProperty("response_id")
    private String responseId;
    
    @JsonProperty("questions_total")
    private Integer questionsTotal;
    
    @JsonProperty("non_content_questions_total")
	private Integer nonContentQuestionsTotal;
	
    @JsonProperty("marked_questions_total")
	private Integer markedQuestionsTotal;
	
    @JsonProperty("questions_answered")
    private Integer questionsAnswered;
	
    @JsonProperty("marked_questions_answered")
	private Integer markedQuestionsAnswered;
    
    @JsonProperty("correct_answer_count")
    private Integer correctAnswerCount;	

}
