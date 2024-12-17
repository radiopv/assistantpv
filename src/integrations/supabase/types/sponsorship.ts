export interface SponsorshipWithDetails {
  id: string;
  sponsors: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  children: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
}

export interface SponsorshipRequest {
  id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  child_id: string;
  motivation?: string;
  phone?: string;
  city?: string;
  facebook_url?: string;
  is_long_term?: boolean;
}

export type GroupedSponsorship = {
  sponsor: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  sponsorships: Array<{
    id: string;
    child: {
      id: string;
      name: string;
      photo_url: string | null;
      age: number;
    };
  }>;
};