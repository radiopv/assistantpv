export interface SponsorshipRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  email: string;
  phone?: string;
  facebook_url?: string;
  motivation?: string;
  status: string;
  terms_accepted: boolean;
  created_at?: string;
  updated_at?: string;
  city?: string;
  is_long_term?: boolean;
}

export interface SponsorshipRequestTable {
  Row: SponsorshipRequest;
  Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<SponsorshipRequest>;
}