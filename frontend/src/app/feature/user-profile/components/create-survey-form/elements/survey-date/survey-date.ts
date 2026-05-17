import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SurveyElement } from '../../models/survey.models';

@Component({
  selector: 'gt-survey-date',
  imports: [DatePickerModule, FormsModule],
  templateUrl: './survey-date.html',
  styleUrl: './survey-date.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:flex; flex-direction:column; gap:8px' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SurveyDateElement),
      multi: true,
    },
  ],
})
export class SurveyDateElement implements ControlValueAccessor {
  readonly element = signal<SurveyElement | null>(null);
  pickedDate: Date | null = null;

  onDateSelect(date: Date): void {
    this.pickedDate = date;
    const formatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    this.update({ content: formatted });
  }

  private _onChange: (val: SurveyElement) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(val: SurveyElement): void {
    this.element.set(val ?? null);
  }

  registerOnChange(fn: (val: SurveyElement) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  update(patch: Partial<SurveyElement>): void {
    const current = this.element();
    if (!current) return;
    const next = { ...current, ...patch };
    this.element.set(next);
    this._onChange(next);
    this._onTouched();
  }
}
