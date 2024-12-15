import { Database } from './database';

export type SponsorshipWithDetails = Database['public']['Tables']['sponsorships']['Row'] & {
  sponsors: {
    name: string;
    email: string;
    photo_url: string | null;
  };
  children: {
    name: string;
    photo_url: string | null;
    age: number;
  };
};

export type GroupedSponsorship = {
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
};