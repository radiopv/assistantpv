import { Database } from '../database';

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export type ChildAssignmentRequestInsert = Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ChildAssignmentRequestUpdate = Partial<ChildAssignmentRequest>;

export interface ChildAssignmentRequestTable {
  Row: ChildAssignmentRequest;
  Insert: ChildAssignmentRequestInsert;
  Update: ChildAssignmentRequestUpdate;
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