package com.survey.universe.mapper;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.User;
import com.survey.universe.web.dto.auth.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.user.UserUpdateRequestDto;

@Component
public class DtoToUserMapper {

	public User toRegisteredUser(String id, String hash, UserRegisterRequestDto registerDto) {
		User user = new User();
		user.setId(id);
		user.setEmail(registerDto.email());
		user.setPassword(hash);
		user.setFirstName(registerDto.firstName());
		user.setLastName(registerDto.lastName());
		user.setRole("user");
		
		user.setDeleted(false);
		
		return user;
	}
	
	public void mapUserUpdate(UserUpdateRequestDto updateRequestDto, User user) {
		Optional.ofNullable(updateRequestDto.firstName()).ifPresent(user::setFirstName);
		Optional.ofNullable(updateRequestDto.lastName()).ifPresent(user::setLastName);
		Optional.ofNullable(updateRequestDto.profileImage()).ifPresent(user::setProfileImage);
	}
}
