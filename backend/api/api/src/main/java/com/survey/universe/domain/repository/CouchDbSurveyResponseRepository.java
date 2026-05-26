package com.survey.universe.domain.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.*;
import com.ibm.cloud.sdk.core.http.Response;
import com.survey.universe.domain.model.SurveyResponse;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;


@Repository
@AllArgsConstructor
public class CouchDbSurveyResponseRepository {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;

    private static final String DB_NAME = "survey-universe";

    private SurveyResponse documentToResponse(Document doc) throws Exception {
        Map<String, Object> props = new java.util.HashMap<>(doc.getProperties() != null ? doc.getProperties() : Map.of());
        props.put("_id", doc.getId());
        props.put("_rev", doc.getRev());
        String json = jacksonMapper.writeValueAsString(props);
        return jacksonMapper.readValue(json, SurveyResponse.class);
    }

    public Optional<SurveyResponse> save(SurveyResponse response) {
        try {
            response.setRootType("response"); 
            byte[] jsonBytes = jacksonMapper.writeValueAsBytes(response);
            InputStream inputStream = new ByteArrayInputStream(jsonBytes);

            PutDocumentOptions options = new PutDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(response.getId())
                    .body(inputStream)
                    .contentType("application/json")
                    .build();

            DocumentResult result = cloudantClient.putDocument(options).execute().getResult();
            response.setId(result.getId());
            response.setRevision(result.getRev());
            return Optional.of(response);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<SurveyResponse> findById(String id) {
        try {
            GetDocumentOptions options = new GetDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(id)
                    .build();

            Response<InputStream> responseStream = cloudantClient.getDocumentAsStream(options).execute();
            InputStream body = responseStream.getResult();
            if (body == null) return Optional.empty();

            SurveyResponse resp = jacksonMapper.readValue(body, SurveyResponse.class);
            return "response".equals(resp.getRootType()) ? Optional.of(resp) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<SurveyResponse> findAllByField(String fieldName, Object value) {
        try {
            Map<String, Object> selector = Map.of(
                    "root_type", "response",
                    fieldName, value
            );
            
            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(5000L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();
            if (docs == null) return Collections.emptyList();

            List<SurveyResponse> list = new ArrayList<>();
            for (Document doc : docs) {
                try { list.add(documentToResponse(doc)); } catch (Exception e) { /* skip */ }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<SurveyResponse> getAll() {
        try {
            Map<String, Object> selector = Map.of("root_type", "response");
            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(20000L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();
            if (docs == null) return Collections.emptyList();

            List<SurveyResponse> list = new ArrayList<>();
            for (Document doc : docs) {
                try { list.add(documentToResponse(doc)); } catch (Exception e) { /* skip */ }
            }
            return list;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
