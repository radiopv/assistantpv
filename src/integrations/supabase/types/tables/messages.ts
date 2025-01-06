export interface MessagesTable {
  Row: {
    id: string;
    sender_id: string | null;
    recipient_id: string | null;
    subject: string;
    content: string;
    is_read: boolean | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<MessagesTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<MessagesTable["Row"]>;
  Relationships: [
    {
      foreignKeyName: "messages_recipient_id_fkey";
      columns: ["recipient_id"];
      isOneToOne: false;
      referencedRelation: "sponsors";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "messages_sender_id_fkey";
      columns: ["sender_id"];
      isOneToOne: false;
      referencedRelation: "sponsors";
      referencedColumns: ["id"];
    }
  ];
}

export type Message = MessagesTable["Row"];