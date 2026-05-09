package com.survey.universe.api.persistence.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SurveyResponse {

	@JsonProperty("_id")
    private String id;

    @JsonProperty("_rev")
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "response";
    
    @JsonProperty("survey_rev")
    private String surveyRev;
    
    @JsonProperty("respondent_id")
    private String respondentId;
    
    @JsonProperty("survey_id")
    private String surveyId;
    
    @JsonProperty("submitted_at")
    private Instant submittedAt;
    
    @JsonProperty("response_answers")
    private List<ResponseAnswer> responseAnswers = new ArrayList<>();
}
