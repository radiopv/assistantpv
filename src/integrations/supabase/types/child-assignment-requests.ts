export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export type ChildAssignmentRequestRow = ChildAssignmentRequest;
export type ChildAssignmentRequestInsert = Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'>;
export type ChildAssignmentRequestUpdate = Partial<ChildAssignmentRequestInsert>;