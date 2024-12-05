import { Database } from "../base";

export type Sponsorship = Database["public"]["Tables"]["sponsorships"]["Row"];

export interface SponsorshipWithDetails extends Sponsorship {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
  };
  sponsor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export type SponsorshipRequest = Database["public"]["Tables"]["sponsorship_requests"]["Row"];