import { Database } from '../database';

export interface ChildAssignmentRequestsTable {
  Row: {
    id: string;
    child_id: string;
    requester_email: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string | null;
  };
  Insert: Omit<ChildAssignmentRequestsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<ChildAssignmentRequestsTable['Row']>;
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

export type ChildAssignmentRequest = ChildAssignmentRequestsTable['Row'];