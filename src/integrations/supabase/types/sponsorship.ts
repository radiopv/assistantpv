import { Json } from './json';

export interface SponsorshipRequest {
  id: string;
  child_id: string | null;
  email: string;
  facebook_url: string | null;
  full_name: string;
  motivation: string | null;
  phone: string | null;
  status: string;
  terms_accepted: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  city?: string | null;
  is_long_term?: boolean | null;
}

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}