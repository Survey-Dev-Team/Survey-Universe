import { Component, input } from '@angular/core';
import { KpiCardComponent, type KpiCard } from '../kpi-card/kpi-card';

export type { KpiCard } from '../kpi-card/kpi-card';

@Component({
  selector: 'gt-kpi-row',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './kpi-row.html',
  styleUrl: './kpi-row.scss',
})
export class KpiRow {
  cards = input<KpiCard[]>([]);
}
