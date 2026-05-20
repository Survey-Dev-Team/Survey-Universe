import { Component, inject, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Tabs, TabItem } from '../../shared/components/tabs/tabs';
import { UserStoreService } from '../../shared/services/user-store-service/user-store-service';
import { SurveyStats } from './components/survey-stats/survey-stats';
import { TestStats } from './components/test-stats/test-stats';
import { PrimeIcon, AdminTab } from '../../shared/models/enums';

@Component({
  selector: 'gt-admin-stats',
  imports: [Header, Footer, PageHeaderRole, Tabs, SurveyStats, TestStats],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.scss',
})
export class AdminStats {
  private readonly userStore = inject(UserStoreService);
  readonly isAdmin = this.userStore.isAdmin;
  readonly AdminTab = AdminTab;

  readonly tabItems: TabItem[] = [
    { value: AdminTab.Surveys, label: 'Surveys', icon: PrimeIcon.List   },
    { value: AdminTab.Tests,   label: 'Tests',   icon: PrimeIcon.Pencil },
  ];

  activeTab = signal<AdminTab>(AdminTab.Surveys);

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }
}
