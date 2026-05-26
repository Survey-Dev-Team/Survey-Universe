import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { GtTable } from '../../../../shared/components/table/table';
import { KpiRow, KpiCard } from '../../../../shared/components/kpi-row/kpi-row';
import { FilterRow } from '../../../../shared/components/filter-row/filter-row';
import { SurveyStat } from './survey-stats.model';
import { TimeRange, StatStatus } from '../../../../shared/models/enums';
import { TIME_RANGE_OPTIONS } from '../../admin-stats.config';
import { SURVEY_KPI_CONFIG, buildCategoryColors, buildSurveyTrendDataset, buildChartOptions, buildDoughnutOptions, SURVEY_TABLE_COLUMNS } from './survey-stats.config';
import { getChartTheme } from '../../../../shared/utils/chart-theme.util';
import { AggregationApiService } from '../../../../shared/services/aggregation/aggregation-api.service';
import { SurveyTableItemDto } from '../../../../shared/models/api/aggregation-api.models';

@Component({
  selector: 'gt-survey-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, GtTable, KpiRow, FilterRow],
  templateUrl: './survey-stats.html',
  styleUrl: './survey-stats.scss',
})
export class SurveyStats implements OnInit {
  private api = inject(AggregationApiService);

  chartOptions    = signal<Record<string, unknown>>({});
  doughnutOptions = signal<Record<string, unknown>>({});

  kpiRange   = signal<TimeRange>(TimeRange.All);
  chartRange = signal<TimeRange>(TimeRange.All);
  tableRange = signal<TimeRange>(TimeRange.All);

  // ── Per-section data signals ───────────────────────────────────────────────
  kpiSurveys   = signal<SurveyStat[]>([]);
  tableSurveys = signal<SurveyStat[]>([]);
  monthly      = signal<{ month: string; participants: number }[]>([]);
  categoryByName = signal<Record<string, number>>({});

  constructor() {
    effect(() => {
      this.api.getSurveysTable(this.kpiRange()).subscribe(data =>
        this.kpiSurveys.set(data.map(item => this.mapItem(item)))
      );
    });

    effect(() => {
      this.api.getSurveysActivity(this.chartRange()).subscribe(data => {
        this.monthly.set(
          Object.entries(data.participantsByMonth).map(([month, participants]) => ({ month, participants }))
        );
        this.categoryByName.set(data.surveysByCategory);
      });
    });

    effect(() => {
      this.api.getSurveysTable(this.tableRange()).subscribe(data =>
        this.tableSurveys.set(data.map(item => this.mapItem(item)))
      );
    });
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly activeCount = computed(() =>
    this.kpiSurveys().filter(s => s.status === StatStatus.Active).length
  );
  readonly avgCompletion = computed(() => {
    const d = this.kpiSurveys();
    return d.length ? Math.round(d.reduce((sum, s) => sum + s.completionRate, 0) / d.length) : 0;
  });
  readonly totalParticipants = computed(() =>
    this.kpiSurveys().reduce((sum, s) => sum + s.participants, 0)
  );

  readonly kpiCards = computed<KpiCard[]>(() => {
    const [participants, total, active, completion] = SURVEY_KPI_CONFIG;
    return [
      { ...participants, value: this.totalParticipants()      },
      { ...total,        value: this.kpiSurveys().length      },
      { ...active,       value: this.activeCount()            },
      { ...completion,   value: this.avgCompletion()          },
    ];
  });

  readonly categoryData = computed(() => {
    const catMap = this.categoryByName();
    return {
      labels: Object.keys(catMap),
      datasets: [{
        data: Object.values(catMap),
        backgroundColor: buildCategoryColors(getChartTheme()),
        hoverOffset: 8,
      }],
    };
  });

  readonly trendData = computed(() => {
    const m = this.monthly();
    return {
      labels:   m.map(x => x.month),
      datasets: [{ ...buildSurveyTrendDataset(getChartTheme()), data: m.map(x => x.participants) }],
    };
  });

  readonly tableData = computed(() => this.tableSurveys());

  readonly timeRanges = TIME_RANGE_OPTIONS;
  readonly columns    = SURVEY_TABLE_COLUMNS;

  setKpiRange(r: string)   { this.kpiRange.set(r as TimeRange);   }
  setChartRange(r: string) { this.chartRange.set(r as TimeRange); }
  setTableRange(r: string) { this.tableRange.set(r as TimeRange); }

  ngOnInit(): void {
    const theme = getChartTheme();
    this.chartOptions.set(buildChartOptions(theme.textColor, theme.gridColor));
    this.doughnutOptions.set(buildDoughnutOptions(theme.textColor));
  }

  private mapItem(item: SurveyTableItemDto): SurveyStat {
    return {
      id:             item.title,
      title:          item.title,
      category:       item.categories[0] ?? '',
      participants:   item.participants,
      completionRate: item.completionRate,
      status:         item.status?.toLowerCase() === 'closed' ? StatStatus.Passed : StatStatus.Active,
      createdAt:      item.createdDate,
    };
  }
}
