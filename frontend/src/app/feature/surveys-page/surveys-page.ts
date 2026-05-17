import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { SurveyComponent } from '../user-profile/components/survey/survey';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { SurveysService } from '../../shared/services/surveys/surveys.service';

interface Survey {
  id: string;
  text: string;
  coverImage: string;
  description: string;
  date: string;
  category: string;
  author: string;
  status: 'Active' | 'Passed';
}

@Component({
  selector: 'gt-surveys-page',
  imports: [Header, Footer, PageHeaderRole, SurveyComponent, InputText, RouterLink],
  templateUrl: './surveys-page.html',
  styleUrl: './surveys-page.scss',
})
export class SurveysPage implements OnInit {
  private surveysService = inject(SurveysService);

  ngOnInit(): void {
    this.surveysService.getAllSurveys().subscribe({
      next: (response) => console.log('[SurveysPage] API response:', response),
      error: (err) => console.error('[SurveysPage] API error:', err),
    });
  }

  readonly searchQuery = signal('');

  readonly openGroups = signal<Set<string>>(
    typeof window !== 'undefined' && window.innerWidth <= 768
      ? new Set(['Date'])
      : new Set(['Date', 'Category', 'Author', 'Test', 'Status'])
  );

  isGroupOpen(name: string): boolean {
    return this.openGroups().has(name);
  }

  toggleGroup(name: string) {
    this.openGroups.update(set => {
      if (set.has(name)) {
        const next = new Set(set);
        next.delete(name);
        return next;
      }
      // на мобайлі — лише один відкритий, на десктопі всі можуть бути відкриті
      if (window.innerWidth <= 768) {
        return new Set([name]);
      }
      return new Set([...set, name]);
    });
  }

  readonly filters = signal({
    dates: [] as string[],
    categories: [] as string[],
    authors: [] as string[],
    statuses: [] as string[],
    isTest: false,
  });

  readonly allSurveys: Survey[] = [
    {
      id: '1',
      text: 'Explore the Unknown',
      coverImage: '/assets/images/banner/card1.png',
      description: '7 questions · 3–5 min',
      date: 'Active until May 15, 2025',
      category: 'Science',
      author: 'Alex Monroe',
      status: 'Active',
    },
    {
      id: '2',
      text: 'Cosmic Perspective Check',
      coverImage: '/assets/images/banner/card2.png',
      description: '10 questions · 5 min',
      date: 'Anonymous survey',
      category: 'Philosophy',
      author: 'Lena Oris',
      status: 'Active',
    },
    {
      id: '3',
      text: 'Signal from the Crowd',
      coverImage: '/assets/images/banner/card3.png',
      description: '4 questions · 2 min',
      date: 'Active until June 1, 2025',
      category: 'Society',
      author: 'Mark Vega',
      status: 'Passed',
    },
    {
      id: '4',
      text: 'New Orbit of Thoughts',
      coverImage: '/assets/images/banner/card4.png',
      description: '8 questions · 4 min',
      date: 'Every answer matters',
      category: 'Test',
      author: 'Dana Kol',
      status: 'Passed',
    },
    {
      id: '5',
      text: 'Voices of the Void',
      coverImage: '/assets/images/banner/card1.png',
      description: '6 questions · 3 min',
      date: 'Active until July 1, 2025',
      category: 'Psychology',
      author: 'Ivan Petrov',
      status: 'Active',
    },
    {
      id: '6',
      text: 'Data and Dreams',
      coverImage: '/assets/images/banner/card2.png',
      description: '12 questions · 6 min',
      date: 'Anonymous survey',
      category: 'Science',
      author: 'Sofia Lane',
      status: 'Passed',
    },
  ];

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.dates.length || f.categories.length || f.authors.length || f.statuses.length || f.isTest || this.searchQuery());
  });

  readonly filteredSurveys = computed(() => {
    const f = this.filters();
    const q = this.searchQuery().toLowerCase();
    return this.allSurveys.filter(s => {
      if (q && !s.text.toLowerCase().includes(q)) return false;
      if (f.categories.length && !f.categories.includes(s.category)) return false;
      if (f.authors.length && !f.authors.includes(s.author)) return false;
      if (f.statuses.length && !f.statuses.includes(s.status)) return false;
      if (f.isTest && s.category !== 'Test') return false;
      return true;
    });
  });

  toggleMulti(key: 'categories' | 'authors' | 'dates' | 'statuses', value: string) {
    this.filters.update(f => {
      const current = f[key];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...f, [key]: updated };
    });
  }

  toggleTest() {
    this.filters.update(f => ({ ...f, isTest: !f.isTest }));
  }
}
