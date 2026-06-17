package com.survey.universe.spring.configuration;

import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.sdk.core.security.BasicAuthenticator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CouchDbConfiguration {

	@Bean
	public Cloudant cloudantClient() {
		BasicAuthenticator authenticator = new BasicAuthenticator.Builder().username("admin").password("password")
				.build();

		Cloudant client = new Cloudant("CouchDB-Service", authenticator);
		client.setServiceUrl("http://database:5984");

		return client;
	}
}
