import { Json } from './json';

export interface SponsorshipWithDetails {
  id: string;
  sponsors: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  children: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
  start_date: string;
  status: string;
  is_anonymous: boolean;
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

export interface SponsorshipRequest {
  id: string;
  child_id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  facebook_url?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_long_term: boolean;
  terms_accepted: boolean;
  created_at: string;
  updated_at?: string;
}