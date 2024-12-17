export interface SponsorshipRequest {
  id: string;
  child_id: string | null;
  requester_email: string;
  name: string;
  email: string;
  full_name: string;
  phone?: string | null;
  facebook_url?: string | null;
  motivation?: string | null;
  status: string;
  terms_accepted: boolean;
  created_at?: string;
  updated_at?: string;
  city?: string | null;
  is_long_term?: boolean | null;
}

export interface SponsorshipRequestTable {
  Row: SponsorshipRequest;
  Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<SponsorshipRequest>;
}