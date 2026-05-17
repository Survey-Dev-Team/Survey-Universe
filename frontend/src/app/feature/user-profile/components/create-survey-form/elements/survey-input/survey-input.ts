import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SurveyElement } from '../../models/survey.models';

@Component({
  selector: 'gt-survey-input',
  imports: [],
  templateUrl: './survey-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:flex; flex-direction:column; gap:8px' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SurveyInputElement),
      multi: true,
    },
  ],
})
export class SurveyInputElement implements ControlValueAccessor {
  readonly element = signal<SurveyElement | null>(null);

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
