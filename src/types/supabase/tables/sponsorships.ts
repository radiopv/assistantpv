import { Database } from "../base";

export type Sponsorship = Database["public"]["Tables"]["sponsorships"]["Row"];

export interface SponsorshipWithDetails extends Sponsorship {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
  };
  sponsor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export type SponsorshipRequest = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city: string;
  facebook_url?: string;
  motivation?: string;
  sponsorship_type: 'long_term' | 'one_time';
  status: 'pending' | 'approved' | 'rejected';
  terms_accepted: boolean;
  created_at?: string;
  updated_at?: string;
};