import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SurveyElement } from '../../models/survey.models';

@Component({
  selector: 'gt-survey-paginator',
  imports: [],
  templateUrl: './survey-paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SurveyPaginatorElement),
      multi: true,
    },
  ],
})
export class SurveyPaginatorElement implements ControlValueAccessor {
  readonly element = signal<SurveyElement | null>(null);

  protected _onChange: (val: SurveyElement) => void = () => {};
  protected _onTouched: () => void = () => {};

  writeValue(val: SurveyElement): void {
    this.element.set(val ?? null);
  }

  registerOnChange(fn: (val: SurveyElement) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
