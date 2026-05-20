import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface KpiCard {
  icon: string;
  value: string | number;
  label: string;
  accent?: boolean;
  formatted?: boolean;
}

@Component({
  selector: 'gt-kpi-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCardComponent {
  card = input.required<KpiCard>();
}
