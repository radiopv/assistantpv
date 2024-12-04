export interface DashboardStats {
  children: {
    total: number;
    sponsored: number;
    available: number;
    urgent_needs: number;
  };
  sponsors: number;
  donations: {
    total: number;
    people_helped: number;
  };
  cities: number;
}

export interface SponsorshipStats {
  conversion_rate: number;
  avg_duration_days: number;
  active_sponsorships: number;
}

export interface UserEngagementStats {
  activity_rate: number;
  active_sponsors: number;
  inactive_sponsors: number;
  total_assistants: number;
  cities_coverage: number;
}

export interface AssistantPerformanceStats {
  assistant_name: string;
  donations_count: number;
  people_helped: number;
  success_rate: number;
}