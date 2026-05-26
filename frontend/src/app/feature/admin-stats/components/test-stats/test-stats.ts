import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { GtTable, TableColumn } from '../../../../shared/components/table/table';
import { KpiRow, KpiCard } from '../../../../shared/components/kpi-row/kpi-row';
import { FilterRow } from '../../../../shared/components/filter-row/filter-row';
import { TestStat } from './test-stats.model';
import { TimeRange, StatsLabel, StatStatus } from '../../../../shared/models/enums';
import { TIME_RANGE_OPTIONS } from '../../admin-stats.config';
import { TEST_KPI_CONFIG, TEST_TABLE_COLUMNS, buildTrendDatasets, buildScoreDistColors, buildChartOptions, buildHorizOptions } from './test-stats.config';
import { getChartTheme } from '../../../../shared/utils/chart-theme.util';
import { AggregationApiService } from '../../../../shared/services/aggregation/aggregation-api.service';
import { TestSummaryDto, FunnelStepDto } from '../../../../shared/models/api/aggregation-api.models';

@Component({
  selector: 'gt-test-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, GtTable, KpiRow, FilterRow],
  templateUrl: './test-stats.html',
  styleUrl: './test-stats.scss',
})
export class TestStats implements OnInit {
  private api = inject(AggregationApiService);

  // ── Range signals ─────────────────────────────────────────────────────────
  kpiRange    = signal<TimeRange>(TimeRange.All);
  funnelRange = signal<TimeRange>(TimeRange.All);
  perfRange   = signal<TimeRange>(TimeRange.All);
  tableRange  = signal<TimeRange>(TimeRange.All);

  // ── Per-section data signals ──────────────────────────────────────────────
  kpiTests          = signal<TestStat[]>([]);
  tableTests        = signal<TestStat[]>([]);
  funnelSteps       = signal<FunnelStepDto[]>([]);
  monthly           = signal<{ month: string; avgScore: number; passRate: number }[]>([]);
  scoreDistribution = signal<{ range: string; count: number }[]>([]);
  scoreDistData     = signal<Record<string, unknown>>({});
  chartOptions      = signal<Record<string, unknown>>({});
  horizOptions      = signal<Record<string, unknown>>({});

  constructor() {
    effect(() => {
      this.api.getTestsFunnel(this.funnelRange()).subscribe(data =>
        this.funnelSteps.set(data.steps)
      );
    });

    effect(() => {
      this.api.getTestsTable(this.kpiRange()).subscribe(data =>
        this.kpiTests.set(data.map(item => this.mapTestSummary(item)))
      );
    });

    effect(() => {
      const theme = getChartTheme();
      this.api.getTestsPerformance(this.perfRange()).subscribe(data => {
        this.monthly.set(data.monthlyTrends);
        const sd = data.scoreDistribution;
        const dist = [
          { range: '0–20%',   count: sd.range0to20   },
          { range: '21–40%',  count: sd.range21to40  },
          { range: '41–60%',  count: sd.range41to60  },
          { range: '61–80%',  count: sd.range61to80  },
          { range: '81–100%', count: sd.range81to100 },
        ];
        this.scoreDistribution.set(dist);
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
      });
    });

    effect(() => {
      this.api.getTestsTable(this.tableRange()).subscribe(data =>
        this.tableTests.set(data.map(item => this.mapTestSummary(item)))
      );
    });
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly trendData = computed(() => {
    const m = this.monthly();
    const trendDatasets = buildTrendDatasets(getChartTheme());
    return {
      labels: m.map(x => x.month),
      datasets: [
        { ...trendDatasets[0], data: m.map(x => x.avgScore) },
        { ...trendDatasets[1], data: m.map(x => x.passRate) },
      ],
    };
  });

  readonly totalParticipants = computed(() =>
    this.kpiTests().reduce((sum, t) => sum + t.participants, 0)
  );
  readonly activeCount = computed(() =>
    this.kpiTests().filter(t => t.status === StatStatus.Active).length
  );
  readonly avgScore = computed(() => {
    const d = this.kpiTests();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.avgScore, 0) / d.length) : 0;
  });
  readonly avgPassRate = computed(() => {
    const d = this.kpiTests();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.passRate, 0) / d.length) : 0;
  });
  readonly avgTime = computed(() => {
    const d = this.kpiTests();
    return d.length ? Math.round(d.reduce((sum, t) => sum + t.avgTimeMin, 0) / d.length) : 0;
  });

  readonly kpiCards = computed<KpiCard[]>(() => {
    const [participants, total, active, score, passRate, time] = TEST_KPI_CONFIG;
    return [
      { ...participants, value: this.totalParticipants() },
      { ...total,        value: this.kpiTests().length   },
      { ...active,       value: this.activeCount()       },
      { ...score,        value: this.avgScore()          },
      { ...passRate,     value: this.avgPassRate()       },
      { ...time,         value: this.avgTime()           },
    ];
  });

  readonly funnel = computed(() =>
    this.funnelSteps().map(s => ({ label: s.stage, count: s.count, pct: Math.round(s.percentage) }))
  );

  readonly tableData = computed(() => this.tableTests());

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly columns: TableColumn[] = TEST_TABLE_COLUMNS;
  readonly timeRanges = TIME_RANGE_OPTIONS;

  ngOnInit(): void {
    const theme = getChartTheme();
    this.chartOptions.set(buildChartOptions(theme.textColor, theme.gridColor));
    this.horizOptions.set(buildHorizOptions(theme.textColor, theme.gridColor));
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
      status:         item.status?.toLowerCase() === 'closed' ? StatStatus.Passed : StatStatus.Active,
      createdAt:      new Date().toISOString(),
    };
  }

  setKpiRange(r: string)    { this.kpiRange.set(r as TimeRange);    }
  setFunnelRange(r: string) { this.funnelRange.set(r as TimeRange); }
  setPerfRange(r: string)   { this.perfRange.set(r as TimeRange);   }
  setTableRange(r: string)  { this.tableRange.set(r as TimeRange);  }
}
