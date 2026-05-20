import { ChartTheme } from '../../../../shared/models/interfaces';
import { PrimeIcon, StatsLabel, SurveyStatField } from '../../../../shared/models/enums';
import { TableColumn, TableColumnType } from '../../../../shared/components/table/table';
import { ROUTES } from '../../../../shared/models/routes.constants';

export const SURVEY_KPI_CONFIG = [
  { icon: PrimeIcon.Users,       label: StatsLabel.TotalParticipants, formatted: true },
  { icon: PrimeIcon.List,        label: StatsLabel.TotalSurveys                       },
  { icon: PrimeIcon.CheckCircle, label: StatsLabel.ActiveSurveys,     accent: true    },
  { icon: PrimeIcon.Percentage,  label: StatsLabel.AvgCompletion                      },
] as const;

export const buildCategoryColors = (theme: ChartTheme) =>
  [theme.accent, theme.cyan, theme.teal, theme.amber, theme.danger];

export const buildSurveyTrendDataset = (theme: ChartTheme) => ({
  label:           StatsLabel.Participants,
  backgroundColor: theme.accentBar,
  borderRadius:    8,
  borderSkipped:   false,
});

export const buildChartOptions = (textColor: string, gridColor: string) => ({
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: { ticks: { color: textColor, maxRotation: 30 }, grid: { color: gridColor } },
    y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true },
  },
  responsive:          true,
  maintainAspectRatio: false,
});

export const buildDoughnutOptions = (textColor: string) => ({
  plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 16 } } },
  responsive:          true,
  maintainAspectRatio: false,
  cutout:              '68%',
});

export const SURVEY_TABLE_COLUMNS: TableColumn[] = [
  { header: StatsLabel.Survey,       field: SurveyStatField.Title,          type: TableColumnType.Link,     basePath: `/${ROUTES.SURVEYS}`, idField: SurveyStatField.Id },
  { header: StatsLabel.Category,     field: SurveyStatField.Category                                                                                                     },
  { header: StatsLabel.Participants, field: SurveyStatField.Participants,   type: TableColumnType.Number                                                                  },
  { header: StatsLabel.Completion,   field: SurveyStatField.CompletionRate, type: TableColumnType.Progress                                                                },
  { header: StatsLabel.Status,       field: SurveyStatField.Status,         type: TableColumnType.Badge                                                                   },
  { header: StatsLabel.Created,      field: SurveyStatField.CreatedAt                                                                                                     },
];
