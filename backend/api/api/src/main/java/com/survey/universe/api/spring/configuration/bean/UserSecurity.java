package com.survey.universe.api.spring.configuration.bean;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.survey.universe.api.persistence.constant.DocType;
import com.survey.universe.api.persistence.entity.User;
import com.survey.universe.api.spring.util.Base64UrlUtil;

import lombok.AllArgsConstructor;

@Component("userSecurity")
@AllArgsConstructor
public class UserSecurity {
	
	private final Base64UrlUtil base64Url;
	
    public boolean isOwner(Authentication authentication, String urlId) {
        User user = (User) authentication.getPrincipal();
        String currentUrlId = base64Url.decode(urlId, DocType.USER);        
        return currentUrlId.equals(user.getId());
    }
}
