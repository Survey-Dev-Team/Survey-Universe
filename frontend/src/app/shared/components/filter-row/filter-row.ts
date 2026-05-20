import { Component, input, output } from '@angular/core';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'gt-filter-row',
  standalone: true,
  imports: [],
  templateUrl: './filter-row.html',
  styleUrl: './filter-row.scss',
})
export class FilterRow {
  options     = input<FilterOption[]>([]);
  activeValue = input<string>('');
  valueChange = output<string>();
}
