export interface Sponsorship {
  id: string;
  sponsor_id: string | null;
  child_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  termination_date: string | null;
  termination_reason: string | null;
  termination_comment: string | null;
}

export type SponsorshipTables = {
  sponsorships: {
    Row: Sponsorship;
    Insert: Partial<Sponsorship> & Pick<Sponsorship, 'child_id' | 'status'>;
    Update: Partial<Sponsorship>;
    Relationships: [
      {
        foreignKeyName: "sponsorships_child_id_fkey";
        columns: ["child_id"];
        referencedRelation: "children";
        referencedColumns: ["id"];
        isOneToOne: false;
      }
    ];
  };
};