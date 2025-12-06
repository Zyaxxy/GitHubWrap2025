
export interface GitHubStats {
  username: string;
  avatarUrl: string;
  totalHours: number;
  totalCommits: number;
  peakTime: string; // e.g., "14:00"
  peakTimeCategory: 'Vampire' | 'Early Bird' | 'Lunch Breaker' | 'Night Owl';
  topLanguages: { name: string; count: number; fill: string }[];
  commitWords: string[]; // Specific keywords found
  additions: number;
  deletions: number;
  ignoredReviews: number;
  forcePushes: number;
  fridayDeploys: number;
  heaviestRepo: string;
  commitDates: string[];
  archetype: Archetype;
}

export interface Archetype {
  name: string;
  description: string;
  quote: string;
}

export type SlideId =
  | 'intro'
  | 'rhythm'
  | 'languages'
  | 'days-coded'
  | 'trash'
  | 'social'
  | 'danger'
  | 'hoarder'
  | 'friday'
  | 'summary';

export const COLORS = {
  green: '#1DB954',
  rose: '#EE3124',
  pink: '#FFB5B5',
  blue: '#2E77D0',
  white: '#FFFFFF',
  black: '#000000',
  surface: '#121212',
};

export interface SlideProps {
  data: GitHubStats;
  isActive: boolean;
}
