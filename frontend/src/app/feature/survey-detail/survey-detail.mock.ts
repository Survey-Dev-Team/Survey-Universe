import { StatStatus } from '../../shared/models/enums';

export interface SurveyData {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  status: StatStatus;
  description: string;
  about: string;
  questionsCount: number;
  estimatedTime: string;
  activeUntil: string;
  author: string;
  authorAvatar: string;
  participants: number;
}

export const SURVEY_DETAIL_MOCK: SurveyData[] = [
  {
    id: '1',
    title: 'Explore the Unknown',
    coverImage: '/assets/images/banner/card1.png',
    category: 'Science',
    status: StatStatus.Active,
    description: 'Take a short journey through questions about space, discovery and the limits of human knowledge.',
    about: 'This survey explores how people think about unknown worlds, future discoveries, scientific progress and cosmic uncertainty. Your answers will help shape a better understanding of how different people imagine the future.',
    questionsCount: 7,
    estimatedTime: '3–5 min',
    activeUntil: 'May 15, 2025',
    author: 'Alex Monroe',
    authorAvatar: '',
    participants: 1245,
  },
  {
    id: '2',
    title: 'Cosmic Perspective Check',
    coverImage: '/assets/images/banner/card2.png',
    category: 'Philosophy',
    status: StatStatus.Active,
    description: 'Reflect on your place in the universe through a series of thought-provoking questions.',
    about: 'A philosophical exploration of how humans position themselves in the vast cosmos. This survey gathers diverse perspectives on existence, meaning, and our collective future.',
    questionsCount: 10,
    estimatedTime: '5 min',
    activeUntil: 'Anonymous survey',
    author: 'Lena Oris',
    authorAvatar: '',
    participants: 873,
  },
  {
    id: '3',
    title: 'Signal from the Crowd',
    coverImage: '/assets/images/banner/card3.png',
    category: 'Society',
    status: StatStatus.Passed,
    description: 'Quick pulse-check on social dynamics and collective behavior patterns.',
    about: 'Society shapes us in ways we rarely notice. This survey digs into attitudes about community, cooperation, and the signals we send each other as members of a shared world.',
    questionsCount: 4,
    estimatedTime: '2 min',
    activeUntil: 'June 1, 2025',
    author: 'Mark Vega',
    authorAvatar: '',
    participants: 2104,
  },
];
