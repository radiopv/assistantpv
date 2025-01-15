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
  is_temporary: boolean | null;
  end_planned_date: string | null;
}

export interface SponsorshipNote {
  id: string;
  sponsorship_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  note_type: string | null;
}

export interface SponsorshipHistory {
  id: string;
  sponsorship_id: string;
  action: string;
  created_at: string;
  reason: string | null;
  performed_by: string | null;
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
  sponsorship_notes: {
    Row: SponsorshipNote;
    Insert: Omit<SponsorshipNote, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<SponsorshipNote>;
  };
  sponsorship_history: {
    Row: SponsorshipHistory;
    Insert: Omit<SponsorshipHistory, 'id' | 'created_at'>;
    Update: Partial<SponsorshipHistory>;
  };
};