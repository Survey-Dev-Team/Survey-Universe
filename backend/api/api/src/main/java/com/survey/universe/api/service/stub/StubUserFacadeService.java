package com.survey.universe.api.service.stub;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.exception.type.InternalConflictException;
import com.survey.universe.api.exception.type.ResourceNotFoundException;
import com.survey.universe.api.persistence.constant.DocType;
import com.survey.universe.api.persistence.entity.SurveyResponse;
import com.survey.universe.api.persistence.entity.User;
import com.survey.universe.api.persistence.entity.survey.Survey;
import com.survey.universe.api.service.UserFacadeService;
import com.survey.universe.api.service.UserService;
import com.survey.universe.api.spring.util.Base64UrlUtil;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.UserPrivateSummaryDto;
import com.survey.universe.api.web.dto.UserPublicSummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.UserUpdateRequestDto;
import com.survey.universe.api.web.dto.response.UserPrivateResponseDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Profile("test")
public class StubUserFacadeService implements UserFacadeService {

	private final Base64UrlUtil base64Url;
	private final UserService userService;
	private final StubSurveyResponseService responseService;
	private final StubSurveyService surveyService;

	@Override
	public UserPrivateResponseDto getPrivateUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		return convertToDto(urlId, user);
	}

	@Override
	public MessageDto deleteUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		user.setDeleted(true);
		userService.update(user).orElseThrow(
				() -> new InternalConflictException("User could not be deleted at this time, please try again"));

		return new MessageDto("User successfully deleted");
	}

	@Override
	public List<UserPrivateResponseDto> getAllUsers() {
		return userService.getAll().stream()
				.map(user -> convertToDto(base64Url.encode(user.getId(), DocType.USER), user)).toList();
	}

	@Override
	public UserPrivateResponseDto updateUserByUrlId(String urlId, UserUpdateRequestDto updateRequestDto) {
		String id = base64Url.decode(urlId, DocType.USER);

		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!user.getRevision().equals(updateRequestDto.revision())) {
			throw new InternalConflictException("Data was modified by someone else. Please refresh your data.");
		}

		applyUpdates(updateRequestDto, user);

		userService.update(user).orElseThrow(
				() -> new InternalConflictException("User could not be updated at this time, please try again"));

		return convertToDto(urlId, user);

	}

	@Override
	public UserPublicSummaryDto getPublicUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		return new UserPublicSummaryDto(urlId, user.getProfileImage(), user.getFirstName(), user.getLastName());
	}

	private void applyUpdates(UserUpdateRequestDto updateRequestDto, User user) {
		Optional.ofNullable(updateRequestDto.email()).ifPresent(user::setEmail);
		Optional.ofNullable(updateRequestDto.firstName()).ifPresent(user::setFirstName);
		Optional.ofNullable(updateRequestDto.lastName()).ifPresent(user::setLastName);
		Optional.ofNullable(updateRequestDto.profileImage()).ifPresent(user::setProfileImage);
	}

	private UserPrivateResponseDto convertToDto(String urlId, User user) {
		UserPrivateSummaryDto userSummary = new UserPrivateSummaryDto(user.getId(), urlId, user.getProfileImage(),
				user.getFirstName(), user.getLastName(), user.getRole(), user.getEmail());
		return new UserPrivateResponseDto(userSummary, responseService.findAllByRespondentId(user.getId()).size(),
				user.getRevision(), user.getLastSession());
	}

	@Override
	public List<UserSurveyResponseDto> getUserResponses(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		List<SurveyResponse> responses = responseService.findAllByRespondentId(id);
		List<UserSurveyResponseDto> responseDtos = new ArrayList<>();
		for (SurveyResponse response : responses) {
			surveyService.findById(response.getSurveyId()).ifPresent(survey -> {
				responseDtos.add(
						new UserSurveyResponseDto(response.getId(), base64Url.encode(survey.getId(), DocType.SURVEY),
								urlId, survey.getTitle(), response.getSubmittedAt(), response.getResponseAnswers()));
			});

		}
		return responseDtos;
	}

}
