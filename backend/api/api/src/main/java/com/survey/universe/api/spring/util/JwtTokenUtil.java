package com.survey.universe.api.spring.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.survey.universe.api.spring.configuration.bean.JwtTokenParams;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtTokenUtil {

	private final JwtTokenParams jwtTokenParams;

	private SecretKey getSigningKey() {
		byte[] bytes = Decoders.BASE64.decode(jwtTokenParams.getJwtSecret());
		return Keys.hmacShaKeyFor(bytes);
	}

	private Claims getAllClaims(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
	}

	private <T> T getClaim(String token, Function<Claims, T> resolver) {
		Claims claims = getAllClaims(token);
		return resolver.apply(claims);
	}
	
	public String getEmail(String token) {
		return getClaim(token, Claims::getSubject);
	} 
	
	public Date getExpiration(String token) {
		return getClaim(token, Claims::getExpiration);
	}
	
	public boolean tokenExpired(String token) {
		return getExpiration(token).before(new Date());
	}
	
	public String generate(Map<String, Object> claims, String username, long expirationTime) {
		long currentMillis = System.currentTimeMillis();
		return Jwts.builder().claims(claims).subject(username).issuedAt(new Date(currentMillis)).expiration(new Date(currentMillis + expirationTime)).signWith(getSigningKey(), Jwts.SIG.HS256).compact();
	}
	
	public String generate(String email, String type, long expirationTime) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("type", type);
		return generate(claims, email, expirationTime);
	}
	
	
	public String generateAccessToken(String email) {
		return generate(email, "ACCESS", getAccessTokenExpirationTime());
	}
	
	public String generateRefreshToken(String email) {
		return generate(email, "REFRESH", getRefreshTokenExpirationTime());
	}
	
	public long getAccessTokenExpirationTime() {
		return jwtTokenParams.getAccessTokenExpirationTime();
	}
	
	public long getRefreshTokenExpirationTime() {
		return jwtTokenParams.getRefreshTokenExpirationTime();
	}
	
	public boolean validateToken(String token, String type) {
		if (token == null) {
			return false;
		}
		
		try {
	        Claims claims = getAllClaims(token);
	        return type.equals(claims.get("type", String.class));
	    } catch (ExpiredJwtException e) {
	        return false;
	    } catch (JwtException | IllegalArgumentException e) {
	        return false;
	    }
	}
	
	public boolean validateRefreshToken(String token) {
		return validateToken(token, "REFRESH");
	}
	
	public boolean validateAccessToken(String token) {
	    return validateToken(token, "ACCESS");
	}

}
