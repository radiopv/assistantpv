import { Database } from "./base";

export type Sponsorship = {
  id: string;
  child: {
    id: string;
    name: string;
    photo_url: string;
  };
  sponsor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  start_date: string;
  status: string;
};

export type SponsorshipRequest = Database["public"]["Tables"]["sponsorship_requests"]["Row"];
export type SponsorshipType = "long_term" | "one_time";