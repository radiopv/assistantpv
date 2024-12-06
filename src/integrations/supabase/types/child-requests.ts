export interface ChildRequest {
  id: string;
  name: string;
  requester_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ChildAssignmentRequests {
  Row: {
    id: string;
    name: string;
    requester_email: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  };
  Insert: Omit<ChildRequest, 'id' | 'created_at'>;
  Update: Partial<ChildRequest>;
}