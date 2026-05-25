package com.survey.universe.domain.repository;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.*;
import com.ibm.cloud.sdk.core.http.Response;
import com.survey.universe.domain.model.survey.Survey;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;


@Repository
@AllArgsConstructor
public class CouchDbSurveyRepository {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;

    private static final String DB_NAME = "survey-universe";
    private static final String DESIGN_DOC = "surveys";

    private Survey documentToSurvey(Document doc) throws Exception {
        Map<String, Object> props = new java.util.HashMap<>(doc.getProperties() != null ? doc.getProperties() : Map.of());
        props.put("_id", doc.getId());
        props.put("_rev", doc.getRev());
        String json = jacksonMapper.writeValueAsString(props);
        return jacksonMapper.readValue(json, Survey.class);
    }

    public Optional<Survey> save(Survey survey) {
        try {
            survey.setRootType("survey");
            byte[] jsonBytes = jacksonMapper.writeValueAsBytes(survey);
            InputStream inputStream = new ByteArrayInputStream(jsonBytes);

            PutDocumentOptions options = new PutDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(survey.getId())
                    .body(inputStream)
                    .contentType("application/json")
                    .build();

            DocumentResult result = cloudantClient.putDocument(options).execute().getResult();
            survey.setId(result.getId());
            survey.setRevision(result.getRev());
            return Optional.of(survey);
        } catch (Exception e) {
            System.err.println("Помилка збереження Survey: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<Survey> findById(String id) {
        try {
            GetDocumentOptions options = new GetDocumentOptions.Builder()
                    .db(DB_NAME)
                    .docId(id)
                    .build();

            Response<InputStream> response = cloudantClient.getDocumentAsStream(options).execute();
            InputStream responseStream = response.getResult();
            
            if (responseStream == null) return Optional.empty();

            Survey survey = jacksonMapper.readValue(responseStream, Survey.class);
            return "survey".equals(survey.getRootType()) ? Optional.of(survey) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Survey> findByView(String viewName, Object key) {
        try {
            PostViewOptions options = new PostViewOptions.Builder()
                    .db(DB_NAME)
                    .ddoc(DESIGN_DOC)
                    .view(viewName)
                    .key(key)
                    .includeDocs(true)
                    .build();

            ViewResult result = cloudantClient.postView(options).execute().getResult();
            List<Survey> surveys = new ArrayList<>();

            for (ViewResultRow row : result.getRows()) {
                if (row.getDoc() != null) {
                    try {
                        surveys.add(documentToSurvey(row.getDoc()));
                    } catch (Exception e) {
                        System.err.println("Помилка маппінгу Survey з View: " + e.getMessage());
                    }
                }
            }
            return surveys;
        } catch (Exception e) {
            System.err.println("Помилка виконання View " + viewName + ": " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public Optional<Survey> findByField(String fieldName, Object value) {
        try {
            Map<String, Object> selector = Map.of(
                    "root_type", "survey",
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
            return Optional.of(documentToSurvey(docs.get(0)));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Survey> getAll() {
        try {
            Map<String, Object> selector = Map.of("root_type", "survey");

            PostFindOptions options = new PostFindOptions.Builder()
                    .db(DB_NAME)
                    .selector(selector)
                    .limit(10000L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();
            if (docs == null) return Collections.emptyList();

            List<Survey> surveys = new ArrayList<>();
            for (Document doc : docs) {
                try {
                    surveys.add(documentToSurvey(doc));
                } catch (Exception e) {
                    System.err.println("Помилка маппінгу Survey: " + e.getMessage());
                }
            }
            return surveys;
        } catch (Exception e) {
            System.err.println("Помилка отримання всіх Survey: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
