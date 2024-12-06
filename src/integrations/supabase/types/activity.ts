export type ActivityLogTables = {
  activity_logs: {
    Row: {
      id: string;
      user_id: string;
      action: string;
      details: Json | null;
      created_at: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      action: string;
      details?: Json | null;
      created_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      action?: string;
      details?: Json | null;
      created_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "activity_logs_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "sponsors";
        referencedColumns: ["id"];
      }
    ];
  };
};