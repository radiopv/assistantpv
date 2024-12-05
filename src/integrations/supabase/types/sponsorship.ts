export interface SponsorshipRequest {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  facebook_url: string;
  motivation: string;
  terms_accepted: boolean;
  is_long_term: boolean;
  is_one_time: boolean;
  status: string;
  child_id: string;
}

export interface Sponsorship {
  id: string;
  created_at: string;
  updated_at: string;
  sponsor_id: string;
  child_id: string;
  start_date: string;
  end_date: string;
  status: string;
  is_anonymous: boolean;
  comments: string;
  termination_reason: string;
  termination_date: string;
  auto_terminate_job_id: string;
}

export interface SponsorshipTables {
  sponsorship_requests: {
    Row: SponsorshipRequest;
    Insert: Omit<SponsorshipRequest, "id" | "created_at" | "updated_at">;
    Update: Partial<Omit<SponsorshipRequest, "id">>;
    Relationships: [
      {
        foreignKeyName: "sponsorship_requests_child_id_fkey";
        columns: ["child_id"];
        isOneToOne: false;
        referencedRelation: "children";
        referencedColumns: ["id"];
      }
    ];
  };
  sponsorships: {
    Row: Sponsorship;
    Insert: Omit<Sponsorship, "id" | "created_at" | "updated_at">;
    Update: Partial<Omit<Sponsorship, "id">>;
    Relationships: [
      {
        foreignKeyName: "sponsorships_child_id_fkey";
        columns: ["child_id"];
        isOneToOne: false;
        referencedRelation: "children";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "sponsorships_sponsor_id_fkey";
        columns: ["sponsor_id"];
        isOneToOne: false;
        referencedRelation: "sponsors";
        referencedColumns: ["id"];
      }
    ];
  };
}