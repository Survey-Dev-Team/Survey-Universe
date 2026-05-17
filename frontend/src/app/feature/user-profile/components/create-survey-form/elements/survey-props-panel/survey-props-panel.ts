import { Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { DatePickerModule } from 'primeng/datepicker';
import { SurveyElement, InputSubType, INPUT_SUB_TYPES } from '../../models/survey.models';

export type SurveyPropForm = FormGroup<{
  label:        FormControl<string>;
  content:      FormControl<string>;
  placeholder:  FormControl<string>;
  required:     FormControl<boolean>;
  inputSubType: FormControl<InputSubType>;
  rangeMin:     FormControl<number>;
  rangeMax:     FormControl<number>;
  rangeStep:    FormControl<number>;
  options:      FormArray<FormControl<string>>;
}>;

@Component({
  selector: 'gt-survey-props-panel',
  imports: [ReactiveFormsModule, FormsModule, DividerModule, FileUploadModule, DatePickerModule],
  templateUrl: './survey-props-panel.html',
  styleUrl: './survey-props-panel.scss',
  host: { style: 'display:flex; flex-direction:column; gap:12px; width:100%' },
})
export class SurveyPropsPanelComponent {
  readonly element  = input.required<SurveyElement>();
  readonly propForm = input.required<SurveyPropForm>();

  readonly addOption    = output<void>();
  readonly removeOption = output<number>();
  readonly imageSelect  = output<any>();
  readonly fileSelect   = output<File>();
  readonly dateSelect   = output<string>();

  readonly inputSubTypes = INPUT_SUB_TYPES;
  readonly selectedPropFile = signal<string | null>(null);
  readonly selectedDate = signal<Date | null>(null);

  onDateSelect(date: Date): void {
    this.selectedDate.set(date);
    const formatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    this.dateSelect.emit(formatted);
  }

  onPropFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedPropFile.set(file.name);
    this.fileSelect.emit(file);
  }

  get optionsArray(): FormArray<FormControl<string>> {
    return this.propForm().controls.options;
  }
}
