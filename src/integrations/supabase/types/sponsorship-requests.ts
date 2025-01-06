import { RequestStatus } from './request-status';

export interface SponsorshipRequest {
  id: string;
  child_id: string;
  email: string;
  full_name: string;
  facebook_url?: string;
  phone?: string;
  motivation?: string;
  status: RequestStatus;
  terms_accepted: boolean;
  created_at: string;
  updated_at?: string;
  city?: string;
  is_long_term?: boolean;
}

export interface SponsorshipRequestTable {
  Row: SponsorshipRequest;
  Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<SponsorshipRequest>;
}