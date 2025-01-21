export interface SponsorshipConversionStats {
  conversion_rate: number;
  avg_duration_days: number;
  active_sponsorships: number;
}

export interface TopCityStats {
  city: string;
  active_sponsorships: number;
}

export interface UserEngagementStats {
  active_sponsors: number;
  activity_rate: number;
  total_assistants: number;
  cities_coverage: number;
}