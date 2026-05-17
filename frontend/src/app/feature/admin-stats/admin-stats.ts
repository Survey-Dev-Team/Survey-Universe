import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { UserStoreService } from '../../shared/services/user-store-service/user-store-service';
import { ROUTES } from '../../shared/models/routes.constants';

type ItemType = 'survey' | 'test';
type TabType = 'surveys' | 'tests';
type TimeRange = 'all' | '3m' | '6m' | '1y';

interface SurveyStat {
  id: string;
  title: string;
  category: string;
  participants: number;
  completionRate: number;
  status: 'Active' | 'Passed';
  createdAt: string;
  type: ItemType;
}

interface TestStat {
  id: string;
  title: string;
  category: string;
  participants: number;
  completionRate: number;
  avgScore: number;
  passRate: number;
  avgTimeMin: number;
  status: 'Active' | 'Passed';
  createdAt: string;
  type: ItemType;
}

@Component({
  selector: 'gt-admin-stats',
  imports: [CommonModule, ChartModule, Header, Footer, RouterLink],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.scss',
})
export class AdminStats implements OnInit {
  private readonly userStore = inject(UserStoreService);

  readonly routes = ROUTES;
  readonly ROUTES = ROUTES;
  readonly isAdmin = this.userStore.isAdmin;

  activeTab = signal<TabType>('surveys');
  timeRange = signal<TimeRange>('all');

  readonly timeRanges: { label: string; value: TimeRange }[] = [
    { label: 'All time',      value: 'all' },
    { label: 'Last 3 months', value: '3m'  },
    { label: 'Last 6 months', value: '6m'  },
    { label: 'Last year',     value: '1y'  },
  ];

  readonly surveys: SurveyStat[] = [
    { id: '1', title: 'Remote Work Culture',      category: 'Business',   participants: 1240, completionRate: 78, status: 'Active', createdAt: '2025-04-10', type: 'survey' },
    { id: '2', title: 'Mental Health at Work',    category: 'Health',     participants:  890, completionRate: 64, status: 'Active', createdAt: '2025-07-14', type: 'survey' },
    { id: '3', title: 'Customer Satisfaction Q1', category: 'Business',   participants: 2100, completionRate: 91, status: 'Passed', createdAt: '2025-12-01', type: 'survey' },
    { id: '4', title: 'Education Trends',         category: 'Education',  participants:  560, completionRate: 55, status: 'Passed', createdAt: '2026-01-20', type: 'survey' },
    { id: '5', title: 'Climate Awareness 2025',   category: 'Science',    participants: 3100, completionRate: 83, status: 'Active', createdAt: '2026-03-05', type: 'survey' },
    { id: '6', title: 'Social Media Habits',      category: 'Technology', participants:  720, completionRate: 70, status: 'Active', createdAt: '2026-04-28', type: 'survey' },
  ];

  readonly tests: TestStat[] = [
    { id: '7',  title: 'UX Research Knowledge',  category: 'Technology', participants: 980,  completionRate: 82, avgScore: 74, passRate: 68, avgTimeMin: 22, status: 'Active', createdAt: '2025-04-15', type: 'test' },
    { id: '8',  title: 'AI Fundamentals Quiz',   category: 'Technology', participants: 3400, completionRate: 76, avgScore: 79, passRate: 71, avgTimeMin: 18, status: 'Active', createdAt: '2025-08-20', type: 'test' },
    { id: '9',  title: 'Business Ethics Test',   category: 'Business',   participants:  640, completionRate: 61, avgScore: 58, passRate: 47, avgTimeMin: 30, status: 'Passed', createdAt: '2025-11-10', type: 'test' },
    { id: '10', title: 'Health & Safety Cert',   category: 'Health',     participants: 1850, completionRate: 94, avgScore: 85, passRate: 82, avgTimeMin: 25, status: 'Passed', createdAt: '2026-01-25', type: 'test' },
    { id: '11', title: 'Data Privacy Awareness', category: 'Technology', participants:  410, completionRate: 58, avgScore: 61, passRate: 54, avgTimeMin: 15, status: 'Active', createdAt: '2026-03-12', type: 'test' },
    { id: '12', title: 'Leadership Skills Eval', category: 'Business',   participants:  720, completionRate: 72, avgScore: 67, passRate: 62, avgTimeMin: 35, status: 'Active', createdAt: '2026-04-30', type: 'test' },
  ];

