import { ChildrenTable } from './tables/children';
import { SponsorsTable } from './tables/sponsors';
import { SponsorshipsTable } from './tables/sponsorships';
import { SponsorshipRequestTable } from './tables/sponsorship-requests';
import { AlbumMediaTable } from './tables/album-media';
import { TestimonialsTable } from './tables/testimonials';
import { ChildAssignmentRequestsTable } from './tables/child-assignment-requests';

export interface Database {
  public: {
    Tables: {
      children: ChildrenTable;
      sponsors: SponsorsTable;
      sponsorships: SponsorshipsTable;
      sponsorship_requests: SponsorshipRequestTable;
      album_media: AlbumMediaTable;
      testimonials: TestimonialsTable;
      child_assignment_requests: ChildAssignmentRequestsTable;
    };
  };
}