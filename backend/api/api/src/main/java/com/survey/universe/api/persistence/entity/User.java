package com.survey.universe.api.persistence.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    @JsonProperty("_id")
    private String id;
    
    @JsonProperty("_rev")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "user";
    
    @JsonProperty("first_name")
    private String firstName;
    
    @JsonProperty("last_name")
    private String lastName;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("profile_image")
    private String profileImage;
    
    @JsonProperty("last_session")
    private Instant lastSession;
    
    @JsonProperty("surveys_completed")
    private List<String> surveysCompleted = new ArrayList<>();   
    
}
