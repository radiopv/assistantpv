import { Database } from "../base";

export interface Sponsorship {
  id: string;
  child_id: string;
  sponsor_id: string;
  start_date: string;
  end_date?: string;
  status: "active" | "pending" | "ended";
  created_at?: string;
  updated_at?: string;
}

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