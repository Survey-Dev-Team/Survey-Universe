package com.survey.universe.service;

import java.util.List;

import com.survey.universe.service.constant.UsersSortOption;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.user.UserPrivateDetailsResponseDto;
import com.survey.universe.web.dto.user.UserPublicSummaryDto;
import com.survey.universe.web.dto.user.UserUpdateRequestDto;

public interface UserFacadeService {

	public UserPublicSummaryDto getPublicUserByUrlId(String urlId);

	public UserPrivateDetailsResponseDto getPrivateUserByUrlId(String urlId);

	public MessageDto deleteUserByUrlId(String urlId);

	public PagedResponseDto<UserPrivateDetailsResponseDto> getAllUsers(String search, Boolean showDeleted,
			UsersSortOption sortBy, int page, int size);

	public UserPrivateDetailsResponseDto updateUserByUrlId(String id, UserUpdateRequestDto updateRequestDto);

	public List<UserSurveyResponseDto> getUserResponses(String urlId);
}
