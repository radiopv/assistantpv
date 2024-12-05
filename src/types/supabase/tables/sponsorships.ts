import { Database } from "../base";

export interface Sponsorship {
  id: string;
  child_id: string;
  sponsor_id: string;
  start_date: string;
  end_date?: string | null;
  status: "active" | "pending" | "ended";
  created_at?: string;
  updated_at?: string;
}

export type SponsorshipRow = Database["public"]["Tables"]["sponsorships"]["Row"];
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