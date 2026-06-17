package com.survey.universe.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

	@NotBlank
    @JsonProperty("_id")
    private String id;
    
    @JsonProperty("_rev")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "user";
    
    @NotBlank
    @JsonProperty("first_name")
    private String firstName;
    
    @NotBlank
    @JsonProperty("last_name")
    private String lastName;
    
    @NotBlank
    @Email
    @JsonProperty("email")
    private String email;
    
    @NotBlank
    @JsonProperty("slug_id")
    private String slugId;
    
    @NotBlank
    @JsonProperty(value = "password")
    private String password;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("profile_image")
    private String profileImage;
    
    @JsonProperty("last_session")
    private Instant lastSession;
    
    @JsonProperty("created_at")
    private Instant createdAt;
    
    @JsonProperty("is_deleted")
    private boolean isDeleted = false;
      
    
}
