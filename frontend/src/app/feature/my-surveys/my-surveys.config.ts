import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { TabItem } from '../../shared/components/tabs/tabs';
import { MySurveysTab, CreatedSurveyStatus, PrimeIcon, StatsLabel } from '../../shared/models/enums';

export type KpiCardConfig  = Omit<KpiCard,    'value'>;
export type TabItemConfig   = Omit<TabItem,    'badge'>;

export const MY_SURVEYS_KPI_CONFIG: KpiCardConfig[] = [
  { icon: PrimeIcon.CheckCircle, label: StatsLabel.SurveysCompleted, accent: true },
  { icon: PrimeIcon.Percentage,  label: StatsLabel.AvgCompletionRate              },
];

export const MY_SURVEYS_TAB_CONFIG: TabItemConfig[] = [
  { value: MySurveysTab.Completed, label: 'Surveys I Completed', icon: PrimeIcon.CheckSquare },
  { value: MySurveysTab.Stats,     label: 'Survey Statistics',   icon: PrimeIcon.ChartBar    },
  { value: MySurveysTab.Created,   label: 'My Created Surveys',  icon: PrimeIcon.PenToSquare },
];

export const CREATED_STATUS_LABELS: Record<CreatedSurveyStatus, string> = {
  [CreatedSurveyStatus.Draft]:     'Draft',
  [CreatedSurveyStatus.Pending]:   'Pending review',
  [CreatedSurveyStatus.Published]: 'Published',
  [CreatedSurveyStatus.Closed]:    'Closed',
};
