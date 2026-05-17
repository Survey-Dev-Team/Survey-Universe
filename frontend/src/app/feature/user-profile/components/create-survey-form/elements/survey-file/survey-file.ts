import { ChangeDetectionStrategy, Component, forwardRef, signal, viewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SurveyElement } from '../../models/survey.models';

@Component({
  selector: 'gt-survey-file',
  imports: [],
  templateUrl: './survey-file.html',
  styleUrl: './survey-file.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:flex; flex-direction:column; gap:8px' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SurveyFileElement),
      multi: true,
    },
  ],
})
export class SurveyFileElement implements ControlValueAccessor {
  readonly element = signal<SurveyElement | null>(null);
  readonly selectedFileName = signal<string | null>(null);
  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  openFilePicker(e: MouseEvent): void {
    e.stopPropagation();
    this.fileInputRef()?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFileName.set(file.name);
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
