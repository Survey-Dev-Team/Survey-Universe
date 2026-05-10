package com.survey.universe.service;

import java.util.List;

import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.UserPublicSummaryDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.UserUpdateRequestDto;
import com.survey.universe.web.dto.response.UserPrivateResponseDto;

public interface UserFacadeService {

	public UserPublicSummaryDto getPublicUserByUrlId(String urlId);
	
	public UserPrivateResponseDto getPrivateUserByUrlId(String urlId);

	public MessageDto deleteUserByUrlId(String urlId);
	
	public List<UserPrivateResponseDto> getAllUsers();

	public UserPrivateResponseDto updateUserByUrlId(String id, UserUpdateRequestDto updateRequestDto);

	public List<UserSurveyResponseDto> getUserResponses(String urlId);
}