  // ── Time filter ──────────────────────────────────────────────────────────
  private readonly cutoffDate = computed((): Date | null => {
    const now = new Date();
    switch (this.timeRange()) {
      case '3m': { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d; }
      case '6m': { const d = new Date(now); d.setMonth(d.getMonth() - 6); return d; }
      case '1y': { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
      default: return null;
    }
  });

  readonly filteredSurveys = computed(() => {
    const cutoff = this.cutoffDate();
    if (!cutoff) return this.surveys;
    return this.surveys.filter(s => new Date(s.createdAt) >= cutoff);
  });

  readonly filteredTests = computed(() => {
    const cutoff = this.cutoffDate();
    if (!cutoff) return this.tests;
    return this.tests.filter(t => new Date(t.createdAt) >= cutoff);
  });

  // ── Survey computed ───────────────────────────────────────────────────────
  readonly surveyTotalParticipants = computed(() =>
    this.filteredSurveys().reduce((sum, s) => sum + s.participants, 0)
  );
  readonly surveyActive = computed(() =>
    this.filteredSurveys().filter((s) => s.status === 'Active').length
  );
  readonly surveyAvgCompletion = computed(() => {
    const fs = this.filteredSurveys();
    return fs.length ? Math.round(fs.reduce((sum, s) => sum + s.completionRate, 0) / fs.length) : 0;
  });

  // ── Test computed ─────────────────────────────────────────────────────────
  readonly testTotalParticipants = computed(() =>
    this.filteredTests().reduce((sum, t) => sum + t.participants, 0)
  );
  readonly testActive = computed(() =>
    this.filteredTests().filter((t) => t.status === 'Active').length
  );
  readonly testAvgScore = computed(() => {
    const ft = this.filteredTests();
    return ft.length ? Math.round(ft.reduce((sum, t) => sum + t.avgScore, 0) / ft.length) : 0;
  });
  readonly testAvgPassRate = computed(() => {
    const ft = this.filteredTests();
    return ft.length ? Math.round(ft.reduce((sum, t) => sum + t.passRate, 0) / ft.length) : 0;
  });
  readonly testAvgTime = computed(() => {
    const ft = this.filteredTests();
    return ft.length ? Math.round(ft.reduce((sum, t) => sum + t.avgTimeMin, 0) / ft.length) : 0;
  });

  readonly testFunnel = computed(() => {
    const total = this.testTotalParticipants();
    const completion = this.testAvgScore();
    const pass = this.testAvgPassRate();
    return [
      { label: 'Started',     count: total,                        pct: 100 },
      { label: 'Reached 50%', count: Math.round(total * 0.82),    pct: 82 },
      { label: 'Completed',   count: Math.round(total * 0.74),     pct: 74 },
      { label: 'Passed',      count: Math.round(total * pass / 100), pct: pass },
    ];
  });

  // ── Survey monthly data ───────────────────────────────────────────────────
  readonly surveyMonthly = [
    { month: 'Jan', participants: 820  },
    { month: 'Feb', participants: 1150 },
    { month: 'Mar', participants: 2340 },
    { month: 'Apr', participants: 3200 },
    { month: 'May', participants: 1780 },
    { month: 'Jun', participants: 2100 },
  ];

  // ── Test monthly data ─────────────────────────────────────────────────────
  readonly testMonthly = [
    { month: 'Jan', avgScore: 68, passRate: 61 },
    { month: 'Feb', avgScore: 72, passRate: 65 },
    { month: 'Mar', avgScore: 74, passRate: 68 },
    { month: 'Apr', avgScore: 76, passRate: 70 },
    { month: 'May', avgScore: 71, passRate: 64 },
    { month: 'Jun', avgScore: 78, passRate: 72 },
  ];

  readonly scoreDistribution = [
    { range: '0–20%',  count: 148 },
    { range: '21–40%', count: 312 },
    { range: '41–60%', count: 890 },
    { range: '61–80%', count: 2340 },
    { range: '81–100%', count: 1220 },
  ];

  // ── Chart signals ─────────────────────────────────────────────────────────
  surveyTrendData = signal<Record<string, unknown>>({});
  testTrendData   = signal<Record<string, unknown>>({});
  scoreDistData   = signal<Record<string, unknown>>({});

  readonly surveyCategoryData = computed(() => {
    const catMap: Record<string, number> = {};
    for (const s of this.filteredSurveys()) {
      catMap[s.category] = (catMap[s.category] || 0) + s.participants;
    }
    return {
      labels: Object.keys(catMap),
      datasets: [{ data: Object.values(catMap), backgroundColor: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'], hoverOffset: 8 }],
    };
  });

  readonly passFailData = computed(() => ({
    labels: this.filteredTests().map(t => t.title),
    datasets: [
      { label: 'Passed', data: this.filteredTests().map(t => t.passRate),       backgroundColor: 'rgba(34,197,94,0.75)', borderRadius: 6 },
      { label: 'Failed', data: this.filteredTests().map(t => 100 - t.passRate), backgroundColor: 'rgba(239,68,68,0.55)', borderRadius: 6 },
    ],
  }));

  chartOptions    = signal<Record<string, unknown>>({});
  doughnutOptions = signal<Record<string, unknown>>({});
  horizOptions    = signal<Record<string, unknown>>({});

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  setTimeRange(range: TimeRange): void {
    this.timeRange.set(range);
  }

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    const isDark = document.body.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Survey: participants bar by month
    this.surveyTrendData.set({
      labels: this.surveyMonthly.map((m) => m.month),
      datasets: [{
        label: 'Participants',
        data: this.surveyMonthly.map((m) => m.participants),
        backgroundColor: 'rgba(124,58,237,0.7)',
        borderRadius: 8,
        borderSkipped: false,
      }],
    });

    // Test: score & pass rate trend line
    this.testTrendData.set({
      labels: this.testMonthly.map((m) => m.month),
      datasets: [
        {
          label: 'Avg score',
          data: this.testMonthly.map((m) => m.avgScore),
          fill: true,
          tension: 0.4,
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124,58,237,0.12)',
          pointBackgroundColor: '#7c3aed',
          pointRadius: 4,
        },
        {
          label: 'Pass rate',
          data: this.testMonthly.map((m) => m.passRate),
          fill: true,
          tension: 0.4,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.10)',
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
        },
      ],
    });

    // Score distribution
    this.scoreDistData.set({
      labels: this.scoreDistribution.map((s) => s.range),
      datasets: [{
        label: 'Participants',
        data: this.scoreDistribution.map((s) => s.count),
        backgroundColor: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#7c3aed'],
        borderRadius: 8,
        borderSkipped: false,
      }],
    });

    this.chartOptions.set({
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { ticks: { color: textColor, maxRotation: 30 }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true },
      },
      responsive: true,
      maintainAspectRatio: false,
    });

    this.horizOptions.set({
      indexAxis: 'y',
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, padding: 16 } },
        tooltip: { mode: 'index' },
      },
      scales: {
        x: { stacked: true, max: 100, ticks: { color: textColor, callback: (v: unknown) => `${v}%` }, grid: { color: gridColor } },
        y: { stacked: true, ticks: { color: textColor }, grid: { display: false } },
      },
      responsive: true,
      maintainAspectRatio: false,
    });

    this.doughnutOptions.set({
      plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 16 } } },
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
    });
  }
}
