import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  CdkDragPreview,
} from '@angular/cdk/drag-drop';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import {
  SurveyElement,
  SurveyElementType,
  SurveyElementPalette,
  InputSubType,
  SURVEY_PALETTE,
  INPUT_SUB_TYPES,
} from './models/survey.models';
import { SurveyPropsPanelComponent, SurveyPropForm } from './elements/survey-props-panel/survey-props-panel';
import { SurveyInputElement } from './elements/survey-input/survey-input';
import { SurveyTextareaElement } from './elements/survey-textarea/survey-textarea';
import { SurveySelectRadioElement } from './elements/survey-select-radio/survey-select-radio';
import { SurveySelectElement } from './elements/survey-select/survey-select';
import { SurveyTextElement } from './elements/survey-text/survey-text';
import { SurveyTitleElement } from './elements/survey-title/survey-title';
import { SurveyImageElement } from './elements/survey-image/survey-image';
import { SurveyRangeElement } from './elements/survey-range/survey-range';
import { SurveyPaginatorElement } from './elements/survey-paginator/survey-paginator';
import { SurveySpaceElement } from './elements/survey-space/survey-space';
import { SurveyFileElement } from './elements/survey-file/survey-file';
import { SurveyDateElement } from './elements/survey-date/survey-date';

@Component({
  selector: 'gt-create-survey-form',
  imports: [
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    TooltipModule,
    SurveyPropsPanelComponent,
    SurveyInputElement,
    SurveyTextareaElement,
    SurveySelectRadioElement,
    SurveySelectElement,
    SurveyTextElement,
    SurveyTitleElement,
    SurveyImageElement,
    SurveyRangeElement,
    SurveyPaginatorElement,
    SurveySpaceElement,
    SurveyFileElement,
    SurveyDateElement,
  ],
  templateUrl: './create-survey-form.html',
  styleUrl: './create-survey-form.scss',
})
export class CreateSurveyForm {
  private readonly destroyRef = inject(DestroyRef);

  readonly palette: SurveyElementPalette[] = SURVEY_PALETTE;
  readonly paletteItems: SurveyElementPalette[] = [...SURVEY_PALETTE];
  readonly inputSubTypes = INPUT_SUB_TYPES;
  readonly elementMeta = new Map(SURVEY_PALETTE.map(p => [p.type, p]));

