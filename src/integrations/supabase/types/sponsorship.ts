export interface SponsorshipRequest {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  phone: string | null;
  motivation: string | null;
  facebook_url: string | null;
  is_long_term: boolean;
  is_one_time: boolean;
  terms_accepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  child_id: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'ended';
  is_anonymous: boolean;
  comments: string | null;
  created_at: string;
  updated_at: string;
}