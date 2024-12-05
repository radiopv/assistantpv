import { Database } from "../base";

export type Sponsorship = Database["public"]["Tables"]["sponsorships"]["Row"];
export type SponsorshipInsert = Database["public"]["Tables"]["sponsorships"]["Insert"];
export type SponsorshipUpdate = Database["public"]["Tables"]["sponsorships"]["Update"];

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