  readonly form = new FormGroup({
    title: new FormControl<string>('Untitled Survey', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('', { nonNullable: true }),
    coverImage:  new FormControl<string>('', { nonNullable: true }),
    elements: new FormArray<FormControl<SurveyElement>>([]),
  });

  readonly propForm: SurveyPropForm = new FormGroup({
    label:        new FormControl<string>('', { nonNullable: true }),
    content:      new FormControl<string>('', { nonNullable: true }),
    placeholder:  new FormControl<string>('', { nonNullable: true }),
    required:     new FormControl<boolean>(false, { nonNullable: true }),
    inputSubType: new FormControl<InputSubType>('text', { nonNullable: true }),
    rangeMin:     new FormControl<number>(0, { nonNullable: true }),
    rangeMax:     new FormControl<number>(100, { nonNullable: true }),
    rangeStep:    new FormControl<number>(1, { nonNullable: true }),
    options:      new FormArray<FormControl<string>>([]),
  });

  readonly selectedElementId = signal<string | null>(null);
  readonly submitted = signal<boolean>(false);
  private readonly _propSub$ = new Subject<void>();

  get elementsArray(): FormArray<FormControl<SurveyElement>> {
    return this.form.controls.elements;
  }

  readonly selectedElement = computed<SurveyElement | null>(() => {
    const id = this.selectedElementId();
    if (!id) return null;
    return this.elementsArray.controls.find(c => c.value.id === id)?.value ?? null;
  });

  get isValid(): boolean {
    return this.form.valid && this.elementsArray.length > 0;
  }

  hasErrorForElement(id: string): boolean {
    if (!this.submitted()) return false;
    return this.elementsArray.controls.find(c => c.value.id === id)?.invalid ?? false;
  }

  selectElement(id: string): void {
    this.selectedElementId.set(id);
    const ctrl = this.elementsArray.controls.find(c => c.value.id === id);
    if (ctrl) this._syncPropForm(ctrl);
  }

  onDrop(event: CdkDragDrop<any[], any[]>): void {
    const isFromPalette = event.previousContainer !== event.container;
    if (isFromPalette) {
      const paletteItem = event.previousContainer.data[event.previousIndex] as SurveyElementPalette;
      const newEl = this._createDefaultElement(paletteItem.type);
      const ctrl = new FormControl<SurveyElement>(newEl, { nonNullable: true });
      this.elementsArray.insert(event.currentIndex, ctrl);
      this.selectElement(newEl.id);
    } else {
      const controls = [...this.elementsArray.controls];
      moveItemInArray(controls, event.previousIndex, event.currentIndex);
      this.elementsArray.clear({ emitEvent: false });
      controls.forEach(c => this.elementsArray.push(c, { emitEvent: false }));
      this.elementsArray.updateValueAndValidity();
    }
  }

  duplicateElement(id: string, e: MouseEvent): void {
    e.stopPropagation();
    const index = this.elementsArray.controls.findIndex(c => c.value.id === id);
    if (index === -1) return;
    const original = this.elementsArray.controls[index].value;
    const newId = `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const clone = new FormControl<SurveyElement>({ ...original, id: newId }, { nonNullable: true });
    this.elementsArray.insert(index + 1, clone);
    this.selectElement(newId);
  }

  deleteElement(id: string, e: MouseEvent): void {
    e.stopPropagation();
    const index = this.elementsArray.controls.findIndex(c => c.value.id === id);
    if (index === -1) return;
    this.elementsArray.removeAt(index);
    if (this.selectedElementId() === id) {
      const next = this.elementsArray.controls[index] ?? this.elementsArray.controls[index - 1];
      if (next) {
        this.selectElement(next.value.id);
      } else {
        this.selectedElementId.set(null);
      }
    }
  }

  addOption(): void {
    this.propForm.controls.options.push(new FormControl<string>('', { nonNullable: true }));
  }

  removeOption(index: number): void {
    if (this.propForm.controls.options.length <= 2) return;
    this.propForm.controls.options.removeAt(index);
  }

  onCoverImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.form.controls.coverImage.setValue(reader.result as string);
    reader.readAsDataURL(file);
  }

  onImageSelect(event: any): void {
    const file: File = event.files?.[0];
    if (!file) return;
    const ctrl = this.elementsArray.controls.find(c => c.value.id === this.selectedElementId());
    if (!ctrl) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      ctrl.setValue({ ...ctrl.value, imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  onFileSelect(file: File): void {
    // File selected in props panel — can be used for preview or upload
    console.log('file selected', file.name);
  }

  onDateSelect(formatted: string): void {
    const ctrl = this.elementsArray.controls.find(c => c.value.id === this.selectedElementId());
    if (!ctrl) return;
    ctrl.setValue({ ...ctrl.value, content: formatted });
  }

  saveSurvey(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (!this.isValid) return;
    console.log(this.form.getRawValue());
  }

  saveAsDraft(): void {
    console.log('draft', this.form.getRawValue());
  }

  private _syncPropForm(elementCtrl: FormControl<SurveyElement>): void {
    this._propSub$.next();
    const el = elementCtrl.value;

    this.propForm.controls.options.clear({ emitEvent: false });
    for (const opt of el.options ?? []) {
      this.propForm.controls.options.push(new FormControl<string>(opt, { nonNullable: true }), { emitEvent: false });
    }

    this.propForm.patchValue({
      label:        el.label        ?? '',
      content:      el.content      ?? '',
      placeholder:  el.placeholder  ?? '',
      required:     el.required     ?? false,
      inputSubType: el.inputSubType ?? 'text',
      rangeMin:     el.rangeMin     ?? 0,
      rangeMax:     el.rangeMax     ?? 100,
      rangeStep:    el.rangeStep    ?? 1,
    }, { emitEvent: false });

    this.propForm.valueChanges
      .pipe(takeUntil(this._propSub$), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        elementCtrl.setValue({
          ...elementCtrl.value,
          label:        this.propForm.controls.label.value,
          content:      this.propForm.controls.content.value,
          placeholder:  this.propForm.controls.placeholder.value,
          required:     this.propForm.controls.required.value,
          inputSubType: this.propForm.controls.inputSubType.value,
          rangeMin:     this.propForm.controls.rangeMin.value,
          rangeMax:     this.propForm.controls.rangeMax.value,
          rangeStep:    this.propForm.controls.rangeStep.value,
          options:      this.propForm.controls.options.controls.map(c => c.value),
        });
      });
  }

  private _createDefaultElement(type: SurveyElementType): SurveyElement {
    const id = `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const defaults: Record<SurveyElementType, Partial<SurveyElement>> = {
      input:          { label: 'Question', placeholder: 'Your answer', inputSubType: 'text', required: false },
      textarea:       { label: 'Question', placeholder: 'Your answer', required: false },
      'select-radio': { label: 'Choose one', options: ['Option 1', 'Option 2'], required: false },
      select:         { label: 'Choose', options: ['Option 1', 'Option 2'], required: false },
      text:           { content: 'Add your description here.' },
      title:          { content: 'Section Title' },
      image:          { imageUrl: '' },
      range:          { label: 'Rate', rangeMin: 0, rangeMax: 100, rangeStep: 1 },
      paginator:      {},
      space:          {},
      file:           { label: 'File Upload', placeholder: 'Click or drag a file here', required: false },
      'date-picker':  { label: 'Date', placeholder: '', required: false },
    };
    return { id, type, ...defaults[type] };
  }
}
