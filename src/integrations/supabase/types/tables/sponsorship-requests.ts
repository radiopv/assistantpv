import { RequestStatus } from "../request-status";

export interface SponsorshipRequestTable {
  Row: {
    id: string;
    child_id: string;
    email: string;
    facebook_url: string | null;
    full_name: string;
    motivation: string | null;
    phone: string | null;
    status: RequestStatus;
    terms_accepted: boolean;
    created_at: string;
    updated_at: string | null;
    city: string | null;
    is_long_term: boolean | null;
  };
  Insert: Omit<SponsorshipRequestTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: Partial<SponsorshipRequestTable["Row"]>;
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

export type SponsorshipRequest = SponsorshipRequestTable["Row"];