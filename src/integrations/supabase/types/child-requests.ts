export interface ChildAssignmentRequest {
  id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ChildAssignmentRequests {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at'>;
  Update: Partial<ChildAssignmentRequest>;
}