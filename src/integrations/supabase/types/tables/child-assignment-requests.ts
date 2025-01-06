export interface ChildAssignmentRequestsTable {
  Row: {
    id: string;
    child_id: string;
    requester_email: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  };
  Insert: Omit<ChildAssignmentRequestsTable['Row'], 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<Omit<ChildAssignmentRequestsTable['Row'], 'id'>>;
}

export type ChildAssignmentRequest = ChildAssignmentRequestsTable['Row'];