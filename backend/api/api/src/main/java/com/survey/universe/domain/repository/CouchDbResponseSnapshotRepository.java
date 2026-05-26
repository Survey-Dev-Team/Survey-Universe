package com.survey.universe.domain.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.*;
import com.ibm.cloud.sdk.core.http.Response;
import com.survey.universe.domain.model.UserResponseStatsSnapshot;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

@Repository
@AllArgsConstructor
public class CouchDbResponseSnapshotRepository {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;

    private static final String DB_NAME = "survey-universe";

    public UserResponseStatsSnapshot save(UserResponseStatsSnapshot snapshot) {
        try {
        	byte[] jsonBytes = jacksonMapper.writeValueAsBytes(snapshot);
            InputStream inputStream = new ByteArrayInputStream(jsonBytes);

            PutDocumentOptions options = new PutDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(snapshot.getResponseId())
                    .body(inputStream)
                    .contentType("application/json")
                    .build();

            DocumentResult result = cloudantClient.putDocument(options).execute().getResult();
            snapshot.setRevision(result.getRev());
            return snapshot;
        } catch (Exception e) {
            return snapshot;
        }
    }

    public Optional<UserResponseStatsSnapshot> findById(String responseId) {
        try {
            GetDocumentOptions options = new GetDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(responseId)
                    .build();

            Response<InputStream> responseStream = cloudantClient.getDocumentAsStream(options).execute();
            InputStream body = responseStream.getResult();
            if (body == null) return Optional.empty();

            return Optional.of(jacksonMapper.readValue(body, UserResponseStatsSnapshot.class));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<UserResponseStatsSnapshot> findAllByField(String fieldName, Object value) {
        try {
            Map<String, Object> selector = Map.of(fieldName, value);
            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(5000L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();
            if (docs == null) return Collections.emptyList();

            List<UserResponseStatsSnapshot> list = new ArrayList<>();
            for (Document doc : docs) {
                try {
                    Map<String, Object> props = new java.util.HashMap<>(doc.getProperties() != null ? doc.getProperties() : Map.of());
                    props.put("_id", doc.getId());
                    props.put("_rev", doc.getRev());
                    String json = jacksonMapper.writeValueAsString(props);
                    list.add(jacksonMapper.readValue(json, UserResponseStatsSnapshot.class));
                } catch (Exception e) {  }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public void delete(UserResponseStatsSnapshot snapshot) {
        try {
            DeleteDocumentOptions options = new DeleteDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(snapshot.getResponseId())
                    .rev(snapshot.getRevision())
                    .build();

            cloudantClient.deleteDocument(options).execute();
        } catch (Exception e) {
            System.err.println("Error deleting a snapshot: " + e.getMessage());
        }
    }
}
