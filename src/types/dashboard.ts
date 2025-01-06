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
  urgent_needs: Array<{
    child_id: string;
    child_name: string;
    needs: Array<{
      category: string;
      description?: string;
      is_urgent: boolean;
    }>;
  }>;
}

export interface DashboardResponse {
  data: DashboardStats;
}