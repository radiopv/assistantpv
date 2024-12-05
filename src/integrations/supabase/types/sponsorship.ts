export interface SponsorshipRequest {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  phone: string | null;
  motivation: string | null;
  facebook_url: string | null;
  is_long_term: boolean;
  is_one_time: boolean;
  terms_accepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  child_id?: string | null;
}

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  child_id: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'ended';
  is_anonymous: boolean;
  comments: string | null;
  created_at: string;
  updated_at: string;
  auto_terminate_job_id?: string | null;
  termination_date?: string | null;
  termination_reason?: string | null;
  termination_comment?: string | null;
}

export type SponsorshipTables = {
  sponsorship_requests: {
    Row: SponsorshipRequest;
    Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<SponsorshipRequest, 'id'>>;
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
    Insert: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Sponsorship, 'id'>>;
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
};