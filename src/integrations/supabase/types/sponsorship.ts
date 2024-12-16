import { Database } from './database';

export interface Sponsorship {
  id: string;
  sponsor_id: string | null;
  child_id: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  is_anonymous: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  comments: string | null;
}

export interface SponsorshipWithDetails extends Sponsorship {
  sponsors: {
    name: string;
    email: string | null;
    photo_url: string | null;
  } | null;
  children: {
    name: string;
    photo_url: string | null;
    age: number;
  } | null;
}

export type SponsorshipTables = {
  sponsorships: {
    Row: Sponsorship;
    Insert: Partial<Sponsorship>;
    Update: Partial<Sponsorship>;
  };
};