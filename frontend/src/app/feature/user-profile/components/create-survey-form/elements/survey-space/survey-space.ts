import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SurveyElement } from '../../models/survey.models';

@Component({
  selector: 'gt-survey-space',
  imports: [],
  templateUrl: './survey-space.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SurveySpaceElement),
      multi: true,
    },
  ],
})
export class SurveySpaceElement implements ControlValueAccessor {
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
}
