import { ChartTheme } from '../../../../shared/models/interfaces';
import { PrimeIcon, StatsLabel, StatStatus, TestStatField } from '../../../../shared/models/enums';
import { TableColumn, TableColumnType } from '../../../../shared/components/table/table';
import { ROUTES } from '../../../../shared/models/routes.constants';

export const TEST_KPI_CONFIG = [
  { icon: PrimeIcon.Users,       label: StatsLabel.TotalParticipants, formatted: true },
  { icon: PrimeIcon.Pencil,      label: StatsLabel.TotalTests                         },
  { icon: PrimeIcon.CheckCircle, label: StatsLabel.ActiveTests,       accent: true    },
  { icon: PrimeIcon.Star,        label: StatsLabel.AvgScore                           },
  { icon: PrimeIcon.Trophy,      label: StatsLabel.AvgPassRate                        },
  { icon: PrimeIcon.Clock,       label: StatsLabel.AvgTime                            },
];

export const buildTrendDatasets = (theme: ChartTheme) => [
  { label: StatsLabel.AvgScore, fill: true, tension: 0.4, borderColor: theme.accent,   backgroundColor: theme.accentAlpha,  pointBackgroundColor: theme.accent,   pointRadius: 4 },
  { label: StatsLabel.PassRate, fill: true, tension: 0.4, borderColor: theme.success,  backgroundColor: theme.successAlpha, pointBackgroundColor: theme.success,  pointRadius: 4 },
];

export const buildPassFailDatasets = (theme: ChartTheme) => [
  { label: StatStatus.Passed, backgroundColor: theme.pass, borderRadius: 6 },
  { label: StatStatus.Failed, backgroundColor: theme.fail, borderRadius: 6 },
];

export const FUNNEL_CONFIG = [
  { label: StatsLabel.Started,   ratio: 1.00 },
  { label: StatsLabel.Reached50, ratio: 0.82 },
  { label: StatsLabel.Completed, ratio: 0.74 },
];

export const buildScoreDistColors = (theme: ChartTheme) =>
  [theme.danger, theme.orange, theme.yellow, theme.success, theme.accent];

export const buildChartOptions = (textColor: string, gridColor: string) => ({
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: { ticks: { color: textColor, maxRotation: 30 }, grid: { color: gridColor } },
    y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true },
  },
  responsive: true,
  maintainAspectRatio: false,
});

export const buildHorizOptions = (textColor: string, gridColor: string) => ({
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

export const TEST_TABLE_COLUMNS: TableColumn[] = [
  { header: StatsLabel.Test,         field: TestStatField.Title,       type: TableColumnType.Link,     basePath: `/${ROUTES.SURVEYS}`, idField: TestStatField.Id },
  { header: StatsLabel.Category,     field: TestStatField.Category                                                                                                },
  { header: StatsLabel.Participants, field: TestStatField.Participants, type: TableColumnType.Number                                                             },
  { header: StatsLabel.AvgScore,     field: TestStatField.AvgScore,    type: TableColumnType.Score                                                               },
  { header: StatsLabel.PassRate,     field: TestStatField.PassRate,    type: TableColumnType.Progress                                                            },
  { header: StatsLabel.AvgTime,      field: TestStatField.AvgTimeMin,  type: TableColumnType.Suffix,   suffix: 'min'                                            },
  { header: StatsLabel.Status,       field: TestStatField.Status,      type: TableColumnType.Badge                                                               },
];
