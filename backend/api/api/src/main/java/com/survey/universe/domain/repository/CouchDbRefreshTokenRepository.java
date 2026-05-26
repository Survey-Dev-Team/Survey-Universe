package com.survey.universe.domain.repository;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.*;
import com.survey.universe.domain.model.RefreshToken;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class CouchDbRefreshTokenRepository {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;

    private static final String DB_NAME = "survey-universe";

    public RefreshToken save(RefreshToken token) {
        try {
        	byte[] jsonBytes = jacksonMapper.writeValueAsBytes(token);
            InputStream inputStream = new ByteArrayInputStream(jsonBytes);

            PutDocumentOptions options = new PutDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(token.getId()) 
                    .body(inputStream)
                    .contentType("application/json")
                    .build();

            DocumentResult result = cloudantClient.putDocument(options).execute().getResult();
            token.setRevision(result.getRev());
            return token;
        } catch (Exception e) {
            return token;
        }
    }

    public Optional<RefreshToken> findByToken(String tokenValue) {
        try {
            Map<String, Object> selector = Map.of("token", tokenValue);
            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(1L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();

            if (docs == null || docs.isEmpty()) return Optional.empty();
            Map<String, Object> props = new java.util.HashMap<>(docs.get(0).getProperties() != null ? docs.get(0).getProperties() : Map.of());
            props.put("_id", docs.get(0).getId());
            props.put("_rev", docs.get(0).getRev());
            String json = jacksonMapper.writeValueAsString(props);
            return Optional.of(jacksonMapper.readValue(json, RefreshToken.class));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void delete(RefreshToken token) {
        try {
            DeleteDocumentOptions options = new DeleteDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(token.getId())
                    .rev(token.getRevision())
                    .build();

            cloudantClient.deleteDocument(options).execute();
        } catch (Exception e) {
            System.err.println("Error deleting Token: " + e.getMessage());
        }
    }
}
