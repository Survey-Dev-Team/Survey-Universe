import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Search } from '../../shared/components/search/search';
import { GtTable } from '../../shared/components/table/table';
import { ROUTES } from '../../shared/models/routes.constants';
import { UserTab, UserRole } from '../../shared/models/enums';
import { USER_SURVEYS_COLUMNS, USER_TESTS_COLUMNS, USER_COLUMNS } from './admin-users.config';
import { AdminDataService } from '../../shared/services/admin/admin-data.service';

@Component({
  selector: 'gt-admin-users',
  imports: [Header, Footer, PageHeaderRole, Search, GtTable],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private adminDataService = inject(AdminDataService);

  readonly routes         = ROUTES;
  readonly UserTab        = UserTab;
  readonly UserRole       = UserRole;
  readonly userColumns    = USER_COLUMNS;
  readonly surveysColumns = USER_SURVEYS_COLUMNS;
  readonly testsColumns   = USER_TESTS_COLUMNS;

  readonly users   = this.adminDataService.users;
  readonly loading = this.adminDataService.loading;

  // ── Expanded / tab state ──────────────────────────────────────────────────
  userTab = signal<UserTab>(UserTab.Surveys);

  // ── Search ────────────────────────────────────────────────────────────────
  searchQuery = signal('');

  readonly filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  // ── Summary computed ──────────────────────────────────────────────────────
  readonly totalUsers = computed(() => this.users().length);
  readonly totalSurveysCompleted = computed(() =>
    this.users().reduce((sum, u) => sum + u.surveys.length, 0)
  );
  readonly totalTestsCompleted = computed(() =>
    this.users().reduce((sum, u) => sum + u.tests.length, 0)
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.adminDataService.loadUsers();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  setUserTab(tab: UserTab): void {
    this.userTab.set(tab);
  }

  onRowExpand(userId: string): void {
    const user = this.users().find(u => u.id === userId);
    if (user?.urlId) {
      this.adminDataService.loadUserResponses(userId, user.urlId);
    }
    this.userTab.set(UserTab.Surveys);
  }

  deleteUser(id: string): void {
    const user = this.users().find(u => u.id === id);
    if (user?.urlId) {
      this.adminDataService.deleteUser(user.urlId);
    }
  }
}
