FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY backend/api/api/.mvn .mvn

COPY backend/api/api/mvnw backend/api/api/pom.xml ./

RUN chmod +x ./mvnw

RUN ./mvnw dependency:go-offline


COPY backend/api/api/src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
