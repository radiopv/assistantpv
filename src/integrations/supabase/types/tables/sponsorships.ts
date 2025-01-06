export interface SponsorshipsTable {
  Row: {
    id: string;
    sponsor_id: string | null;
    child_id: string | null;
    start_date: string;
    end_date: string | null;
    status: string;
    comments: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<SponsorshipsTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<SponsorshipsTable["Row"]>;
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
}

export type Sponsorship = SponsorshipsTable["Row"];