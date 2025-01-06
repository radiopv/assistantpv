export interface ChildAssignmentRequestsTable {
  Row: {
    id: string;
    child_id: string;
    requester_email: string;
    name: string;
    status: "pending" | "approved" | "rejected";
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    child_id: string;
    requester_email: string;
    name: string;
    status?: "pending" | "approved" | "rejected";
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    child_id?: string;
    requester_email?: string;
    name?: string;
    status?: "pending" | "approved" | "rejected";
    created_at?: string | null;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "child_assignment_requests_child_id_fkey";
      columns: ["child_id"];
      isOneToOne: false;
      referencedRelation: "children";
      referencedColumns: ["id"];
    }
  ];
}

export type ChildAssignmentRequest = ChildAssignmentRequestsTable["Row"];