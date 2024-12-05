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