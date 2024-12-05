export interface ScheduledVisit {
  id: string;
  sponsorship_id: string;
  visit_start_date: string | null;
  visit_end_date: string | null;
  wants_to_visit_child: boolean;
  wants_donation_pickup: boolean;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  sponsorships: {
    sponsors: {
      name: string;
      email: string;
    };
    children: {
      name: string;
      city: string;
    };
  };
}