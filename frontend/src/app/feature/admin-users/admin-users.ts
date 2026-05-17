import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ROUTES } from '../../shared/models/routes.constants';

type UserTab = 'surveys' | 'tests';

interface CompletedSurvey {
  id: string;
  title: string;
  category: string;
  completedAt: string;
  completionRate: number;
}

interface CompletedTest {
  id: string;
  title: string;
  category: string;
  completedAt: string;
  completionRate: number;
  score: number;
  passed: boolean;
  timeTakenMin: number;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  joinedAt: string;
  status: 'Active' | 'Inactive';
  surveys: CompletedSurvey[];
  tests: CompletedTest[];
}

@Component({
  selector: 'gt-admin-users',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers {
  readonly routes = ROUTES;

  readonly users = signal<AppUser[]>([
    {
      id: '1',
      name: 'Olivia Bennett',
      email: 'olivia.bennett@example.com',
      role: 'user',
      joinedAt: '2025-03-12',
      status: 'Active',
      surveys: [
        { id: 's1', title: 'Remote Work Culture',      category: 'Business',   completedAt: '2026-02-10', completionRate: 100 },
        { id: 's2', title: 'Mental Health at Work',    category: 'Health',     completedAt: '2026-03-15', completionRate: 88  },
        { id: 's3', title: 'Social Media Habits',      category: 'Technology', completedAt: '2026-04-22', completionRate: 100 },
      ],
      tests: [
        { id: 't1', title: 'AI Fundamentals Quiz',   category: 'Technology', completedAt: '2026-02-20', completionRate: 100, score: 82, passed: true,  timeTakenMin: 16 },
        { id: 't2', title: 'Data Privacy Awareness', category: 'Technology', completedAt: '2026-03-30', completionRate: 100, score: 55, passed: false, timeTakenMin: 13 },
      ],
    },
    {
      id: '2',
      name: 'Lucas Moreau',
      email: 'lucas.moreau@example.com',
      role: 'user',
      joinedAt: '2025-05-20',
      status: 'Active',
      surveys: [
        { id: 's4', title: 'Climate Awareness 2025',   category: 'Science',   completedAt: '2026-01-08', completionRate: 100 },
        { id: 's5', title: 'Education Trends',         category: 'Education', completedAt: '2026-04-01', completionRate: 72  },
      ],
      tests: [
        { id: 't3', title: 'UX Research Knowledge',  category: 'Technology', completedAt: '2026-01-25', completionRate: 100, score: 77, passed: true, timeTakenMin: 20 },
        { id: 't4', title: 'Health & Safety Cert',   category: 'Health',     completedAt: '2026-03-10', completionRate: 100, score: 91, passed: true, timeTakenMin: 22 },
        { id: 't5', title: 'Business Ethics Test',   category: 'Business',   completedAt: '2026-04-18', completionRate: 85,  score: 63, passed: true, timeTakenMin: 28 },
      ],
    },
    {
      id: '3',
      name: 'Amelia Novak',
      email: 'amelia.novak@example.com',
      role: 'admin',
      joinedAt: '2024-11-05',
      status: 'Active',
      surveys: [
        { id: 's6', title: 'Customer Satisfaction Q1', category: 'Business',   completedAt: '2025-12-20', completionRate: 100 },
      ],
      tests: [
        { id: 't6', title: 'Leadership Skills Eval',  category: 'Business',   completedAt: '2026-02-14', completionRate: 100, score: 74, passed: true, timeTakenMin: 34 },
      ],
    },
    {
      id: '4',
      name: 'Ethan Clarke',
      email: 'ethan.clarke@example.com',
      role: 'user',
      joinedAt: '2026-01-30',
      status: 'Inactive',
      surveys: [],
      tests: [
        { id: 't7', title: 'AI Fundamentals Quiz', category: 'Technology', completedAt: '2026-02-05', completionRate: 60, score: 42, passed: false, timeTakenMin: 11 },
      ],
    },
    {
      id: '5',
      name: 'Sofia Reyes',
      email: 'sofia.reyes@example.com',
      role: 'user',
      joinedAt: '2025-08-14',
      status: 'Active',
      surveys: [
        { id: 's7', title: 'Remote Work Culture',   category: 'Business',   completedAt: '2026-01-17', completionRate: 100 },
        { id: 's8', title: 'Social Media Habits',   category: 'Technology', completedAt: '2026-03-09', completionRate: 100 },
        { id: 's9', title: 'Mental Health at Work', category: 'Health',     completedAt: '2026-04-25', completionRate: 95  },
      ],
      tests: [
        { id: 't8',  title: 'Health & Safety Cert',   category: 'Health',     completedAt: '2026-02-28', completionRate: 100, score: 88, passed: true, timeTakenMin: 24 },
        { id: 't9',  title: 'Data Privacy Awareness', category: 'Technology', completedAt: '2026-04-10', completionRate: 100, score: 70, passed: true, timeTakenMin: 14 },
      ],
    },
    {
      id: '6',
      name: 'Noah Fischer',
      email: 'noah.fischer@example.com',
      role: 'user',
      joinedAt: '2025-12-01',
      status: 'Active',
      surveys: [
        { id: 's10', title: 'Education Trends',       category: 'Education', completedAt: '2026-02-18', completionRate: 68 },
        { id: 's11', title: 'Climate Awareness 2025', category: 'Science',   completedAt: '2026-03-22', completionRate: 100 },
      ],
      tests: [],
    },
  ]);

  // ── Expanded / tab state ──────────────────────────────────────────────────
  expandedUserId = signal<string | null>(null);
  userTab = signal<UserTab>('surveys');

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
  readonly activeUsers = computed(() => this.users().filter((u) => u.status === 'Active').length);
  readonly totalSurveysCompleted = computed(() =>
    this.users().reduce((sum, u) => sum + u.surveys.length, 0)
  );
  readonly totalTestsCompleted = computed(() =>
    this.users().reduce((sum, u) => sum + u.tests.length, 0)
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleUser(id: string): void {
    if (this.expandedUserId() === id) {
      this.expandedUserId.set(null);
    } else {
      this.expandedUserId.set(id);
      this.userTab.set('surveys');
    }
  }

  setUserTab(tab: UserTab): void {
    this.userTab.set(tab);
  }

  deleteUser(id: string): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
    if (this.expandedUserId() === id) {
      this.expandedUserId.set(null);
    }
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
