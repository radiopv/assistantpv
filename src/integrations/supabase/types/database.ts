import type { SupabaseClient } from '@supabase/supabase-js';
import { SponsorshipRequestsTable } from './tables/sponsorship-requests';
import { ChildrenTable } from './tables/children';
import { SponsorsTable } from './tables/sponsors';
import { SponsorshipsTable } from './tables/sponsorships';
import { AlbumMediaTable } from './tables/album-media';
import { TestimonialsTable } from './tables/testimonials';

export interface Database {
  public: {
    Tables: {
      sponsorship_requests: SponsorshipRequestsTable;
      children: ChildrenTable;
      sponsors: SponsorsTable;
      sponsorships: SponsorshipsTable;
      album_media: AlbumMediaTable;
      testimonials: TestimonialsTable;
    };
  };
}

export type SupabaseClientType = SupabaseClient<Database>;