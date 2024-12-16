import { Children } from './children';
import { Sponsor } from './sponsor';

export interface SponsorshipWithDetails {
  id: string;
  sponsor: Sponsor['Row'];
  child: Children['Row'];
  start_date: string;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GroupedSponsorship {
  sponsor: Sponsor['Row'];
  sponsorships: Array<{
    id: string;
    child: Children['Row'];
  }>;
}

export interface ChildWithSponsorDetails extends Children['Row'] {
  sponsor: Sponsor['Row'] | null;
}

export interface SponsorshipRequest {
  id: string;
  sponsor_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  motivation?: string;
  is_long_term: boolean;
  facebook_url?: string;
}