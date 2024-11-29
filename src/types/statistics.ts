export interface AssistantPerformanceStats {
  assistant_name: string;
  donations_count: number;
  people_helped: number;
  success_rate: number;
}

export interface SponsorshipConversionStats {
  conversion_rate: number;
  avg_duration_days: number;
  active_sponsorships: number;
}

export interface TopCityStats {
  city: string;
  active_sponsorships: number;
}

export interface UrgentNeedsByCityStats {
  city: string;
  urgent_needs_count: number;
  total_needs: number;
  urgent_needs_ratio: number;
}

export interface UserEngagementStats {
  active_sponsors: number;
  inactive_sponsors: number;
  activity_rate: number;
  total_assistants: number;
  cities_coverage: number;
}