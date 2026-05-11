package com.survey.universe.service.stub;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.User;
import com.survey.universe.exception.type.InternalConflictException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.DtoToUserMapper;
import com.survey.universe.mapper.PagedDtoMapper;
import com.survey.universe.mapper.UserToDtoMapper;
import com.survey.universe.service.UserFacadeService;
import com.survey.universe.service.UserService;
import com.survey.universe.service.constant.UsersSortOption;
import com.survey.universe.spring.util.Base64UrlUtil;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.user.UserPrivateDetailsResponseDto;
import com.survey.universe.web.dto.user.UserPublicSummaryDto;
import com.survey.universe.web.dto.user.UserUpdateRequestDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Profile("test")
public class StubUserFacadeService implements UserFacadeService {

	private final Base64UrlUtil base64Url;
	private final UserService userService;
	private final StubSurveyResponseService responseService;
	private final StubSurveyService surveyService;
	private final DtoToUserMapper dtoToUser;
	private final UserToDtoMapper userToDto;
	private final PagedDtoMapper pagedDtoMapper;

	private void validateActive(User user) {
		if (user.isDeleted()) {
			throw new ResourceNotFoundException("Resource not found");
		}
	}

	@Override
	public UserPrivateDetailsResponseDto getPrivateUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		validateActive(user);

		return userToDto.toUserPrivateDetailsDto(user, urlId, responseService.findAllByRespondentId(id).size());
	}

	@Override
	public MessageDto deleteUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (user.isDeleted()) {
			return new MessageDto("User successfully deleted");
		}

		user.setDeleted(true);
		userService.update(user).orElseThrow(
				() -> new InternalConflictException("User could not be deleted at this time, please try again"));

		return new MessageDto("User successfully deleted");
	}

	@Override
	public PagedResponseDto<UserPrivateDetailsResponseDto> getAllUsers(String search, Boolean showDeleted,
			UsersSortOption sortBy, int page, int size) {

		List<User> privateDetails = userService.filter(search, showDeleted);
		
		Comparator<User> comparator = switch (sortBy) {
		case userId -> Comparator.comparing(User::getId).reversed();
		case email -> Comparator.comparing(User::getEmail).reversed();
		case lastName -> Comparator.comparing(User::getLastName).reversed();
		default ->
			Comparator.comparing(User::getLastSession, Comparator.nullsLast(Comparator.naturalOrder())).reversed();
		};

		return pagedDtoMapper.toPagedResponse(privateDetails, comparator, page, size,
				user -> userToDto.toUserPrivateDetailsDto(user, base64Url.encode(user.getId(), DocType.USER),
						responseService.findAllByRespondentId(user.getId()).size()));
	}

	@Override
	public UserPrivateDetailsResponseDto updateUserByUrlId(String urlId, UserUpdateRequestDto updateRequestDto) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		validateActive(user);

		if (!user.getRevision().equals(updateRequestDto.revision())) {
			throw new InternalConflictException("Data was modified by someone else. Please refresh your data.");
		}

		dtoToUser.mapUserUpdate(updateRequestDto, user);

		user = userService.update(user).orElseThrow(
				() -> new InternalConflictException("User could not be updated at this time, please try again"));

		return userToDto.toUserPrivateDetailsDto(user, urlId, responseService.findAllByRespondentId(id).size());
	}

	@Override
	public UserPublicSummaryDto getPublicUserByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		validateActive(user);

		return userToDto.toUserPublicSummaryDto(user, urlId);
	}

	@Override
	public List<UserSurveyResponseDto> getUserResponses(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		User user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		validateActive(user);

		return responseService.findAllByRespondentId(id).stream()
				.map(response -> surveyService.findById(response.getSurveyId())
						.map(survey -> new UserSurveyResponseDto(response.getId(),
								base64Url.encode(survey.getId(), DocType.SURVEY), urlId, survey.getTitle(),
								response.getSubmittedAt(), response.getResponseAnswers())))
				.flatMap(Optional::stream).toList();
	}
}
