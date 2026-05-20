import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { GtTable } from '../../../../shared/components/table/table';
import { KpiRow, KpiCard } from '../../../../shared/components/kpi-row/kpi-row';
import { FilterRow } from '../../../../shared/components/filter-row/filter-row';
import { SurveyStat } from './survey-stats.model';
import { SURVEYS_MOCK, SURVEY_MONTHLY_MOCK } from './survey-stats.mock';
import { TimeRange } from '../../../../shared/models/enums';
import { TIME_RANGE_OPTIONS } from '../../admin-stats.config';
import { SURVEY_KPI_CONFIG, buildCategoryColors, buildSurveyTrendDataset, buildChartOptions, buildDoughnutOptions, SURVEY_TABLE_COLUMNS } from './survey-stats.config';
import { StatStatus } from '../../../../shared/models/enums';
import { filterByRange } from '../../../../shared/utils/stats-filter.util';
import { getChartTheme } from '../../../../shared/utils/chart-theme.util';

@Component({
  selector: 'gt-survey-stats',
  standalone: true,
  imports: [CommonModule, ChartModule, GtTable, KpiRow, FilterRow],
  templateUrl: './survey-stats.html',
  styleUrl: './survey-stats.scss',
})
export class SurveyStats implements OnInit {
  trendData = signal<Record<string, unknown>>({});
  chartOptions = signal<Record<string, unknown>>({});
  doughnutOptions = signal<Record<string, unknown>>({});
  kpiRange = signal<TimeRange>(TimeRange.All);
  chartRange = signal<TimeRange>(TimeRange.All);
  tableRange = signal<TimeRange>(TimeRange.All);

  readonly activeCount = computed(
    () => this.kpiData().filter((s) => s.status === StatStatus.Active).length,
  );
  readonly avgCompletion = computed(() => {
    const d = this.kpiData();
    return d.length ? Math.round(d.reduce((sum, s) => sum + s.completionRate, 0) / d.length) : 0;
  });

  readonly kpiCards = computed<KpiCard[]>(() => {
    const [participants, total, active, completion] = SURVEY_KPI_CONFIG;
    return [
      { ...participants, value: this.totalParticipants()   },
      { ...total,        value: this.kpiData().length      },
      { ...active,       value: this.activeCount()         },
      { ...completion,   value: this.avgCompletion() + '%' },
    ];
  });

  readonly categoryData = computed(() => {
    const catMap: Record<string, number> = {};
    for (const s of this.chartData()) {
      catMap[s.category] = (catMap[s.category] || 0) + s.participants;
    }
    return {
      labels: Object.keys(catMap),
      datasets: [
        {
          data: Object.values(catMap),
          backgroundColor: buildCategoryColors(getChartTheme()),
          hoverOffset: 8,
        },
      ],
    };
  });

  readonly kpiData   = computed(() => filterByRange(this.surveys, this.kpiRange()));
  readonly chartData = computed(() => filterByRange(this.surveys, this.chartRange()));
  readonly tableData = computed(() => filterByRange(this.surveys, this.tableRange()));

  readonly totalParticipants = computed(() =>
    this.kpiData().reduce((sum, s) => sum + s.participants, 0),
  );

  readonly monthly = SURVEY_MONTHLY_MOCK;
  readonly timeRanges = TIME_RANGE_OPTIONS;
  readonly surveys: SurveyStat[] = SURVEYS_MOCK;

  readonly columns = SURVEY_TABLE_COLUMNS;

  setKpiRange(r: string) {
    this.kpiRange.set(r as TimeRange);
  }
  setChartRange(r: string) {
    this.chartRange.set(r as TimeRange);
  }
  setTableRange(r: string) {
    this.tableRange.set(r as TimeRange);
  }

  ngOnInit(): void {
    const theme = getChartTheme();

    this.trendData.set({
      labels:   this.monthly.map(m => m.month),
      datasets: [{ ...buildSurveyTrendDataset(theme), data: this.monthly.map(m => m.participants) }],
    });

    this.chartOptions.set(buildChartOptions(theme.textColor, theme.gridColor));
    this.doughnutOptions.set(buildDoughnutOptions(theme.textColor));
  }
}
