export interface StatisticsData {
  total_donations: number;
  total_children: number;
  total_sponsors: number;
  active_sponsorships: number;
  pending_sponsorships: number;
  monthly_trends?: Array<{
    donation_date: string;
  }>;
  city_distribution?: Array<{
    city: string;
    count: number;
  }>;
}

export interface DashboardStats {
  urgent_needs: Array<{
    child_id: string;
    child_name: string;
    needs: Array<{
      category: string;
      description?: string;
    }>;
  }>;
}