package com.survey.universe.domain.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RefreshToken {

	@JsonProperty("_id")
    private String id;
    
    @JsonProperty("_rev")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String revision;

    @JsonProperty("root_type")
    private String rootType = "refresh_token";
    
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("token")
    private String token;

    @JsonProperty("expiry_date")
    private Instant expiryDate;
    
}
