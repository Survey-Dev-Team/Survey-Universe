import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CreateSurveyForm } from '../user-profile/components/create-survey-form/create-survey-form';
import { ROUTES } from '../../shared/models/routes.constants';

type SurveyStatus = 'Active' | 'Passed';
type FormMode = 'create' | 'edit';

interface AdminSurvey {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  author: string;
  questionCount: number;
  responses: number;
  status: SurveyStatus;
  published: boolean;
  createdAt: string;
  description: string;
}

@Component({
  selector: 'gt-admin-surveys',
  imports: [CommonModule, RouterLink, Header, Footer, CreateSurveyForm],
  templateUrl: './admin-surveys.html',
  styleUrl: './admin-surveys.scss',
})
export class AdminSurveys {
  readonly routes = ROUTES;

  readonly surveys = signal<AdminSurvey[]>([
    { id: '1', title: 'Explore the Unknown',       coverImage: '/assets/images/banner/card1.png', category: 'Science',     author: 'Alex Monroe',  questionCount: 7,  responses: 1240, status: 'Active', published: true,  createdAt: '2026-01-10', description: '7 questions · 3–5 min' },
    { id: '2', title: 'Cosmic Perspective Check',   coverImage: '/assets/images/banner/card2.png', category: 'Philosophy',  author: 'Lena Oris',    questionCount: 10, responses:  890, status: 'Active', published: true,  createdAt: '2026-01-22', description: '10 questions · 5 min' },
    { id: '3', title: 'Signal from the Crowd',      coverImage: '/assets/images/banner/card3.png', category: 'Society',     author: 'Mark Vega',    questionCount: 4,  responses: 2100, status: 'Passed', published: true,  createdAt: '2026-02-03', description: '4 questions · 2 min' },
    { id: '4', title: 'New Orbit of Thoughts',      coverImage: '/assets/images/banner/card4.png', category: 'Test',        author: 'Dana Kol',     questionCount: 8,  responses:  560, status: 'Passed', published: false, createdAt: '2026-02-18', description: '8 questions · 4 min' },
    { id: '5', title: 'Voices of the Void',         coverImage: '/assets/images/banner/card1.png', category: 'Psychology',  author: 'Ivan Petrov',  questionCount: 6,  responses: 3100, status: 'Active', published: true,  createdAt: '2026-03-05', description: '6 questions · 3 min' },
    { id: '6', title: 'Data and Dreams',            coverImage: '/assets/images/banner/card2.png', category: 'Science',     author: 'Sofia Lane',   questionCount: 12, responses:  720, status: 'Passed', published: true,  createdAt: '2026-03-22', description: '12 questions · 6 min' },
    { id: '7', title: 'Remote Work Culture',        coverImage: '/assets/images/banner/card3.png', category: 'Business',    author: 'Amelia Novak', questionCount: 9,  responses: 1850, status: 'Active', published: true,  createdAt: '2026-04-01', description: '9 questions · 4 min' },
    { id: '8', title: 'AI Fundamentals Quiz',       coverImage: '/assets/images/banner/card4.png', category: 'Test',        author: 'Lucas Moreau', questionCount: 15, responses: 3400, status: 'Active', published: true,  createdAt: '2026-04-15', description: '15 questions · 8 min' },
    { id: '9', title: 'Mental Health at Work',      coverImage: '/assets/images/banner/card1.png', category: 'Health',      author: 'Sofia Reyes',  questionCount: 11, responses:  410, status: 'Active', published: false, createdAt: '2026-04-28', description: '11 questions · 5 min' },
  ]);

  // ── Search ────────────────────────────────────────────────────────────────
  readonly searchQuery = signal('');

  readonly filteredSurveys = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.surveys();
    return this.surveys().filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q)
    );
  });

  // ── Summary KPIs ──────────────────────────────────────────────────────────
  readonly totalSurveys = computed(() => this.surveys().length);
  readonly publishedCount = computed(() => this.surveys().filter((s) => s.published).length);
  readonly activeCount = computed(() => this.surveys().filter((s) => s.status === 'Active').length);
  readonly totalResponses = computed(() =>
    this.surveys().reduce((sum, s) => sum + s.responses, 0)
  );

  // ── Form panel ────────────────────────────────────────────────────────────
  readonly showForm = signal(false);
  readonly formMode = signal<FormMode>('create');
  readonly editingSurveyId = signal<string | null>(null);

  openCreateForm(): void {
    this.formMode.set('create');
    this.editingSurveyId.set(null);
    this.showForm.set(true);
    document.body.style.overflow = 'hidden';
  }

  openEditForm(id: string): void {
    this.formMode.set('edit');
    this.editingSurveyId.set(id);
    this.showForm.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeForm(): void {
    this.showForm.set(false);
    document.body.style.overflow = '';
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  togglePublish(id: string): void {
    this.surveys.update((list) =>
      list.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    );
  }

  deleteSurvey(id: string): void {
    this.surveys.update((list) => list.filter((s) => s.id !== id));
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}
