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

    private SurveyResponse mapDocumentToResponse(Document doc) {
        Map<String, Object> properties = doc.getProperties();
        Map<String, Object> map = new HashMap<>(properties != null ? properties : Map.of());
        
        map.put("_id", doc.getId());
        map.put("_rev", doc.getRev());
        
        return jacksonMapper.convertValue(map, SurveyResponse.class);
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
            System.err.println("CouchDB Репозиторій: Помилка виклику save() для відповіді: " + e.getMessage());
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
        } catch (com.ibm.cloud.sdk.core.service.exception.NotFoundException e) {
            return Optional.empty();
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

            if (docs == null || docs.isEmpty()) {
                return Collections.emptyList();
            }

            List<SurveyResponse> list = new ArrayList<>();
            for (Document doc : docs) {
                try {
                    list.add(mapDocumentToResponse(doc));
                } catch (Exception mapEx) {
                    System.err.println("CouchDB Репозиторій: Помилка конвертації рядка відповіді: " + mapEx.getMessage());
                }
            }
            return list;
        } catch (Exception e) {
            System.err.println("CouchDB Репозиторій: Помилка Mango-пошуку для " + fieldName + ": " + e.getMessage());
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
                try {
                    list.add(mapDocumentToResponse(doc));
                } catch (Exception mapEx) {
                }
            }
            return list;
        } catch (Exception e) {
            System.err.println("CouchDB Репозиторій: Помилка завантаження всіх відповідей: " + e.getMessage());
            return Collections.emptyList();
        }
    }
    
    public List<SurveyResponse> findBySurveyAndRespondent(String surveyId, String respondentId) {
        try {
            Map<String, Object> selector = Map.of(
                    "root_type", "response",
                    "survey_id", surveyId,
                    "respondent_id", respondentId
            );
            
            PostFindOptions options = new PostFindOptions.Builder()
                    .db("survey-universe")
                    .selector(selector)
                    .limit(10L)
                    .build();

            FindResult result = cloudantClient.postFind(options).execute().getResult();
            List<Document> docs = result.getDocs();

            if (docs == null || docs.isEmpty()) {
                return Collections.emptyList();
            }

            List<SurveyResponse> list = new ArrayList<>();
            for (Document doc : docs) {
                Map<String, Object> map = new HashMap<>(doc.getProperties() != null ? doc.getProperties() : Map.of());
                map.put("_id", doc.getId());
                map.put("_rev", doc.getRev());
                list.add(jacksonMapper.convertValue(map, SurveyResponse.class));
            }
            return list;
        } catch (Exception e) {
            System.err.println("CouchDB Помилка пошуку пари survey+respondent: " + e.getMessage());
            return Collections.emptyList();
        }
    }

}
