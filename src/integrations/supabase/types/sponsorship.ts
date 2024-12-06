export interface SponsorshipRequest {
  child_id: string | null;
  created_at: string | null;
  email: string;
  facebook_url: string | null;
  full_name: string;
  id: string;
  motivation: string | null;
  phone: string | null;
  status: string;
  terms_accepted: boolean;
  updated_at: string | null;
  city: string | null;
  is_long_term: boolean | null;
  is_one_time?: boolean | null;
}

export type SponsorshipTables = {
  sponsorship_requests: {
    Row: SponsorshipRequest;
    Insert: Partial<SponsorshipRequest> & Pick<SponsorshipRequest, 'email' | 'full_name' | 'status'>;
    Update: Partial<SponsorshipRequest>;
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
};