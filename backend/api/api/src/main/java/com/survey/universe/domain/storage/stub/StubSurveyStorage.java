package com.survey.universe.domain.storage.stub;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.QuestionType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.model.survey.Option;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.model.survey.TextAreaQuestion;

import jakarta.annotation.PostConstruct;

@Service
@Profile("test")
public class StubSurveyStorage {

	private final Map<String, Survey> surveyStorage = new ConcurrentHashMap<>();

	@PostConstruct
	private void init() {
		Survey remoteWorkSurvey = new Survey();
		remoteWorkSurvey.setId("survey:019de95c-3401-7001-a1b2-c3d4e5f60001");
		remoteWorkSurvey.setRevision("1-x123");
		remoteWorkSurvey.setRootType("survey");
		remoteWorkSurvey.setTitle("Employee Remote Work Questionnaire 2026");
		remoteWorkSurvey.setDescription("A comprehensive look at our current remote work culture.");
		remoteWorkSurvey.setStatus(SurveyStatus.DRAFT);
		remoteWorkSurvey.setCategory(List.of("corporate", "questionnaire", "work"));
		remoteWorkSurvey.setHome(true);
		remoteWorkSurvey.setEstimatedTime(5);
		remoteWorkSurvey.setCreatedAt(Instant.parse("2026-05-01T09:00:00Z"));
		remoteWorkSurvey.setModifiedAt(Instant.parse("2026-05-01T10:30:00Z"));
		remoteWorkSurvey.setCreatorId("user:019de942-9929-7fe2-a364-530aba65d8d8");

		RangeQuestion q1 = new RangeQuestion();
		q1.setId("q1");
		q1.setLabel("How satisfied are you with your work-life balance?");
		q1.setType(QuestionType.RANGE);
		q1.setSortOrder(1);
		q1.setIsRequired(true);
		q1.setMin(0);
		q1.setMax(10);
		q1.setStep(1);

		SelectionQuestion q2 = new SelectionQuestion();
		q2.setId("q2");
		q2.setLabel("Which perks do you value most?");
		q2.setType(QuestionType.CHECKBOX);
		q2.setSortOrder(2);
		q2.setOptions(List.of(createOption("opt1", "Health Insurance", Integer.valueOf(1)),
				createOption("opt2", "Remote Budget", 2), createOption("opt3", "Extra PTO", 3)));

		TextAreaQuestion q3 = new TextAreaQuestion();
		q3.setId("q3");
		q3.setLabel("Leave your suggestions here:");
		q3.setType(QuestionType.TEXT_AREA);
		q3.setSortOrder(3);
		q3.setPlaceholder("Enter your suggestions");

		remoteWorkSurvey.setQuestions(List.of(q1, q2, q3));

		surveyStorage.put(remoteWorkSurvey.getId(), remoteWorkSurvey);
	}

	private Option createOption(String id, String label, int order) {
		Option opt = new Option();
		opt.setId(id);
		opt.setLabel(label);
		opt.setSortOrder(order);
		return opt;
	}

	public Optional<Survey> findById(String id) {
		return Optional.ofNullable(surveyStorage.get(id));
	}

	public List<Survey> findAllByCreator(String creatorId) {
		return surveyStorage.values().stream().filter(s -> s.getCreatorId().equals(creatorId)).toList();
	}

	public List<Survey> findActiveByCreator(String creatorId) {
		return surveyStorage.values().stream().filter(s -> s.getCreatorId().equals(creatorId))
				.filter(s -> !s.isDeleted()).toList();

	}

	public Optional<Survey> add(Survey survey) {
		surveyStorage.put(survey.getId(), survey);
		return Optional.of(survey);
	}

	public Optional<Survey> update(String id, Survey survey) {
		surveyStorage.put(survey.getId(), survey);
		return Optional.of(survey);
	}

	public List<Survey> findAllActive() {
		return surveyStorage.values().stream().filter(s -> !s.isDeleted()).toList();

	}

	public List<Survey> findAllHome() {
		return surveyStorage.values().stream().filter(s -> s.isHome()).filter(s -> !s.isDeleted()).toList();

	}

	public List<Survey> findByStatus(SurveyStatus status) {
		return surveyStorage.values().stream().filter(s -> s.getStatus().equals(status)).filter(s -> !s.isDeleted())
				.toList();
	}

	public List<Survey> getAll() {
		return (List<Survey>) surveyStorage.values();
	}
}
