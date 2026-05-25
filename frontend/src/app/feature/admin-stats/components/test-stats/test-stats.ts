import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { GtTable, TableColumn } from '../../../../shared/components/table/table';
import { KpiRow, KpiCard } from '../../../../shared/components/kpi-row/kpi-row';
import { FilterRow } from '../../../../shared/components/filter-row/filter-row';
import { TestStat } from './test-stats.model';
import { TimeRange, StatsLabel, StatStatus } from '../../../../shared/models/enums';
import { TIME_RANGE_OPTIONS } from '../../admin-stats.config';
import { TEST_KPI_CONFIG, TEST_TABLE_COLUMNS, buildTrendDatasets, buildPassFailDatasets, buildScoreDistColors, FUNNEL_CONFIG, buildChartOptions, buildHorizOptions } from './test-stats.config';
import { filterByRange } from '../../../../shared/utils/stats-filter.util';
import { getChartTheme } from '../../../../shared/utils/chart-theme.util';
import { AggregationApiService } from '../../../../shared/services/aggregation/aggregation-api.service';
import { TestSummaryDto } from '../../../../shared/models/api/aggregation-api.models';

@Component({
  selector: 'gt-test-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, GtTable, KpiRow, FilterRow],
  templateUrl: './test-stats.html',
  styleUrl: './test-stats.scss',
})
export class TestStats implements OnInit {
  private api = inject(AggregationApiService);

  // ── Signals ───────────────────────────────────────────
  kpiRange      = signal<TimeRange>(TimeRange.All);
  funnelRange   = signal<TimeRange>(TimeRange.All);
  perfRange     = signal<TimeRange>(TimeRange.All);
  passFailRange = signal<TimeRange>(TimeRange.All);
  tableRange    = signal<TimeRange>(TimeRange.All);

  trendData     = signal<Record<string, unknown>>({});
  scoreDistData = signal<Record<string, unknown>>({});
  chartOptions  = signal<Record<string, unknown>>({});
  horizOptions  = signal<Record<string, unknown>>({});

  tests             = signal<TestStat[]>([]);
  monthly           = signal<{ month: string; avgScore: number; passRate: number }[]>([]);
  scoreDistribution = signal<{ range: string; count: number }[]>([]);

  // ── Computed ───────────────────────────────────────────

  readonly kpiData       = computed(() => filterByRange(this.tests(), this.kpiRange()));
  readonly funnelData    = computed(() => filterByRange(this.tests(), this.funnelRange()));
  readonly passFailItems = computed(() => filterByRange(this.tests(), this.passFailRange()));
  readonly tableData     = computed(() => filterByRange(this.tests(), this.tableRange()));

  readonly totalParticipants = computed(() =>
    this.kpiData().reduce((sum, t) => sum + t.participants, 0)
  );
  readonly activeCount = computed(() =>
    this.kpiData().filter(t => t.status === StatStatus.Active).length
  );
  readonly avgScore = computed(() => {
    const d = this.kpiData();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.avgScore, 0) / d.length) : 0;
  });
  readonly avgPassRate = computed(() => {
    const d = this.kpiData();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.passRate, 0) / d.length) : 0;
  });
  readonly avgTime = computed(() => {
    const d = this.kpiData();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.avgTimeMin, 0) / d.length) : 0;
  });

  readonly kpiCards = computed<KpiCard[]>(() => {
    const [participants, total, active, score, passRate, time] = TEST_KPI_CONFIG;
    return [
      { ...participants, value: this.totalParticipants()    },
      { ...total,        value: this.kpiData().length       },
      { ...active,       value: this.activeCount()          },
      { ...score,        value: this.avgScore() + '%'       },
      { ...passRate,     value: this.avgPassRate() + '%'    },
      { ...time,         value: this.avgTime() + ' min'     },
    ];
  });

  readonly funnel = computed(() => {
    const data  = this.funnelData();
    const total = data.reduce((sum, t) => sum + t.participants, 0);
    const pass  = data.length ? Math.round(data.reduce((sum, t) => sum + t.passRate, 0) / data.length) : 0;
    return [
      ...FUNNEL_CONFIG.map(s => ({ label: s.label, count: Math.round(total * s.ratio), pct: Math.round(s.ratio * 100) })),
      { label: StatStatus.Passed, count: Math.round(total * pass / 100), pct: pass },
    ];
  });

  readonly passFailChartData = computed(() => {
    const datasets = buildPassFailDatasets(getChartTheme());
    return {
      labels: this.passFailItems().map(t => t.title),
      datasets: [
        { ...datasets[0], data: this.passFailItems().map(t => t.passRate)        },
        { ...datasets[1], data: this.passFailItems().map(t => 100 - t.passRate) },
      ],
    };
  });

  // ── Data ──────────────────────────────────────────────
  readonly columns: TableColumn[] = TEST_TABLE_COLUMNS;
  readonly timeRanges = TIME_RANGE_OPTIONS;

  ngOnInit(): void {
    const theme = getChartTheme();
    this.chartOptions.set(buildChartOptions(theme.textColor, theme.gridColor));
    this.horizOptions.set(buildHorizOptions(theme.textColor, theme.gridColor));

    forkJoin({
      table:       this.api.getTestsTable(),
      performance: this.api.getTestsPerformance(),
    }).subscribe({
      next: ({ table, performance }) => {
        this.tests.set(table.map(item => this.mapTestSummary(item)));

        this.monthly.set(performance.monthlyTrends);

        const sd = performance.scoreDistribution;
        const dist = [
          { range: '0–20%',   count: sd.range0to20   },
          { range: '21–40%',  count: sd.range21to40  },
          { range: '41–60%',  count: sd.range41to60  },
          { range: '61–80%',  count: sd.range61to80  },
          { range: '81–100%', count: sd.range81to100 },
        ];
        this.scoreDistribution.set(dist);

        const trendDatasets = buildTrendDatasets(theme);
        this.trendData.set({
          labels: performance.monthlyTrends.map(m => m.month),
          datasets: [
            { ...trendDatasets[0], data: performance.monthlyTrends.map(m => m.avgScore) },
            { ...trendDatasets[1], data: performance.monthlyTrends.map(m => m.passRate) },
          ],
        });

        this.scoreDistData.set({
          labels: dist.map(s => s.range),
          datasets: [{
            label: StatsLabel.Participants,
            data: dist.map(s => s.count),
            backgroundColor: buildScoreDistColors(theme),
            borderRadius: 8,
            borderSkipped: false,
          }],
        });
      },
    });
  }

  private mapTestSummary(item: TestSummaryDto): TestStat {
    return {
      id:             item.id,
      title:          item.title,
      category:       item.category,
      participants:   item.participants,
      completionRate: item.passRate,
      avgScore:       item.avgScore,
      passRate:       item.passRate,
      avgTimeMin:     item.avgTimeInMinutes,
      status:         item.status === 'closed' ? StatStatus.Passed : StatStatus.Active,
      createdAt:      new Date().toISOString(),
    };
  }

  setKpiRange(r: string)      { this.kpiRange.set(r as TimeRange);      }
  setFunnelRange(r: string)   { this.funnelRange.set(r as TimeRange);   }
  setPerfRange(r: string)     { this.perfRange.set(r as TimeRange);     }
  setPassFailRange(r: string) { this.passFailRange.set(r as TimeRange); }
  setTableRange(r: string)    { this.tableRange.set(r as TimeRange);    }
}
