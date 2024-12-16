export interface SponsorshipWithDetails {
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

export interface SponsorshipRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  motivation: string;
  facebook_url?: string;
  is_long_term: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}
