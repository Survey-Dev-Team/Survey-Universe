package com.survey.universe.domain.model.abstraction;

import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;

public interface QuestionVisitor<T> {
    public T visit(RangeQuestion question);
    public T visit(SelectionQuestion question);
    public T visit(TextAreaQuestion question);
    public T visit(InputQuestion question);
    public T visit(FileQuestion question);
    public T visit(OpenFormQuestion question);
    public T visit(SimpleRespondedQuestion question);
    public T visit(DefaultQuestion question);
}

