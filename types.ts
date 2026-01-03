export enum ViewState {
  STRATEGY = 'STRATEGY',
  SIMULATOR = 'SIMULATOR',
  TRENDS = 'TRENDS',
  AI_MONETIZATION = 'AI_MONETIZATION',
  SAVED_IDEAS = 'SAVED_IDEAS',
  COMMUNITY = 'COMMUNITY'
}

export interface RevenueData {
  month: number;
  revenue: number;
  users: number;
  expenses: number;
}

export interface SimulationParams {
  acquisitionRate: number; // Users per month
  churnRate: number; // Percentage per month
  conversionRate: number; // Percentage of free users converting to paid
  arpu: number; // Average Revenue Per User (or Price)
  initialUsers: number;
  months: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface SavedIdea {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CommunityMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  avatarColor?: string;
}