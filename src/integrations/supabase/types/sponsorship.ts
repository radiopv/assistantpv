import { Json } from './json';

export interface SponsorshipRequest {
  id: string;
  child_id: string;
  email: string;
  full_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  motivation?: string;
  phone?: string;
  facebook_url?: string;
  terms_accepted: boolean;
  city?: string;
  is_long_term?: boolean;
}

export interface SponsorshipWithDetails {
  id: string;
  sponsor_id: string;
  child_id: string;
  start_date: string;
  status: string;
  is_anonymous: boolean;
  sponsors: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
    is_active: boolean;
  };
  children: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
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