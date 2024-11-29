export interface SponsorshipRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  facebook_url: string | null;
  motivation: string | null;
  child_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  terms_accepted: boolean;
  created_at: string;
  updated_at: string;
  children?: {
    name: string;
    age: number;
    city: string | null;
  } | null;
}