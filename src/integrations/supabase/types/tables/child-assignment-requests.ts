import { Database } from "../database";
import { RequestStatus } from "../request-status";

export interface ChildAssignmentRequestTable {
  Row: {
    id: string;
    child_id: string;
    requester_email: string;
    name: string;
    status: RequestStatus;
    created_at: string;
    updated_at: string | null;
  };
  Insert: Omit<ChildAssignmentRequestTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<ChildAssignmentRequestTable["Row"]>;
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

export type ChildAssignmentRequest = ChildAssignmentRequestTable["Row"];