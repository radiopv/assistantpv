import { Json } from './json';

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface ChildAssignmentRequestTable {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<ChildAssignmentRequest>;
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