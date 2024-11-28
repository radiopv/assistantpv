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