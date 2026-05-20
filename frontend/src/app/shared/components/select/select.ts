import { 
  Component, 
  forwardRef, 
  input 
} from '@angular/core';
import { 
  NG_VALUE_ACCESSOR, 
  ControlValueAccessor 
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { 
  LabeledOption 
} from '../../models/interfaces';

@Component({
  selector: 'gt-select',
  standalone: true,
  imports: [
    SelectModule, 
    FormsModule
  ],
  templateUrl: './select.html',
  styleUrls: ['./select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  placeholder = input<string>('Select');
options = input.required<
  string[] |
  { id: string; name: string }[] |
  LabeledOption[]
>();
  icon = input<string>('');
  styleClass = input<string>('');
  optionLabel = input<string>('address');
  optionValue = input<string>('id');
  filter = input<boolean>(false);
  filterBy = input<string>('');
  showClear = input<boolean>(false);
  editable = input<boolean>(false);
  scrollHeight = input<string>('200px');

  value: string | null = null;
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  isStringArray(): boolean {
    const opts = this.options();
    return Array.isArray(opts) && (opts.length === 0 || typeof opts[0] === 'string');
  }

  writeValue(value: string | null): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = !!isDisabled;
  }

 
  handleChange(value: string | null) {
    this.value = value ?? null;
    this.onChange(this.value);
  }

  markTouched() {
    this.onTouched();
  }
}
