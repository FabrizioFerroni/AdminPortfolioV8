export interface DashboardSummaryDto {
  totalProjects: number;
  totalSubscribers: number;
  totalMessages: number;
  totalViews: number;
}

export interface DashboardMonthlySummaryDto {
  newProjects: number;
  newSubscribers: number;
  newMessages: number;
  newViews: number;
  growthRate: number;
}

export interface AnalyticsResponse {
  data: AnalyticsData[];
  total: number;
  percentageChange: number;
}

export interface AnalyticsData {
  date: string;
  views: number;
}
