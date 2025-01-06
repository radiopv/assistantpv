export interface SponsorshipRequest {
  id: string;
  child_id: string;
  email: string;
  full_name: string;
  phone: string;
  facebook_url: string;
  motivation: string;
  city: string;
  status: 'pending' | 'approved' | 'rejected';
  terms_accepted: boolean;
  is_long_term: boolean;
  created_at: string;
  updated_at: string;
}

export interface SponsorshipWithDetails {
  id: string;
  sponsor_id: string;
  child_id: string;
  status: string;
  start_date: string;
  end_date?: string;
  sponsors: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
    is_active: boolean;
  };
  children: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
}

export interface GroupedSponsorship {
  sponsor: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
    is_active: boolean;
  };
  sponsorships: Array<{
    id: string;
    child: {
      id: string;
      name: string;
      photo_url: string | null;
      age: number;
    };
    start_date: string;
    status: string;
  }>;
}