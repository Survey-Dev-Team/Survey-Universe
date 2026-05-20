import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { TabItem } from '../../shared/components/tabs/tabs';
import { MySurveysTab, CreatedSurveyStatus, PrimeIcon, StatsLabel } from '../../shared/models/enums';

export type KpiCardConfig  = Omit<KpiCard,    'value'>;
export type TabItemConfig   = Omit<TabItem,    'badge'>;

export const MY_SURVEYS_KPI_CONFIG: KpiCardConfig[] = [
  { icon: PrimeIcon.CheckCircle, label: StatsLabel.SurveysCompleted, accent: true },
  { icon: PrimeIcon.Percentage,  label: StatsLabel.AvgCompletionRate              },
  { icon: PrimeIcon.Users,       label: StatsLabel.PeersResponded                 },
  { icon: PrimeIcon.Star,        label: StatsLabel.AvgFeedbackScore               },
];

export const MY_SURVEYS_TAB_CONFIG: TabItemConfig[] = [
  { value: MySurveysTab.Completed, label: 'Surveys I Completed', icon: PrimeIcon.CheckSquare },
  { value: MySurveysTab.AboutMe,   label: 'Responses About Me',  icon: PrimeIcon.Comment     },
  { value: MySurveysTab.Created,   label: 'My Created Surveys',  icon: PrimeIcon.PenToSquare },
];

export const CREATED_STATUS_LABELS: Record<CreatedSurveyStatus, string> = {
  [CreatedSurveyStatus.Draft]:     'Draft',
  [CreatedSurveyStatus.Pending]:   'Pending review',
  [CreatedSurveyStatus.Published]: 'Published',
};
