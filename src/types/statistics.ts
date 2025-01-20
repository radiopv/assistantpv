export interface SponsorshipConversionStats {
  conversion_rate: number;
  avg_duration_days: number;
  active_sponsorships: number;
  pending_sponsorships?: number;
  total_donations?: number;
  total_children?: number;
  sponsored_children?: number;
  total_sponsors?: number;
  total_people_helped?: number;
  monthly_trends?: any[];
  city_distribution?: any[];
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