import { Component, input, output } from '@angular/core';

export interface TabItem {
  value: string;
  label: string;
  icon?: string;
  badge?: number | null;
  badgeVariant?: 'warn';
}

@Component({
  selector: 'gt-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  tabs = input<TabItem[]>([]);
  activeTab = input<string>('');
  tabChange = output<string>();
}
