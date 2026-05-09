package com.survey.universe.api.service;

import java.util.List;

import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.UserPublicSummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.UserUpdateRequestDto;
import com.survey.universe.api.web.dto.response.UserPrivateResponseDto;

public interface UserFacadeService {

	public UserPublicSummaryDto getPublicUserByUrlId(String urlId);
	
	public UserPrivateResponseDto getPrivateUserByUrlId(String urlId);

	public MessageDto deleteUserByUrlId(String urlId);
	
	public List<UserPrivateResponseDto> getAllUsers();

	public UserPrivateResponseDto updateUserByUrlId(String id, UserUpdateRequestDto updateRequestDto);

	public List<UserSurveyResponseDto> getUserResponses(String urlId);
}
