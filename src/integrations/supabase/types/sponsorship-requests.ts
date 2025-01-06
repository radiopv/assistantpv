export interface SponsorshipRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  email: string;
  facebook_url?: string;
  phone?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected';
  terms_accepted: boolean;
  created_at: string;
  updated_at?: string;
  city?: string;
  is_long_term?: boolean;
}

export interface SponsorshipRequestTable {
  Row: SponsorshipRequest;
  Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at'>;
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
}