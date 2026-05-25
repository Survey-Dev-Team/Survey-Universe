package com.survey.universe.spring.configuration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.DocumentResult;
import com.ibm.cloud.cloudant.v1.model.GetDatabaseInformationOptions;
import com.ibm.cloud.cloudant.v1.model.PostBulkDocsOptions;
import com.ibm.cloud.sdk.core.http.Response;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import com.ibm.cloud.cloudant.v1.model.Document;
import com.ibm.cloud.cloudant.v1.model.BulkDocs;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class CouchDbDatabaseSeeder implements CommandLineRunner {

    private final Cloudant cloudantClient;
    private final ObjectMapper jacksonMapper;
    private final ResourceLoader resourceLoader;

    private static final String DB_NAME = "survey-universe";

    @Override
    public void run(String... args) throws Exception {
        try {
            GetDatabaseInformationOptions infoOptions = new GetDatabaseInformationOptions.Builder()
                    .db(DB_NAME)
                    .build();
            
            long docCount = cloudantClient.getDatabaseInformation(infoOptions).execute().getResult().getDocCount();

            if (docCount > 5) { 
                System.out.println("CouchDB: Database 'survey-universe' already has data (" + docCount + " documents). Skipping seeding.");
                return;
            }

            System.out.println("CouchDB: Database empty, launching seeding from seed/seed.json...");

            Resource resource = resourceLoader.getResource("classpath:seed/seed.json");
            if (!resource.exists()) {
                System.err.println("CouchDB Error: File src/main/resources/seed/seed.json not found!");
                return;
            }

            List<Map<String, Object>> seedDocuments;
            try (InputStream inputStream = resource.getInputStream()) {
                seedDocuments = jacksonMapper.readValue(inputStream, new TypeReference<List<Map<String, Object>>>() {});
            }

            if (seedDocuments.isEmpty()) {
                System.out.println("CouchDB: File seed/seed.json is empty.");
                return;
            }

            List<Document> couchDocuments = seedDocuments.stream().map(map -> {
                Document doc = new Document();
                map.forEach((key, value) -> doc.put(key, value)); 
                return doc;
            }).toList();

            PostBulkDocsOptions bulkOptions = new PostBulkDocsOptions.Builder()
                    .db(DB_NAME)
                    .bulkDocs(new BulkDocs.Builder().docs(couchDocuments).build())
                    .build();

            Response<List<DocumentResult>> response = cloudantClient.postBulkDocs(bulkOptions).execute();
            
            if (response.getStatusCode() == 201) {
                System.out.println("CouchDB: Seeding duccess: " + couchDocuments.size() + " ducuments in 'survey-universe'.");
            } else {
                System.err.println("CouchDB: Seeding error. HTTP: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("CouchDB Critical error while seeding: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
