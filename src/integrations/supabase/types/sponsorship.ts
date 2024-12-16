import { Database } from './database';

export interface SponsorshipWithDetails {
  id: string;
  sponsor: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  child: {
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
  };
  sponsorships: Array<{
    id: string;
    child: {
      id: string;
      name: string;
      photo_url: string | null;
      age: number;
    };
  }>;
}

export interface ChildWithSponsorDetails extends Database['public']['Tables']['children']['Row'] {
  sponsor?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface SponsorshipRequest {
  id: string;
  sponsor_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}