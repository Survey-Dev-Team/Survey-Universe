package com.survey.universe.domain.model.survey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Survey {
    
	@NotBlank
	@JsonProperty("_id")
    private String id;

    @JsonProperty("_rev")
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "survey";
    
    @JsonProperty("title")
    private String title;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("status")
    private SurveyStatus status;
    
    @JsonProperty
    private SurveyType surveyType;
    
    @JsonProperty("category")
    private List<String> category = new ArrayList<>();
    
    @JsonProperty("is_home")
    private boolean isHome;
    
    @JsonProperty("icon")
    private String icon;
    
    @JsonProperty("estimated_time")
    private Integer estimatedTime;
    
    @JsonProperty("created_at")
    private Instant createdAt;
    
    @JsonProperty("modified_at")
    private Instant modifiedAt;
    
    @JsonProperty("closed_at")
    private Instant closedAt;
    
    @JsonProperty("published_at")
    private Instant publishedAt;
    
    @JsonProperty("is_deleted")
    private boolean isDeleted;
    
    @JsonProperty("creator_id")
    private String creatorId;
    
    @Valid 
    @JsonProperty("questions")
    private List<Question> questions = new ArrayList<>();
}

