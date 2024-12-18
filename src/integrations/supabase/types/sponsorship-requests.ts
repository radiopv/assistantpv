export interface SponsorshipRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  motivation?: string;
  phone?: string;
  facebook_url?: string;
  terms_accepted: boolean;
  city?: string;
  is_long_term?: boolean;
}