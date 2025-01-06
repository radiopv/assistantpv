import type { SupabaseClient } from '@supabase/supabase-js';
import { SponsorshipRequestTable } from './tables/sponsorship-requests';
import { ChildrenTable } from './tables/children';
import { SponsorsTable } from './tables/sponsors';
import { SponsorshipsTable } from './tables/sponsorships';
import { AlbumMediaTable } from './tables/album-media';
import { TestimonialsTable } from './tables/testimonials';
import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';

export interface Database {
  public: {
    Tables: {
      sponsorship_requests: SponsorshipRequestTable;
      children: ChildrenTable;
      sponsors: SponsorsTable;
      sponsorships: SponsorshipsTable;
      album_media: AlbumMediaTable;
      testimonials: TestimonialsTable;
      child_assignment_requests: ChildAssignmentRequestTable;
    };
  };
}

export type SupabaseClientType = SupabaseClient<Database>;