package com.survey.universe.domain.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.*;
import com.survey.universe.domain.model.User;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;
import com.ibm.cloud.sdk.core.http.Response;

@Repository
@AllArgsConstructor
public class CouchDbUserRepository {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;

    private static final String DB_NAME = "survey-universe";

    private User documentToUser(Document doc) throws Exception {
        Map<String, Object> props = new java.util.HashMap<>(doc.getProperties() != null ? doc.getProperties() : Map.of());
        props.put("_id", doc.getId());
        props.put("_rev", doc.getRev());
        String json = jacksonMapper.writeValueAsString(props);
        return jacksonMapper.readValue(json, User.class);
    }

    public Optional<User> save(User user) {
        try {
            user.setRootType("user");
            byte[] jsonBytes = jacksonMapper.writeValueAsBytes(user);
            InputStream inputStream = new ByteArrayInputStream(jsonBytes);

            PutDocumentOptions options = new PutDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(user.getId())
                    .body(inputStream)
                    .contentType("application/json")
                    .build();

            DocumentResult result = cloudantClient.putDocument(options).execute().getResult();
            user.setId(result.getId());
            user.setRevision(result.getRev());
            return Optional.of(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(String id) {
        try {
            GetDocumentOptions options = new GetDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(id)
                    .build();

            Response<InputStream> response = cloudantClient.getDocumentAsStream(options).execute();
            InputStream responseStream = response.getResult();
            if (responseStream == null) return Optional.empty();

            User user = jacksonMapper.readValue(responseStream, User.class);
            return "user".equals(user.getRootType()) ? Optional.of(user) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByField(String fieldName, Object value) {
        try {
            Map<String, Object> selector = Map.of(
                    "root_type", "user",
                    fieldName, value
            );

            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(1L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();

            if (docs == null || docs.isEmpty()) return Optional.empty();
            return Optional.of(documentToUser(docs.get(0)));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<User> getAll() {
        try {
            Map<String, Object> selector = Map.of("root_type", "user");
            
            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(10000L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();
            if (docs == null) return Collections.emptyList();

            List<User> users = new ArrayList<>();
            for (Document doc : docs) {
                try {
                    users.add(documentToUser(doc));
                } catch (Exception e) {
                    System.err.println("Помилка маппінгу User: " + e.getMessage());
                }
            }
            return users;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
