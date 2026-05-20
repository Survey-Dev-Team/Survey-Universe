import { Component, signal, computed } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { Search } from '../../shared/components/search/search';
import { GtTable } from '../../shared/components/table/table';
import { ROUTES } from '../../shared/models/routes.constants';
import { UserTab, UserRole } from '../../shared/models/enums';
import { AppUser } from './admin-users.model';
import { ADMIN_USERS_MOCK } from './admin-users.mock';
import { USER_SURVEYS_COLUMNS, USER_TESTS_COLUMNS, USER_COLUMNS } from './admin-users.config';

@Component({
  selector: 'gt-admin-users',
  imports: [Header, Footer, PageHeaderRole, Search, GtTable],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers {
  readonly routes          = ROUTES;
  readonly UserTab         = UserTab;
  readonly UserRole        = UserRole;
  readonly userColumns     = USER_COLUMNS;
  readonly surveysColumns  = USER_SURVEYS_COLUMNS;
  readonly testsColumns    = USER_TESTS_COLUMNS;

  readonly users = signal<AppUser[]>(ADMIN_USERS_MOCK);

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

  // ── Helpers ───────────────────────────────────────────────────────────────
  setUserTab(tab: UserTab): void {
    this.userTab.set(tab);
  }

  deleteUser(id: string): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
  }
}
