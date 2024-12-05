import { SponsorshipRequest, Sponsorship } from './sponsorship';

export interface DatabaseTables {
  sponsorship_requests: {
    Row: SponsorshipRequest;
    Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<SponsorshipRequest, 'id'>>;
  };
  sponsorships: {
    Row: Sponsorship;
    Insert: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Sponsorship, 'id'>>;
  };
}