package com.survey.universe.spring.configuration.bean;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.spring.configuration.UserPrincipal;
import com.survey.universe.spring.util.Base64UrlUtil;

import lombok.AllArgsConstructor;

@Component("userSecurity")
@AllArgsConstructor
public class UserSecurity {
	
	private final Base64UrlUtil base64Url;
	
    public boolean isOwner(Authentication authentication, String urlId) {
    	UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        String currentUrlId = base64Url.decode(urlId, DocType.USER);        
        return currentUrlId.equals(user.id());
    }
}
